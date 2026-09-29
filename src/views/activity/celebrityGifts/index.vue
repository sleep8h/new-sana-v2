<!-- Celebrity Gift Battle 活动主页 -->
<template>
  <div class="page">
    <div class="nav-div">
      <div class="nav-back" :class="{ 'nav-back-ar': store.language === 'ar' }" @click="back">
        <img v-if="store.language !== 'ar'" src="@/assets/common/left-black-icon@2x.png" alt="" />
        <img v-else src="@/assets/common/right-black-icon@2x.png" alt="" />
      </div>
      <div class="nav-title">{{ $t("celebrityGifts.title") }}</div>
    </div>

    <div class="page-content">
      <div class="bg-top">
        <!-- 光晕 -->
        <div class="spotlight spotlight-l"></div>
        <div class="spotlight spotlight-r"></div>

        <!-- 皇冠 -->
        <div class="crown">
          <span class="gem gem-l"></span>
          <span class="gem gem-m"></span>
          <span class="gem gem-r"></span>
        </div>

        <!-- 标题 -->
        <div class="title-block">
          <div class="title-en">CELEBRITY</div>
          <div class="title-en title-en-big">GIFT BATTLE</div>
          <div class="title-ar" v-if="store.language === 'ar'">{{ $t("celebrityGifts.titleAr") }}</div>
        </div>

        <!-- 奖杯 -->
        <div class="trophy">
          <div class="trophy-handle trophy-handle-l"></div>
          <div class="trophy-handle trophy-handle-r"></div>
          <div class="trophy-cup">
            <span>SANA</span>
          </div>
          <div class="trophy-stem"></div>
          <div class="trophy-base"></div>
        </div>

        <!-- 倒计时 -->
        <div class="time">
          <CountDownCelebrity :time="countDownTime || 0" :key="countDownTime" format="DD:HH:MM:SS" />
        </div>

        <!-- 规则入口 -->
        <div class="rules" @click="rulesShow = true">
          <span class="rules-icon">?</span>
          <span>{{ $t("celebrityGifts.rule") }}</span>
        </div>

        <!-- tab -->
        <div class="tab-list">
          <div
            v-for="item in tabList"
            :key="item.value"
            class="tab-item"
            :class="{ 'tab-item-show': curTab === item.value }"
            @click="tabChange(item)"
          >
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>

      <div class="content">
        <giftBattle v-if="curTab === 1" />
        <rank v-if="curTab === 2" />
      </div>

      <RuleToast v-model:isShow="rulesShow" :rewardGroups="rewardGroups" @close="rulesShow = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { get } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import CountDownCelebrity from "./components/CountDownCelebrity.vue";
import RuleToast from "./components/ruleToast.vue";
import giftBattle from "./giftBattle.vue";
import rank from "./rank.vue";
import { withMock, mockInfo } from "./mock.js";

const store = useMainStore();
const { t } = useI18n();

const curTab = ref(1);
const countDownTime = ref(0);
const rulesShow = ref(false);
const rewardGroups = ref([]);

const tabList = [
  { text: t("celebrityGifts.gifts"), value: 1 },
  { text: t("celebrityGifts.ranking"), value: 2 },
];

const tabChange = (item) => {
  curTab.value = item.value;
};

const back = () => {
  if (store.os === "android") {
    WebViewJavascriptBridge.backToFront(null, null);
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.backToFront.postMessage(null);
  } else {
    window.history.back();
  }
};

const getActivityInfo = async () => {
  const data = await withMock(
    () =>
      get("/h5doings/activity/celebrityGift2026/list", {
        uid: store.uid,
        ticket: store.ticket,
        language: store.language,
      }),
    mockInfo,
  );
  countDownTime.value = data.timeOut;
  rewardGroups.value = data.rewardGroups || [];
};

