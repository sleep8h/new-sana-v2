<!-- 补签失败充值弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="text">{{ $t("ramadan.backSignatureRecharge") }}</div>
      <div class="btn">
        <div class="confirm" @click="confirm">{{ $t("ramadan.confirm") }}</div>
        <div class="cancel" @click="closeModal">{{ $t("ramadan.cancel") }}</div>
      </div>
      <div class="toast-close" @click="closeModal"></div>
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
  title: {
    //标题
    type: String,
    default: "",
  },
  list: {
    //列表
    type: Array,
    default: () => [],
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
    width: 100%;
    height: 358px;
    background: url("@/assets/activity/ramadan/components/tip.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .text {
      width: 255px;
      height: 60px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 500;
      font-size: 16px;
      color: #fff099;
      line-height: 20px;
      text-align: center;
      font-style: normal;
      margin: 161px auto 31px;
    }
    .btn {
      width: 100%;
      padding: 0 53px 0 49px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      .confirm,
      .cancel {
        width: 135px;
        height: 46px;
        background: url("@/assets/activity/ramadan/components/confirm.png") no-repeat center center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        color: #ffffd8;
        text-shadow:
          1px 1px 0px #473800,
          -1px -1px 0px #473800,
          -1px 1px 0px #473800,
          1px -1px 0px #473800;
      }
      .cancel {
        background: url("@/assets/activity/ramadan/components/cancel.png") no-repeat center center;
        background-size: cover;
        color: #e2fbcf;
        text-shadow:
          1px 1px 0px #1a6301,
          -1px -1px 0px #1a6301,
          -1px 1px 0px #1a6301,
          1px -1px 0px #1a6301;
      }
    }
    .toast-close {
      position: absolute;
      top: 48px;
      right: 25px;
      width: 34px;
      height: 34px;
      background: url("@/assets/activity/ramadan/components/toast_close.png") no-repeat center center;
      background-size: cover;
    }
  }
}
</style>
