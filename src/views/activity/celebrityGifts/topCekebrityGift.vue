<!-- 名人礼物榜：按收到礼物价值排序的名人榜单 -->
<template>
  <div class="celebrity-rank">
    <!-- senderTop 弹窗 -->
    <senderTop v-model:isShow="showSenderTop" :list="senderTopList" :giftName="senderTopGiftName" />
    <!-- 名人礼物周榜奖励弹窗 -->
    <cekebrityGiftReward v-model:isShow="showWeeklyReward" :list="weeklyRewardList" :type="1" />
    <!-- 名人礼物月榜奖励弹窗 -->
    <cekebrityGiftReward v-model:isShow="showMonthlyReward" :list="monthlyRewardList" :type="2" />
    <!-- 奖励  周和月才显示 -->
    <div class="top-reward" v-if="curTab === 1 || curTab === 2">
      <div class="title">
        <span v-if="curTab === 1">{{ $t("celebrityGifts.weeklyTop1Reward") }}</span>
        <span v-else>{{ $t("celebrityGifts.monthlyTop1Reward") }}</span>
      </div>
      <div class="more" @click="handleMoreClick"></div>
      <div class="gift-list">
        <div class="gift-item" v-for="(gift, idx) in topRewardsArr" :key="idx">
          <div class="gift-icon">
            <img :src="gift.rewardUrl || defaultRewardImg" alt="Reward" />
          </div>
          <sanaAutoText class="name">
            <span>
              {{ `${store.language === "ar" ? gift.rewardNameAr : gift.rewardName}*${gift.rewardValue}` }}
            </span>
          </sanaAutoText>
          <!-- <div class="number">{{ gift.rewardValue }}</div> -->
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

    <div v-if="curTab === 1 || curTab === 2" class="view-weekly view-monthly" :class="{ padding: userInfo?.index }">
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
            <img class="gift-img" :src="top1.avatar" alt="" />
            <div class="podium-info">
              <div class="podium-name text-hide">{{ top1.nick }}</div>
              <div class="podium-score highlight">{{ `X ${formatNumber(top1.integral)}` }}</div>
            </div>
            <div
              class="hall-of-fame"
              v-if="top1?.topSenders?.length > 0"
              @click="goToHallOfFame(top1.nick, top1?.topSenders || [])"
            >
              <div class="hall-avatars">
                <img v-for="(h, i) in top1.topSenders?.slice(0, 3)" :key="i" :src="h.avatar" alt="" />
              </div>
              <div class="hall-arrow"></div>
            </div>
          </div>

          <!-- TOP2 -->
          <div class="top2" v-if="top2">
            <img class="gift-img" :src="top2.avatar" alt="" />
            <div class="podium-info">
              <div class="podium-name text-hide">{{ top2.nick }}</div>
              <div class="podium-score">{{ `X ${formatNumber(top2.integral)}` }}</div>
            </div>
            <div
              class="hall-of-fame"
              v-if="top2?.topSenders?.length > 0"
              @click="goToHallOfFame(top2.nick, top2?.topSenders || [])"
            >
              <div class="hall-avatars">
                <img v-for="(h, i) in top2.topSenders?.slice(0, 3)" :key="i" :src="h.avatar" alt="" />
              </div>
              <div class="hall-arrow"></div>
            </div>
          </div>

          <!-- TOP3 -->
          <div class="top3" v-if="top3">
            <img class="gift-img" :src="top3.avatar" alt="" />
            <div class="podium-info">
              <div class="podium-name text-hide">{{ top3.nick }}</div>
              <div class="podium-score">{{ `X ${formatNumber(top3.integral)}` }}</div>
            </div>
            <div
              class="hall-of-fame"
              v-if="top3?.topSenders?.length > 0"
              @click="goToHallOfFame(top3.nick, top3?.topSenders || [])"
            >
              <div class="hall-avatars">
                <img v-for="(h, i) in top3.topSenders?.slice(0, 3)" :key="i" :src="h.avatar" alt="" />
              </div>
              <div class="hall-arrow"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 名人礼物榜列表 -->
      <div class="list-section">
        <div class="item" v-for="(item, idx) in celebrityList.slice(3, 50)" :key="idx">
          <div class="col-rank">
            <div class="rank-num">{{ idx + 4 }}</div>
          </div>
          <div class="col-avatar">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="col-name">{{ item.nick }}</div>
          <div class="col-score">{{ `X ${formatNumber(item.integral)}` }}</div>
        </div>
      </div>
    </div>
    <div class="user-info" v-if="(curTab === 1 || curTab === 2) && userInfo?.index">
      <!-- <div class="progress-box">
        <div
          class="progress"
          :class="{ 'progress-rtl': store.language === 'ar' }"
          :style="{ width: progressPercent + '%' }"
        >
          <span class="progress-text">{{ progressPercent }}%</span>
        </div>
      </div> -->
      <div class="user-info-item">
        <div class="col-rank">
          <div class="rank-num">{{ userInfo.index }}</div>
        </div>
        <div class="col-avatar">
          <img :src="userInfo.avatar" alt="" />
        </div>
        <div class="col-name">{{ userInfo.nick }}</div>
        <div class="col-number-score">
          <!-- <div class="col-number">
            <span>{{ $t("celebrityGifts.myShare") }}</span>
            <span>{{ userInfo.percent }}%</span>
          </div> -->
          <div class="col-score">{{ `X ${formatNumber(userInfo.integral)}` }}</div>
        </div>
      </div>
    </div>

    <div v-if="curTab === 3" class="view-previous-winner">
      <div class="view-previous-winner-list">
        <div class="view-previous-winner-item" v-for="(item, idx) in previousWinnerList" :key="idx">
          <div class="winner-period">
            <img src="@/assets/activity/celebrityGifts/whiteSparkleIcon.png" alt="" />
            <span>{{ item.weekStr }} ~ {{ getWeekEndStr(item.weekStr) }}</span>
            <img src="@/assets/activity/celebrityGifts/whiteSparkleIcon.png" alt="" />
          </div>
          <div class="winner-podium">
            <!-- TOP1 -->
            <div class="podium-first" v-if="item.giftTop3[0]">
              <img class="podium-avatar" :src="item.giftTop3[0]?.giftPicUrl" alt="" />
              <div class="podium-name">{{ item.giftTop3[0]?.giftName }}</div>
              <div class="podium-score">x{{ formatNumber(item.giftTop3[0]?.giftCount) }}</div>
            </div>
            <!-- TOP3 -->
            <div class="podium-second" v-if="item.giftTop3[2]">
              <img class="podium-avatar" :src="item.giftTop3[2]?.giftPicUrl" alt="" />
              <div class="podium-name">{{ item.giftTop3[2]?.giftName }}</div>
              <div class="podium-score">x{{ formatNumber(item.giftTop3[2]?.giftCount) }}</div>
            </div>
            <!-- TOP2 -->
            <div class="podium-third" v-if="item.giftTop3[1]">
              <div class="podium-avatar">
                <img :src="item.giftTop3[1]?.giftPicUrl" alt="" />
              </div>
              <div class="podium-name">{{ item.giftTop3[1]?.giftName }}</div>
              <div class="podium-score">x{{ formatNumber(item.giftTop3[1]?.giftCount) }}</div>
            </div>
          </div>
          <img class="winner-footer" src="@/assets/activity/celebrityGifts/previous-winner-foot-bg.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/pinia/index.js";
