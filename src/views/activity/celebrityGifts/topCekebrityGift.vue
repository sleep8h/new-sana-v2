<!-- 名人礼物榜：按收到礼物价值排序的名人榜单 -->
<template>
  <div class="celebrity-rank">
    <!-- 顶部标题 -->
    <div class="top-header">
      <div class="header-title">
        <span>WEEKLY TOP REWARD</span>
      </div>
    </div>

    <!-- 倒计时 -->
    <div class="countdown-section">
      <div class="countdown-item">
        <span class="count-num">{{ countdown.days }}</span>
        <span class="count-label">Days</span>
      </div>
      <div class="countdown-item">
        <span class="count-num">{{ countdown.hours }}</span>
        <span class="count-label">Hours</span>
      </div>
      <div class="countdown-item">
        <span class="count-num">{{ countdown.minutes }}</span>
        <span class="count-label">Minutes</span>
      </div>
      <div class="countdown-item">
        <span class="count-num">{{ countdown.seconds }}</span>
        <span class="count-label">Seconds</span>
      </div>
    </div>

    <!-- 奖励预览 -->
    <div class="reward-preview">
      <div class="reward-item" v-for="(gift, idx) in topRewards" :key="idx">
        <div class="reward-icon">
          <img :src="gift.rewardUrl || defaultRewardImg" alt="" />
        </div>
        <div class="reward-name">{{ gift.rewardName }}</div>
      </div>
    </div>

    <!-- 榜单切换 -->
    <div class="sub-tabs">
      <div
        v-for="item in tabList"
        :key="item.value"
        class="sub-tab"
        :class="{ 'sub-tab-show': curTab === item.value }"
        @click="tabChange(item)"
      >
        {{ item.text }}
      </div>
    </div>

    <!-- TOP3 王座 -->
    <div class="podium-section">
      <div class="podium-bg">
        <div class="podium-empty" v-if="celebrityList.length === 0">{{ $t("celebrityGifts.noRank") }}</div>
        <template v-else>
          <!-- TOP2 -->
          <div class="podium-item top2" v-if="top2">
            <div class="rank-badge">2</div>
            <div class="avatar-frame">
              <img :src="top2.avatar" alt="" />
            </div>
            <div class="podium-info">
              <div class="podium-name text-hide">{{ celebrityName(top2) }}</div>
              <div class="podium-score">{{ formatNumber(top2.integral) }}</div>
            </div>
          </div>

          <!-- TOP1 -->
          <div class="podium-item top1" v-if="top1">
            <div class="rank-badge">1</div>
            <div class="crown-icon"></div>
            <div class="avatar-frame large">
              <img :src="top1.avatar" alt="" />
            </div>
            <div class="podium-info">
              <div class="podium-name text-hide">{{ celebrityName(top1) }}</div>
              <div class="podium-score highlight">{{ formatNumber(top1.integral) }}</div>
            </div>
          </div>

          <!-- TOP3 -->
          <div class="podium-item top3" v-if="top3">
            <div class="rank-badge">3</div>
            <div class="avatar-frame">
              <img :src="top3.avatar" alt="" />
            </div>
            <div class="podium-info">
              <div class="podium-name text-hide">{{ celebrityName(top3) }}</div>
              <div class="podium-score">{{ formatNumber(top3.integral) }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 名人堂：历届 TOP1 -->
    <div class="panel hall-of-fame">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.hallOfFame") }}</span>
      </div>
      <div class="fame-list">
        <div class="fame-card" v-for="item in hallOfFame" :key="item.uid">
          <div class="fame-avatar">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="fame-info">
            <div class="fame-name text-hide">{{ item.nick }}</div>
            <div class="fame-period">{{ item.period }}</div>
          </div>
          <div class="fame-score">{{ formatNumber(item.integral) }}</div>
        </div>
      </div>
    </div>

    <!-- 名人榜列表 -->
    <div class="panel rank-list-panel">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.celebrityGiftRank") }}</span>
      </div>
      <senderTop :list="celebrityList.slice(3)" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { get } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import senderTop from "./components/senderTop.vue";
import { withMock, mockCelebrityRank, mockHallOfFame, mockRewardGroups } from "./mock.js";
import defaultAvatar from "@/assets/common/user-avatar-default.png";

const store = useMainStore();
const { t } = useI18n();

const defaultRewardImg = defaultAvatar;

const curTab = ref(1);
const tabList = [
  { text: t("celebrityGifts.todayRank"), value: 1 },
  { text: t("celebrityGifts.yesterdayRank"), value: 2 },
  { text: t("celebrityGifts.totalRank"), value: 3 },
];

const celebrityList = ref([]);
const hallOfFame = ref([]);
const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let countdownTimer = null;

const top1 = computed(() => celebrityList.value[0] || null);
const top2 = computed(() => celebrityList.value[1] || null);
const top3 = computed(() => celebrityList.value[2] || null);

const topRewards = computed(() => mockRewardGroups[0]?.gifts?.slice(0, 3) || []);

const celebrityName = (c) => (store.language === "ar" ? c.nickAr || c.nick : c.nick);
const formatNumber = (num) => Number(num || 0).toLocaleString("en-US");

const startCountdown = (timeOut) => {
  const updateCountdown = () => {
    const now = Date.now();
    const diff = timeOut - now;
    if (diff <= 0) {
      countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      clearInterval(countdownTimer);
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    countdown.value = { days, hours, minutes, seconds };
  };
  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
};

const tabChange = async (item) => {
  curTab.value = item.value;
  celebrityList.value = [];
  await getCelebrityRank();
};

const getCelebrityRank = async () => {
  const data = await withMock(
    () =>
      get("/h5doings/activity/celebrityGift2026/celebrityRank", {
        uid: store.uid,
        size: 100,
        type: curTab.value,
        ticket: store.ticket,
        language: store.language,
      }),
    mockCelebrityRank,
  );
  celebrityList.value = data.list || [];
};

const getHallOfFame = async () => {
  const data = await withMock(
    () =>
      get("/h5doings/activity/celebrityGift2026/hallOfFame", {
        uid: store.uid,
        ticket: store.ticket,
        language: store.language,
      }),
    mockHallOfFame,
  );
  hallOfFame.value = Array.isArray(data) ? data : data.list || [];
};

onMounted(async () => {
  await getCelebrityRank();
  await getHallOfFame();
  // 从 mock 数据获取倒计时时间
  const mockTimeOut = (44 * 24 * 60 * 60 + 19 * 60 * 60 + 38 * 60 + 29) * 1000;
  startCountdown(Date.now() + mockTimeOut);
});

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<style lang="scss" scoped>
.celebrity-rank {
  width: 100%;
  padding: 0 12px 20px;
  color: #ffe9c7;

  /* 顶部标题 */
  .top-header {
    text-align: center;
    padding: 16px 0 8px;
    .header-title {
      font-family: LogoSCUnboundedSans, sans-serif;
      font-weight: bold;
      font-size: 20px;
      line-height: 28px;
      color: #f2cd63;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
  }

  /* 倒计时 */
  .countdown-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    .countdown-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .count-num {
        width: 44px;
        height: 44px;
        border-radius: 8px;
        background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 20px;
        color: #5c1503;
      }
      .count-label {
        margin-top: 4px;
        font-size: 10px;
        color: #e9c889;
      }
    }
  }

  /* 奖励预览 */
  .reward-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-bottom: 16px;
    .reward-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      .reward-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        border: 2px solid #e7b740;
        background: linear-gradient(180deg, rgba(103, 16, 24, 0.8) 0%, rgba(43, 6, 10, 0.9) 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img {
          width: 48px;
          height: 48px;
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

  /* 标签切换 */
  .sub-tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px 0 16px;
    .sub-tab {
      width: 100px;
      height: 34px;
      margin: 0 4px;
      border-radius: 17px;
      border: 1px solid rgba(242, 205, 99, 0.55);
      background: rgba(40, 6, 10, 0.85);
      font-weight: bold;
      font-size: 13px;
      line-height: 32px;
      text-align: center;
      color: #d8b46a;
      cursor: pointer;
    }
    .sub-tab-show {
      border-color: #f7d264;
      background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
      color: #5c1503;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }
  }

  /* TOP3 王座 */
  .podium-section {
    position: relative;
    margin-bottom: 16px;
    .podium-bg {
      position: relative;
      height: 280px;
      background: url("@/assets/activity/celebrityGifts/darkRedPage1.png") no-repeat center center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding: 0 20px 20px;
      border-radius: 12px;
    }

    .podium-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .rank-badge {
        position: absolute;
        top: -10px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 14px;
        color: #5c1503;
        z-index: 2;
      }

      .avatar-frame {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        border: 3px solid #e7b740;
        background: linear-gradient(135deg, #fff0b8 0%, #f2cd63 40%, #a8741c 100%);
        padding: 3px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #5a2e08;
        }
        &.large {
          width: 96px;
          height: 96px;
        }
      }

      .crown-icon {
        position: absolute;
        top: -20px;
        width: 32px;
        height: 24px;
        background: url("@/assets/activity/celebrityGifts/goldTrophyIllustration.png") no-repeat center center;
        background-size: contain;
      }

      .podium-info {
        margin-top: 8px;
        text-align: center;
        .podium-name {
          max-width: 100px;
          font-weight: bold;
          font-size: 12px;
          line-height: 16px;
          color: #ffe0a0;
        }
        .podium-score {
          margin-top: 4px;
          padding: 2px 10px;
          border-radius: 10px;
          background: rgba(242, 205, 99, 0.14);
          border: 1px solid rgba(242, 205, 99, 0.5);
          font-weight: bold;
          font-size: 11px;
          line-height: 16px;
          color: #f7d264;
          &.highlight {
            background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
            color: #5c1503;
          }
        }
      }
    }

    .top1 {
      margin: 0 20px 20px;
      z-index: 1;
    }
    .top2,
    .top3 {
      margin-bottom: 10px;
    }

    .podium-empty {
      position: absolute;
      bottom: 20px;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 13px;
      color: #e9c889;
    }
  }

  /* 面板通用样式 */
  .panel {
    position: relative;
    margin-top: 16px;
    padding: 34px 12px 14px;
    border-radius: 14px;
    border: 1px solid rgba(231, 183, 64, 0.55);
    background: linear-gradient(180deg, rgba(103, 16, 24, 0.92) 0%, rgba(43, 6, 10, 0.95) 100%);
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

  /* 名人堂 */
  .hall-of-fame {
    .fame-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .fame-card {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(231, 183, 64, 0.4);
      background: linear-gradient(90deg, rgba(40, 7, 12, 0.75) 0%, rgba(74, 13, 19, 0.55) 100%);
      .fame-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 2px solid #e7b740;
        overflow: hidden;
        flex-shrink: 0;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .fame-info {
        flex: 1;
        margin-left: 12px;
        .fame-name {
          font-weight: bold;
          font-size: 14px;
          color: #ffe9c7;
        }
        .fame-period {
          font-size: 11px;
          color: #e9c889;
          margin-top: 2px;
        }
      }
      .fame-score {
        font-weight: bold;
        font-size: 14px;
        color: #f7d264;
      }
    }
  }
}
</style>
