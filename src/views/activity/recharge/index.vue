<!-- 主页 -->
<template>
  <div class="page">
    <div class="nav-container" @click="back">
      <img v-if="store.language != 'ar'" src="@/assets/common/left-icon@2x.png" alt="" />
      <img v-else src="@/assets/common/right-icon@2x.png" alt="" />
    </div>
    <div class="bg-top">
      <div class="tab-list">
        <div
          :class="['tab-item' + index, { 'tab-item-show': curTab === item.value }]"
          @click="tabChange(item)"
          v-for="(item, index) in tabList"
          :key="index"
        >
          <img v-if="curTab === item.value" :src="item.imgShow" alt="" />
          <img v-else :src="item.imgHide" alt="" />
          <div>{{ item.text }}</div>
        </div>
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
    width: 32px;
    height: 32px;
    box-sizing: border-box;
    background: none;
    color: transparent;
    position: fixed;
    z-index: 999;
    /* 增加点击区域 */
    touch-action: manipulation;
    top: 52px;
    inset-inline-start: 24px;
    > img {
      width: 32px;
      height: 32px;
    }
  }
  .bg-top {
    background: url("@/assets/activity/recharge/reward/bg1.png") no-repeat center center;
    background-size: 100% 100%;
    width: 100%;
    height: 811px;
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    // 与下方 content 的背景重叠 2px，只画 bg1 的最后 2px，避免拼接处露细缝且不影响布局
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 2px;
      background: url("@/assets/activity/recharge/reward/bg1.png") no-repeat center bottom;
      background-size: 100% 811px;
      pointer-events: none;
    }
    .tab-list {
      position: absolute;
      width: 100%;
      bottom: -18px;
      left: 50%;
      transform: translateX(-50%);
      .tab-item0 {
        width: 116.5px;
        height: 102px;
        position: absolute;
        top: 0;
        inset-inline-start: 8.5px;
        > img {
          width: 116.5px;
          height: 102px;
        }
        > div {
          position: absolute;
          top: 92.5px;
          inset-inline-start: 22px;
          font-weight: bold;
          font-size: 10px;
          line-height: 10px;
          color: #fff;
          width: 80.5px;
          height: 31px;
          background: none;
          background: url("@/assets/activity/recharge/reward/tabBtnBg.png") no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          box-sizing: border-box;
          padding-inline-end: 5px;
        }
      }
      .tab-item1 {
        width: 116.5px;
        height: 102px;
        position: absolute;
        top: 31px;
        inset-inline-start: 128.5px;
        > img {
          width: 116.5px;
          height: 102px;
        }
        > div {
          position: absolute;
          top: 92px;
          inset-inline-start: 20.5px;
          font-weight: bold;
          font-size: 10px;
          line-height: 10px;
          color: #fff;
          width: 80.5px;
          height: 31px;
          background: none;
          background: url("@/assets/activity/recharge/reward/tabBtnBg.png") no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          box-sizing: border-box;
          padding-inline-end: 5px;
        }
      }
      .tab-item2 {
        width: 109.5px;
        height: 83px;
        position: absolute;
        top: 17px;
        inset-inline-end: 12.5px;
        > img {
          width: 109.5px;
          height: 83px;
        }
        > div {
          position: absolute;
          top: 75.5px;
          inset-inline-start: 18px;
          font-weight: bold;
          font-size: 10px;
          line-height: 10px;
          color: #fff;
          width: 80.5px;
          height: 31px;
          background: none;
          background: url("@/assets/activity/recharge/reward/tabBtnBg.png") no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          box-sizing: border-box;
          padding-inline-end: 5px;
        }
      }
      .tab-item-show {
        > span {
          color: #ffe400;
        }
      }
    }
  }
  .rules {
    position: fixed;
    top: 270px;
    right: 0;
    width: 60px;
    height: 31px;
    // background: url("@/assets/activity/recharge/rank/rules.png") no-repeat center center;
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
    background: #4e0708;
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
      // background: url("@/assets/activity/recharge/reward/rulesBg.png") no-repeat center center;
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
