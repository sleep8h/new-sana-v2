<!-- 名人礼物排名奖励弹窗 -->
<template>
  <div class="reward-toast" v-if="isShow" @click="closeModal">
    <div class="reward-scroll" @click.stop>
      <div class="reward-panel">
        <div class="card-title">
          <span>{{ $t("celebrityGifts.topCelebrityRewards") }}</span>
        </div>
        <div class="reward-list">
          <div class="reward-item" v-for="(item, index) in list" :key="index">
            <div class="reward-rank" :class="{ 'reward-rank-wide': isWideRank(index) }">
              <span>{{ rankLabel(index) }}</span>
            </div>
            <div class="reward-gifts" :class="{ 'reward-gifts-monthly': type === 2 }">
              <div class="gift-item" v-for="(gift, gIdx) in item" :key="gIdx">
                <div class="gift-icon">
                  <img :src="gift.rewardUrl || defaultRewardImg" alt="" />
                </div>
                <div class="gift-name">{{ giftName(gift) }}</div>
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
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/pinia/index.js";
import defaultRewardImg from "@/assets/common/user-avatar-default.png";

const store = useMainStore();
const { t } = useI18n();

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

// 排名标题：周榜 5 档（TOP1/2/3/4/5-10），月榜 4 档（TOP1/2/3/4）
const rankLabel = (index) => {
  const prefix = props.type === 1 ? "weekly" : "monthly";
  if (index === 0) return t(`celebrityGifts.${prefix}Top1Reward`);
  if (index === 1) return t(`celebrityGifts.${prefix}Top2Reward`);
  if (index === 2) return t(`celebrityGifts.${prefix}Top3Reward`);
  if (props.type === 1) {
    return index === 3 ? t("celebrityGifts.weeklyTop4Reward") : t("celebrityGifts.weeklyTop5To10Reward");
  }
  return t("celebrityGifts.monthlyTop4Reward");
};

// TOP5-10 的标题横幅更宽
const isWideRank = (index) => props.type === 1 && index >= 4;

const giftName = (gift) => {
  const name = store.language === "ar" ? gift.rewardNameAr : gift.rewardName;
  return `${name}*${gift.rewardValue}`;
};
</script>

<style lang="scss" scoped>
@keyframes reward-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.reward-toast {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.75);

  .reward-scroll {
    width: 331.5px;
    max-height: 100vh;
    overflow: hidden;
  }

  .reward-panel {
    box-sizing: border-box;
    width: 331.5px;
    height: 538.5px;
    padding: 15px 40px 44px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    background: url("@/assets/activity/celebrityGifts/cekebrityGiftRewardBg.png") no-repeat center center;
    background-size: 100% 100%;
    animation: reward-slide-up 0.3s ease-out both;
  }

  .card-title {
    flex-shrink: 0;
    margin-bottom: 28px;
    font-size: 13px;
    font-weight: bold;
    line-height: 14px;
    text-align: center;
    > span {
      background: linear-gradient(90deg, #ffe197 0%, #ffc636 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  .reward-list {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28.5px;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .reward-item {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .reward-rank {
    width: 157px;
    height: 34px;
    margin-bottom: 15px;
    font-size: 11px;
    font-weight: bold;
    line-height: 12px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("@/assets/activity/celebrityGifts/supporterRewardTitleBg.png") no-repeat center center;
    background-size: 100% 100%;
    > span {
      background: linear-gradient(90deg, #ffe197 0%, #ffc636 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    &.reward-rank-wide {
      box-sizing: border-box;
      padding: 0 20px;
    }
  }

  .reward-gifts {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 9px;
    &.reward-gifts-monthly {
      gap: 4px;
    }
  }

  .gift-item {
    width: 74px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 13px;
    .gift-icon {
      width: 72px;
      height: 69px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/celebrityGifts/supporterRewardGiftBg.png") no-repeat center center;
      background-size: 100% 100%;
      img {
        width: 59px;
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

  .tip {
    margin-top: 15px;
    font-size: 12px;
    line-height: 18px;
    color: #fff0c0;
    text-align: center;
  }
}
</style>
