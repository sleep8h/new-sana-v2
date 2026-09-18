<!-- 规则弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title">{{ $t("eidAlAdha.howToPlay") }}</div>
      <div class="content">
        <p>{{ $t("eidAlAdha.howToPlayText1") }}</p>
        <p>{{ $t("eidAlAdha.howToPlayText2") }}</p>
        <p>{{ $t("eidAlAdha.howToPlayText3") }}</p>
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
  content: {
    //内容
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:isShow", "close"]);

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
    height: 441px;
    background: url("@/assets/activity/eidAlAdha/ruleBg.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      position: absolute;
      top: 29px;
      left: 50%;
      transform: translateX(-50%);
      width: 179px;
      height: 45px;
      background: url("@/assets/activity/eidAlAdha/ruleTitle.png") no-repeat center center;
      background-size: cover;
      font-weight: bold;
      font-size: 18px;
      color: #f5febe;
      line-height: 45px;
      text-stroke: 1px #8c2c05;
      -webkit-text-stroke: 1px #8c2c05;
      text-align: center;
    }
    .content {
      position: absolute;
      top: 86px;
      left: 50%;
      transform: translateX(-50%);
      width: 257px;
      height: 311px;
      font-size: 14px;
      color: #2d5301;
      line-height: 20px;
      text-align: left;
      overflow-y: auto;
      > p {
        margin-bottom: 20px;
      }
    }
    .toast-close {
      position: absolute;
      bottom: -43px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 30px;
      background: url("@/assets/activity/eidAlAdha/toastClose.png") no-repeat center center;
      background-size: cover;
    }
  }
}
</style>
