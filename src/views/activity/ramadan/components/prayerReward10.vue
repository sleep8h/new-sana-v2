<!-- 祈福10次奖励弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title">{{ $t("ramadan.prayerReward") }}</div>
      <div class="sub-title">{{ $t("ramadan.gotRewards") }}</div>
      <div class="content">
        <div class="list">
          <div class="item" v-for="(item, index) in list" :key="index">
            <img class="gift-img" :src="item.rewardUrl" alt="" />
            <sanaAutoText class="text" :key="new Date().getTime()">
              {{ `${item.rewardName}*${item.giftNum}` }}
            </sanaAutoText>
          </div>
        </div>
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
    width: 100%;
    height: 469px;
    background: url("@/assets/activity/ramadan/components/bg_rule.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      width: 300px;
      height: 28px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
      text-align: center;
      color: #fef188;
      text-shadow:
        1px 1px 0px #8a5e02,
        -1px -1px 0px #8a5e02,
        -1px 1px 0px #8a5e02,
        1px -1px 0px #8a5e02;
      margin: 91px auto 0;
    }
    .sub-title {
      width: 255px;
      height: 20px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 500;
      font-size: 16px;
      color: #fff099;
      line-height: 20px;
      text-align: center;
      margin-bottom: 15px;
    }
    .content {
      .list {
        width: 262px;
        height: 295px;
        overflow-y: auto;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        .item {
          width: 80px;
          height: 106px;
          background: url("@/assets/activity/ramadan/components/bg_sign_reward_item.png") no-repeat center center;
          background-size: cover;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 8px;
          &:nth-child(3n-1) {
            margin-right: 11px;
            margin-left: 11px;
          }
          > .gift-img {
            width: 56px;
            height: 56px;
            margin: 12px auto 10px;
          }
          > .text {
            width: 80px;
            height: 18px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 14px;
            color: #493300;
            line-height: 18px;
            text-align: center;
          }
        }
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
