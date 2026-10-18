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
            <div class="gift-image-frame"></div>
            <img :src="myGift.giftPicUrl || defaultImg" :alt="myGift.giftName" />
          </div>
          <div class="gift-detail">
            <div class="detail">ID: {{ myGift.erbanNo }}</div>
            <div class="detail">WEEKLY LEVEL: {{ myGift.currentLevel }}</div>
            <div class="detail">MONTHLY TASK: {{ myGift.monthlyCount }}/40</div>
            <div class="detail">STATE: {{ myGift.status === 1 ? "Valid" : "Invalid" }}</div>
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
        <div class="level-item" v-for="(item, index) in levelList" :key="index" @click="goToSlide(index)">
          <div class="level-coin">
            <span class="coin-icon"></span>
            <span class="coin-num">{{ item }}</span>
          </div>
          <div class="level-badge" :class="{ 'level-active': rewardPage === index }">
            <div :class="'level' + (index + 1)"></div>
          </div>
        </div>
        <div class="level-badge-bg">
          <div class="progress-bg" :style="{ width: progressWidth }"></div>
        </div>
      </div>

      <!-- 奖励展示 -->
      <div class="reward-showcase">
        <div class="reward-arrow-left" @click="prevReward"></div>
        <div class="swiper-box">
          <Swiper
            :initial-slide="rewardPage"
            :slides-per-view="1"
            :slides-per-group="1"
            ref="rewardSwiper"
            :space-between="0"
            :speed="300"
            @slideChange="onRewardChange"
            style="height: 100%; width: 238.5px"
          >
            <SwiperSlide v-for="(rewardGroup, index) in allRewards" :key="index">
              <div class="reward-group">
                <div v-for="(reward, idx) in rewardGroup" :key="idx" class="reward-item">
                  <div class="reward-frame">
                    <img :src="reward.rewardUrl || defaultImg" :alt="reward.rewardName" />
                  </div>
                  <sanaAutoText class="reward-name">
                    <span>{{
                      `${store.language === "ar" ? reward.rewardNameAr : reward.rewardName}*${reward.rewardValue}`
                    }}</span>
                  </sanaAutoText>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div class="reward-arrow-right" @click="nextReward"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import defaultAvatar from "@/assets/common/user-avatar-default.png";

const store = useMainStore();
const { t } = useI18n();

const defaultImg = defaultAvatar;

// 我的名人礼物数据
const myGift = ref({});

// 等级列表
const levelList = ref([]);

// 进度条宽度计算
const progressWidth = computed(() => {
  const { currentLevel, weeklyCount, thresholds } = myGift.value || {};
  if (!currentLevel || currentLevel <= 0) return "0%";
  if (!thresholds || !Array.isArray(thresholds) || thresholds.length === 0) return "0%";
  // currentLevel 对应 thresholds 的索引 (currentLevel - 1)
  const threshold = thresholds[currentLevel - 1];
  if (!threshold || threshold <= 0) return "0%";
  const percent = Math.min((weeklyCount / threshold) * 100, 100);
  return `${percent}%`;
});

const hasMyGift = computed(() => {
  if (!myGift.value) return false;
  // 优先使用后端明确的 hasGift 标记
  if (typeof myGift.value.hasGift === "boolean") return myGift.value.hasGift;
  // status: 1 上架（有效），2 下架（无效）
  return !!myGift.value.giftPicUrl && myGift.value.status === 1;
});

// 奖励展示
const rewardPage = ref(0);
const rewardSwiper = ref(null);

const allRewards = ref([
  [
    { rewardName: "HEADWEAR HEADWEAR", rewardNameAr: "التواجه", rewardValue: 1, rewardUrl: "" },
    { rewardName: "BADGE", rewardNameAr: "شارة", rewardValue: 1, rewardUrl: "" },
  ],
  [
    { rewardName: "FRAME", rewardNameAr: "إطار", rewardValue: 2, rewardUrl: "" },
    { rewardName: "THEME", rewardNameAr: "سمة", rewardValue: 2, rewardUrl: "" },
  ],
  [
    { rewardName: "HEADWEAR", rewardNameAr: "التواجه", rewardValue: 3, rewardUrl: "" },
    { rewardName: "BADGE", rewardNameAr: "شارة", rewardValue: 3, rewardUrl: "" },
  ],
  [
    { rewardName: "FRAME", rewardNameAr: "إطار", rewardValue: 4, rewardUrl: "" },
    { rewardName: "FRAME", rewardNameAr: "إطار", rewardValue: 4, rewardUrl: "" },
  ],
  [
    { rewardName: "FRAME", rewardNameAr: "إطار", rewardValue: 5, rewardUrl: "" },
    { rewardName: "THEME", rewardNameAr: "سمة", rewardValue: 5, rewardUrl: "" },
  ],
]);

const onRewardChange = (swiper) => {
  rewardPage.value = swiper.activeIndex;
};