onMounted(() => {
  getActivityInfo();
});
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 94px;
  background: #1c0306;
  font-family:
    PingFangSC,
    PingFang SC,
    Avenir,
    Helvetica,
    Arial,
    sans-serif;

  .nav-div {
    width: 100%;
    height: 94px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    box-sizing: border-box;
    padding: 44px 16px 0 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    .nav-back {
      position: absolute;
      top: 53px;
      left: 16px;
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    .nav-back-ar {
      left: 0;
      right: 16px;
    }
    .nav-title {
      width: calc(100vw - 96px);
      text-align: center;
      font-weight: bold;
      font-size: 19px;
      color: #ffe0a0;
    }
  }

  .page-content {
    width: 100%;
    min-height: calc(100vh - 94px);
    background:
      radial-gradient(circle at 50% -10%, #6d1018 0%, #3a070c 38%, #1c0306 78%);
    overflow-x: hidden;
  }

  .bg-top {
    position: relative;
    width: 375px;
    height: 468px;
    margin: 0 auto;
    overflow: hidden;
    background:
      radial-gradient(ellipse at 50% 8%, rgba(255, 190, 110, 0.28) 0%, transparent 45%),
      linear-gradient(180deg, #4a0a10 0%, #2a0509 55%, #1c0306 100%);
    border-bottom: 1px solid rgba(242, 205, 99, 0.25);

    // 两侧幕布光
    .spotlight {
      position: absolute;
      top: -40px;
      width: 150px;
      height: 340px;
      opacity: 0.55;
      filter: blur(2px);
    }
    .spotlight-l {
      left: -46px;
      background: linear-gradient(200deg, rgba(180, 30, 30, 0.55) 0%, transparent 70%);
    }
    .spotlight-r {
      right: -46px;
      background: linear-gradient(160deg, rgba(180, 30, 30, 0.55) 0%, transparent 70%);
    }

    // 皇冠
    .crown {
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 38px;
      background: linear-gradient(180deg, #fff3c4 0%, #f3c54b 55%, #b07a1c 100%);
      clip-path: polygon(0 100%, 0 32%, 16% 58%, 32% 8%, 50% 58%, 68% 8%, 84% 58%, 100% 32%, 100% 100%);
      filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.6));
      .gem {
        position: absolute;
        bottom: 9px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #d81f2a;
        border: 1px solid #8a0b12;
      }
      .gem-l {
        left: 12px;
      }
      .gem-m {
        left: 50%;
        transform: translateX(-50%);
        background: #ffe680;
        border-color: #b07a1c;
      }
      .gem-r {
        right: 12px;
      }
    }

    // 标题
    .title-block {
      position: absolute;
      top: 56px;
      left: 0;
      width: 100%;
      text-align: center;
      .title-en {
        font-family: LogoSCUnboundedSans, sans-serif;
        font-size: 22px;
        line-height: 26px;
        letter-spacing: 1px;
        background-image: linear-gradient(180deg, #fff3c4 0%, #f3c54b 55%, #a9741c 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
      }
      .title-en-big {
        font-size: 30px;
        line-height: 36px;
        letter-spacing: 2px;
      }
      .title-ar {
        margin-top: 2px;
        font-weight: bold;
        font-size: 16px;
        color: #f3c54b;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
      }
    }

    // 奖杯
    .trophy {
      position: absolute;
      top: 132px;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      height: 150px;
      .trophy-cup {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 96px;
        height: 78px;
        border-radius: 10px 10px 46px 46px;
        background:
          radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.55) 0%, transparent 42%),
          linear-gradient(180deg, #fff0b8 0%, #f3c54b 45%, #b07a1c 100%);
        border: 2px solid #8a5a14;
        box-shadow:
          inset 0 -8px 14px rgba(120, 70, 10, 0.55),
          0 6px 14px rgba(0, 0, 0, 0.55);
        display: flex;
        justify-content: center;
        align-items: center;
        > span {
          font-family: LogoSCUnboundedSans, sans-serif;
          font-weight: bold;
          font-size: 24px;
          color: #7a4a10;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
        }
      }
      .trophy-handle {
        position: absolute;
        top: 14px;
        width: 26px;
        height: 44px;
        border: 5px solid #d69f2e;
        z-index: 0;
      }
      .trophy-handle-l {
        left: 6px;
        border-right: none;
        border-radius: 22px 0 0 22px;
      }
      .trophy-handle-r {
        right: 6px;
        border-left: none;
        border-radius: 0 22px 22px 0;
      }
      .trophy-stem {
        position: absolute;
        top: 78px;
        left: 50%;
        transform: translateX(-50%);
        width: 18px;
        height: 26px;
        background: linear-gradient(180deg, #f3c54b 0%, #a9741c 100%);
        border-left: 2px solid #8a5a14;
        border-right: 2px solid #8a5a14;
      }
      .trophy-base {
        position: absolute;
        top: 102px;
        left: 50%;
        transform: translateX(-50%);
        width: 74px;
        height: 16px;
        border-radius: 4px;
        background: linear-gradient(180deg, #f3c54b 0%, #8a5a14 100%);
        border: 2px solid #6a470f;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
      }
    }

    // 倒计时
    .time {
      position: absolute;
      top: 292px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    // 规则
    .rules {
      position: absolute;
      top: 296px;
      right: 12px;
      height: 28px;
      padding: 0 10px;
      border-radius: 14px;
      border: 1px solid rgba(242, 205, 99, 0.7);
      background: rgba(40, 6, 10, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 12px;
      color: #f7d264;
      .rules-icon {
        width: 16px;
        height: 16px;
        margin-right: 3px;
        border-radius: 50%;
        border: 1px solid #f7d264;
        font-size: 11px;
        line-height: 14px;
        text-align: center;
      }
    }

    // tab
    .tab-list {
      position: absolute;
      bottom: 8px;
      left: 0;
      width: 100%;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      .tab-item {
        width: 150px;
        height: 44px;
        border-radius: 22px;
        border: 1px solid rgba(242, 205, 99, 0.65);
        background: linear-gradient(180deg, #5e1118 0%, #33060b 100%);
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        > span {
          font-weight: bold;
          font-size: 16px;
          color: #d8b46a;
        }
      }
      .tab-item-show {
        border-color: #f7d264;
        background: linear-gradient(180deg, #f4423f 0%, #a30d14 100%);
        box-shadow:
          inset 0 1px 0 rgba(255, 220, 160, 0.5),
          0 4px 10px rgba(0, 0, 0, 0.45);
        > span {
          color: #ffe9b0;
          text-shadow: 0 1px 2px rgba(60, 0, 0, 0.6);
        }
      }
    }
  }

  .content {
    width: 100%;
    padding-top: 10px;
  }
}
</style>
