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
        <div class="title" :data-text="$t('ramadan.title')">{{ $t("ramadan.title") }}</div>
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
      <div class="time-text">
        <span>{{ $t("ramadan.time") }}</span>
      </div>
      <div class="time">
        <CountDownBox :time="timeOut || 0" :key="timeOut" format="DD:HH:MM:SS" />
      </div>
      <div class="rules" @click="rulesShow = true">{{ $t("ramadan.rule") }}</div>
    </div>
    <div class="content">
      <Sign v-if="curTab === 1" />
      <Blessing v-if="curTab === 2" />
      <RamadanLight v-if="curTab === 3" />
      <Rank v-if="curTab === 4" />
    </div>
    <RuleToast v-model:isShow="rulesShow" :content="$t('ramadan.rule')" @close="rulesShow = false" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import CountDownBox from "@/components/countDown/CountDownBoxRamadan.vue";
import { showToast } from "vant";
import "vant/es/toast/style"; // 关键：单独引入样式

// 图片资源
// import title from '@/assets/activity/ramadan/rank/rechargeActivity.png'
// import titleAr from '@/assets/activity/ramadan/rank/rechargeActivity1.png'
import tabHide from "@/assets/activity/ramadan/tab_hide.png";
import tabShow from "@/assets/activity/ramadan/tab_show.png";

// 模块
// 斋月签到
import Sign from "@/views/activity/ramadan/sign.vue";
// 斋月祈福
import Blessing from "@/views/activity/ramadan/blessing.vue";
// 斋月灯
import RamadanLight from "@/views/activity/ramadan/ramadanLight.vue";
// 总榜
import Rank from "@/views/activity/ramadan/rank.vue";
// 规则弹窗
import RuleToast from "@/views/activity/ramadan/components/ruleToast.vue";

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const curTab = ref(1);
const timeOut = ref(0);
const rulesShow = ref(false);
const tabList = [
  {
    imgHide: tabHide,
    imgShow: tabShow,
    text: t("ramadan.ramadanCheckIn"),
    value: 1,
  },
  {
    imgHide: tabHide,
    imgShow: tabShow,
    text: t("ramadan.ramadanBlessings"),
    value: 2,
  },
  {
    imgHide: tabHide,
    imgShow: tabShow,
    text: t("ramadan.ramadanLanterns"),
    value: 3,
  },
  {
    imgHide: tabHide,
    imgShow: tabShow,
    text: t("ramadan.overallLeaderboard"),
    value: 4,
  },
];

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

// 获取排行榜
const getRamadan2026List = async () => {
  try {
    const res = await postFormData("/h5doings/activity/ramadan2026/list", {
      uid: store.uid,
      size: 20,
      type: curTab.value,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      timeOut.value = res.data.timeOut;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(() => {
  getRamadan2026List();
});
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background: #00291b;
  font-family: LogoSCUnboundedSans, system-ui, Avenir, Helvetica, Arial, sans-serif;
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
    background: url("@/assets/activity/ramadan/bg_top.png") no-repeat top center;
    background-size: 375px 513px;
    width: 100%;
    height: 688px;
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    .bg-title {
      position: absolute;
      top: 26px;
      left: 50%;
      transform: translateX(-50%);
      width: 316px;
      height: 94px;
      background: url("@/assets/activity/ramadan/bg_title.png") no-repeat top center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      > .title {
        min-width: 282px;
        text-align: center;
        height: 24px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 800;
        font-size: 24px;
        line-height: 24px;
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
          font-size: 24px;
          width: 100%;
          height: 100%;
          color: transparent;
          z-index: -2;
          text-stroke: 3px #f0f466;
          -webkit-text-stroke: 3px #f0f466;
        }
      }
    }
    .tab-list {
      position: absolute;
      top: 555px;
      width: 100%;
      height: 114px;
      box-sizing: border-box;
      // padding: 0 21px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      .tab-item {
        width: 160px;
        height: 54px;
        background: url("@/assets/activity/ramadan/tab_hide.png") no-repeat center center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        box-sizing: border-box;
        padding: 0 20px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 800;
        font-size: 16px;
        line-height: 16px;
        font-style: normal;
        color: #fffbd7;
        position: relative;
        &:nth-child(1),
        &:nth-child(3) {
          margin-right: 13px;
        }
        > span::before {
          content: attr(data-text);
          position: absolute;
          left: 0;
          width: 100%;
          box-sizing: border-box;
          padding: 0 20px;
          color: #fff;
          height: 100%;
          text-shadow:
            1px 1px 0px #555555,
            -1px -1px 0px #555555,
            1px -1px 0px #555555,
            -1px 1px 0px #555555;
        }
      }
      .tab-item-show {
        background: url("@/assets/activity/ramadan/tab_show.png") no-repeat center center;
        background-size: cover;
      }
    }
    .time-text {
      width: 146px;
      height: 31px;
      background: url("@/assets/activity/ramadan/bg_time_text.png") no-repeat center center;
      background-size: cover;
      position: absolute;
      top: 131px;
      left: 50%;
      transform: translateX(-50%);
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 500;
      font-size: 12px;
      color: #ffe638;
      > span {
        display: inline-block;
        height: 17px;
        margin: 5px auto 9px;
        width: 100%;
        text-align: center;
      }
    }
    .time {
      position: absolute;
      top: 458px;
      left: 50%;
      transform: translateX(-50%);
      width: 321px;
      height: 73px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/ramadan/bg_time.png") no-repeat center center;
      background-size: cover;
    }
  }
  .rules {
    position: absolute;
    top: 180px;
    right: 0;
    width: 54px;
    height: 30px;
    background: url("@/assets/activity/ramadan/bg_rules.png") no-repeat center center;
    background-size: cover;
    font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-weight: 500;
    font-size: 15px;
    color: #412702;
    line-height: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    box-sizing: border-box;
    padding-bottom: 2px;
  }
  .content {
    width: 100%;
    height: auto;
  }
}
</style>
