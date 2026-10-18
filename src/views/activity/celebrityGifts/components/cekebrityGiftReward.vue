<!-- 支持者奖励弹窗 -->
<template>
  <div class="supporter-reward-toast" v-if="isShow" @click="closeModal">
    <div class="toast-mask"></div>
    <div class="toast-content">
      <div class="content" :class="type === 1 ? 'weekly' : 'monthly'">
        <div class="card-title">
          <span>{{ $t("celebrityGifts.topSupporters") }}</span>
        </div>
        <div class="reward-list">
          <div
            class="reward-item"
            :class="{ 'reward-item-monthly': type === 2 }"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="reward-rank">
              <span v-if="type === 1 && index === 0">{{ $t("celebrityGifts.weeklyTop1Reward") }}</span>
              <span v-else-if="type === 1 && index === 1">{{ $t("celebrityGifts.weeklyTop2Reward") }}</span>
              <span v-else-if="type === 1 && index === 2">{{ $t("celebrityGifts.weeklyTop3Reward") }}</span>
              <span v-else-if="type === 1 && index === 3">{{ $t("celebrityGifts.weeklyTop4Reward") }}</span>
              <span v-else-if="type === 1 && index === 4">{{ $t("celebrityGifts.weeklyTop5To10Reward") }}</span>
              <span v-else-if="type === 2 && index === 0">{{ $t("celebrityGifts.monthlyTop1Reward") }}</span>
              <span v-else-if="type === 2 && index === 1">{{ $t("celebrityGifts.monthlyTop2Reward") }}</span>
              <span v-else-if="type === 2 && index === 2">{{ $t("celebrityGifts.monthlyTop3Reward") }}</span>
              <span v-else-if="type === 2 && index === 3">{{ $t("celebrityGifts.monthlyTop4Reward") }}</span>
              <span v-else-if="type === 2 && index === 4">{{ $t("celebrityGifts.monthlyTop5To10Reward") }}</span>
            </div>
            <div class="reward-gifts">
              <div class="gift-item" v-for="(gift, gIdx) in item" :key="gIdx">
                <div class="gift-icon">
                  <img :src="gift.rewardUrl || defaultRewardImg" alt="" />
                </div>
                <div class="gift-name">
                  {{ `${store.language === "ar" ? gift.rewardNameAr : gift.rewardName}*${gift.rewardValue}` }}
                </div>
              </div>
            </div>
            <div class="tip" v-if="type === 1 && index < 4">
              <p>{{ $t("celebrityGifts.topDisplayTip", { rank: index + 1 }) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from "@/pinia/index.js";
const store = useMainStore();

import defaultRewardImg from "@/assets/common/user-avatar-default.png";

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array,
    default: () => [],
  },
  type: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update:isShow", "close"]);

const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};
</script>

<style lang="scss" scoped>
.supporter-reward-toast {
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
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .content {
      position: relative;
      width: 100%;
      flex-shrink: 0;
      .card-title {
        position: absolute;
        top: 18.5px;
        left: 50%;
        transform: translateX(-50%);
        font-weight: bold;
        font-size: 15px;
        line-height: 15px;
        text-align: center;
        span {
          background: linear-gradient(90deg, #ffe197 0%, #ffc636 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          // -webkit-text-stroke: 1px #620000;
        }
      }
      .reward-list {
        position: absolute;
        width: 332px;
        height: 645.5px;
        top: 61px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .reward-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .reward-rank {
            width: 174px;
            height: 38px;
            font-size: 12px;
            line-height: 14px;
            text-align: center;
            font-weight: bold;
            margin-bottom: 17px;
            background: url("@/assets/activity/celebrityGifts/supporterRewardTitleBg.png") no-repeat center center;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            > span {
              background: linear-gradient(90deg, #ffe197 0%, #ffc636 100%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }
          }
          .reward-gifts {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
            width: 335px;
            height: 113px;
            .gift-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 80px;
              min-height: 113px;
              gap: 14.5px;
              .gift-icon {
                width: 80px;
                height: 76.5px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: url("@/assets/activity/celebrityGifts/supporterRewardGiftBg.png") no-repeat center center;
                background-size: 100% 100%;
                img {
                  width: 63.5px;
                  height: auto;
                  object-fit: contain;
                }
              }
              .gift-name {
                width: 100%;
                font-size: 10px;
                line-height: 11px;
                color: #fff0c0;
                text-align: center;
                word-break: break-word;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
            }
          }
          .tip {
            height: 36px;
            font-size: 12px;
            line-height: 18px;
            color: #fff0c0;
            margin-top: 11.5px;
            margin-bottom: 28.5px;
            text-align: center;
          }
        }
        .reward-item-monthly {
          margin-bottom: 18.5px;
        }
      }
    }
    .content.weekly {
      height: 1259.5px;
      background: url("@/assets/activity/celebrityGifts/cekebrityGiftRewardWeekly.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .content.monthly {
      height: 823.5px;
      background: url("@/assets/activity/celebrityGifts/cekebrityGiftRewardMonthly.png") no-repeat center center;
      background-size: 100% 100%;
    }
  }
}
</style>
