<!-- 规则弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="toast-close" @click="closeModal"></div>
      <div class="content">
        <div class="title">{{ $t("ramadan.rule") }}</div>
        <div class="rule-text" :class="{ 'rule-text-ar': store.language === 'ar' }">
          <p>{{ $t("dragons.knightDesc") }}</p>
          <p>{{ $t("dragons.dragonDesc") }}</p>
          <p>{{ $t("dragons.goldRule") }}</p>
          <p>{{ $t("dragons.applyRule") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from "@/pinia/index.js";

const store = useMainStore();

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
    width: 345px;
    height: 459px;
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
    .content {
      position: absolute;
      top: 40px;
      left: 0;
      width: 345px;
      height: 419px;
      background: url("@/assets/activity/dragonsWealth/toast-bg.png") no-repeat center center;
      background-size: cover;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .title {
        margin: 19px auto 41px;
        height: 22px;
        font-weight: bold;
        box-sizing: border-box;
        padding-top: 3px;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        background: linear-gradient(90deg, #f4f998 0%, #ffe721 100%);
        -webkit-background-clip: text; /* Safari/Chrome 兼容 */
        background-clip: text; /* 现代浏览器标准属性 */
        color: transparent; /* 文字透明以显示背景渐变 */
        display: inline-block; /* 必须为块级或行内块元素 [1][3][6] */
      }
      .rule-text {
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
        height: 291px;
        overflow-y: auto;
        font-size: 13px;
        color: #fff099;
        line-height: 22px;
        text-align: left;
        > p {
          margin-bottom: 12px;
        }
      }
      .rule-text-ar {
        text-align: right;
      }
    }
  }
}
</style>
