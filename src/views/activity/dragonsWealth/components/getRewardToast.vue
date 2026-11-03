<!-- 获得奖励弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="toast-close" @click="closeModal"></div>
      <div class="toast-title">
        <span>{{ $t("dragons.rewardsObtained") }}</span>
      </div>
      <div class="toast-list">
        <div class="list">
          <div class="item" v-for="(item, index) in props.getRewardList" :key="index">
            <div class="reward-img">
              <img :src="rewardUrlFn(item.giftId)" alt="" />
            </div>
            <sanaAutoText class="gift-name">
              {{ `${rewardNameFn(item.giftId)} *${rewardNumFn(item)}` }}
              <!-- {{ `${store.language === "ar" ? item.rewardNameAr : item.rewardName} *${item.rewardValue}` }} -->
            </sanaAutoText>
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

// 奖励类型不等于 11、12 时，数量后面加 D
const rewardNumFn = (item) => {
  const reward = props.rewardList.find((r) => r.rewardRefId === item.giftId);
  const type = Number(item.rewardType ?? reward?.rewardType);
  return type !== 11 && type !== 12 ? `${item.giftNum}D` : `${item.giftNum}`;
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
      top: 25.5px;
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
    .toast-list {
      position: absolute;
      top: 82.5px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
      width: 100%;
      height: 430px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 24px;
      .list {
        width: 331px;
        max-height: 360px;
        overflow-y: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 9px;
        .item {
          width: 104px;
          height: 114px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          gap: 5px;
          .reward-img {
            width: 104px;
            height: 96px;
            background: url("@/assets/activity/dragonsWealth/getRewardItemBg.png") no-repeat center center;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            > img {
              width: 68px;
              height: auto;
            }
          }
          .gift-name {
            width: 94px;
            height: 16px;
            line-height: 16px;
            font-size: 11px;
            line-height: 16px;
            ::v-deep(> span) {
              background: linear-gradient(180deg, #ffffff 0%, #d8b26d 100%);
              -webkit-background-clip: text; /* Safari/Chrome 兼容 */
              background-clip: text; /* 现代浏览器标准属性 */
              color: transparent; /* 文字透明以显示背景渐变 */
            }
          }
        }
      }
      .toast-confirm {
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
}
</style>
