<!-- 礼物页：我的名人礼物 + 名人礼物等级 -->
<template>
  <div class="gift-battle">
    <!-- 模块一：MY CELEBRITY GIFT -->
    <!-- 有名人礼物 -->
    <div v-if="hasMyGift" class="panel my-gift-panel">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.myCelebrityGift") }}</span>
      </div>
      <div class="my-gift-content">
        <div class="gift-info">
          <div class="gift-image">
            <img :src="myGift.image || defaultGiftImg" alt="" />
          </div>
          <div class="gift-detail">
            <div class="detail">{{ $t("celebrityGifts.id", { number: myGift.uid }) }}</div>
            <div class="detail">{{ $t("celebrityGifts.weeklyLevel", { level: myGift.weeklyLevel }) }}</div>
            <div class="detail">
              {{ $t("celebrityGifts.monthlyTask", { num1: myGift.monthlyTaskNum1, num2: myGift.monthlyTaskNum2 }) }}
            </div>
            <div class="detail">
              {{
                $t("celebrityGifts.sate", {
                  state: myGift.state ? $t("celebrityGifts.valid") : $t("celebrityGifts.invalid"),
                })
              }}
            </div>
          </div>
        </div>
        <div class="gift-tip">{{ $t("celebrityGifts.myGiftTip") }}</div>
      </div>
    </div>

    <!-- 没有名人礼物 -->
    <div v-else class="panel my-gift-empty">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.myCelebrityGift") }}</span>
      </div>
      <div class="empty-text">{{ $t("celebrityGifts.noGiftTip") }}</div>
      <div class="empty-loading"></div>
    </div>

    <!-- 模块二：CELEBRITY GIFT LEVEL -->
    <div class="panel level-panel">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.celebrityGiftLevel") }}</span>
      </div>
      <div class="level-tip">{{ $t("celebrityGifts.levelTip") }}</div>

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
        <div class="reward-arrow left" @click="prevReward"></div>
        <Swiper
          :initial-slide="rewardPage"
          :slides-per-view="1"
          ref="rewardSwiper"
          :space-between="0"
          @slideChange="onRewardChange"
          style="height: 100%"
        >
          <SwiperSlide v-for="(reward, index) in allRewards" :key="index">
            <div class="reward-item">
              <div class="reward-frame">
                <img :src="reward.image || defaultRewardImg" alt="" />
              </div>
              <div class="reward-name">{{ reward.name }}</div>
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="reward-arrow right" @click="nextReward"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
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
const rewardSwiper = ref(null);

const allRewards = ref([
  { name: "HEADWEAR*7", image: "" },
  { name: "BADGE*7", image: "" },
  { name: "FRAME*7", image: "" },
  { name: "THEME*7", image: "" },
]);

const onRewardChange = (swiper) => {
  rewardPage.value = swiper.activeIndex;
};

const prevReward = () => {
  if (rewardSwiper.value && rewardSwiper.value.$el.swiper) {
    rewardSwiper.value.$el.swiper.slidePrev(300);
  }
};

const nextReward = () => {
  if (rewardSwiper.value && rewardSwiper.value.$el.swiper) {
    rewardSwiper.value.$el.swiper.slideNext(300);
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
  height: auto;
  max-height: 854px;
  background: #000000;
  .panel {
    position: relative;
    .panel-title {
      position: absolute;
      top: 33px;
      left: 50%;
      transform: translateX(-50%);
      line-height: 22px;
      font-weight: bold;
      font-size: 14px;
      text-align: center;
      color: #ffffff;
    }
  }
  // 我的名人礼物
  .my-gift-panel {
    width: 100%;
    height: 332px;
    background: url("@/assets/activity/celebrityGifts/myCeleBrityGiftBg.png") no-repeat center center;
    background-size: cover;
    .my-gift-content {
      position: absolute;
      top: 84px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 248px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .gift-info {
        width: 100%;
        height: 126px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 42px;
        padding: 0 57px;
        .gift-image {
          width: 89px;
          height: 126px;
          img {
            width: 89px;
            height: 126px;
            object-fit: fill;
          }
        }
        .gift-detail {
          flex: 1;
          height: 87px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 6px;
          .detail {
            font-size: 12px;
            line-height: 20px;
            background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
      .gift-tip {
        width: 305px;
        min-height: 54px;
        margin-top: 15px;
        font-size: 12px;
        line-height: 18px;
        background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        font-weight: bold;
      }
    }
  }

  // 空状态
  .my-gift-empty {
    width: 100%;
    height: 310px;
    background: url("@/assets/activity/celebrityGifts/myCeleBrityGiftEmptyBg.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .empty-text {
      width: 279px;
      height: 36px;
      font-size: 12px;
      line-height: 20px;
      color: #fff0c0;
      text-align: center;
      margin-top: 95px;
      margin-bottom: 27px;
    }
    .empty-loading {
      width: 92px;
      height: 92px;
      background: url("@/assets/activity/celebrityGifts/loading.png") no-repeat center center;
      background-size: cover;
      border-radius: 50%;
      animation: spin 2s linear infinite;
    }
  }

  // 名人礼物等级
  .level-panel {
    width: 100%;
    height: 507px;
    background: url("@/assets/activity/celebrityGifts/celebrityGiftLevelBg.png") no-repeat center center;
    background-size: cover;
    .level-tip {
      position: absolute;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      width: 250px;
      height: 36px;
      font-size: 12px;
      line-height: 18px;
      color: #e9c889;
      text-align: center;
      margin-bottom: 16px;
    }

    .level-road {
      position: absolute;
      top: 163px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
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
      position: absolute;
      top: 275px;
      left: 50%;
      transform: translateX(-50%);
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

      .swiper {
        flex: 1;

        .reward-item {
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
