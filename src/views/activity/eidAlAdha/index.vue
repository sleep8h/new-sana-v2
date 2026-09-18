<!-- 主页 -->
<template>
  <div class="page">
    <div
      class="nav-container"
      :class="store.language != 'ar' ? 'nav-container-left' : 'nav-container-right'"
      @click="back"
    >
      <img v-if="store.language != 'ar'" src="@/assets/common/left-icon@2x.png" alt="" />
      <img v-else src="@/assets/common/right-icon@2x.png" alt="" />
    </div>
    <div class="bg-top">
      <div class="bg-title">
        <div class="title" :data-text="$t('eidAlAdha.title')">{{ $t("eidAlAdha.title") }}</div>
      </div>
      <div class="rules" @click="rulesShow = true">{{ $t("eidAlAdha.rule") }}</div>
      <!-- 弹幕 -->
      <div class="barrage">
        <vue-danmaku
          v-model:danmus="barrageList"
          style="height: 144px"
          :speeds="speeds"
          :debounce="debounce"
          :channels="3"
          :loop="true"
          :randomChannel="true"
          :top="36"
        >
          <template #danmu="{ index, danmu }">
            <div class="barrage-item">
              <div v-html="$t('eidAlAdha.barrage', { name: danmu.nick, lv: danmu.levelText })"></div>
            </div>
          </template>
        </vue-danmaku>
      </div>
      <div class="yesterday-top1">
        <div class="yesterday-top1-title">{{ $t("eidAlAdha.yesterdayTop1") }}</div>
        <div class="yesterday-top1-avatar">
          <img class="yesterday-top1-avatar-img" :src="yesterdayTop1User?.avatar || defaultAvatar" alt="" />
        </div>
        <div class="yesterday-top1-user-name">{{ yesterdayTop1User?.name || "usename" }}</div>
      </div>
      <div class="time-text">{{ $t("eidAlAdha.time") }}</div>
      <div class="time">
        <CountDownBox :time="timeOut || 0" :key="timeOut" format="DD:HH:MM:SS" />
      </div>
      <div class="event-gift">
        <div class="event-gift-title">{{ $t("eidAlAdha.eventGift") }}</div>
        <div class="event-gift-content">
          <div class="event-gift-list">
            <div class="event-gift-item" v-for="(item, index) in eventGiftList" :key="index">
              <img :src="item.rewardUrl" alt="" />
              <div v-if="item.luckyGift" class="lucky"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-list">
        <div
          :class="['tab-item', { 'tab-item-show': curTab === item.value }]"
          @click="tabChange(item)"
          v-for="(item, index) in tabList"
          :key="index"
        >
          <span :data-text="item.text">{{ item.text }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <MyRanch v-if="curTab === 1" />
      <FeedingDayRank v-if="curTab === 2" />
      <FeedingTotalRank v-if="curTab === 3" />
    </div>
    <RuleToast v-model:isShow="rulesShow" :content="$t('ramadan.rule')" @close="rulesShow = false" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import CountDownBox from "@/components/countDown/CountDownBoxEidAlAdha.vue";
import vueDanmaku from "vue-danmaku";
import { showToast } from "vant";
import "vant/es/toast/style"; // 关键：单独引入样式

// 图片资源
import tabHide from "@/assets/activity/eidAlAdha/tabHide.png";
import tabShow from "@/assets/activity/eidAlAdha/tabShow.png";
import giftImg from "@/assets/activity/eidAlAdha/gift.png";
import defaultAvatar from "@/assets/activity/eidAlAdha/myRanch/defaultAvatar.png";

// 模块
// 我的牧场
import MyRanch from "@/views/activity/eidAlAdha/myRanch.vue";
// 喂养日榜
import FeedingDayRank from "@/views/activity/eidAlAdha/feedingDayRank.vue";
// 喂养总榜
import FeedingTotalRank from "@/views/activity/eidAlAdha/feedingTotalRank.vue";
// 规则弹窗
import RuleToast from "@/views/activity/eidAlAdha/components/ruleToast.vue";

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const curTab = ref(1);
const timeOut = ref(0);
const yesterdayTop1User = ref({
  avatar: null,
  nick: null,
  score: null,
  uid: null,
});
const rulesShow = ref(false);
const tabList = [
  {
    imgHide: tabHide,
    imgShow: tabShow,
    text: t("eidAlAdha.tab1"),
    value: 1,
  },
  {
    imgHide: tabHide,
    imgShow: tabShow,
    text: t("eidAlAdha.tab2"),
    value: 2,
  },
  {
    imgHide: tabHide,
    imgShow: tabShow,
    text: t("eidAlAdha.tab3"),
    value: 3,
  },
];
const eventGiftList = ref([]);
const barrageList = ref([]);
const speeds = ref(25); // 初始速度
const debounce = ref(6000); // 初始刷新频率
const intervalTimeId = ref(null);
// 生成随机参数
const randomizeSettings = () => {
  speeds.value = Math.floor(Math.random() * 50) + 10; // 速度范围：10-60px/s
  debounce.value = Math.floor(Math.random() * 5000) + 1000; // 频率范围：1-6秒
};

const tabChange = (item) => {
  // if (item.value === 3) {
  //   return showToast(t("ramadan.underDevelopmentStayTuned"));
  // }
  curTab.value = item.value;
};

const back = () => {
  if (store.os === "android") {
    WebViewJavascriptBridge.backToFront(null, null);
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.backToFront.postMessage(null);
  } else {
    console.error("未知平台，无法返回");
  }
};

// 获取活动列表接口
const getEidAlAdha2026List = async () => {
  try {
    const res = await postFormData("/h5doings/activity/eidAlAdha2026/list", {
      uid: store.uid,
      type: curTab.value,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      timeOut.value = res.data.timeOut;
      yesterdayTop1User.value = res.data.yesterdayTop1User;
      barrageList.value = res.data.upgradeRecordList;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取喂养活动礼物奖励列表
const getFeedingTotalRankReward = async () => {
  try {
    const res = await get("/h5doings/activity/eidAlAdha2026/rankRewards", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      groupType: 0,
    });
    if (res && res.code === 200) {
      eventGiftList.value = Object.values(res.data)[0];
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(async () => {
  await getEidAlAdha2026List();
  await getFeedingTotalRankReward();
  clearInterval(intervalTimeId.value);
  intervalTimeId.value = null;
  intervalTimeId.value = setInterval(randomizeSettings, 10000); // 每10秒更新一次参数
});

onUnmounted(() => {
  clearInterval(intervalTimeId.value);
  intervalTimeId.value = null;
});
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background: #00291b;
  font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
  .nav-container {
    width: 48px;
    height: 48px;
    box-sizing: border-box;
    background: none;
    color: transparent;
    position: fixed;
    z-index: 999;
    /* 增加点击区域 */
    touch-action: manipulation;
    > img {
      width: 48px;
      height: 48px;
    }
  }
  .nav-container-left {
    top: 52px;
    left: 4px;
  }
  .nav-container-right {
    top: 52px;
    right: 4px;
  }
  .bg-top {
    background: url("@/assets/activity/eidAlAdha/bgTop.png") no-repeat top center;
    background-size: 375px 514px;
    width: 100%;
    height: 993px;
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    .bg-title {
      position: absolute;
      top: 75px;
      left: 50%;
      transform: translateX(-50%);
      width: 316px;
      height: 94px;
      background: url("@/assets/activity/eidAlAdha/titleBg.png") no-repeat top center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      > .title {
        min-width: 282px;
        text-align: center;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 800;
        font-size: 36px;
        line-height: 54px;
        background: linear-gradient(0deg, #f98c00 0%, #e8d41b 39%, #f0f466 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-stroke: 2px #00460f;
        -webkit-text-stroke: 2px #00460f;
        position: relative;
        &::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0px;
          font-size: 36px;
          width: 100%;
          height: 100%;
          color: transparent;
          z-index: -2;
          text-stroke: 3px #f0f466;
          -webkit-text-stroke: 3px #f0f466;
        }
      }
    }
    .rules {
      position: absolute;
      top: 183px;
      right: 0;
      width: 43px;
      height: 22px;
      background: url("@/assets/activity/eidAlAdha/rulesTextBg.png") no-repeat center center;
      background-size: cover;
      font-weight: 500;
      font-size: 12px;
      color: #402900;
      line-height: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
    }
    .barrage {
      width: 100%;
      height: 144px;
      box-sizing: border-box;
      position: absolute;
      top: 211px;
      left: 0;
      .barrage-item {
        min-width: 254px;
        max-width: 350px;
        height: 24px;
        font-size: 13px;
        color: #ffffff;
        line-height: 24px;
        text-align: center;
        background: url("@/assets/activity/eidAlAdha/barrageTextBg.png") no-repeat center center;
        background-size: cover;
        ::v-deep(.name) {
          color: #f89001;
        }
        ::v-deep(.lv) {
          color: #ebe33d;
        }
      }
    }
    .yesterday-top1 {
      position: absolute;
      top: 377px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      > .yesterday-top1-title {
        width: 120px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-weight: bold;
        font-size: 13px;
        color: #ffe747;
        line-height: 18px;
        background: url("@/assets/activity/eidAlAdha/yesterdayTop1Bg.png") no-repeat center center;
        background-size: cover;
        text-shadow:
          1px 1px 0px #742902,
          -1px -1px 0px #742902,
          -1px 1px 0px #742902,
          1px -1px 0px #742902;
      }
      > .yesterday-top1-avatar {
        position: relative;
        width: 88px;
        height: 88px;
        .yesterday-top1-avatar-frame {
          position: absolute;
          top: 0;
          left: 0;
          width: 88px;
          height: 88px;
          z-index: 2;
        }
        .yesterday-top1-avatar-img {
          position: absolute;
          top: 12px;
          left: 11px;
          width: 67px;
          height: 67px;
          z-index: 1;
        }
      }
      > .yesterday-top1-user-name {
        width: 78px;
        height: 20px;
        font-size: 11px;
        color: #ffe747;
        line-height: 20px;
        text-align: center;
        background: url("@/assets/activity/eidAlAdha/userNameBg.png") no-repeat center center;
        background-size: cover;
      }
    }
    .time-text {
      position: absolute;
      width: 100%;
      height: 20px;
      line-height: 20px;
      top: 545px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
      font-size: 14px;
      color: #6cca63;
      text-align: center;
      box-sizing: border-box;
      padding: 0 5px;
    }
    .time {
      position: absolute;
      top: 576px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 49px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .event-gift {
      position: absolute;
      top: 648px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 256px;
      background: url("@/assets/activity/eidAlAdha/eventGiftBg.png") no-repeat center center;
      background-size: cover;
      .event-gift-title {
        position: absolute;
        top: 32px;
        left: 50%;
        transform: translateX(-50%);
        width: 181px;
        height: 16px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: bold;
        font-size: 16px;
        color: #f8fc98;
        line-height: 16px;
        text-align: center;
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
      }
      .event-gift-content {
        position: absolute;
        top: 90px;
        left: 22px;
        width: 343px;
        height: 97px;
        overflow-x: auto;
        .event-gift-list {
          box-sizing: border-box;
          padding-top: 13px;
          width: auto;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .event-gift-item {
            width: 84px;
            height: 84px;
            margin-right: 10px;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            background: url("@/assets/activity/eidAlAdha/eventGiftItemBg.png") no-repeat center center;
            background-size: cover;
            img {
              width: 66px;
              height: auto;
            }
            .lucky {
              position: absolute;
              width: 58px;
              height: 42px;
              background: url("@/assets/activity/eidAlAdha/lucky.png") no-repeat center center;
              background-size: cover;
              top: -13px;
              right: -12px;
            }
          }
        }
      }
    }
    .tab-list {
      position: absolute;
      top: 931px;
      width: 100%;
      padding: 0 10px;
      height: 34px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      .tab-item {
        width: 115px;
        height: 39px;
        line-height: 15px;
        background: url("@/assets/activity/eidAlAdha/tabHide.png") no-repeat center center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        box-sizing: border-box;
        padding: 0 5px;
        font-size: 15px;
        color: #504a0b;
        font-weight: bold;
      }
      .tab-item-show {
        background: url("@/assets/activity/eidAlAdha/tabShow.png") no-repeat center center;
        background-size: cover;
        color: #984c00;
      }
    }
  }

  .content {
    width: 100%;
    height: auto;
  }
}
</style>