const goToSlide = (index) => {
  rewardPage.value = index;
  if (rewardSwiper.value && rewardSwiper.value.$el.swiper) {
    rewardSwiper.value.$el.swiper.slideTo(index, 300);
  }
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

const getDataList = async (type) => {
  try {
    const res = await postFormData("/h5doings/activity/famous2026/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      // 获取我的名人礼物
      myGift.value = res.data.myGift || {};
      levelList.value = res.data.levelThresholds || [];

      console.log(res);
    } else {
      console.error(res.message);
    }
  } catch (error) {
    console.error(error);
  }
};

// 获取奖励
const getRankRewards = async (type) => {
  try {
    const res = await get("/h5doings/activity/famous2026/rankRewards", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      groupType: 1,
    });
    if (res && res.code === 200) {
      const arr = Object.values(res.data || {});
      allRewards.value = arr;
    } else {
      console.error(res.message);
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await getDataList();
  await getRankRewards();
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
          position: relative;
          .gift-image-frame {
            position: absolute;
            z-index: 2;
            width: 89px;
            height: 126px;
            background: url("@/assets/activity/celebrityGifts/avatarFrame1.png") no-repeat center center;
            background-size: cover;
          }
          img {
            position: absolute;
            z-index: 1;
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
    position: relative;
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
      width: 100%;
      height: 82px;
      position: relative;
      top: 163px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 0 15px;

      .level-item {
        position: relative;
        z-index: 3;
        height: 82px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 25px 0;

        .level-coin {
          width: 69px;
          height: 25px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 5px;
          .coin-icon {
            width: 24px;
            height: 20px;
            background: url("@/assets/activity/celebrityGifts/goldLeafIcon.png") no-repeat center center;
            background-size: cover;
            margin-inline-start: 5px;
          }

          .coin-num {
            font-weight: bold;
            font-size: 15px;
            line-height: 18px;
            background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }

        .level-badge {
          width: 34px;
          height: 32px;
          border-radius: 50%;
          background: url("@/assets/activity/celebrityGifts/orangeCircleIcon.png") no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          .level1 {
            width: 25px;
            height: 15px;
            background: url("@/assets/activity/celebrityGifts/levelBadge1.png") no-repeat center center;
            background-size: cover;
          }
          .level2 {
            width: 25px;
            height: 15px;
            background: url("@/assets/activity/celebrityGifts/levelBadge2.png") no-repeat center center;
            background-size: cover;
          }
          .level3 {
            width: 25px;
            height: 15px;
            background: url("@/assets/activity/celebrityGifts/levelBadge3.png") no-repeat center center;
            background-size: cover;
          }
          .level4 {
            width: 25px;
            height: 15px;
            background: url("@/assets/activity/celebrityGifts/levelBadge4.png") no-repeat center center;
            background-size: cover;
          }
          .level5 {
            width: 25px;
            height: 15px;
            background: url("@/assets/activity/celebrityGifts/levelBadge5.png") no-repeat center center;
            background-size: cover;
          }
          &.level-active {
            transform: scale(1.2);
            transition: transform 0.3s ease;
          }
        }
      }
      .level-badge-bg {
        width: 345px;
        height: 18px;
        position: absolute;
        top: 57px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        background: #2b2b2b;
        border-radius: 9px;
        .progress-bg {
          width: 100%;
          height: 100%;
          border-radius: 9px;
          background: url("@/assets/activity/celebrityGifts/level-badge-bg.png") no-repeat center center;
          background-size: cover;
        }
      }
    }

    .reward-showcase {
      position: absolute;
      top: 275px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 171px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 37px;

      .reward-arrow-left,
      .reward-arrow-right {
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        top: 61px;
        left: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        flex-shrink: 0;
        background: url("@/assets/activity/celebrityGifts/swiper-arrow-left.png") no-repeat center center;
        background-size: cover;
        &:active {
          transform: scale(0.9);
        }
      }
      .reward-arrow-right {
        position: absolute;
        top: 61px;
        left: auto;
        right: 20px;
        background: url("@/assets/activity/celebrityGifts/swiper-arrow-right.png") no-repeat center center;
        background-size: cover;
      }
      .swiper-box {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 238.5px;
        height: 171px;
        overflow: hidden;
        .swiper {
          width: 238.5px;
          .reward-group {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 37.5px;
            height: 171px;
          }

          .reward-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            width: 100.5px;
            height: 171px;

            .reward-frame {
              width: 100.5px;
              height: 147px;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              background: url("@/assets/activity/celebrityGifts/goldTrophyIllustration.png") no-repeat center center;
              background-size: cover;
              img {
                width: 75px;
                height: 75px;
                object-fit: cover;
              }
            }

            .reward-name {
              width: 100.5px;
              height: 18px;
              line-height: 18px;
              font-size: 12px;
              :deep(span) {
                background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
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
