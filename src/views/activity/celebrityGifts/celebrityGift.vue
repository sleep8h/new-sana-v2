<!-- 礼物页：我的名人礼物 + 名人礼物等级 -->
<template>
  <div class="gift-battle">
    <!-- 模块一：MY CELEBRITY GIFT -->
    <div class="panel my-gift-panel">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.myCelebrityGift") }}</span>
      </div>

      <!-- 有名人礼物 -->
      <div v-if="hasMyGift" class="my-gift-content">
        <div class="gift-info">
          <div class="gift-image">
            <img :src="myGift.image || defaultGiftImg" alt="" />
          </div>
          <div class="gift-detail">
            <div class="detail-row">
              <span class="detail-label">ID:</span>
              <span class="detail-value">{{ myGift.uid || store.uid }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ $t("celebrityGifts.weeklyLevel") }}:</span>
              <span class="detail-value">{{ myGift.weeklyLevel || 1 }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ $t("celebrityGifts.monthlyTask") }}:</span>
              <span class="detail-value">{{ myGift.monthlyTask || '0/40' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ $t("celebrityGifts.state") }}:</span>
              <span class="detail-value state-valid">{{ myGift.state || 'VALID' }}</span>
            </div>
          </div>
        </div>
        <div class="gift-tip">
          {{ $t("celebrityGifts.myGiftTip") }}
        </div>
      </div>

      <!-- 没有名人礼物 -->
      <div v-else class="my-gift-empty">
        <div class="empty-text">
          {{ $t("celebrityGifts.noGiftTip") }}
        </div>
        <div class="empty-loading">
          <div class="loading-spinner"></div>
        </div>
      </div>
    </div>

    <!-- 模块二：CELEBRITY GIFT LEVEL -->
    <div class="panel level-panel">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.celebrityGiftLevel") }}</span>
      </div>
      <div class="level-tip">
        {{ $t("celebrityGifts.levelTip") }}
      </div>

      <!-- 等级奖励路线 -->
      <div class="level-road">
        <div class="level-item" v-for="(item, index) in levelList" :key="index">
          <div class="level-coin">
            <span class="coin-icon"></span>
            <span class="coin-num">{{ item.coin }}</span>
          </div>
          <div class="level-badge" :class="{ 'level-active': item.active }">
            {{ item.level }}
          </div>
        </div>
      </div>

      <!-- 奖励展示 -->
      <div class="reward-showcase">
        <div class="reward-arrow left" @click="prevReward">
          <span>&lt;</span>
        </div>
        <div
          class="reward-carousel"
          ref="carouselRef"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div
            class="reward-track"
            :style="{ transform: `translateX(-${rewardPage * 50}%)` }"
          >
            <div class="reward-item" v-for="(reward, index) in allRewards" :key="index">
              <div class="reward-frame">
                <img :src="reward.image || defaultRewardImg" alt="" />
              </div>
              <div class="reward-name">{{ reward.name }}</div>
            </div>
          </div>
        </div>
        <div class="reward-arrow right" @click="nextReward">
          <span>&gt;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { get } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import defaultAvatar from "@/assets/common/user-avatar-default.png";
import { withMock, mockMyGift, mockLevelList } from "./mock.js";

const store = useMainStore();
const { t } = useI18n();

const defaultGiftImg = defaultAvatar;
const defaultRewardImg = defaultAvatar;

// 我的名人礼物数据
const myGift = ref({});
const hasMyGift = computed(() => !!myGift.value && myGift.value.hasGift);

// 等级列表
const levelList = ref([]);

// 奖励展示
const rewardPage = ref(0);
const rewardsPerPage = 2;

const allRewards = ref([
  { name: "HEADWEAR*7", image: "" },
  { name: "BADGE*7", image: "" },
  { name: "FRAME*7", image: "" },
  { name: "THEME*7", image: "" },
]);

const currentRewards = computed(() => {
  const start = rewardPage.value * rewardsPerPage;
  return allRewards.value.slice(start, start + rewardsPerPage);
});

const prevReward = () => {
  if (rewardPage.value > 0) rewardPage.value--;
};

const nextReward = () => {
  const maxPage = Math.ceil(allRewards.value.length / rewardsPerPage) - 1;
  if (rewardPage.value < maxPage) rewardPage.value++;
};

// 触摸滑动
const carouselRef = ref(null);
let touchStartX = 0;
let touchEndX = 0;

const onTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX;
};

const onTouchMove = (e) => {
  touchEndX = e.changedTouches[0].screenX;
};

const onTouchEnd = () => {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 30) {
    if (diff > 0) {
      nextReward();
    } else {
      prevReward();
    }
  }
};

