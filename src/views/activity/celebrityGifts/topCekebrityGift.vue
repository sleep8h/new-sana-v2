<!-- 名人礼物榜：按收到礼物价值排序的名人榜单 -->
<template>
  <div class="celebrity-rank">
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
    <div class="podium">
      <div class="podium-empty" v-if="celebrityList.length === 0">{{ $t("celebrityGifts.noRank") }}</div>
      <template v-else>
        <div class="podium-side" v-if="top2">
          <div class="shield">
            <img :src="top2.avatar" alt="" />
          </div>
          <div class="podium-name text-hide">{{ celebrityName(top2) }}</div>
          <div class="podium-score">{{ formatNumber(top2.integral) }}</div>
        </div>
        <div class="podium-center" v-if="top1">
          <div class="crown-badge"></div>
          <div class="top-frame">
            <img :src="top1.avatar" alt="" />
          </div>
          <div class="podium-name text-hide">{{ celebrityName(top1) }}</div>
          <div class="podium-score center-score">{{ formatNumber(top1.integral) }}</div>
          <div class="chair"></div>
        </div>
        <div class="podium-side" v-if="top3">
          <div class="shield shield-bronze">
            <img :src="top3.avatar" alt="" />
          </div>
          <div class="podium-name text-hide">{{ celebrityName(top3) }}</div>
          <div class="podium-score">{{ formatNumber(top3.integral) }}</div>
        </div>
      </template>
    </div>

    <!-- 榜单奖励一览 -->
    <div class="panel reward-strip">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.rankReward") }}</span>
      </div>
      <div class="strip-list">
        <reward v-for="gift in rewardGifts" :key="gift.giftId" :gift="gift" :size="42" />
      </div>
    </div>

    <!-- 名人堂：历届 TOP1 -->
    <div class="panel hall-of-fame">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.hallOfFame") }}</span>
      </div>
      <div class="fame-card" v-for="item in hallOfFame" :key="item.uid">
        <div class="fame-top1">TOP1</div>
        <div class="fame-stage">
          <div class="fame-avatar">
            <img :src="item.avatar" alt="" />
          </div>
        </div>
        <div class="fame-info">
          <div class="fame-name text-hide">{{ item.nick }}</div>
          <div class="fame-period">{{ item.period }}</div>
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
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { get } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import reward from "./components/reward.vue";
import senderTop from "./components/senderTop.vue";
import { withMock, mockCelebrityRank, mockHallOfFame, mockRewardGroups } from "./mock.js";

const store = useMainStore();
const { t } = useI18n();

const curTab = ref(1);
const tabList = [
  { text: t("celebrityGifts.todayRank"), value: 1 },
  { text: t("celebrityGifts.yesterdayRank"), value: 2 },
  { text: t("celebrityGifts.totalRank"), value: 3 },
];

const celebrityList = ref([]);
const hallOfFame = ref([]);

const top1 = computed(() => celebrityList.value[0] || null);
const top2 = computed(() => celebrityList.value[1] || null);
const top3 = computed(() => celebrityList.value[2] || null);

const rewardGifts = computed(() => mockRewardGroups[0]?.gifts || []);

const celebrityName = (c) => (store.language === "ar" ? c.nickAr || c.nick : c.nick);
const formatNumber = (num) => Number(num || 0).toLocaleString("en-US");

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
});
</script>

