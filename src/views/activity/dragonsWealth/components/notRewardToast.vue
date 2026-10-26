<!-- 未获得奖励弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="toast-close" @click="closeModal"></div>
      <div class="toast-title">
        <span>{{ $t("dragons.noRewards") }}</span>
      </div>
      <div class="toast-not"></div>
      <div class="toast-confirm" @click="closeModal">{{ $t("dragons.confirm") }}</div>
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
    width: 354px;
    height: 539.5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url("@/assets/activity/dragonsWealth/toast-bg3.png") no-repeat center center;
    background-size: cover;
    .toast-close {
      position: absolute;
      top: 25.5px;
      right: 25.5px;
      width: 33px;
      height: 33px;
      background: url("@/assets/activity/dragonsWealth/toast-close.png") no-repeat center center;
      background-size: cover;
    }
    .toast-title {
      position: absolute;
      top: 57px;
      left: 50%;
      transform: translateX(-50%);
      height: 27px;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
      > span {
        font-weight: bold;
        box-sizing: border-box;
        font-size: 18px;
        line-height: 27px;
        text-align: center;
        color: #ffce51;
        text-shadow:
          1px 1px 0px #a00000,
          -1px -1px 0px #a00000,
          -1px 1px 0px #a00000,
          1px -1px 0px #a00000;
      }
    }
    .toast-not {
      position: absolute;
      top: 121.5px;
      left: 50%;
      transform: translateX(-50%);
      width: 192px;
      height: 194.5px;
      background: url("@/assets/activity/dragonsWealth/not-get.png") no-repeat center center;
      background-size: cover;
    }
    .toast-confirm {
      position: absolute;
      top: 387px;
      left: 50%;
      transform: translateX(-50%);
      width: 198px;
      height: 46px;
      background: url("@/assets/activity/dragonsWealth/toast-button.png") no-repeat center center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 18px;
      line-height: 21px;
      color: #ffce51;
      text-shadow:
        1px 1px 0px #a00000,
        -1px -1px 0px #a00000,
        -1px 1px 0px #a00000,
        1px -1px 0px #a00000;
    }
  }
}
</style>
