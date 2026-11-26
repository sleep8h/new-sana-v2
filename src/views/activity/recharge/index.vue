<!-- 主页 -->
<template>
  <div class="page">
    <div class="nav-container" @click="back">
      <img v-if="store.language != 'ar'" src="@/assets/common/left-icon@2x.png" alt="" />
      <img v-else src="@/assets/common/right-icon@2x.png" alt="" />
    </div>
    <div class="bg-top" :class="{ 'bg-top-ar': store.language === 'ar' }">
      <div class="tab-list">
        <div
          :class="['tab-item' + index, { 'tab-item-show': curTab === item.value }]"
          @click="tabChange(item)"
          v-for="(item, index) in tabList"
          :key="index"
        >
          <img class="tab-img" :class="{ 'tab-img-active': curTab !== item.value }" :src="item.imgHide" alt="" />
          <img class="tab-img" :class="{ 'tab-img-active': curTab === item.value }" :src="item.imgShow" alt="" />
          <div class="tab-label">
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>
      <div class="rules" @click="rulesShow = true">{{ $t("recharge.rules") }}</div>
      <!-- 倒计时 -->
      <div class="time">
        <CountDownRecharge :time="countDownTime || 0" :key="countDownTime" format="DD:HH:MM:SS" />
      </div>
      <!-- 周第一 -->
      <div class="week-first">
        <div class="week-first-frame">
          <img :src="weekFirst.avatar || DEFAULT_AVATAR" alt="" />
        </div>
        <div class="week-first-plate" v-if="weekFirst.nick">
          <div class="week-first-name">{{ weekFirst.nick }}</div>
          <div class="week-first-value">
            <span>{{ formatNumber(weekFirst.integral) }}</span>
            <i class="week-first-gold"></i>
          </div>
        </div>
      </div>
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
import CountDownRecharge from "@/components/countDown/CountDownRecharge.vue";
import { showToast } from "vant";
import "vant/es/toast/style"; // 关键：单独引入样式

// 图片资源
import homeTab1Hide from "@/assets/activity/recharge/reward/home-tab1-hide.png";
import homeTab2Hide from "@/assets/activity/recharge/reward/home-tab2-hide.png";
import homeTab3Hide from "@/assets/activity/recharge/reward/home-tab3-hide.png";
import homeTab1Show from "@/assets/activity/recharge/reward/home-tab1-show.png";
import homeTab2Show from "@/assets/activity/recharge/reward/home-tab2-show.png";
import homeTab3Show from "@/assets/activity/recharge/reward/home-tab3-show.png";
import DEFAULT_AVATAR from "@/assets/common/user-avatar-default.png";

// 模块
import Reward from "@/views/activity/recharge/reward.vue";
import Rank from "@/views/activity/recharge/rank.vue";

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

// 数字格式化：千转K，百万转M
const formatNumber = (num) => {
  if (!num || isNaN(num)) return "0";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  }
  return num.toString();
};

const curTab = ref(1);
const countDownTime = ref(0);
const rulesShow = ref(false);
// 周榜第一名
const weekFirst = reactive({
  avatar: "",
  nick: "",
  integral: "",
});

const getWeekFirst = async () => {
  try {
    const res = await postFormData("/h5doings/activity/recharge/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      const first = res.data?.weekTop3?.listNow?.[0];
      if (first) {
        weekFirst.avatar = first.avatar || "";
        weekFirst.nick = first.nick || "";
        weekFirst.integral = first.integral ?? "";
      }
    }
  } catch (error) {
    console.error("Error fetching week first:", error);
  }
};
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

