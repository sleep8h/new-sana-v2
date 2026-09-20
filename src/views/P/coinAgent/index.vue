<template>
  <div class="coin-agent-container">
    <!-- 顶部横幅 -->
    <div class="header-banner">
      <img class="return-btn" @click="goBack" src="@/assets/p/coinAgent/icon-back.png" />
      <div class="banner-subtitle">Gold Coins Recharge</div>
      <div class="banner-coins">
        <span class="coin-amount">{{ formatNumber(myCoins) }}</span>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tab-container">
      <div class="tab-item" :class="{ active: activeTab === 'recharge' }" @click="activeTab = 'recharge'">
        {{ t("coinAgent.recharge") }}
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'record' }" @click="activeTab = 'record'">
        {{ t("coinAgent.record") }}
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'subAgent' }" @click="activeTab = 'subAgent'">
        {{ t("coinAgent.subAgent") }}
      </div>
    </div>

    <!-- 内容区 -->
    <div class="content-container">
      <!-- 充值 -->
      <div v-show="activeTab === 'recharge'" class="recharge-content">
        <div class="form-card">
          <div class="form-row" v-if="targetUser.uid">
            <div class="user-info">
              <img class="avatar" :src="targetUser.avatar" />
              <div class="nickname">{{ targetUser.nickname || t("coinAgent.userNickname") }}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-label">
              <span>{{ t("coinAgent.account") }}</span>
            </div>
            <div class="form-input-wrap">
              <input v-model="rechargeForm.account" class="form-input" type="text" :placeholder="t('coinAgent.accountPlaceholder')" />
              <img v-if="rechargeForm.account" class="clear-icon" @click="rechargeForm.account = ''" src="@/assets/p/coinAgent/icon-clear.png" />
            </div>
          </div>
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
              <img v-if="rechargeForm.amount" class="clear-icon" @click="rechargeForm.amount = ''" src="@/assets/p/coinAgent/icon-clear.png" />
            </div>
          </div>
          <div class="quick-amounts">
            <div
              v-for="(item, index) in allQuickAmounts"
              :key="item.key"
              class="quick-item"
            >
              <div class="quick-number" dir="ltr" @click="addQuickAmount(item.value)">+{{ formatNumber(item.value) }}</div>
              <img
                v-if="item.isCustom"
                class="quick-del"
                src="@/assets/p/coinAgent/icon-close.png"
                @click.stop="removeCustomAmount(index)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 记录 -->
      <div v-show="activeTab === 'record'" class="record-content">
        <div class="record-list">
          <div v-for="(item, index) in recordList" :key="index" class="record-item">
            <div class="record-info">
              <div class="record-nickname">{{ item.nickname }}</div>
              <div class="record-meta">ID:{{ item.targetUid }}</div>
              <div class="record-meta">{{ t("coinAgent.tradeTime") }}:{{ item.createTime }}</div>
            </div>
            <div class="record-right">
              <div class="record-amount" :class="item.amount > 0 ? 'positive' : 'negative'">
                {{ item.amount > 0 ? '+' : '' }}{{ formatNumber(item.amount) }}
              </div>
              <div v-if="item.canCancel" class="cancel-btn" @click="showCancelDialog(item)">
                {{ t("coinAgent.cancelTrade") }}
              </div>
              <div v-else class="cancel-btn disabled">{{ t("coinAgent.cancelled") }}</div>
            </div>
          </div>
          <div v-if="recordList.length === 0" class="empty-state">{{ t("common.noData") }}</div>
        </div>
      </div>

      <!-- 子代理 -->
      <div v-show="activeTab === 'subAgent'" class="subagent-content">
        <div v-if="!showAddSubAgent" class="subagent-list">
          <div v-for="(item, index) in subAgentList" :key="index" class="subagent-item">
            <img class="subagent-avatar" :src="item.avatar || defaultAvatar" />
            <div class="subagent-info">
              <div class="subagent-nickname">{{ item.nickname }}</div>
              <div class="subagent-meta">ID:{{ item.uid }}</div>
              <div class="subagent-coin">
                <span>{{ formatNumber(item.coins) }}</span>
              </div>
            </div>
            <div class="remove-btn" @click="showRemoveDialog(item)">{{ t("coinAgent.remove") }}</div>
          </div>
          <div class="add-subagent-bar" @click="showAddSubAgent = true">
            <span class="add-icon">+</span>
            <span>{{ t("coinAgent.addSubAgent") }}</span>
          </div>
          <div v-if="subAgentList.length === 0" class="empty-state">{{ t("common.noData") }}</div>
        </div>

        <!-- 添加子代理 -->
        <div v-else class="add-subagent-form">
          <div class="add-title">{{ t("coinAgent.addSubAgent") }}</div>
          <div class="form-input-wrap">
            <input v-model="addSubAgentId" class="form-input center" type="text" :placeholder="t('coinAgent.enterId')" />
          </div>
          <button class="confirm-btn send-invite" @click="handleSendInvite">{{ t("coinAgent.sendInvite") }}</button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'recharge'" class="confirm-btn" @click="handleRecharge">{{ t("coinAgent.confirm") }}</div>
    <div class="bottom-bg"></div>
    <!-- 弹窗：撤销确认 -->
    <div v-if="dialogType === 'cancel'" class="dialog-mask" @click.self="closeDialog">
      <div class="dialog-box">
        <div class="dialog-text">{{ t("coinAgent.cancelConfirm") }}</div>
        <div class="dialog-btns">
          <button class="dialog-btn cancel" @click="closeDialog">{{ t("common.cancel") }}</button>
          <button class="dialog-btn confirm" @click="confirmCancel">{{ t("common.ok") }}</button>
        </div>
      </div>
    </div>

    <!-- 弹窗：转账/充值确认 -->
    <div v-if="dialogType === 'transfer'" class="dialog-mask" @click.self="closeDialog">
      <div class="dialog-box">
        <div class="dialog-text">
          {{ t("coinAgent.transferConfirm", { uid: targetUser.uid, nickname: targetUser.nickname, amount: formatNumber(rechargeForm.amount) }) }}
        </div>
        <div class="dialog-btns">
          <button class="dialog-btn cancel" @click="closeDialog">{{ t("common.cancel") }}</button>
          <button class="dialog-btn confirm" @click="confirmTransfer">{{ t("common.ok") }}</button>
        </div>
      </div>
    </div>

    <!-- 弹窗：移除子代理确认 -->
    <div v-if="dialogType === 'remove'" class="dialog-mask" @click.self="closeDialog">
      <div class="dialog-box">
        <div class="dialog-text">{{ t("coinAgent.removeConfirm", { nickname: currentItem.nickname }) }}</div>
        <div class="dialog-btns">
          <button class="dialog-btn cancel" @click="closeDialog">{{ t("common.cancel") }}</button>
          <button class="dialog-btn confirm" @click="confirmRemove">{{ t("common.ok") }}</button>
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const activeTab = ref("recharge");
const myCoins = ref(7777777);
const defaultAvatar = "https://via.placeholder.com/40";

