<template>
  <div class="recharge-content">
    <div class="content">
      <div class="form-card">
        <!-- 目标用户信息展示（查询成功后显示） -->
        <div class="form-row" v-if="targetUser.uid">
          <div class="user-info">
            <img class="avatar" :src="targetUser.avatar" />
            <div class="nickname">{{ targetUser.nick || t("coinAgent.userNickname") }}</div>
          </div>
        </div>
        <!-- 账号输入行 -->
        <div class="form-row account-row">
          <div class="form-label">
            <span>{{ t("coinAgent.account") }}</span>
          </div>
          <div class="form-input-wrap">
            <input
              v-model="form.account"
              class="form-input"
              type="text"
              inputmode="numeric"
              maxlength="7"
              :placeholder="t('coinAgent.accountPlaceholder')"
              @keydown="onAccountKeydown"
              @input="onAccountInput"
            />
              <!-- @blur="onAccountBlur" -->
            <img v-if="form.account" class="clear-icon" @click="form.account = ''" src="@/assets/p/coinAgent/icon-clear.png" />
          </div>
        </div>
        <!-- 金额输入行 -->
        <div class="form-row">
          <div class="form-label">
            <span>{{ t("coinAgent.amount") }}</span>
            <img class="clear-setting" @click="openCustomDialog" src="@/assets/p/coinAgent/icon-setting.png" />
          </div>
          <div class="form-input-wrap">
            <input
              :value="displayAmount"
              class="form-input"
              type="text"
              inputmode="numeric"
              :placeholder="t('coinAgent.amountPlaceholder')"
              @input="onAmountInput"
              @blur="onAmountBlur"
            />
            <img v-if="form.amount" class="clear-icon" @click="form.amount = ''" src="@/assets/p/coinAgent/icon-clear.png" />
          </div>
        </div>
        <!-- 快捷金额选择区 -->
        <div class="quick-amounts">
          <div v-for="(item, index) in allQuickAmounts" :key="item.key" class="quick-item">
            <div class="quick-number" dir="ltr" @click="addQuickAmount(item.value)">+{{ formatNumber(item.value) }}</div>
            <img v-if="item.isCustom" class="quick-del" src="@/assets/p/coinAgent/icon-close.png" @click.stop="removeCustomAmount(index)" />
          </div>
        </div>
      </div>
    </div>

    <!-- 确认充值按钮 -->
    <div class="confirm-btn" @click="handleRecharge">{{ t("coinAgent.confirm") }}</div>

    <!-- 弹窗：转账/充值确认 -->
    <div v-if="dialogType === 'transfer'" class="dialog-mask" @click.self="closeDialog">
      <div class="dialog-box">
        <div class="dialog-text" v-html="t('coinAgent.transferConfirm', { uid: targetUser.uid, nickname: targetUser.nick, amount: formatNumber(form.amount) })">
        </div>
        <div class="dialog-btns">
          <button class="dialog-btn cancel" @click="closeDialog">{{ t("common.cancel") }}</button>
          <button class="dialog-btn confirm" @click="confirmTransfer">{{ t("common.ok") }}</button>
        </div>
      </div>
    </div>

    <!-- 弹窗：自定义快捷金额 -->
    <div v-if="dialogType === 'custom'" class="dialog-mask" @click.self="closeDialog">
      <div class="dialog-box custom-box">
        <div class="dialog-title">{{ t("coinAgent.customTitle") }}</div>
        <div class="custom-list">
          <div class="custom-row">
            <div class="custom-input-wrap">
              <input
                :value="customInputDisplay"
                class="custom-input"
                type="text"
                inputmode="numeric"
                :placeholder="t('coinAgent.customPlaceholder')"
                @input="onCustomDialogInput"
                @blur="onCustomDialogBlur"
              />
            </div>
          </div>
        </div>
        <div class="dialog-btns">
          <button class="dialog-btn cancel" @click="closeDialog">{{ t("common.cancel") }}</button>
          <button class="dialog-btn confirm" @click="saveCustomAmounts">{{ t("common.ok") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { postForm, postUrlEncoded } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

const emit = defineEmits(["updateBalance"]);

// ==================== 依赖注入 ====================
const store = useMainStore();
const { t } = useI18n();

// ==================== 常量 ====================
// 固定快捷金额选项
const fixedAmounts = [1000, 10000, 50000, 100000, 500000];

// 自定义金额上限与最大自定义数量
const MAX_QUICK_AMOUNT = 100000000;
const MAX_CUSTOM_AMOUNTS = 5;

// localStorage 缓存 key
const CUSTOM_AMOUNTS_KEY = "coinAgent_customAmounts";

// ==================== 变量声明 ====================
// 表单数据：账号与充值金额
const form = ref({ account: "", amount: "" });

// 用户自定义的快捷金额数组
const customAmounts = ref([]);

// 查询到的目标用户信息
const targetUser = ref({});

// 当前弹窗类型：transfer（确认转账）/ custom（自定义金额）
const dialogType = ref("");

// 自定义金额弹窗输入值
const customInputValue = ref("");

// ==================== 监听 / 计算属性 ====================
// 合并固定金额与自定义金额，生成快捷金额列表
const allQuickAmounts = computed(() => {
  const list = fixedAmounts.map((v) => ({ key: `fixed-${v}`, value: v, isCustom: false }));
  customAmounts.value.forEach((v, i) => {
    list.push({ key: `custom-${i}-${v}`, value: v, isCustom: true });
  });
  return list;
});

// 金额输入框格式化显示（千分位）
const displayAmount = computed(() => {
  const val = form.value.amount;
  if (!val) return "";
  return formatNumber(val);
});

// 自定义弹窗输入框格式化显示
const customInputDisplay = computed(() => {
  return customInputValue.value ? formatNumber(customInputValue.value) : "";
});

// ==================== 方法 ====================
/**
 * 格式化数字为千分位字符串
 * @param {number|string} num - 待格式化的数字
 * @returns {string} 格式化后的字符串，如 "1,000"
 */
const formatNumber = (num) => {
  if (!num && num !== 0) return "";
  const n = Number(String(num).replace(/,/g, ""));
  if (isNaN(n)) return "";
  return n.toLocaleString("en-US");
};

/**
 * 去除字符串中的非数字字符和千分位逗号
 * @param {string} str - 输入字符串
 * @returns {string} 纯数字字符串
 */
const parseNumber = (str) => {
  if (!str) return "";
  return String(str).replace(/,/g, "").replace(/[^0-9]/g, "");
};

/**
 * 金额输入事件处理
 * 过滤非数字字符并同步到表单
 */
const onAmountInput = (e) => {
  const raw = parseNumber(e.target.value);
  form.value.amount = raw;
  e.target.value = raw ? formatNumber(raw) : "";
};

/**
 * 金额输入框失去焦点时格式化显示
 */
const onAmountBlur = (e) => {
  const raw = parseNumber(e.target.value);
  form.value.amount = raw;
  e.target.value = raw ? formatNumber(raw) : "";
};

/**
 * 点击快捷金额，累加到当前金额
 * @param {number} val - 要累加的金额
 */
const addQuickAmount = (val) => {
  const current = Number(form.value.amount || 0);
  const add = Number(val || 0);
  const sum = current + add;
  form.value.amount = String(sum);
};

/**
 * 打开自定义快捷金额弹窗
 * 若已达上限则提示
 */
const openCustomDialog = () => {
  if (customAmounts.value.length >= MAX_CUSTOM_AMOUNTS) {
    return showToast(t("coinAgent.customLimit"));
  }
  customInputValue.value = "";
  dialogType.value = "custom";
};

/**
 * 自定义弹窗输入事件处理，限制最大值
 */
const onCustomDialogInput = (e) => {
  let raw = parseNumber(e.target.value);
  if (raw) {
    const num = Number(raw);
    if (num > MAX_QUICK_AMOUNT) raw = String(MAX_QUICK_AMOUNT);
  }
  customInputValue.value = raw;
  e.target.value = raw ? formatNumber(raw) : "";
};

/**
 * 自定义弹窗输入框失去焦点时格式化并限制最大值
 */
const onCustomDialogBlur = (e) => {
  let raw = parseNumber(e.target.value);
  if (raw) {
    const num = Number(raw);
    if (num > MAX_QUICK_AMOUNT) raw = String(MAX_QUICK_AMOUNT);
  }
  customInputValue.value = raw;
  e.target.value = raw ? formatNumber(raw) : "";
};

/**
 * 删除自定义快捷金额
 * @param {number} indexInAll - 在全部快捷金额中的索引
 */
const removeCustomAmount = (indexInAll) => {
  const fixedLen = fixedAmounts.length;
  const customIdx = indexInAll - fixedLen;
  if (customIdx >= 0) {
    customAmounts.value.splice(customIdx, 1);
    persistCustomAmounts();
  }
};

/**
 * 从 localStorage 读取自定义快捷金额
 */
const loadCustomAmounts = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_AMOUNTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        customAmounts.value = parsed.filter((v) => typeof v === "number" && v > 0);
      }
    }
  } catch (e) {
    console.error("加载自定义快捷金额失败", e);
  }
};