// 充值奖励：日/周/月 tab → 对应倒计时；充值榜单：周榜(2)/月榜(3) → 周/月倒计时
const timeChanges = (timeData) => {
  if (timeData.curTab === 1) {
    countDownTime.value = timeData.timeOutDay || 0;
  }
  if (timeData.curTab === 2) {
    countDownTime.value = timeData.timeOutWeek || 0;
  }
  if (timeData.curTab === 3) {
    countDownTime.value = timeData.timeOutMonth || 0;
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
  getWeekFirst();
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
    // 倒计时
    .time {
      position: absolute;
      top: 480px;
      left: 50%;
      transform: translateX(-50%);
      width: 272px;
      height: 68px;
      z-index: 2;
    }
    // 阿拉伯语头图
    &.bg-top-ar {
      background-image: url("@/assets/activity/recharge/reward/bg1-ar.png");
      &::after {
        background-image: url("@/assets/activity/recharge/reward/bg1-ar.png");
      }
      // 阿拉伯语下三个 tab 定位单独设置（默认按 LTR 镜像，可在此单独微调）
      .tab-item0 {
        inset-inline-start: auto;
        right: 8.5px;
      }
      .tab-item1 {
        inset-inline-start: auto;
        right: 128.5px;
      }
      .tab-item2 {
        inset-inline-end: auto;
        left: 12.5px;
      }
      // AR 下三个 tab 文字底图定位单独设置（按需微调）
      .tab-item0 > .tab-label {
        left: 17px;
        margin-left: 0;
      }
      .tab-item1 > .tab-label {
        left: 16px;
        margin-left: 0;
      }
      .tab-item2 > .tab-label {
        left: 12px;
        margin-left: 0;
      }
      // 阿语下文字底图水平翻转，文字再翻回来保持正常阅读方向
      .tab-label {        transform: scaleX(-1);
        > span {
          display: inline-block;
          transform: scaleX(-1);
        }
      }
    }
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
    // 周第一（数值为设计稿 750 宽 ÷ 2）
    .week-first {
      position: absolute;
      top: 620px;
      inset-inline-start: 96px;
      width: 188px;
      z-index: 2;
      .week-first-frame {
        position: relative;
        width: 188px;
        height: 181px;
        > img {
          position: absolute;
          // 头像 132×132，相对头像框 left 28 / top 25
          top: 25px;
          inset-inline-start: 28px;
          width: 132px;
          height: 132px;
          object-fit: cover;
          z-index: 0;
        }
        // 头像框盖在头像上面，中间镂空区域露出头像
        &::after {
          content: "";
          position: absolute;
          inset: 0;
          background: url("@/assets/activity/recharge/reward/bgTopBg.png") no-repeat center center;
          background-size: 100% 100%;
          z-index: 1;
          pointer-events: none;
        }
      }
      .week-first-plate {
        width: 160px;
        height: 63px;
        // 文字背景 top 789 = 头像框底 801 再往上叠 12px，水平居中
        margin: -12px auto 0;
        padding: 6px 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0.9;
        background: url("@/assets/activity/recharge/reward/bgTopTextBg.png") no-repeat center center;
        background-size: 100% 100%;
        .week-first-name {
          width: 100%;
          font-family: "Readex Pro", LogoSCUnboundedSans, system-ui, sans-serif;
          font-weight: 700;
          font-size: 14px;
          line-height: 14px;
          text-align: center;
          text-transform: uppercase;
          color: #ffe1a2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .week-first-value {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 11px;
          line-height: 20px;
          color: #ffffff;
          .week-first-gold {
            width: 16px;
            height: 12px;
            margin-inline-start: 4px;
            background: url("@/assets/activity/recharge/reward/gold.png") no-repeat center center;
            background-size: cover;
          }
        }
      }
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
          left: 50%;
          margin-left: -36px;
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
          padding-right: 5px;
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
          left: 50%;
          margin-left: -37px;
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
          padding-right: 5px;
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
          left: 50%;
          margin-left: -36px;
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
          padding-right: 5px;
        }
      }
      .tab-item-show {
        > span {
          color: #ffe400;
        }
      }
      // 选中/未选中两张图同时渲染，用透明度切换，避免切换时 img 节点重建导致闪烁
      .tab-img {
        position: absolute;
        inset: 0;
        opacity: 0;
      }
      .tab-img-active {
        opacity: 1;
      }
    }
  }
  .rules {
    position: absolute;
    top: 350px;
    inset-inline-end: -60px;
    padding-inline-end: 30px;
    width: 168px;
    height: 47px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("@/assets/activity/recharge/rulesBtnBg.png") no-repeat center center;
    background-size: 100% 100%;
    font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-weight: bold;
    font-size: 16px;
    color: #f8e378;
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
      width: 375px;
      height: 635px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1002;
      box-sizing: border-box;
      // 顶层背景（上半部分 + 顶部皇冠框）：751×892，left 1
      &::before {
        content: "";
        position: absolute;
        top: 0;
        inset-inline-start: 0px;
        width: 375px;
        height: 446px;
        background: url("@/assets/activity/recharge/reward/ruleBgTop.png") no-repeat center center;
        background-size: 100% 100%;
        z-index: -2;
        pointer-events: none;
      }
      // 底层背景（下半部分 + 底部宝石框，与顶层重叠融合）：767×754，top 515 / left -15
      &::after {
        content: "";
        position: absolute;
        top: 288px;
        inset-inline-start: -0.5px;
        width: 376px;
        height: 377px;
        background: url("@/assets/activity/recharge/reward/ruleBgBottom.png") no-repeat center center;
        background-size: 100% 100%;
        z-index: -2;
        pointer-events: none;
      }
      .rules-title {
        position: absolute;
        top: 18px;
        left: 50%;
        transform: translateX(-50%);
        width: 58px;
        height: 27px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 22px;
        line-height: 27px;
        text-align: center;
        background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        filter: drop-shadow(0 2px 2px #320000fc);
      }
      .rules-sec {
        position: absolute;
        top: 104.5px;
        bottom: 50px;
        inset-inline-start: 36px;
        inset-inline-end: 36px;
        overflow-y: auto;
        font-size: 17px;
        line-height: 20px;
        color: #f6e7b5;
        text-align: center;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
}
</style>
