<!-- 活动规则弹窗 -->
<template>
  <div class="rule-toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content" @click="closeModal">
      <div class="card-title">
        <span>{{ $t("celebrityGifts.activityRule") }}</span>
      </div>
      <div class="scroll-card" @click.stop>
        <div class="text">
          <p class="rule-title">{{ $t("celebrityGifts.ruleTitle1") }}</p>
          <p>{{ $t("celebrityGifts.ruleDesc1") }}</p>

          <p class="rule-title">{{ $t("celebrityGifts.ruleTitle2") }}</p>
          <p>{{ $t("celebrityGifts.ruleDesc2") }}</p>

          <p class="rule-title">{{ $t("celebrityGifts.ruleTitle3") }}</p>
          <p>{{ $t("celebrityGifts.ruleDesc3") }}</p>

          <p class="rule-title">{{ $t("celebrityGifts.ruleTitle4") }}</p>
          <p>{{ $t("celebrityGifts.ruleDesc4") }}</p>

          <p class="rule-title">{{ $t("celebrityGifts.ruleTitle5") }}</p>
          <p>{{ $t("celebrityGifts.ruleDesc5") }}</p>

          <p>{{ $t("celebrityGifts.ruleDesc6") }}</p>

          <p>{{ $t("celebrityGifts.ruleDesc7") }}</p>

          <p>{{ $t("celebrityGifts.ruleDesc8") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/pinia/index.js";

const store = useMainStore();
const { tm, rt } = useI18n();

const props = defineProps({
  isShow: {
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

<style lang="scss" scoped>
.rule-toast {
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
  }
  .toast-content {
    position: relative;
    z-index: 10000;
    width: 368px;
    height: 520px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .card-title {
      box-sizing: border-box;
      padding-top: 8px;
      width: 130px;
      height: 43px;
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
      background: url("@/assets/activity/celebrityGifts/rule-title-bg.png") no-repeat center center;
      background-size: 100% 100%;
      > span {
        background: linear-gradient(90deg, #ffe197 0%, #ffc636 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-weight: bold;
        font-size: 12px;
        line-height: 14px;
      }
    }
  }
  .scroll-card {
    width: 368px;
    height: 505.5px;
    background: url("@/assets/activity/celebrityGifts/rule-bg.png") no-repeat center center;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 38px 34px 35.5px 48.5px;
    .text {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      > p {
        margin-bottom: 12px;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #ffffff;
      }
      .rule-title {
        font-weight: bold;
        margin-bottom: 0;
      }
    }
  }
}
</style>