const rechargeForm = ref({ account: "", amount: "" });
const fixedAmounts = [1000, 10000, 50000, 100000, 500000];
const MAX_QUICK_AMOUNT = 100000000;
const MAX_CUSTOM_AMOUNTS = 5;
const customAmounts = ref([]);

const targetUser = ref({});
const recordList = ref([]);
const subAgentList = ref([]);
const showAddSubAgent = ref(false);
const addSubAgentId = ref("");

const dialogType = ref("");
const currentItem = ref({});

const allQuickAmounts = computed(() => {
  const list = fixedAmounts.map((v) => ({ key: `fixed-${v}`, value: v, isCustom: false }));
  customAmounts.value.forEach((v, i) => {
    list.push({ key: `custom-${i}-${v}`, value: v, isCustom: true });
  });
  return list;
});

const displayAmount = computed(() => {
  const val = rechargeForm.value.amount;
  if (!val) return "";
  return formatNumber(val);
});

const goBack = () => {
  if (store.os === "android") {
    WebViewJavascriptBridge.backToFront(null, null);
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.backToFront.postMessage(null);
  } else {
    router.back();
  }
};

const formatNumber = (num) => {
  if (!num && num !== 0) return "";
  const n = Number(String(num).replace(/,/g, ""));
  if (isNaN(n)) return "";
  return n.toLocaleString("en-US");
};

const parseNumber = (str) => {
  if (!str) return "";
  return String(str).replace(/,/g, "").replace(/[^0-9]/g, "");
};

const onAmountInput = (e) => {
  const raw = parseNumber(e.target.value);
  rechargeForm.value.amount = raw;
  e.target.value = raw ? formatNumber(raw) : "";
};

const onAmountBlur = (e) => {
  const raw = parseNumber(e.target.value);
  rechargeForm.value.amount = raw;
  e.target.value = raw ? formatNumber(raw) : "";
};

const addQuickAmount = (val) => {
  const current = Number(rechargeForm.value.amount || 0);
  const add = Number(val || 0);
  const sum = current + add;
  rechargeForm.value.amount = String(sum);
};

