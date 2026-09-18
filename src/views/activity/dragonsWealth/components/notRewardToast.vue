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
import avatar from "@/assets/activity/dragonsWealth/avatar.png";

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
    width: 345px;
    height: 408px;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    .toast-close {
      position: absolute;
      top: 0;
      right: 0;
      width: 34px;
      height: 34px;
      background: url("@/assets/activity/dragonsWealth/toast-close.png") no-repeat center center;
      background-size: cover;
    }
    .toast-title {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 199px;
      height: 115px;
      background: url("@/assets/activity/dragonsWealth/text-bg.png") no-repeat center center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
      > span {
        font-weight: bold;
        box-sizing: border-box;
        padding-top: 3px;
        font-size: 24px;
        line-height: 33px;
        text-align: center;
        color: #ffffff;
      }
    }
    .toast-not {
      position: absolute;
      top: 146px;
      left: 50%;
      transform: translateX(-50%);
      width: 180px;
      height: 180px;
      background: url("@/assets/activity/dragonsWealth/not-get.png") no-repeat center center;
      background-size: cover;
    }
    .toast-confirm {
      position: absolute;
      top: 362px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 46px;
      background: url("@/assets/activity/dragonsWealth/toast-button.png") no-repeat center center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 15px;
      color: #ffe640;
      line-height: 21px;
      text-shadow:
        1px 1px #572d00,
        -1px -1px #572d00,
        -1px 1px #572d00,
        1px -1px #572d00;
    }
  }
}
</style>
