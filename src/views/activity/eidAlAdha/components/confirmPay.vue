<!-- 规则弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="tip">{{ $t("eidAlAdha.confirmRedemption") }}</div>
      <div class="btn">
        <div class="confirm" @click="confirm">{{ $t("eidAlAdha.confirm") }}</div>
        <div class="cancel" @click="closeModal">{{ $t("eidAlAdha.cancel") }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isShow: {
    //是否显示
    type: Boolean,
    default: false,
  },
  content: {
    //内容
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:isShow", "close", "confirm"]);

const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};

const confirm = () => {
  emit("confirm");
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
    width: 348px;
    height: 269px;
    background: url("@/assets/activity/eidAlAdha/confirmPay.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .tip {
      position: absolute;
      top: 96px;
      left: 50%;
      transform: translateX(-50%);
      height: 25px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: bold;
      font-size: 18px;
      color: #f5febe;
      line-height: 25px;
      text-align: center;
      text-shadow:
        1px 1px 0px #8c2c05,
        -1px -1px 0px #8c2c05,
        -1px 1px 0px #8c2c05,
        1px -1px 0px #8c2c05;
    }
    .btn {
      position: absolute;
      top: 159px;
      width: 278px;
      height: 52px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        width: 138px;
        height: 52px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .confirm {
        background: url("@/assets/activity/eidAlAdha/confirmPayConfirm.png") no-repeat center center;
        background-size: cover;
        color: #b1490b;
      }
      .cancel {
        background: url("@/assets/activity/eidAlAdha/confirmPayCancel.png") no-repeat center center;
        background-size: cover;
        color: #c30a2c;
      }
    }
  }
}
</style>
