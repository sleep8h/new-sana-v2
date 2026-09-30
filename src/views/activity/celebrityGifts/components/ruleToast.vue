<!-- 活动规则弹窗 -->
<template>
  <div class="rule-toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="scroll-card">
        <div class="card-title">
          <span>{{ $t("celebrityGifts.activityRule") }}</span>
        </div>
        <div class="card-body" :class="{ 'card-body-ar': store.language === 'ar' }">
          <p v-for="(item, index) in ruleList" :key="index">{{ item }}</p>
        </div>
        <div class="reward-preview">
          <div class="preview-title">{{ $t("celebrityGifts.rewardPreview") }}</div>
          <div class="preview-row" v-for="group in rewardGroups" :key="group.id">
            <div class="gifts">
              <div class="gift-item" v-for="gift in group.gifts" :key="gift.giftId">
                <reward :gift="gift" :size="34" :show-value="false" />
              </div>
            </div>
            <div class="support-tag">{{ $t("celebrityGifts.support") }}</div>
          </div>
        </div>
      </div>
      <div class="toast-close" @click="closeModal"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/pinia/index.js";
import reward from "./reward.vue";

const store = useMainStore();
const { tm, rt } = useI18n();

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  rewardGroups: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:isShow", "close"]);

// 规则文案（i18n 数组消息）
const ruleList = computed(() => {
  const arr = tm("celebrityGifts.ruleList");
  if (Array.isArray(arr)) return arr.map((k) => rt(k));
  return [];
});

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
    width: 345px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .scroll-card {
    width: 323px;
    max-height: calc(80vh - 50px);
    border-radius: 14px;
    border: 2px solid #e7b740;
    background:
      linear-gradient(180deg, rgba(125, 17, 25, 0.96) 0%, rgba(74, 8, 14, 0.98) 100%);
    box-shadow:
      0 0 0 1px rgba(90, 40, 5, 0.8),
      0 10px 36px rgba(0, 0, 0, 0.65),
      inset 0 0 26px rgba(0, 0, 0, 0.35);
    overflow-y: auto;
    .card-title {
      width: 220px;
      height: 42px;
      margin: -2px auto 0;
      border-radius: 0 0 12px 12px;
      background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        font-weight: bold;
        font-size: 17px;
        color: #5c1503;
        line-height: 20px;
      }
    }
    .card-body {
      padding: 14px 18px 4px;
      font-size: 12.5px;
      line-height: 20px;
      color: #ffe6b8;
      text-align: left;
      > p {
        margin-bottom: 10px;
      }
    }
    .card-body-ar {
      text-align: right;
    }
    .reward-preview {
      padding: 6px 14px 16px;
      .preview-title {
        margin: 6px 0 10px;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        line-height: 18px;
        background-image: linear-gradient(180deg, #fff3c4 0%, #f3c54b 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .preview-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 6px;
        margin-bottom: 8px;
        border-radius: 10px;
        border: 1px solid rgba(231, 183, 64, 0.45);
        background: rgba(40, 4, 8, 0.45);
        .gifts {
          display: flex;
          align-items: center;
          .gift-item {
            width: 58px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 4px;
            .gift-name {
              max-width: 58px;
              margin-top: 3px;
              font-size: 10px;
              line-height: 14px;
              color: #ffd98a;
              text-align: center;
            }
          }
        }
        .support-tag {
          flex-shrink: 0;
          width: 62px;
          height: 28px;
          margin-left: 6px;
          border-radius: 14px;
          border: 1px solid #f2cd63;
          background: linear-gradient(180deg, #f23b3b 0%, #a30d14 100%);
          font-weight: bold;
          font-size: 12px;
          line-height: 26px;
          text-align: center;
          color: #ffe9b0;
        }
      }
    }
  }
  .toast-close {
    margin-top: 18px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #e7b740;
    background: radial-gradient(circle at 35% 30%, #8b2020 0%, #4a0a10 70%);
    position: relative;
    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 14px;
      height: 2px;
      border-radius: 1px;
      background: #f2cd63;
      transform-origin: center;
    }
    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
}
</style>
