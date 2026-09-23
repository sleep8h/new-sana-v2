<template>
  <div class="superior-content">
    <!-- 有上级代理时显示代理信息卡片 -->
    <div v-if="parentInfo?.uid" class="superior-card">
      <img class="superior-avatar" :src="parentInfo?.avatar || ''" />
      <div class="superior-info">
        <div class="superior-nickname">{{ parentInfo?.nick }}</div>
        <div class="superior-meta">{{ t("coinAgent.idLabel", { number: parentInfo?.erbanNo }) }}</div>
      </div>
      <!-- 解除绑定按钮 -->
      <div class="unbind-btn" @click="showUnbindDialog">{{ t("coinAgent.unbind") }}</div>
    </div>
    <!-- 无上级代理时显示空状态 -->
    <div v-else class="empty-state">{{ t("coinAgent.noSuperior") }}</div>

    <!-- 弹窗：解除绑定确认 -->
    <div v-if="dialogType === 'unbind'" class="dialog-mask" @click.self="closeDialog">
      <div class="dialog-box">
        <div class="dialog-text">{{ t("coinAgent.unbindConfirm", { nickname: parentInfo?.nick }) }}</div>
        <div class="dialog-btns">
          <button class="dialog-btn cancel" @click="closeDialog">{{ t("common.cancel") }}</button>
          <button class="dialog-btn confirm" @click="confirmUnbind">{{ t("common.ok") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { postForm } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

// ==================== 依赖注入 ====================
const store = useMainStore();
const { t } = useI18n();

// ==================== 变量声明 ====================
// 上级代理信息
const parentInfo = ref(null);

// 当前弹窗类型：unbind（解除绑定确认）
const dialogType = ref("");

// ==================== 方法 ====================
/**
 * 显示解除绑定确认弹窗
 */
const showUnbindDialog = () => {
  dialogType.value = "unbind";
};

/**
 * 关闭弹窗
 */
const closeDialog = () => {
  dialogType.value = "";
};

// ==================== 接口调用 ====================
/**
 * 获取上级代理信息
 */
const fetchParent = async () => {
  try {
    const res = await postForm("/agency/subAgent/parent", {
      uid: store.uid,
      ticket: store.ticket,
    });
    if (res.code === 200) {
      parentInfo.value = res.data || {};
    } else {
      showToast(res.message || t("common.requestFail"));
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * 确认解除绑定，调用解绑接口
 * 成功后清空上级代理信息
 */
const confirmUnbind = async () => {
  try {
    const res = await postForm("/agency/subAgent/unbind", {
      uid: store.uid,
      ticket: store.ticket,
    });
    if (res.code === 200) {
      dialogType.value = "";
      parentInfo.value = [];
      showToast(t("coinAgent.unbindSuccess"));
    } else {
      showToast(res.message || t("common.requestFail"));
    }
  } catch (e) {
    console.error(e);
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  fetchParent();
});
</script>

<style scoped lang="scss">
.superior-content {
  width: 351px;
  height: calc(100% - 61px);
  background: #FFFFFF;
  border-radius: 12px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
  .superior-card {
    padding: 0 16px 0 12px;
    display: flex;
    align-items: center;
    width: 319px;
    height: 93px;
    background: #F9FBFC;
    border-radius: 6px 6px 6px 6px;
    border: 1px solid #E8EAF2;
    margin: 0 auto 8px;

    .superior-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      margin-right: 12px;
    }

    .superior-info {
      flex: 1;

      .superior-nickname {
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }

      .superior-meta {
        font-size: 12px;
        color: #999;
        margin-top: 2px;
      }
    }

    .unbind-btn {
      padding: 4px 12px;
      border: 1px solid #ff4d4f;
      border-radius: 6px;
      font-size: 12px;
      color: #ff4d4f;
      cursor: pointer;
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