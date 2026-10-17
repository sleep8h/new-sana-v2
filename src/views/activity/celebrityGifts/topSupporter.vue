<!-- 名人礼物榜：按收到礼物价值排序的名人榜单 -->
<template>
  <div class="celebrity-rank">
    <!-- 奖励  周和月才显示 -->
    <div class="top-reward" v-if="curTab === 1 || curTab === 2">
      <div class="title">
        <span v-if="curTab === 1">Weekly TOP1 Reward</span>
        <span v-else>Monthly TOP1 Reward</span>
      </div>
      <div class="more"></div>
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
        :class="[`tab-item-${item.value}`, { [`tab-item-${item.value}-active`]: curTab === item.value }]"
        @click="tabChange(item)"
      >
        <span class="tab-text">{{ item.text }}</span>
      </div>
    </div>

    <div v-if="curTab === 1 || curTab === 2" class="view-weekly view-monthly">
      <div class="top">
        <div class="count-down">
          <div class="time-list">
            <div class="time-item" v-for="(t, idx) in timeUnits" :key="idx">
              <div class="time-number">{{ t.value }}</div>
              <div class="time-text">{{ t.label }}</div>
            </div>
          </div>
        </div>
        <!-- TOP3 王座 -->
        <div class="podium-section">
          <!-- TOP1 -->
          <div class="top1" v-if="top1">
            <div class="avatar">
              <div class="avatar-frame"></div>
              <img class="avatar-img" :src="top1.avatar" alt="" />
            </div>
            <div class="podium-info">
              <div class="podium-name text-hide">{{ celebrityName(top1) }}</div>
              <div class="podium-score highlight">
                <div class="coin-icon"></div>
                <span>{{ formatNumber(top1.integral) }}</span>
              </div>
            </div>
          </div>

          <!-- TOP2 -->
          <div class="top2" v-if="top2">
            <div class="avatar">
              <div class="avatar-frame"></div>
              <img class="avatar-img" :src="top2.avatar" alt="" />
            </div>
            <div class="podium-info">
              <div class="podium-name text-hide">{{ celebrityName(top2) }}</div>
              <div class="podium-score highlight">
                <div class="coin-icon"></div>
                <span>{{ formatNumber(top2.integral) }}</span>
              </div>
            </div>
          </div>

          <!-- TOP3 -->
          <div class="top3" v-if="top3">
            <div class="avatar">
              <div class="avatar-frame"></div>
              <img class="avatar-img" :src="top3.avatar" alt="" />
            </div>
            <div class="podium-info">
              <div class="podium-name text-hide">{{ celebrityName(top3) }}</div>
              <div class="podium-score highlight">
                <div class="coin-icon"></div>
                <span>{{ formatNumber(top3.integral) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 名人礼物榜列表 -->
      <div class="list-section">
        <div class="item" v-for="(item, idx) in celebrityList.slice(3, 50)" :key="idx">
          <div class="col-rank">
            <div class="rank-num">{{ idx + 4 }}</div>
            <div class="region">{{ item.region }}</div>
          </div>
          <div class="col-avatar">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="col-name-userno">
            <div class="name">{{ celebrityName(item) }}</div>
            <div class="userno">
              <img src="@/assets/activity/celebrityGifts/darkListBanner.png" alt="" />
              <span>{{ "123456" }}</span>
            </div>
          </div>
          <div class="col-score">
            <img src="@/assets/activity/celebrityGifts/dataIcon.png" alt="" />
            <span>{{ `${formatNumber(item.integral)}` }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="user-info" v-if="curTab === 1 || curTab === 2">
      <div class="progress-box">
        <div
          class="progress"
          :class="{ 'progress-rtl': store.language === 'ar' }"
          :style="{ width: progressPercent + '%' }"
        >
          <span class="progress-text">88%</span>
        </div>
      </div>
      <div class="user-info-item">
        <div class="col-rank">
          <div class="rank-num">{{ userInfo.rank }}</div>
          <div class="region">{{ userInfo.region }}</div>
        </div>
        <div class="col-avatar">
          <img :src="userInfo.avatar" alt="" />
        </div>
        <div class="col-name-userno">
          <div class="name">{{ celebrityName(userInfo) }}</div>
          <div class="userno">
            <img src="@/assets/activity/celebrityGifts/darkListBanner.png" alt="" />
            <span>{{ "123456" }}</span>
          </div>
        </div>
        <div class="col-number-score">
          <div class="col-number">
            <span>{{ $t("celebrityGifts.myShare") }}</span>
            <span>{{ userInfo.percent }}%</span>
          </div>
          <div class="col-score">
            <img src="@/assets/activity/celebrityGifts/dataIcon.png" alt="" />
            <span>{{ `${formatNumber(userInfo.integral)}` }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="curTab === 3" class="view-previous-winner">
      <div class="view-previous-winner-list">
        <div class="view-previous-winner-item" v-for="(item, idx) in previousWinnerList" :key="idx">
          <div class="winner-period">
            <img src="@/assets/activity/celebrityGifts/whiteSparkleIcon.png" alt="" />
            <span>{{ item.period }}</span>
            <img src="@/assets/activity/celebrityGifts/whiteSparkleIcon.png" alt="" />
          </div>
          <div class="winner-podium">
            <!-- TOP1 -->
            <div class="podium-first">
              <div class="podium-avatar">
                <div class="frame"></div>
                <img :src="item.top1?.avatar" alt="" />
              </div>
              <div class="text">
                <div class="podium-name">{{ item.top1?.name }}</div>
                <div class="podium-score">x{{ formatNumber(item.top1?.score) }}</div>
              </div>
            </div>
            <!-- TOP2 -->
            <div class="podium-second">
              <div class="podium-avatar">
                <div class="frame"></div>
                <img :src="item.top2?.avatar" alt="" />
              </div>
              <div class="text">
                <div class="podium-name">{{ item.top2?.name }}</div>
                <div class="podium-score">x{{ formatNumber(item.top2?.score) }}</div>
              </div>
            </div>
            <!-- TOP3 -->
            <div class="podium-third">
              <div class="podium-avatar">
                <div class="frame"></div>
                <img :src="item.top3?.avatar" alt="" />
              </div>
              <div class="text">
                <div class="podium-name">{{ item.top3?.name }}</div>
                <div class="podium-score">x{{ formatNumber(item.top3?.score) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  { text: t("celebrityGifts.weeklyRank"), value: 1 },
  { text: t("celebrityGifts.monthlyRank"), value: 2 },
  { text: t("celebrityGifts.previousWinner"), value: 3 },
];

const celebrityList = ref([]);
const hallOfFame = ref([]);
const userInfo = ref({
  rank: 99,
  region: "",
  avatar: defaultRewardImg,
  nick: "123456",
  nickAr: "",
  percent: 88,
  integral: 88888,
});
const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let countdownTimer = null;

const top1 = computed(() => celebrityList.value[0] || null);
const top2 = computed(() => celebrityList.value[1] || null);
const top3 = computed(() => celebrityList.value[2] || null);

// 进度条百分比，可自行修改
const progressPercent = ref(60);

const previousWinnerList = ref([
  {
    period: "2026/09/14 ~ 2026/09/20",
    top1: {
      avatar: "https://example.com/avatar1.png",
      name: "礼物昵称",
      score: 7777,
    },
    top2: {
      avatar: "https://example.com/avatar2.png",
      name: "礼物昵称",
      score: 7777,
    },
    top3: {
      avatar: "https://example.com/avatar3.png",
      name: "礼物昵称",
      score: 7777,
    },
  },
  {
    period: "2026/09/14 ~ 2026/09/20",
    top1: {
      avatar: "https://example.com/avatar1.png",
      name: "礼物昵称",
      score: 7777,
    },
    top2: {
      avatar: "https://example.com/avatar2.png",
      name: "礼物昵称",
      score: 7777,
    },
    top3: {
      avatar: "https://example.com/avatar3.png",
      name: "礼物昵称",
      score: 7777,
    },
  },
  {
    period: "2026/09/14 ~ 2026/09/20",
    top1: {
      avatar: "https://example.com/avatar1.png",
      name: "礼物昵称",
      score: 7777,
    },
    top2: {
      avatar: "https://example.com/avatar2.png",
      name: "礼物昵称",
      score: 7777,
    },
    top3: {
      avatar: "https://example.com/avatar3.png",
      name: "礼物昵称",
      score: 7777,
    },
  },
]);

const topRewards = computed(() => mockRewardGroups[0]?.gifts?.slice(0, 4) || []);

const celebrityName = (c) => (store.language === "ar" ? c.nickAr || c.nick : c.nick);
const formatNumber = (num) => Number(num || 0).toLocaleString("en-US");

const padZero = (num) => String(num).padStart(2, "0");

const timeUnits = computed(() => [
  { value: padZero(countdown.value.days), label: t("celebrityGifts.day") },
  { value: padZero(countdown.value.hours), label: t("celebrityGifts.hour") },
  { value: padZero(countdown.value.minutes), label: t("celebrityGifts.minute") },
  { value: padZero(countdown.value.seconds), label: t("celebrityGifts.second") },
]);

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

const goToHallOfFame = () => {
  // TODO: 跳转到名人堂页面
  console.log("go to hall of fame");
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
  if (data.userInfo) {
    userInfo.value = { ...userInfo.value, ...data.userInfo };
  }
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
    position: relative;
    .title {
      position: absolute;
      top: 31.5px;
      left: 50%;
      transform: translateX(-50%);
      font-style: Bold;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
    }
    .more {
      width: 92px;
      height: 28px;
      position: absolute;
      top: 81.5px;
      right: -18px;
      background: url("@/assets/activity/celebrityGifts/brownMedallionBanner.png") no-repeat center center;
      background-size: cover;
    }
    .gift-list {
      position: absolute;
      top: 120px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 3.5px;
      .gift-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .gift-icon {
          width: 83px;
          height: 83px;
          margin-bottom: 4px;
          background: url("@/assets/activity/celebrityGifts/gift-bg.png") no-repeat center center;
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 64px;
            height: auto;
          }
        }
        .name {
          font-size: 12px;
          background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: bold;
          margin-top: 13.5px;
        }
        .number {
          font-size: 11px;
          background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      }
    }
  }

  .tab {
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 8px;
    .tab-item-1 {
      width: 130px;
      height: 36px;
      background: url("@/assets/activity/celebrityGifts/tab1-hide.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .tab-item-2 {
      width: 131px;
      height: 36px;
      margin: 0 -8px;
      background: url("@/assets/activity/celebrityGifts/tab2-hide.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .tab-item-3 {
      width: 130px;
      height: 36px;
      background: url("@/assets/activity/celebrityGifts/tab3-hide.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .tab-item-1,
    .tab-item-2,
    .tab-item-3 {
      display: flex;
      justify-content: center;
      align-items: center;
      .tab-text {
        padding: 0 12px;
        color: #470000;
        font-size: 12px;
        line-height: 14px;
        font-style: Bold;
        text-align: center;
      }
    }
    .tab-item-1-active {
      width: 130px;
      height: 42.5px;
      background: url("@/assets/activity/celebrityGifts/tab1-show.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .tab-item-2-active {
      width: 132px;
      height: 42.5px;
      background: url("@/assets/activity/celebrityGifts/tab2-show.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .tab-item-3-active {
      width: 130px;
      height: 42.5px;
      background: url("@/assets/activity/celebrityGifts/tab3-show.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .tab-item-1-active,
    .tab-item-2-active,
    .tab-item-3-active {
      display: flex;
      justify-content: center;
      align-items: center;
      .tab-text {
        padding: 6.5px 12px 0 12px;
        color: #470000;
        font-size: 12px;
        line-height: 14px;
        font-style: Bold;
        text-align: center;
      }
    }
  }
  .view-weekly,
  .view-monthly {
    width: 100%;
    height: auto;
    padding-bottom: 125px;
    .top {
      width: 100%;
      // height: 724px;
      // background: url("@/assets/activity/celebrityGifts/darkRedAppPageScreenshot.png") no-repeat center center;
      height: 783px;
      background: url("@/assets/activity/celebrityGifts/goldPageFrame.png") no-repeat center center;
      background-size: 100% 100%;
      position: relative;
      margin-bottom: 12px;
      &::after {
        content: "";
        position: absolute;
        z-index: -1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 385px;
        height: 743px;
        background: url("@/assets/activity/celebrityGifts/darkRedAppPageScreenshot.png") no-repeat center center;
        background-size: cover;
      }
      .count-down {
        position: absolute;
        top: 67.5px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        .time-list {
          display: flex;
          .time-item {
            width: 68px;
            height: 67.5px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            background: url("@/assets/activity/celebrityGifts/time-bg.png") no-repeat center center;
            background-size: 100% 100%;
            .time-number {
              margin-top: 5px;
              width: 42px;
              font-size: 32px;
              height: 37.5px;
              line-height: 37.5px;
              font-weight: bold;
              background: linear-gradient(180deg, #fbdb9b 4.97%, #fffdf2 40.31%, #ffecbb 92.76%, #ffd686 147.83%);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
            }
            .time-text {
              font-size: 12px;
              background: linear-gradient(127.58deg, #fff0ca 3.96%, #ffd05e 95.87%);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
            }
          }
        }
      }
      .podium-section {
        position: absolute;
        width: 100%;
        height: 485.5px;
        top: 174.5px;
        left: 50%;
        transform: translateX(-50%);
        .top1,
        .top2,
        .top3 {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 224px;
          height: 280px;
          .avatar {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 224px;
            height: 232px;
            .avatar-frame {
              width: 224px;
              height: 232px;
              position: absolute;
              z-index: 10;
              background: url("@/assets/activity/celebrityGifts/avatarTop1.png") no-repeat center center;
              background-size: 100% 100%;
            }
            .avatar-img {
              position: absolute;
              z-index: 9;
              top: 55px;
              left: 50%;
              transform: translateX(-50%);
              width: 120px;
              height: 120px;
            }
          }
          .podium-info {
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 140px;
            height: 48px;
            // top: 232px;
            top: 212px;
            left: 50%;
            transform: translateX(-50%);
            background: url("@/assets/activity/celebrityGifts/darkRedInfoBar1.png") no-repeat center center;
            background-size: 100% 100%;
            font-size: 11px;
            text-align: center;
            .podium-name {
              font-size: 12px;
              font-weight: bold;
              background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
            }
            .podium-score {
              font-size: 11px;
              font-weight: bold;
              background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 5px;
              .coin-icon {
                width: 12px;
                height: 10px;
                background: url("@/assets/activity/celebrityGifts/goldLeafIcon.png") no-repeat center center;
                background-size: cover;
              }
            }
          }
        }
        .top2 {
          position: absolute;
          top: 280px;
          left: 31px;
          transform: translateX(0);
          width: 140px;
          height: 187px;
          .avatar {
            position: absolute;
            top: 0px;
            left: 50%;
            transform: translateX(-50%);
            width: 136px;
            height: 139px;
            .avatar-frame {
              width: 136px;
              height: 139px;
              background: url("@/assets/activity/celebrityGifts/avatarTop2.png") no-repeat center center;
              background-size: 100% 100%;
            }
            .avatar-img {
              position: absolute;
              z-index: 9;
              top: 32px;
              left: 50%;
              transform: translateX(-50%);
              width: 81px;
              height: 81px;
            }
          }
          .podium-info {
            top: 139px;
          }
        }
        .top3 {
          position: absolute;
          top: 280px;
          left: auto;
          transform: translateX(0);
          right: 16px;
          width: 140px;
          height: 187px;
          .avatar {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 134px;
            height: 139px;
            .avatar-frame {
              width: 134px;
              height: 139px;
              background: url("@/assets/activity/celebrityGifts/avatarTop3.png") no-repeat center center;
              background-size: 100% 100%;
            }
            .avatar-img {
              position: absolute;
              z-index: 9;
              top: 32px;
              left: 50%;
              transform: translateX(-50%);
              width: 81px;
              height: 81px;
            }
          }
          .podium-info {
            top: 139px;
          }
        }
      }
    }
    .list-section {
      width: 100%;
      max-height: 585px;
      overflow: auto;
      .item {
        width: 100%;
        height: 87px;
        margin-bottom: 12px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 18px;
        box-sizing: border-box;
        background: url("@/assets/activity/celebrityGifts/darkListBanner.png") no-repeat center center;
        background-size: 100% 100%;
        &:last-child {
          margin-bottom: 0;
        }
        .col-rank {
          width: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3.5px;
          margin-inline-end: 16.5px;
          .rank-num {
            font-weight: bold;
            background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 18px;
            line-height: 21px;
          }
          .region {
            width: 24px;
            height: 16px;
            background: url("@/assets/activity/celebrityGifts/darkListBanner.png") no-repeat center center;
            background-size: 100% 100%;
          }
        }
        .col-avatar {
          width: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-inline-end: 9px;
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        .col-name-userno {
          width: 90px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          .name {
            font-size: 12px;
            background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
            -webkit-background-clip: text;
            background-clip: text;
            font-size: 12px;
            line-height: 21px;
            text-align: start;
            color: transparent;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .userno {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 3px;
            > img {
              width: 12px;
              height: 12px;
            }
            > span {
              font-size: 13px;
              line-height: 21px;
              text-align: start;
              color: #ffffff;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .col-score {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 3px;
          flex: 1;
          background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
          -webkit-background-clip: text;
          background-clip: text;
          font-size: 12px;
          line-height: 21px;
          text-align: start;
          color: transparent;
          text-align: end;
          > img {
            width: 12px;
            height: 10px;
          }
        }
      }
    }
  }
  .user-info {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 125px;
    background: url("@/assets/activity/celebrityGifts/stickyBottomBar.png") no-repeat center center;
    background-size: 100% 100%;
    z-index: 100;
    .progress-box {
      position: absolute;
      width: 100%;
      height: 18px;
      background: #2b2b2b;
      top: 9px;
      overflow: hidden;
      .progress {
        height: 18px;
        background: url("@/assets/activity/celebrityGifts/progress-status.png") no-repeat center center;
        background-size: cover;
        transition: width 0.3s ease;
        color: #0e0e0e;
        font-style: bold;
        font-size: 12px;
        text-align: end;
        position: relative;
        display: flex;
        box-sizing: border-box;
        padding: 0 2px;
        transform: scaleX(-1);
        &.progress-rtl {
          justify-content: flex-end;
          transform: scaleX(1);
          .progress-text {
            transform: scaleX(1);
          }
        }
        .progress-text {
          display: inline-block;
          transform: scaleX(-1);
        }
      }
    }
    .user-info-item {
      position: absolute;
      top: 27px;
      width: 100%;
      height: 87px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 18px;
      box-sizing: border-box;
      background: url("@/assets/activity/celebrityGifts/darkListBanner.png") no-repeat center center;
      background-size: 100% 100%;
      .col-rank {
        width: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3.5px;
        margin-inline-end: 16.5px;
        .rank-num {
          font-weight: bold;
          background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 18px;
          line-height: 21px;
        }
        .region {
          width: 24px;
          height: 16px;
          background: url("@/assets/activity/celebrityGifts/darkListBanner.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
      .col-avatar {
        width: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-inline-end: 9px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .col-name-userno {
        width: 90px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .name {
          font-size: 12px;
          background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
          -webkit-background-clip: text;
          background-clip: text;
          font-size: 12px;
          line-height: 21px;
          text-align: start;
          color: transparent;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .userno {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 3px;
          > img {
            width: 12px;
            height: 12px;
          }
          > span {
            font-size: 13px;
            line-height: 21px;
            text-align: start;
            color: #ffffff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .col-number-score {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        .col-number {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 5px;
          > span {
            &:nth-child(1) {
              font-size: 10px;
              color: #685a48;
            }
            &:nth-child(2) {
              font-size: 14px;
              color: #45a82c;
            }
          }
        }
        .col-score {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 3px;
          background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
          -webkit-background-clip: text;
          background-clip: text;
          font-size: 12px;
          line-height: 21px;
          text-align: start;
          color: transparent;
          text-align: end;
          > img {
            width: 12px;
            height: 10px;
          }
        }
      }
    }
  }
  .view-previous-winner {
    width: 100%;
    box-sizing: border-box;
    .view-previous-winner-list {
      display: flex;
      flex-direction: column;
      .view-previous-winner-item {
        width: 100%;
        height: 667px;
        background: url("@/assets/activity/celebrityGifts/darkPageScreenshot.png") no-repeat center center;
        background-size: 100% 100%;
        box-sizing: border-box;
        position: relative;
        .winner-period {
          position: absolute;
          top: 57px;
          left: 50%;
          transform: translateX(-50%);
          width: 250px;
          height: 32px;
          font-size: 16px;
          text-align: center;
          background: linear-gradient(180deg, #fbdb9b 4.97%, #fffdf2 40.31%, #ffecbb 92.76%, #ffd686 147.83%);
          -webkit-background-clip: text;
          background-clip: text;
          display: flex;
          justify-content: center;
          align-items: center;
          color: transparent;
          > img {
            width: 12px;
            height: 16px;
          }
          > span {
            display: inline-block;
            height: 16px;
            line-height: 16px;
            margin: 0 10px;
          }
          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 250px;
            height: 1px;
            background: url("@/assets/activity/celebrityGifts/previous-winner-title-bg.png") no-repeat center center;
            background-size: 100% 100%;
          }
        }
        .winner-podium {
          position: absolute;
          width: 100%;
          height: 667px;
          .podium-first,
          .podium-second,
          .podium-third {
            position: absolute;
            width: 147.5px;
            height: 186px;
            top: 97px;
            right: 26.5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .podium-avatar {
              width: 147.5px;
              height: 152px;
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              .frame {
                position: absolute;
                z-index: 10;
                width: 147.5px;
                height: 152px;
                background: url("@/assets/activity/celebrityGifts/top1-avatar.png") no-repeat center center;
                background-size: 100% 100%;
              }
              > img {
                position: absolute;
                z-index: 9;
                width: 98px;
                height: 98px;
                border-radius: 50%;
                overflow: hidden;
                object-fit: cover;
              }
            }
            .text {
              margin-top: 138px;
              width: 140px;
              height: 98px;
              background: url("@/assets/activity/celebrityGifts/darkRedInfoBar1.png") no-repeat center center;
              background-size: 100% 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .podium-name {
                font-size: 12px;
                font-style: bold;
                line-height: 22px;
                text-align: center;
                background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              .podium-score {
                background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent; /* 新增：让文字填充透明，显示渐变背景 */
                font-size: 12px;
                line-height: 12px;
              }
            }
          }
          .podium-second {
            width: 140px;
            height: 193px;
            top: 293px;
            left: 10.5px;
            transform: none;
            .podium-avatar {
              width: 115px;
              height: 131px;
              .frame {
                width: 115px;
                height: 131px;
                background: url("@/assets/activity/celebrityGifts/top2-avatar.png") no-repeat center center;
                background-size: 100% 100%;
              }
              > img {
                width: 105.5px;
                height: 105.5px;
              }
            }
            .text {
              margin-top: 128px;
            }
          }
          .podium-third {
            width: 140px;
            height: 166px;
            top: 386px;
            left: auto;
            right: 44px;
            transform: none;
            .podium-avatar {
              width: 115px;
              height: 118px;
              .frame {
                width: 115px;
                height: 118px;
                background: url("@/assets/activity/celebrityGifts/top3-avatar.png") no-repeat center center;
                background-size: 100% 100%;
              }
              > img {
                width: 105.5px;
                height: 105.5px;
              }
            }
            .text {
              margin-top: 118px;
            }
          }
        }
      }
    }
  }
}
</style>