/**
 * 保存自定义快捷金额到 localStorage
 */
const persistCustomAmounts = () => {
  try {
    localStorage.setItem(CUSTOM_AMOUNTS_KEY, JSON.stringify(customAmounts.value));
  } catch (e) {
    console.error("保存自定义快捷金额失败", e);
  }
};

/**
 * 保存自定义快捷金额
 * 校验是否重复及是否超过上限
 */
const saveCustomAmounts = () => {
  const val = Number(customInputValue.value);
  if (val > 0 && customAmounts.value.length < MAX_CUSTOM_AMOUNTS) {
    if (fixedAmounts.includes(val) || customAmounts.value.includes(val)) {
      return showToast(t("coinAgent.customDuplicate"));
    }
    customAmounts.value.push(val);
    persistCustomAmounts();
  }
  customInputValue.value = "";
  dialogType.value = "";
};

/**
 * 点击确认充值按钮，校验必填项并打开确认弹窗
 */
const handleRecharge = () => {
  if (!targetUser.value.uid) {
    return showToast(t("coinAgent.enterAccount"));
  }
  if (!form.value.amount) {
    return showToast(t("coinAgent.amountPlaceholder"));
  }
  dialogType.value = "transfer";
};

/**
 * 关闭弹窗
 */
const closeDialog = () => {
  dialogType.value = "";
};

