<!-- 购买弹窗 - 支持三种状态：confirm/success/error -->
<template>
  <Teleport to="body">
    <div class="toast" v-if="isShow">
      <div class="toast-mask" @click="closeModal"></div>
      <div class="toast-content">
        <!-- 标题 -->
        <div class="title">{{ titleText }}</div>
  
        <!-- 提示文案 -->
        <div class="message-text">
          <p v-html="message"></p>
        </div>
  
        <!-- 按钮区域 -->
        <div class="btn-group">
          <!-- 确认状态：Confirm + Cancel -->
          <template v-if="type === 'confirm'">
            <div class="btn btn-confirm" @click="handleConfirm">{{ t("birthday.confirm") }}</div>
            <div class="btn btn-cancel" @click="closeModal">{{ t("birthday.cancel") }}</div>
          </template>
  
          <!-- 成功状态：Confirm + Cancel -->
          <template v-if="type === 'success'">
            <div class="btn btn-confirm" @click="handleConfirm">{{ t("birthday.confirm") }}</div>
            <div class="btn btn-cancel" @click="closeModal">{{ t("birthday.cancel") }}</div>
          </template>
  
          <!-- 失败状态：Recharge + Cancel -->
          <template v-if="type === 'error'">
            <div class="btn btn-recharge" @click="handleRecharge">{{ t("birthday.recharge") }}</div>
            <div class="btn btn-cancel" @click="closeModal">{{ t("birthday.cancel") }}</div>
          </template>
        </div>
  
        <div class="toast-close" @click="closeModal"></div>
      </div>
    </div>
  </Teleport>
</template>

<!-- 购买弹窗示例 - 购买确认状态 -->
<!-- 购买确认 -->
<!-- <BuyToast
  v-model:isShow="confirmShow"
  type="confirm" 
  coins="9999"
  @confirm="handleBuy"
  @close="confirmShow = false"
/> -->

<!-- 购买成功 -->
<!-- <BuyToast
  v-model:isShow="successShow"
  type="success"
  @confirm="successShow = false"
  @close="successShow = false"
/> -->

<!-- 金币不足 -->
<!-- <BuyToast
  v-model:isShow="errorShow"
  type="error"
  @recharge="goToRechargePage"
  @close="errorShow = false"
/> -->

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  // 弹窗类型：confirm-购买确认, success-购买成功, error-金币不足
  type: {
    type: String,
    default: "confirm",
    validator: (value) => ["confirm", "success", "error"].includes(value),
  },
  // 金币数量（用于确认和失败状态）
  coins: {
    type: [String, Number],
    default: "",
  },
});

const emit = defineEmits(["update:isShow", "close", "confirm", "recharge"]);

const { t } = useI18n();

// 根据类型计算标题
const titleText = computed(() => {
  const titles = {
    confirm: t("birthday.reminder"),
    success: t("birthday.congratulations"),
    error: t("birthday.sorry"),
  };
  return titles[props.type] || t("birthday.reminder");
});

// 根据类型计算提示文案
const message = computed(() => {
  const messages = {
    confirm: t("birthday.buyConfirmMsg", { coins: `<span class="highlight">${props.coins || "{0}"}</span>` }),
    success: t("birthday.buySuccessMsg"),
    error: t("birthday.buyErrorMsg"),
  };
  return messages[props.type] || messages.confirm;
});

const handleConfirm = () => {
  emit("confirm");
  emit("update:isShow", false);
};

const handleRecharge = () => {
  emit("recharge");
  emit("update:isShow", false);
};

const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};
</script>

<style scoped lang="scss">
.toast {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: PingFang SC;

  .toast-mask {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  .toast-content {
    position: fixed;
    z-index: 10000;
    width: 337px;
    height: 259px;
    background: url("@/assets/activity/birthday/bg_buy.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    // 标题
    .title {
      position: absolute;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
      font-size: 14px;
      line-height: 14px;
      color: #F0D863;
      background: linear-gradient(355deg, #FFFFCC 0%, #FFDC34 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
      white-space: nowrap;
    }

    // 提示文案
    .message-text {
      position: absolute;
      top: 101px;
      left: 50%;
      transform: translateX(-50%);
      width: 260px;
      text-align: center;

      :deep(.highlight) {
        color: #FFD700;
        font-weight: bold;
      }

      p {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #FFFFFF;
        line-height: 18px;
      }
    }

    // 按钮区域
    .btn-group {
      position: absolute;
      bottom: 54px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 16px;

      .btn {
        width: 116px;
        height: 37px;
        line-height: 37px;
        text-align: center;
        font-size: 12px;
        font-weight: bold;

        &-confirm,
        &-recharge {
          background: url("@/assets/activity/birthday/btn_confirm.png") no-repeat center center;
          background-size: cover;
          color: #200B1F;
        }

        &-cancel {
          background: url("@/assets/activity/birthday/btn_cancel.png") no-repeat center center;
          background-size: cover;
          color: #FFFFFF;
        }
      }
    }

    .toast-close {
      position: absolute;
      bottom: -43px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 30px;
      background: url("@/assets/activity/birthday/close.png") no-repeat center center;
      background-size: cover;
      cursor: pointer;
    }
  }
}
</style>