const customInputValue = ref("");

const customInputDisplay = computed(() => {
  return customInputValue.value ? formatNumber(customInputValue.value) : "";
});

const openCustomDialog = () => {
  if (customAmounts.value.length >= MAX_CUSTOM_AMOUNTS) {
    return showToast(t("coinAgent.customLimit"));
  }
  customInputValue.value = "";
  dialogType.value = "custom";
};

const onCustomDialogInput = (e) => {
  let raw = parseNumber(e.target.value);
  if (raw) {
    const num = Number(raw);
    if (num > MAX_QUICK_AMOUNT) raw = String(MAX_QUICK_AMOUNT);
  }
  customInputValue.value = raw;
  e.target.value = raw ? formatNumber(raw) : "";
};

const onCustomDialogBlur = (e) => {
  let raw = parseNumber(e.target.value);
  if (raw) {
    const num = Number(raw);
    if (num > MAX_QUICK_AMOUNT) raw = String(MAX_QUICK_AMOUNT);
  }
  customInputValue.value = raw;
  e.target.value = raw ? formatNumber(raw) : "";
};

const removeCustomAmount = (indexInAll) => {
  const fixedLen = fixedAmounts.length;
  const customIdx = indexInAll - fixedLen;
  if (customIdx >= 0) {
    customAmounts.value.splice(customIdx, 1);
  }
};

const saveCustomAmounts = () => {
  const val = Number(customInputValue.value);
  if (val > 0 && customAmounts.value.length < MAX_CUSTOM_AMOUNTS) {
    if (fixedAmounts.includes(val) || customAmounts.value.includes(val)) {
      return showToast(t("coinAgent.customDuplicate"));
    }
    customAmounts.value.push(val);
  }
  customInputValue.value = "";
  dialogType.value = "";
};

// 充值
const handleRecharge = () => {
  if (!rechargeForm.value.account || !rechargeForm.value.amount) return;
  dialogType.value = "transfer";
};

const confirmTransfer = async () => {
  try {
    const res = await postFormData("/coinAgent/transfer", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      targetUid: rechargeForm.value.account,
      amount: rechargeForm.value.amount,
    });
    if (res.code === 200) {
      rechargeForm.value = { account: "", amount: "" };
      dialogType.value = "";
    }
  } catch (e) {
    console.error(e);
  }
};

// 记录
const fetchRecords = async () => {
  try {
    const res = await postFormData("/coinAgent/record", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res.code === 200) {
      recordList.value = res.data || [];
    }
  } catch (e) {
    console.error(e);
  }
};

const showCancelDialog = (item) => {
  currentItem.value = item;
  dialogType.value = "cancel";
};

const confirmCancel = async () => {
  try {
    const res = await postFormData("/coinAgent/cancel", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      recordId: currentItem.value.id,
    });
    if (res.code === 200) {
      dialogType.value = "";
      fetchRecords();
    }
  } catch (e) {
    console.error(e);
  }
};

// 子代理
const fetchSubAgents = async () => {
  try {
    const res = await postFormData("/coinAgent/subAgent/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res.code === 200) {
      subAgentList.value = res.data || [];
    }
  } catch (e) {
    console.error(e);
  }
};

const showRemoveDialog = (item) => {
  currentItem.value = item;
  dialogType.value = "remove";
};

const confirmRemove = async () => {
  try {
    const res = await postFormData("/coinAgent/subAgent/remove", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      targetUid: currentItem.value.uid,
    });
    if (res.code === 200) {
      dialogType.value = "";
      fetchSubAgents();
    }
  } catch (e) {
    console.error(e);
  }
};

const handleSendInvite = async () => {
  if (!addSubAgentId.value) return;
  try {
    const res = await postFormData("/coinAgent/subAgent/invite", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      targetUid: addSubAgentId.value,
    });
    if (res.code === 200) {
      showAddSubAgent.value = false;
      addSubAgentId.value = "";
      fetchSubAgents();
    }
  } catch (e) {
    console.error(e);
  }
};

const closeDialog = () => {
  dialogType.value = "";
  currentItem.value = {};
};

onMounted(() => {
  fetchRecords();
  fetchSubAgents();
});
</script>

