<!-- 名人礼物榜：按收到礼物价值排序的名人榜单 -->
<template>
  <div class="celebrity-rank">
    <!-- 奖励  周和月才显示 -->
    <div class="top-reward" v-if="curTab === 1 || curTab === 2">
      <div class="title">
        <span>Weekly TOP1 Reward</span>
        <span>Monthly TOP1 Reward</span>
      </div>
      <div class="more">MORE</div>
      <div class="gift-list">
        <div class="gift-item" v-for="(gift, idx) in topRewards" :key="idx">
          <div class="gift-icon">
            <img :src="gift.rewardUrl || defaultRewardImg" alt="Reward" />
          </div>
          <div class="name">{{ gift.rewardName }}</div>
          <div class="number">{{ gift.rewardValue }}</div>
        </div>
      </div>
    </div>
    <!-- tab -->
    <div class="tab">
      <div
        v-for="item in tabList"
        :key="item.value"
        class="tab-item"
        :class="{ 'tab-item-active': curTab === item.value }"
        @click="tabChange(item)"
      >
        {{ item.text }}
      </div>
    </div>

    <div v-if="curTab === 1 || curTab === 2" class="view-weekly view-monthly">
      <div class="count-down">
        <div class="time-list">
          <div class="time-item">
            <div class="time-number"></div>
            <div class="time-text"></div>
          </div>
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

      <!-- 名人榜列表 -->
      <div class="rank-list-panel"></div>
    </div>

    <div v-if="curTab === 3" class="view-previous-winner"></div>
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
  height: auto;

  .top-reward {
    width: 100%;
    height: 314px;
    margin-bottom: 8px;
    background: url("@/assets/activity/celebrityGifts/top-reward-bg.png") no-repeat center center;
    background-size: cover;
    .title {
      font-style: Bold;
      font-size: 14px;
      text-align: center;
    }
    .more {
      font-size: 12px;
      color: #ffe9c7;
      cursor: pointer;
    }
    .gift-list {
      display: flex;
      gap: 12px;
      .gift-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .gift-icon {
          width: 50px;
          height: 50px;
          margin-bottom: 4px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .name {
          font-size: 12px;
          color: #ffe9c7;
          margin-bottom: 2px;
        }
        .number {
          font-size: 12px;
          color: #ffe9c7;
        }
      }
    }
  }
}
</style>