import { get, postFormData } from "@/utils/http.js";
import senderTop from "./components/senderTop.vue";
import { withMock, mockHallOfFame } from "./mock.js";
import cekebrityGiftReward from "./components/cekebrityGiftReward.vue";
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

// senderTop 弹窗状态
const showSenderTop = ref(false);
const senderTopList = ref([]);
const senderTopGiftName = ref("");

// 进度条百分比，可自行修改
const progressPercent = ref(0);

const previousWinnerList = ref([]);

const topRewardsArr = ref([]);
const topRewardsArrList = ref([]);
const weeklyRewardList = ref([]);
const monthlyRewardList = ref([]);
const showWeeklyReward = ref(false);
const showMonthlyReward = ref(false);

const formatNumber = (num) => String(num || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const getWeekEndStr = (weekStr) => {
  if (!weekStr) return "";
  const date = new Date(weekStr.replace(/-/g, "/"));
  date.setDate(date.getDate() + 6);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const padZero = (num) => String(num).padStart(2, "0");

const timeUnits = computed(() => [
  { value: padZero(countdown.value.days), label: t("celebrityGifts.day") },
  { value: padZero(countdown.value.hours), label: t("celebrityGifts.hour") },
  { value: padZero(countdown.value.minutes), label: t("celebrityGifts.minute") },
  { value: padZero(countdown.value.seconds), label: t("celebrityGifts.second") },
]);

const startCountdown = (timeOut) => {
  if (countdownTimer) clearInterval(countdownTimer);
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

const handleMoreClick = () => {
  if (curTab.value === 1) {
    showWeeklyReward.value = true;
  } else if (curTab.value === 2) {
    showMonthlyReward.value = true;
  }
};

const tabChange = async (item) => {
  curTab.value = item.value;
  celebrityList.value = [];
  topRewardsArr.value = [];
  if (countdownTimer) clearInterval(countdownTimer);
  countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  await getDataList();
  // 切换榜单后需要按新的榜单类型重新拉取排名和奖励数据，否则列表会被清空后一直为空
  if (item.value === 1 || item.value === 2) {
    await getRank();
  }
  await getRankRewards();
};

const goToHallOfFame = (giftName, list) => {
  // 打开 senderTop 弹窗，展示当前选中名人的 TOP10 发送者
  senderTopGiftName.value = giftName;
  senderTopList.value = list || [];
  showSenderTop.value = true;
};

const getDataList = async (type) => {
  try {
    const res = await postFormData("/h5doings/activity/famous2026/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      if (curTab.value === 1) {
        const timeOut = res.data.timeOutWeek || res.data.timeOutDay || 0;
        startCountdown(Date.now() + timeOut);
        const monthlyCount = res.data.myGift.monthlyCount || 0;
        const monthlyTarget = res.data.myGift.monthlyTarget || 0;
        progressPercent.value = Math.min(Math.floor((monthlyCount / monthlyTarget) * 100), 100);
      } else if (curTab.value === 2) {
        const timeOut = res.data.timeOutMonth || res.data.timeOutDay || 0;
        startCountdown(Date.now() + timeOut);
        const monthlyCount = res.data.myGift.monthlyCount || 0;
        const monthlyTarget = res.data.myGift.monthlyTarget || 0;
        progressPercent.value = Math.min(Math.floor((monthlyCount / monthlyTarget) * 100), 100);
      } else if (curTab.value === 3) {
        previousWinnerList.value = res.data.history || [
          {
            weekStr: "",
            giftTop3: [],
            supporterTop3: [],
          },
        ];
      }
      console.log(res);
    } else {
      console.error(res.message);
    }
  } catch (error) {
    console.error(error);
  }
};

const getRank = async () => {
  try {
    const res = await get("/h5doings/activity/famous2026/rank", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      size: 50,
      type: curTab.value + 2,
    });
    if (res && res.code === 200) {
      celebrityList.value = res.data.list || [];
      if (res.data.self) {
        userInfo.value = res.data.self;
      }
    } else {
      console.error(res.message);
    }
  } catch (error) {
    console.error(error);
  }
};

const getRankRewards = async () => {
  try {
    const res = await get("/h5doings/activity/famous2026/rankRewards", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      groupType: curTab.value === 1 ? 2 : 3,
    });
    if (res && res.code === 200) {
      console.log(res, "res");
      const data = res.data || {};
      const arr = Object.values(data);
      topRewardsArrList.value = arr;
      topRewardsArr.value = arr[0] || [];
      if (curTab.value === 1) {
        weeklyRewardList.value = arr?.slice(0, 5);
      } else if (curTab.value === 2) {
        monthlyRewardList.value = arr?.slice(0, 4);
      }
      console.log(topRewardsArr.value, "topRewardsArr.value");
    } else {
      console.error(res.message);
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await getDataList();
  await getRank();
  await getRankRewards();
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
    > .title {
      position: absolute;
      top: 37.5px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 14px;
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
      gap: 12px;
      .gift-item {
        width: 90px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .gift-icon {
          width: 90px;
          height: 90px;
          margin-bottom: 4px;
          background: url("@/assets/activity/celebrityGifts/redSealMedallion.png") no-repeat center center;
          background-size: 190% 190%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 64px;
            height: auto;
          }
        }
        .name {
          width: 90px;
          font-size: 12px;
          color: transparent;
          margin-bottom: 2px;
          text-align: center;
          :deep(span) {
            background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        .number {
          font-size: 12px;
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
    direction: ltr;
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
        font-weight: bold;
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
        font-weight: bold;
        text-align: center;
      }
    }
  }
  .view-weekly,
  .view-monthly {
    width: 100%;
    height: auto;
    .top {
      width: 100%;
      height: 728px;
      background: url("@/assets/activity/celebrityGifts/topCekebrityGiftBg.png") no-repeat center center;
      background-size: 100% 100%;
      position: relative;
      margin-bottom: 12px;
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
        height: 497.5px;
        top: 172.5px;
        left: 50%;
        transform: translateX(-50%);
        .top1 {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 215px;
          .gift-img {
            position: absolute;
            top: 56px;
            left: 50%;
            transform: translateX(-50%);
            width: auto;
            height: 78.5px;
          }
          .podium-info {
            position: absolute;
            top: 134.5px;
            left: 50%;
            transform: translateX(-50%);
            color: #ffffff;
            font-size: 11px;
            text-align: center;
          }
          .hall-of-fame {
            position: absolute;
            top: 165.5px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            .hall-avatars {
              display: flex;
              gap: 1.5px;
              img {
                width: 18px;
                height: 18px;
                border-radius: 50%;
              }
            }
            .hall-arrow {
              margin-inline-start: -6.5px;
              width: 29px;
              height: 15px;
              background: url("@/assets/activity/celebrityGifts/arrow-right.png") no-repeat center center;
              background-size: contain;
            }
          }
        }
        .top2 {
          position: absolute;
          top: 296.5px;
          left: 19.5px;
          width: 149px;
          height: 173px;
          .gift-img {
            position: absolute;
            top: 44.5px;
            left: 50%;
            transform: translateX(-50%);
            width: auto;
            height: 50px;
          }
          .podium-info {
            position: absolute;
            top: 94.5px;
            left: 50%;
            transform: translateX(-50%);
            color: #ffffff;
            font-size: 10px;
            text-align: center;
          }
          .hall-of-fame {
            position: absolute;
            top: 124.5px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            .hall-avatars {
              display: flex;
              gap: 1.5px;
              img {
                width: 18px;
                height: 18px;
                border-radius: 50%;
              }
            }
            .hall-arrow {
              margin-inline-start: -6.5px;
              width: 29px;
              height: 15px;
              background: url("@/assets/activity/celebrityGifts/arrow-right.png") no-repeat center center;
              background-size: contain;
            }
          }
        }
        .top3 {
          position: absolute;
          top: 296.5px;
          right: 14px;
          width: 144.5px;
          height: 173px;
          .gift-img {
            position: absolute;
            top: 44.5px;
            left: 50%;
            transform: translateX(-50%);
            width: auto;
            height: 50px;
          }
          .podium-info {
            position: absolute;
            top: 94.5px;
            left: 50%;
            transform: translateX(-50%);
            color: #ffffff;
            font-size: 10px;
            text-align: center;
          }
          .hall-of-fame {
            position: absolute;
            top: 124.5px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            .hall-avatars {
              display: flex;
              gap: 1.5px;
              img {
                width: 18px;
                height: 18px;
                border-radius: 50%;
              }
            }
            .hall-arrow {
              margin-inline-start: -6.5px;
              width: 29px;
              height: 15px;
              background: url("@/assets/activity/celebrityGifts/arrow-right.png") no-repeat center center;
              background-size: contain;
            }
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
        .col-name {
          width: 90px;
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
        .col-score {
          flex: 1;
          background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
          -webkit-background-clip: text;
          background-clip: text;
          font-size: 12px;
          line-height: 21px;
          text-align: start;
          color: transparent;
          text-align: end;
        }
      }
    }
  }
  .padding {
    padding-bottom: 125px;
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
        font-weight: bold;
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
      .col-name {
        width: 90px;
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
          background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
          -webkit-background-clip: text;
          background-clip: text;
          font-size: 12px;
          line-height: 21px;
          text-align: start;
          color: transparent;
          text-align: end;
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
      gap: 12px;
      .view-previous-winner-item {
        width: 100%;
        height: 500px;
        background: url("@/assets/activity/celebrityGifts/darkRedPage3.png") no-repeat center center;
        background-size: 100% 100%;
        box-sizing: border-box;
        position: relative;
        margin-bottom: 15px;
        .winner-period {
          position: absolute;
          top: 40px;
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
          height: 275px;
          .podium-first,
          .podium-second,
          .podium-third {
            position: absolute;
            width: 140px;
            height: 226px;
            top: 99px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            .podium-avatar {
              width: auto;
              height: 80px;
              margin-top: 56px;
              margin-bottom: 3px;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                width: 81px;
                height: auto;
                object-fit: cover;
              }
            }
            .podium-name {
              font-size: 12px;
              font-weight: bold;
              line-height: 22px;
              text-align: center;
              color: #ffffff;
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
          .podium-second {
            width: 115px;
            height: 193px;
            top: 178px;
            left: 8px;
            transform: none;
            .podium-avatar {
              width: auto;
              height: 60px;
              margin-top: 54px;
              margin-bottom: 4px;
              img {
                width: 81px;
              }
            }
            .podium-name {
              font-size: 11px;
            }
          }
          .podium-third {
            width: 120px;
            height: 196px;
            top: 177px;
            left: auto;
            right: 1px;
            transform: none;
            .podium-avatar {
              width: 70px;
              height: 70px;
              margin-top: 51px;
              background: url("@/assets/activity/celebrityGifts/giftTop2Bg.png") no-repeat center center;
              background-size: cover;
              img {
                width: auto;
                height: 60px;
              }
            }
            .podium-name {
              font-size: 11px;
            }
          }
        }
        .winner-footer {
          position: absolute;
          top: 471px;
          left: 50%;
          transform: translateX(-50%);
          width: 404px;
          height: 37px;
          background: url("@/assets/activity/celebrityGifts/previous-winner-foot-bg.png") no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
  }
}
</style>