<style lang="scss" scoped>
.celebrity-rank {
  width: 100%;
  padding: 0 12px 20px;
  color: #ffe9c7;

  .sub-tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px 0 6px;
    .sub-tab {
      width: 96px;
      height: 32px;
      margin: 0 5px;
      border-radius: 16px;
      border: 1px solid rgba(242, 205, 99, 0.55);
      background: rgba(40, 6, 10, 0.85);
      font-weight: bold;
      font-size: 13px;
      line-height: 30px;
      text-align: center;
      color: #d8b46a;
    }
    .sub-tab-show {
      border-color: #f7d264;
      background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
      color: #5c1503;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }
  }

  .podium {
    position: relative;
    height: 232px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 0 8px;

    .podium-side {
      width: 116px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 6px;
      .shield {
        width: 88px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 10px;
        background: linear-gradient(180deg, #fff0b8 0%, #d69f2e 55%, #8a5a14 100%);
        clip-path: polygon(0 0, 100% 0, 100% 68%, 50% 100%, 0 68%);
        filter: drop-shadow(0 5px 7px rgba(0, 0, 0, 0.55));
        > img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #6a3f0d;
        }
      }
      .shield-bronze {
        background: linear-gradient(180deg, #ffd9c2 0%, #d8732e 55%, #8a3a14 100%);
      }
      .podium-name {
        max-width: 110px;
        margin-top: 5px;
        font-weight: bold;
        font-size: 12px;
        line-height: 16px;
        color: #ffe0a0;
        text-align: center;
      }
      .podium-score {
        padding: 0 10px;
        height: 20px;
        border-radius: 10px;
        background: rgba(242, 205, 99, 0.14);
        border: 1px solid rgba(242, 205, 99, 0.5);
        font-weight: bold;
        font-size: 11px;
        line-height: 18px;
        color: #f7d264;
      }
    }

    .podium-center {
      position: relative;
      width: 140px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 4px;
      .crown-badge {
        width: 34px;
        height: 21px;
        margin-bottom: -2px;
        background: linear-gradient(180deg, #fff0b8 0%, #e0a92f 100%);
        clip-path: polygon(0 100%, 0 35%, 18% 65%, 34% 15%, 50% 65%, 66% 15%, 82% 65%, 100% 35%, 100% 100%);
        filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5));
      }
      .top-frame {
        width: 96px;
        height: 96px;
        padding: 3px;
        border-radius: 50%;
        background: linear-gradient(135deg, #fff0b8 0%, #f2cd63 40%, #a8741c 100%);
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.55);
        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #5a2e08;
          object-fit: cover;
        }
      }
      .podium-name {
        max-width: 132px;
        margin-top: 6px;
        font-weight: bold;
        font-size: 13px;
        line-height: 17px;
        color: #ffe9b0;
        text-align: center;
      }
      .center-score {
        background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
        color: #5c1503;
      }
      .chair {
        width: 116px;
        height: 18px;
        margin-top: 4px;
        border-radius: 4px 4px 0 0;
        background: linear-gradient(180deg, #f2cd63 0%, #a8741c 100%);
        border: 1px solid #8a5a14;
        border-bottom: none;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: -12px;
          width: calc(100% + 24px);
          height: 10px;
          border-radius: 4px;
          background: linear-gradient(180deg, #caa24c 0%, #7c5414 100%);
          border: 1px solid #6a470f;
        }
      }
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

  .panel {
    position: relative;
    margin-top: 18px;
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

  .reward-strip {
    .strip-list {
      display: flex;
      justify-content: space-around;
    }
  }

  .hall-of-fame {
    .fame-card {
      display: flex;
      align-items: center;
      padding: 8px 6px;
      margin-bottom: 10px;
      border-radius: 10px;
      border: 1px solid rgba(231, 183, 64, 0.4);
      background: linear-gradient(90deg, rgba(40, 7, 12, 0.75) 0%, rgba(74, 13, 19, 0.55) 100%);
      &:last-child {
        margin-bottom: 0;
      }
      .fame-top1 {
        width: 52px;
        font-family: LogoSCUnboundedSans, sans-serif;
        font-weight: bold;
        font-size: 22px;
        line-height: 26px;
        text-align: center;
        background-image: linear-gradient(180deg, #fff3c4 0%, #f3c54b 60%, #b07a1c 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .fame-stage {
        width: 58px;
        height: 58px;
        margin: 0 10px;
        border-radius: 50% 50% 8px 8px;
        border: 2px solid #e7b740;
        background: radial-gradient(circle at 50% 25%, rgba(255, 220, 150, 0.4) 0%, transparent 65%),
          linear-gradient(180deg, #9e1b26 0%, #5e0d14 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        .fame-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #f2cd63;
          overflow: hidden;
          > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .fame-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        .fame-name {
          font-weight: bold;
          font-size: 13px;
          color: #ffe9c7;
        }
        .fame-period {
          font-size: 11px;
          color: #e9c889;
        }
        .fame-score {
          font-weight: bold;
          font-size: 14px;
          color: #f7d264;
        }
      }
    }
  }
}
</style>
