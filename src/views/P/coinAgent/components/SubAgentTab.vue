<template>
  <div class="subagent-content">
    <!-- 子代理列表页 -->
    <div v-if="!showAddSubAgent" class="subagent-list">
      <!-- 遍历显示子代理列表 -->
      <div v-for="(item, index) in subAgentList" :key="index" class="subagent-item">
        <img class="subagent-avatar" :src="item.avatar" />
        <div class="subagent-info">
          <div class="subagent-nickname">{{ item.nick }}</div>
          <div class="subagent-meta">{{ t("coinAgent.idLabel", { number: item.erbanNo }) }}</div>
          <div class="subagent-coin">
            <span>{{ formatNumber(item.goldNum) }}</span>
          </div>
        </div>
        <!-- 移除子代理按钮 -->
        <div class="remove-btn" @click="showRemoveDialog(item)">{{ t("coinAgent.remove") }}</div>
      </div>
    </div>

    <!-- 添加子代理表单页 -->
    <div v-if="subAgentList.length < 2" class="add-subagent-form">
      <div class="add-title">{{ t("coinAgent.addSubAgent") }}</div>
      <div class="form-input-wrap">
        <input v-model="addSubAgentId" class="form-input center" type="text" :placeholder="t('coinAgent.enterId')" />
      </div>
      <button class="confirm-btn send-invite" @click="handleSendInvite">{{ t("coinAgent.sendInvite") }}</button>
    </div>

    <!-- 弹窗：移除子代理确认 -->
    <div v-if="dialogType === 'remove'" class="dialog-mask" @click.self="closeDialog">
      <div class="dialog-box">
        <div class="dialog-title">{{ t("coinAgent.removeConfirmTitle", { nickname: currentItem.nick }) }}</div>
        <div class="dialog-text">{{ t("coinAgent.removeConfirm") }}</div>
        <div class="dialog-btns">
          <button class="dialog-btn cancel" @click="closeDialog">{{ t("common.cancel") }}</button>
          <button class="dialog-btn confirm" @click="confirmRemove">{{ t("common.ok") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { postForm } from "@/utils/http.js";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

// ==================== 依赖注入 ====================
const store = useMainStore();
const { t } = useI18n();

// ==================== 变量声明 ====================
// 子代理列表
const subAgentList = ref([]);

// 添加子代理输入的ID
const addSubAgentId = ref("");

// 当前弹窗类型：remove（移除确认）
const dialogType = ref("");

// 当前选中的子代理项
const currentItem = ref({});

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
 * 显示移除子代理确认弹窗
 * @param {Object} item - 选中的子代理项
 */
const showRemoveDialog = (item) => {
  currentItem.value = item;
  dialogType.value = "remove";
};

/**
 * 关闭弹窗并清空当前选中项
 */
const closeDialog = () => {
  dialogType.value = "";
  currentItem.value = {};
};

// ==================== 接口调用 ====================
/**
 * 获取子代理列表
 */
const fetchSubAgents = async () => {
  try {
    const res = await postForm("/agency/subAgent/list", {
      uid: store.uid,
      ticket: store.ticket,
      pageNum: 0,
      pageSize: 20,
    });
    if (res.code === 200) {
      subAgentList.value = res.data?.list || [];
    } else {
      showToast(res.message || t("common.requestFail"));
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * 确认移除子代理，调用删除接口
 * 成功后刷新子代理列表
 */
const confirmRemove = async () => {
  try {
    const res = await postForm("/agency/subAgent/delete", {
      uid: store.uid,
      ticket: store.ticket,
      subUid: currentItem.value.uid,
    });
    if (res.code === 200) {
      dialogType.value = "";
      fetchSubAgents();
      showToast(t("coinAgent.removeSuccess"));
    } else {
      showToast(res.message || t("common.requestFail"));
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * 发送邀请添加子代理
 * 成功后返回列表页并清空输入
 */
const handleSendInvite = async () => {
  if (!addSubAgentId.value) {
    return showToast(t("coinAgent.enterId"));
  }
  try {
    const res = await postForm("/agency/subAgent/invite", {
      uid: store.uid,
      ticket: store.ticket,
      targetUid: addSubAgentId.value,
    });
    if (res.code === 200) {
      addSubAgentId.value = "";
      showToast(t("coinAgent.inviteSuccess"));
    } else {
      showToast(res.message || t("common.requestFail"));
    }
  } catch (e) {
    console.error(e);
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  fetchSubAgents();
});
</script>

<style scoped lang="scss">
.subagent-content {
  width: 351px;
  height: calc(100% - 61px);
  background: #FFFFFF;
  border-radius: 12px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
  .subagent-list {
    .subagent-item {
      padding: 0 16px 0 12px;
      display: flex;
      align-items: center;
      width: 319px;
      height: 93px;
      background: #F9FBFC;
      border-radius: 6px 6px 6px 6px;
      border: 1px solid #E8EAF2;
      margin: 0 auto 8px;

      .subagent-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        margin-inline-end: 11px;
      }

      .subagent-info {
        flex: 1;

        .subagent-nickname {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }

        .subagent-meta {
          font-weight: bold;
          font-size: 12px;
          color: #828282;
          margin-top: 2px;
          margin-bottom: 3px;
        }

        .subagent-coin {
          display: flex;
          align-items: flex-start;
          font-weight: bold;
          font-size: 12px;
          color: #828282;

          .small-coin {
            width: 16px;
            height: 16px;
          }
        }
      }

      .remove-btn {
        min-width: 67px;
        height: 22px;
        border-radius: 4px;
        border: 1px solid #EB5757;
        padding: 0 22px;
        font-size: 12px;
        font-weight: bold;
        color: #EB5757;
        cursor: pointer;
      }
    }
  }

  .add-subagent-form {
    width: 319px;
    height: 167px;
    background: #F9FBFC;
    border-radius: 6px 6px 6px 6px;
    border: 1px solid #E8EAF2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .add-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-top: 16px;
    }

    .form-input-wrap {
      width: 239px;
      height: 43px;
      background: #F1F6FE;
      border-radius: 6px 6px 6px 6px;
      border: 1px solid #E8EAF2;
      margin: 12px auto 16px;
      display: flex;
      justify-content: center;
      align-items: center;

      .form-input {
        width: 100%;
        box-sizing: border-box;
        padding: 0 16px;
        height: 41px;
        background: transparent;
        border: none;
        outline: none;
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        text-align: center;
        &::placeholder {
          color: #bbb;
        }
      }
    }

    .send-invite {
      margin: 0 auto;
      min-width: 117px;
      height: 39px;
      background: #2F80ED;
      border-radius: 6px 6px 6px 6px;
      font-size: 16px;
      color: #fff;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;

      &:active {
        opacity: 0.9;
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 40px 0;
    font-size: 14px;
    color: #999;
  }
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
}
</style>