/**
 * 账号输入键盘事件处理
 * 阻止非数字按键输入
 */
const onAccountKeydown = (e) => {
  // 允许控制键：退格、删除、Tab、方向键、全选、复制、粘贴、剪切
  const allowedKeys = [
    "Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight",
    "Home", "End", "Enter",
  ];
  if (allowedKeys.includes(e.key)) return;
  // 允许 Ctrl+A/C/V/X
  if (e.ctrlKey || e.metaKey) return;
  // 只允许数字键 0-9
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

/**
 * 账号输入事件处理
 * 过滤非数字字符，达到7位时自动查询用户信息
 */
const onAccountInput = (e) => {
  let raw = parseNumber(form.value.account);
  // 限制最多7位数字
  if (raw.length > 7) raw = raw.slice(0, 7);
  form.value.account = raw;
  // 达到7位时自动查询
  if (raw.length === 7) {
    fetchUserInfo(raw);
  }
};

/**
 * 账号输入框失去焦点时校验
 * 必须为7位数字才查询用户信息
 */
const onAccountBlur = async () => {
  const raw = parseNumber(form.value.account);
  form.value.account = raw;
  console.log(raw, form.value.account, 'raw')
  if (raw.length !== 7) {
    // return showToast(t("coinAgent.accountLengthError"));
    return false
  } else{
    await fetchUserInfo(raw);
  }
};

// ==================== 接口调用 ====================
/**
 * 根据账号查询用户信息
 * @param {string} erbanNo - 7位数字账号
 */
const fetchUserInfo = async (erbanNo) => {
  try {
    const res = await postForm("/user/search/user", {
      uid: store.uid,
      ticket: store.ticket,
      searchType: 3,
      erbanNo: Number(erbanNo),
    });
    if (res.code === 200) {
      targetUser.value = res.data || {};
    } else {
      targetUser.value = {};
      showToast(res.message || t("common.requestFail"));
    }
  } catch (e) {
    targetUser.value = {};
    console.error(e);
  }
};

/**
 * 确认转账，调用充值接口
 * 成功后清空表单并提示
 */
const confirmTransfer = async () => {
  try {
    const res = await postUrlEncoded("/agency/gold/recharge", {
      uid: store.uid,
      ticket: store.ticket,
      targetUid: targetUser.value.uid,
      goldNum: form.value.amount,
    });
    if (res.code === 200) {
      form.value = { account: "", amount: "" };
      dialogType.value = "";
      showToast(t("coinAgent.transferSuccess"));
      // 通知父组件扣除余额
      emit("updateBalance", Number(form.value.amount));
    } else {
      showToast(res.message || t("common.requestFail"));
    }
  } catch (e) {
    console.error(e);
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  loadCustomAmounts();
});
</script>

<style scoped lang="scss">
.recharge-content {
  width: 100%;
  height: 100%;
  .content{
    width: 351px;
    height: calc(100% - 123px);
    background: #FFFFFF;
    border-radius: 12px 12px 12px 12px;
    margin: 0 auto;
    padding: 20px 16px;
    box-sizing: border-box;
    overflow-y: auto;
    .form-card {
      .form-row {
        .user-info {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          .avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
          }
  
          .nickname {
            font-weight: bold;
            font-size: 16px;
            color: #333333;
          }
        }
  
        .form-label {
          font-weight: bold;
          font-size: 12px;
          color: #333333;
          margin-bottom: 6px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
  
          > img {
            width: 16px;
            height: 16px;
            margin-inline-start: 7px;
            cursor: pointer;
          }
        }
  
        .form-input-wrap {
          width: 319px;
          height: 41px;
          background: #F9FBFC;
          border-radius: 6px;
          border: 1px solid #E8EAF2;
          position: relative;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          box-sizing: border-box;
          padding: 0 16px;
          .form-input {
            width: calc(100% - 40px);
            height: 41px;
            background: transparent;
            border: none;
            outline: none;
            font-weight: bold;
            font-size: 16px;
            color: #333333;
            text-align: start;
  
            &::placeholder {
              color: #bbb;
            }
          }
  
          .clear-icon {
            position: absolute;
            inset-inline-end: 16px;
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
        }
      }
      .account-row{
        margin-bottom: 16px;
      }
      .quick-amounts {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 12px;
  
        .quick-item {
          width: auto;
          height: 31px;
          display: flex;
          justify-content: center;
          align-items: center;
  
          .quick-number {
            height: 31px;
            background: #F9FBFC;
            border: 1px solid #E8EAF2;
            padding: 0 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            color: #494949;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            cursor: pointer;
            direction: ltr;
          }
  
          .quick-del {
            width: 16px;
            height: 16px;
            margin-inline-start: 4px;
            cursor: pointer;
          }
        }
      }
    }
  }

  .confirm-btn {
    width: 273px;
    height: 46px;
    margin: 16px auto 0;
    background: url('@/assets/p/coinAgent/confirm-bg.png') no-repeat center center;
    background-size: cover;
    font-size: 16px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:active {
      opacity: 0.9;
    }
  }
}

.dialog-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

  .dialog-box {
    width: 280px;
    background: #fff;
    border-radius: 12px;
    padding: 24px 20px;
    text-align: center;

    .dialog-text {
      margin-bottom: 20px;
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      &::v-deep(.uid){
        color:#219653;
      }
      &::v-deep(.amount){
        color:#EB5757;
      }
    }

    .dialog-btns {
      display: flex;
      justify-content: center;
      gap: 12px;

      .dialog-btn {
        flex: 1;
        height: 40px;
        border-radius: 20px;
        font-size: 14px;
        border: none;
        cursor: pointer;

        &.cancel {
          background: #f5f6fa;
          color: #666;
        }

        &.confirm {
          background: #208cff;
          color: #fff;
        }
      }
    }
  }

  .custom-box {
    width: 300px;
    padding: 20px;

    .dialog-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 16px;
    }

    .custom-list {
      margin-bottom: 20px;

      .custom-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;

        .custom-input-wrap {
          flex: 1;
          height: 40px;
          background: #F9FBFC;
          border: 1px solid #E8EAF2;
          border-radius: 6px;
          display: flex;
          align-items: center;
          padding: 0 12px;

          .custom-input {
            width: 100%;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            font-size: 14px;
            color: #333;
            text-align: center;

            &::placeholder {
              color: #bbb;
            }
          }
        }
      }
    }
  }
}
</style>