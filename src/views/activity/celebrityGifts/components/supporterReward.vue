<!-- 支持者排名奖励弹窗 -->
<template>
  <div class="reward-toast" v-if="isShow" @click="closeModal">
    <div class="reward-scroll" @click.stop>
      <div class="reward-panel">
        <div class="card-title">
          <span>{{ $t("celebrityGifts.topSupporters") }}</span>
        </div>
        <div class="reward-list">
          <div class="reward-item" v-for="(item, index) in list" :key="index">
            <div class="reward-rank" :class="{ 'reward-rank-wide': index >= 3 }">
              <span>{{ rankLabel(index) }}</span>
            </div>
            <div class="reward-gifts">
              <div class="gift-item" v-for="(gift, gIdx) in item" :key="gIdx">
                <div class="gift-icon">
                  <img :src="gift.rewardUrl || defaultRewardImg" alt="" />
                </div>
                <div class="gift-name">{{ giftName(gift) }}</div>
              </div>
            </div>
            <div class="tip" v-if="type === 1 && index < 3">
              <p>{{ $t("celebrityGifts.exclusiveReward") }}</p>
              <p>{{ $t("celebrityGifts.bannerNaming") }}</p>
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

// 排名标题：周榜/月榜均为 TOP1/2/3/4-10 四档
const rankLabel = (index) => {
  const prefix = props.type === 1 ? "weekly" : "monthly";
  if (index === 0) return t(`celebrityGifts.${prefix}Top1Reward`);
  if (index === 1) return t(`celebrityGifts.${prefix}Top2Reward`);
  if (index === 2) return t(`celebrityGifts.${prefix}Top3Reward`);
  return props.type === 1 ? t("celebrityGifts.weeklyTop4To10Reward") : t("celebrityGifts.monthlyTop4To10Reward");
};

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
    width: 337px;
    max-height: 100vh;
    overflow: hidden;
  }

  .reward-panel {
    box-sizing: border-box;
    width: 337px;
    height: 593.5px;
    padding: 52px 31px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    background: url("@/assets/activity/celebrityGifts/supporterRewardBg.png") no-repeat center center;
    background-size: 100% 100%;
    animation: reward-slide-up 0.3s ease-out both;
  }

  .card-title {
    flex-shrink: 0;
    margin-bottom: 32px;
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
    gap: 12.5px;
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
    width: 158px;
    height: 34px;
    margin-bottom: 12.5px;
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
      width: 188px;
    }
  }

  .reward-gifts {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
  }

  .gift-item {
    width: 74px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12.5px;
    .gift-icon {
      width: 66px;
      height: 63px;
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
    margin-top: 16px;
    font-size: 12px;
    line-height: 18px;
    color: #fff0c0;
    text-align: center;
  }
}
</style>
