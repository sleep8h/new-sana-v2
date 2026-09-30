<!-- 奖励/礼物组件：展示单个奖励的图片、名称与数量 -->
<template>
  <div class="reward-item" :style="{ width: size + 'px' }">
    <div class="reward-icon" :style="{ width: size + 'px', height: size + 'px' }">
      <img v-if="gift.rewardUrl" :src="gift.rewardUrl" alt="" />
      <img v-else :src="giftPlaceholder" alt="" class="placeholder" />
    </div>
    <div v-if="showName" class="reward-name text-hide">{{ rewardName }}</div>
    <div v-if="showValue" class="reward-value">x{{ gift.rewardValue }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMainStore } from "@/pinia/index.js";
import giftPlaceholder from "@/assets/activity/dragonsWealth/dragonsLair/gift.png";

const store = useMainStore();

const props = defineProps({
  gift: {
    type: Object,
    default: () => ({}),
  },
  // 图标尺寸
  size: {
    type: Number,
    default: 48,
  },
  showName: {
    type: Boolean,
    default: true,
  },
  showValue: {
    type: Boolean,
    default: true,
  },
});

const rewardName = computed(() =>
  store.language === "ar" ? props.gift.rewardNameAr || props.gift.rewardName : props.gift.rewardName,
);
</script>

<style lang="scss" scoped>
.reward-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  .reward-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, rgba(255, 230, 160, 0.35) 0%, rgba(120, 30, 30, 0.35) 100%);
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
    > img {
      width: 78%;
      height: 78%;
      object-fit: contain;
    }
    .placeholder {
      opacity: 0.85;
    }
  }
  .reward-name {
    width: 100%;
    margin-top: 5px;
    font-size: 11px;
    line-height: 15px;
    color: #ffdf9a;
    text-align: center;
  }
  .reward-value {
    margin-top: 1px;
    font-size: 10px;
    line-height: 14px;
    color: #f2cd63;
  }
}
</style>
