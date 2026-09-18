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
      <img v-if="store.language === 'ar'" :src="titleAr" alt="" class="title-img" />
      <img v-else :src="title" alt="" class="title-img" />
      <div class="tab-list">
        <div
          :class="['tab-item', { 'tab-item-show': curTab === item.value }]"
          @click="tabChange(item)"
          v-for="(item, index) in tabList"
          :key="index"
        >
          <img v-if="curTab === item.value" :src="item.imgShow" alt="" />
          <img v-else :src="item.imgHide" alt="" />
          <span>{{ item.text }}</span>
        </div>
      </div>
      <div class="time">
        <CountDownBox :time="countDownTime || 0" :key="countDownTime" format="DD:HH:MM:SS" />
      </div>
      <div class="rules" @click="rulesShow = true">{{ $t("recharge.rules") }}</div>
    </div>
    <div class="content">
      <Reward v-if="curTab === 1" @timeChange="timeChanges" />
      <Rank v-if="curTab === 2" @timeChange="timeChanges" />
    </div>
    <div class="rules-toast" v-if="rulesShow" @click="rulesShow = false">
      <div class="mask"></div>
      <div class="rules-content">
        <div class="rules-title">{{ $t("recharge.rule") }}</div>
        <div class="rules-sec">
          <div>{{ $t("recharge.ruleText1") }}</div>
          <div>{{ $t("recharge.ruleText2") }}</div>
          <div>{{ $t("recharge.ruleText3") }}</div>
          <div>{{ $t("recharge.ruleText4") }}</div>
          <div>{{ $t("recharge.ruleText5") }}</div>
          <div>{{ $t("recharge.ruleText6") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import CountDownBox from "@/components/countDown/CountDownBox.vue";
import { showToast } from "vant";
import "vant/es/toast/style"; // 关键：单独引入样式

// 图片资源
import bgTop from "@/assets/activity/recharge/reward/bgTop.png";
import title from "@/assets/activity/recharge/rank/rechargeActivity.png";
import titleAr from "@/assets/activity/recharge/rank/rechargeActivity1.png";
import homeTab1Hide from "@/assets/activity/recharge/reward/home-tab1-hide.png";
import homeTab2Hide from "@/assets/activity/recharge/reward/home-tab2-hide.png";
import homeTab3Hide from "@/assets/activity/recharge/reward/home-tab3-hide.png";
import homeTab1Show from "@/assets/activity/recharge/reward/home-tab1-show.png";
import homeTab2Show from "@/assets/activity/recharge/reward/home-tab2-show.png";
import homeTab3Show from "@/assets/activity/recharge/reward/home-tab3-show.png";

// 模块
import Reward from "@/views/activity/recharge/reward.vue";
import Rank from "@/views/activity/recharge/rank.vue";

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const curTab = ref(1);
const countDownTime = ref(0);
const rulesShow = ref(false);
const tabList = [
  {
    imgHide: homeTab1Hide,
    imgShow: homeTab1Show,
    text: t("recharge.rechargeReward"),
    value: 1,
  },
  {
    imgHide: homeTab2Hide,
    imgShow: homeTab2Show,
    text: t("recharge.rechargeRanking"),
    value: 2,
  },
  {
    imgHide: homeTab3Hide,
    imgShow: homeTab3Show,
    text: t("recharge.rechargeHonor"),
    value: 3,
  },
];

const tabChange = (item) => {
  if (item.value === 3) {
    return showToast(t("recharge.underDevelopmentStayTuned"));
  }
  curTab.value = item.value;
};

const timeChanges = (timeData) => {
  console.log(timeData, "timeData");
  if (timeData.curTab === 1) {
    countDownTime.value = timeData.timeOutDay;
  }
  if (timeData.curTab === 2) {
    countDownTime.value = timeData.weekTimeOut;
  }
  if (timeData.curTab === 3) {
    countDownTime.value = timeData.monthTimeOut;
  }
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

onMounted(() => {
  // getAnchorInfo()
  // getAnchorReward()
});
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  font-family: LogoSCUnboundedSans, system-ui, Avenir, Helvetica, Arial, sans-serif;
  .nav-container {
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    background: none;
    color: transparent;
    position: fixed;
    z-index: 999;
    /* 增加点击区域 */
    touch-action: manipulation;
    > img {
      width: 16px;
      height: 16px;
    }
  }
  .nav-container-left {
    top: 52px;
    left: 24px;
  }
  .nav-container-right {
    top: 52px;
    right: 24px;
  }
  .bg-top {
    background: url("@/assets/activity/recharge/reward/bgTop.png") no-repeat center center;
    background-size: 100% 100%;
    width: 100%;
    height: 592px;
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    .title-img {
      position: absolute;
      width: 228px;
      height: 34px;
      top: 194px;
      left: 75px;
    }
    .tab-list {
      position: absolute;
      width: 325px;
      top: 507px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tab-item {
        width: 91px;
        height: 91px;
        position: relative;
        &:nth-child(2) {
          margin-top: -15px;
        }
        > img {
          width: 91px;
          height: 91px;
        }
        > span {
          position: absolute;
          top: 64px;
          left: 50%;
          width: 53px;
          height: 15px;
          font-size: 9px;
          color: rgba(#ffe400, 0.8) !important;
          line-height: 8px;
          text-align: center;
          transform: translateX(-50%);
        }
      }
      .tab-item-show {
        > span {
          color: #ffe400;
        }
      }
    }
    .time {
      position: absolute;
      top: 417px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .rules {
    position: fixed;
    top: 270px;
    right: 0;
    width: 60px;
    height: 31px;
    background: url("@/assets/activity/recharge/rank/rules.png") no-repeat center center;
    background-size: cover;
    font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-weight: bold;
    font-size: 16px;
    color: #f8e378;
    padding: 3px 4px 5px 0;
    line-height: 23px;
    text-align: right;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
  }
  .content {
    width: 100%;
    height: auto;
  }
  .rules-toast {
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1001;
    }
    .rules-content {
      position: fixed;
      width: 355px;
      height: 271px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1002;
      box-sizing: border-box;
      padding: 54px 42px 48px;
      background: url("@/assets/activity/recharge/reward/rulesBg.png") no-repeat center center;
      background-size: cover;
      .rules-title {
        font-family: PingFang-SC, PingFang-SC;
        font-size: 15px;
        color: #ffffff;
        line-height: 18px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 5px;
      }
      .rules-sec {
        width: 100%;
        height: calc(100% - 23px);
        overflow-y: auto;
        font-family: PingFang-SC, PingFang-SC;
        font-size: 12px;
        color: #ffffff;
        line-height: 18px;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
}
</style>