<style scoped lang="scss">
.coin-agent-container {
  width: 100%;
  height: 812px;
  display: flex;
  flex-direction: column;
  color: #fff;
  overflow-y: auto;
  box-sizing: border-box;
  background: #F9F9F9;
  position: relative;
  font-family: Source Han Sans SC, Source Han Sans SC;
  

  .header-banner {
    position: relative;
    width: 100%;
    height: 262px;
    background: url("@/assets/p/coinAgent/top-bg.png") no-repeat top center;
    background-size: 375px 238px;
    flex-shrink: 0;

    .return-btn {
      position: absolute;
      top: 50px;
      left: 16px;
      width: 32px;
      height: 32px;
      z-index: 10;
    }

    .banner-subtitle {
      position: absolute;
      top: 94px;
      left: 22px;
      font-weight: bold;
      font-size: 18px;
      color: #333333;
    }

    .banner-coins {
      width: 351px;
      height: 77px;
      position: absolute;
      top: 185px;
      left: 50%;
      transform: translateX(-50%);
      background: url("@/assets/p/coinAgent/gold-bg.png") no-repeat top center;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;

      .coin-amount {
        font-size: 28px;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .tab-container {
    width: 100%;
    height: 59px;
    box-sizing: border-box;
    padding-top: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 12px;
    flex-shrink: 0;

    .tab-item {
      width: 114px;
      font-size: 12px;
      color: #828282;
      text-align: center;
      font-weight: bold;
      position: relative;

      &.active {
        font-size: 16px;
        color: #333333;
      }

      &.active::after {
        content: "";
        width: 41px;
        height: 8px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background: url("@/assets/p/coinAgent/divider-line.png") no-repeat top center;
        background-size: cover;
      }
    }
  }

  .content-container {
    width: 351px;
    height: 368px;
    background: #FFFFFF;
    border-radius: 12px 12px 12px 12px;
    overflow-y: auto;
    margin: 0 auto;
  }

  // 充值
  .recharge-content {
    padding: 0 16px;

    .form-card {
      .form-row {
        margin-top: 16px;

        &:first-child {
          margin-top: 20px;
        }

        .user-info {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 12px;

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

          >img {
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
          border-radius: 6px 6px 6px 6px;
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
            cursor: pointer;
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

  // 充值记录
  .record-content {
    .record-list {
      .record-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        border-radius: 12px;
        padding: 14px 16px;
        margin-bottom: 12px;

        .record-info {
          .record-nickname {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }

          .record-meta {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
          }
        }

        .record-right {
          text-align: right;

          .record-amount {
            font-size: 18px;
            font-weight: bold;

            &.positive {
              color: #52c41a;
            }

            &.negative {
              color: #ff4d4f;
            }
          }

          .cancel-btn {
            margin-top: 6px;
            font-size: 12px;
            color: #208cff;
            cursor: pointer;

            &.disabled {
              color: #bbb;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  // 子代理
  .subagent-content {
    .subagent-list {
      .subagent-item {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 12px;
        padding: 14px 16px;
        margin-bottom: 12px;

        .subagent-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          margin-right: 12px;
        }

        .subagent-info {
          flex: 1;

          .subagent-nickname {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }

          .subagent-meta {
            font-size: 12px;
            color: #999;
            margin-top: 2px;
          }

          .subagent-coin {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 4px;
            font-size: 12px;
            color: #e2ad32;

            .small-coin {
              width: 14px;
              height: 14px;
            }
          }
        }

        .remove-btn {
          padding: 4px 12px;
          border: 1px solid #ff4d4f;
          border-radius: 6px;
          font-size: 12px;
          color: #ff4d4f;
          cursor: pointer;
        }
      }

      .add-subagent-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: #fff;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #208cff;
        cursor: pointer;

        .add-icon {
          font-size: 18px;
        }
      }
    }

    .add-subagent-form {
      background: #fff;
      border-radius: 12px;
      padding: 24px 16px;
      text-align: center;

      .add-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 16px;
      }

      .form-input-wrap {
        margin-bottom: 16px;
      }

      .send-invite {
        width: 100%;
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
  .bottom-bg{
    width: 375px;
    height: 105px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: url("@/assets/p/coinAgent/bottom-bg.png") no-repeat bottom center;
    background-size: 375px 105px;
  }
  .empty-state {
    text-align: center;
    padding: 40px 0;
    font-size: 14px;
    color: #999;
  }

  .dialog-mask {
    position: fixed;
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
        font-size: 14px;
        color: #333;
        line-height: 1.6;
        margin-bottom: 20px;
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

          .custom-del {
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
        }

        .custom-add {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 40px;
          background: #F9FBFC;
          border: 1px dashed #E8EAF2;
          border-radius: 6px;
          font-size: 14px;
          color: #208cff;
          cursor: pointer;

          .add-icon {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>