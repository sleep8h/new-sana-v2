<!-- 获得奖励弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content" :class="{ 'toast-content-1': props.getRewardList.length === 1 }">
      <div class="toast-close" @click="closeModal"></div>
      <div class="toast-title">
        <span>{{ $t("dragons.rewardsObtained") }}</span>
      </div>
      <div class="toast-list" :class="{ 'toast-list-1': props.getRewardList.length === 1 }">
        <div class="list">
          <div class="item" v-for="(item, index) in props.getRewardList" :key="index">
            <div class="reward-img">
              <img :src="rewardUrlFn(item.giftId)" alt="" />
            </div>
            <div class="gift-name-number">
              <sanaAutoText class="gift-name" :key="new Date().getTime()">
                <!-- {{ `${store.language === "ar" ? item.rewardNameAr : item.rewardName} *${item.giftNum}` }} -->
                {{ `${rewardNameFn(item.giftId)} *${item.giftNum}` }}
              </sanaAutoText>
            </div>
          </div>
        </div>
        <div class="toast-confirm" @click="closeModal">
          {{ $t("dragons.confirm") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from "@/pinia/index.js";
const store = useMainStore();
import avatar from "@/assets/activity/dragonsWealth/avatar.png";

const props = defineProps({
  isShow: {
    //是否显示
    type: Boolean,
    default: false,
  },
  getRewardList: {
    type: Array,
    default: () => [],
  },
  rewardList: {
    //内容
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["update:isShow", "close"]);

const rewardUrlFn = (giftId) => {
  console.log(props.rewardList, "rewardList");
  console.log(props.rewardList.find((item) => item.rewardRefId === giftId).rewardUrl, "rewardList");
  return props.rewardList.find((item) => item.rewardRefId === giftId).rewardUrl;
};

const rewardNameFn = (giftId) => {
  if (store.language === "ar") {
    return props.rewardList.find((item) => item.rewardRefId === giftId).rewardNameAr;
  } else {
    return props.rewardList.find((item) => item.rewardRefId === giftId).rewardName;
  }
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
  .toast-mask {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }
  .toast-content-1 {
    position: fixed;
    z-index: 10000;
    width: 345px;
    height: 305px !important;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .toast-content {
    position: fixed;
    z-index: 10000;
    width: 345px;
    height: 583px;
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
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: 199px;
      height: 115px;
      background: url("@/assets/activity/dragonsWealth/text-bg.png") no-repeat center center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        color: #fff8a0;
        font-weight: bold;
        box-sizing: border-box;
        padding-top: 3px;
        font-size: 24px;
        line-height: 33px;
        text-align: center;
        background: linear-gradient(90deg, #f4f998 0%, #ffe721 100%);
        -webkit-background-clip: text; /* Safari/Chrome 兼容 */
        background-clip: text; /* 现代浏览器标准属性 */
        color: transparent; /* 文字透明以显示背景渐变 */
        display: inline-block; /* 必须为块级或行内块元素 [1][3][6] */
        white-space: nowrap;
      }
    }
    .toast-list-1 {
      .list {
        > .item {
          margin: 0 !important;
          margin-bottom: 20px !important;
        }
      }
    }
    .toast-list {
      position: absolute;
      top: 105px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
      width: 100%;
      box-sizing: border-box;
      padding: 0 12px 0 12px;
      .list {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .item {
          width: 96px;
          height: 124px;
          margin-right: 8px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 16px;
          .reward-img {
            width: 96px;
            height: 96px;
            background: url("@/assets/activity/dragonsWealth/reward-bg.png") no-repeat center center;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 6px;
            > img {
              width: 68px;
              height: auto;
            }
          }
          .gift-name-number {
            width: 96px;
            height: 22px;
            font-size: 14px;
            line-height: 22px;
            .gift-name {
              color: #ffe343;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
      .toast-confirm {
        width: 120px;
        height: 46px;
        margin: 0 auto;
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
}
</style>
