<!-- 规则弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title">{{ $t("birthday.rule") }}</div>
      <div class="content">
        <div class="text-title">{{ $t('birthday.ruleQ1') }}</div>
        <div class="text-content">{{ $t('birthday.ruleA1') }}</div>
        <div class="text-title">{{ $t('birthday.ruleQ2') }}</div>
        <div class="text-content">{{ $t('birthday.ruleA2') }}</div>
        <div class="text-title">{{ $t('birthday.ruleQ3') }}</div>
        <div class="text-content">{{ $t('birthday.ruleA3_1') }}</div>
        <img class="img1" src="@/assets/activity/birthday/rule_info.png" alt="" />
        <div class="text-content">{{ $t('birthday.ruleA3_2') }}</div>
        <img class="img2" src="@/assets/activity/birthday/rule_img1.png" alt="" />
        <div class="text-title">{{ $t('birthday.ruleQ4') }}</div>
        <div class="text-content">{{ $t('birthday.ruleA4') }}</div>
        <div class="text-title">{{ $t('birthday.ruleQ5') }}</div>
        <div class="text-content">{{ $t('birthday.ruleA5_1') }}</div>
        <div class="text-content">{{ $t('birthday.ruleA5_2') }}</div>
        <div class="text-title">{{ $t('birthday.ruleQ6') }}</div>
        <div class="text-sub-title">{{ $t('birthday.ruleA6Tip') }}</div>
        <div class="text-content">{{ $t('birthday.ruleA6_1') }}</div>
        <div class="text-content">{{ $t('birthday.ruleA6_2') }}</div>
        <div class="text-title">{{ $t('birthday.ruleQ7') }}</div>
      </div>
      <div class="toast-close" @click="closeModal"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  content: {
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
    height: 450px;
    background: url("@/assets/activity/birthday/bg_rule.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      position: absolute;
      top: 27px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
      font-size: 14px;
      color: #F0D863;
      line-height: 14px;
      background: linear-gradient(355deg, #FFFFCC 0%, #FFDC34 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
    }
    .content {
      position: absolute;
      top: 78px;
      left: 50%;
      transform: translateX(-50%);
      width: 266px;
      height: 353px;
      text-align: start;
      overflow-y: auto;
      .text-title{
        width: 100%;
        min-height: 11px;
        font-weight: bold;
        font-size: 10px;
        color: #FFF267;
        line-height: 11px;
        margin-bottom: 10px;
      }
      .text-sub-title{
        width: 100%;
        min-height: 11px;
        font-weight: bold;
        font-size: 10px;
        color: #FFF267;
        line-height: 11px;
        margin-bottom: 10px;
         padding-inline-start: 15px;
      }
      .text-content{
        width: 100%;
        min-height: 13px;
        font-size: 10px;
        color: #FFFFFF;
        line-height: 13px;
         padding-inline-start: 15px;
        margin-bottom: 15px;
      }
      .img1{
        width: 261px;
        height: 127px;
        margin-top: 15px;
        margin-bottom: 22px;
      }
      .img2{
        width: 254px;
        height: 178px;
        margin-top: 15px;
        margin-bottom: 22px;
      }
      .img3{
        width: 254px;
        height: 178px;
        margin-top: 15px;
        margin-bottom: 22px;
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
    }
  }
}
</style>