// 获取我的名人礼物
const getMyGift = async () => {
  const data = await withMock(
    () =>
      get("/h5doings/activity/celebrityGift2026/myGift", {
        uid: store.uid,
        ticket: store.ticket,
        language: store.language,
      }),
    mockMyGift,
  );
  myGift.value = data || {};
};

// 获取等级列表
const getLevelList = async () => {
  const data = await withMock(
    () =>
      get("/h5doings/activity/celebrityGift2026/levelList", {
        uid: store.uid,
        ticket: store.ticket,
        language: store.language,
      }),
    mockLevelList,
  );
  levelList.value = data.list || [];
};

onMounted(async () => {
  await getMyGift();
  await getLevelList();
});
</script>

<style lang="scss" scoped>
.gift-battle {
  width: 100%;
  padding: 0 12px 20px;
  background: #000000;

  .panel {
    position: relative;
    margin-bottom: 14px;
    padding: 34px 12px 14px;
    border-radius: 14px;
    border: 1px solid rgba(231, 183, 64, 0.55);
    background:
      linear-gradient(180deg, rgba(103, 16, 24, 0.92) 0%, rgba(43, 6, 10, 0.95) 100%);
    box-shadow:
      inset 0 0 18px rgba(0, 0, 0, 0.35),
      0 4px 14px rgba(0, 0, 0, 0.35);

    .panel-title {
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      height: 28px;
      min-width: 168px;
      padding: 0 22px;
      border-radius: 0 0 12px 12px;
      background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
        color: #5c1503;
        white-space: nowrap;
      }
    }
  }

  // 我的名人礼物
  .my-gift-panel {
    .my-gift-content {
      .gift-info {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 10px 0;

        .gift-image {
          width: 100px;
          height: 130px;
          border-radius: 8px;
          border: 1px solid rgba(242, 205, 99, 0.5);
          overflow: hidden;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .gift-detail {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;

          .detail-row {
            display: flex;
            align-items: center;
            font-size: 12px;
            line-height: 18px;

            .detail-label {
              color: #e9c889;
              margin-right: 6px;
            }

            .detail-value {
              color: #ffe9c7;
              font-weight: bold;

              &.state-valid {
                color: #7ee787;
              }
            }
          }
        }
      }

      .gift-tip {
        margin-top: 8px;
        padding: 8px 10px;
        border-radius: 8px;
        background: rgba(242, 205, 99, 0.1);
        border: 1px solid rgba(242, 205, 99, 0.3);
        font-size: 11px;
        line-height: 16px;
        color: #e9c889;
        text-align: center;
      }
    }

    // 空状态
    .my-gift-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 20px;

      .empty-text {
        font-size: 12px;
        line-height: 20px;
        color: #e9c889;
        text-align: center;
        margin-bottom: 20px;
      }

      .empty-loading {
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(242, 205, 99, 0.2);
          border-top-color: #f2cd63;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      }
    }
  }

  // 名人礼物等级
  .level-panel {
    .level-tip {
      font-size: 11px;
      line-height: 16px;
      color: #e9c889;
      text-align: center;
      margin-bottom: 16px;
    }

    .level-road {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 20px;
      padding: 0 8px;

      .level-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;

        .level-coin {
          display: flex;
          align-items: center;
          gap: 4px;

          .coin-icon {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
          }

          .coin-num {
            font-weight: bold;
            font-size: 11px;
            color: #f7d264;
          }
        }

        .level-badge {
          width: 36px;
          height: 20px;
          border-radius: 10px;
          background: linear-gradient(180deg, #8a8a8a 0%, #555555 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 10px;
          color: #fff;

          &.level-active {
            background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
            color: #5c1503;
          }
        }
      }
    }

    .reward-showcase {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;

      .reward-arrow {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        flex-shrink: 0;

        span {
          font-size: 14px;
          color: #f2cd63;
        }

        &:active {
          transform: scale(0.9);
        }
      }

      .reward-carousel {
        flex: 1;
        overflow: hidden;
        touch-action: pan-x;

        .reward-track {
          display: flex;
          transition: transform 0.3s ease;
          width: fit-content;

          .reward-item {
            width: 50%;
            min-width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;

            .reward-frame {
              width: 80px;
              height: 100px;
              border-radius: 40px 40px 8px 8px;
              border: 2px solid #e7b740;
              background: linear-gradient(180deg, rgba(103, 16, 24, 0.8) 0%, rgba(43, 6, 10, 0.9) 100%);
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;

              img {
                width: 60px;
                height: 60px;
                object-fit: cover;
              }
            }

            .reward-name {
              font-size: 11px;
              color: #ffdf9a;
              text-align: center;
            }
          }
        }
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>