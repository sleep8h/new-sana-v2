<!-- 主页 -->
<template>
  <div class="page">
    <div class="nav-back" :class="{ 'nav-back-ar': store.language === 'ar' }" @click="back">
      <img v-if="store.language !== 'ar'" src="@/assets/common/left-icon@2x.png" alt="" />
      <img v-else src="@/assets/common/right-icon@2x.png" alt="" />
    </div>
    <div class="page-content">
      <div class="bg-top">
        <div class="bg-img">
          <div :class="store.language === 'ar' ? 'bg-img1-ar' : 'bg-img1'"></div>
          <div class="bg-img2"></div>
          <div class="bg-img3"></div>
          <div class="bg-gradient"></div>
        </div>
        <div class="time">
          <CountDownDragon :time="countDownTime || 0" :key="countDownTime" format="DD:HH:MM:SS" />
        </div>
        <div class="tab-list">
          <div
            :class="['tab-item', { 'tab-item-show': curTab === item.value }]"
            @click="tabChange(item)"
            v-for="(item, index) in tabList"
            :key="index"
          >
            <span>{{ item.text }}</span>
          </div>
        </div>
        <div class="rules" @click="rulesShow = true">{{ $t("ramadan.rule") }}</div>
      </div>
      <div class="content">
        <gameRank v-if="curTab === 1" />
        <dragonsLair v-if="curTab === 2" />
        <post v-if="curTab === 3" />
      </div>
      <RuleToast v-model:isShow="rulesShow" :content="$t('ramadan.rule')" @close="rulesShow = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import { showToast } from "vant";
import "vant/es/toast/style"; // 关键：单独引入样式

// 图片资源

// 模块
// 游戏排名
import gameRank from "@/views/activity/dragonsWealth/gameRank.vue";
// 巨龙巢穴
import dragonsLair from "@/views/activity/dragonsWealth/dragonsLair.vue";
// 驿站
import post from "@/views/activity/dragonsWealth/post.vue";
// 规则弹窗
import RuleToast from "@/views/activity/dragonsWealth/components/ruleToast.vue";
import CountDownDragon from "@/components/countDown/CountDownDragon.vue";

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const curTab = ref(1);
const countDownTime = ref(0);
const rulesShow = ref(false);
const tabList = [
  {
    text: t("dragons.gameRank"),
    value: 1,
  },
  {
    text: t("dragons.dragonLair"),
    value: 2,
  },
  {
    text: t("dragons.station"),
    value: 3,
  },
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
    console.error("未知平台，无法返回");
  }
};

// 获取排行榜
const getActivityCamp = async () => {
  try {
    const res = await postFormData("/h5doings/activity/camp2026", {
      uid: store.uid,
      size: 20,
      type: curTab.value,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      console.log(res, "res");
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

const getActivityCamp2026List = async () => {
  try {
    const res = await postFormData("/h5doings/activity/camp2026/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      countDownTime.value = res.data.timeOut;
      console.log(countDownTime.value, "countDownTime");
      console.log(res, "res");
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(() => {
  getActivityCamp2026List();
});
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  // overflow-y: auto;
  box-sizing: border-box;
  background: transparent;
  font-family:
    PingFangSC,
    PingFang SC,
    Avenir,
    Helvetica,
    Arial,
    sans-serif;
  .nav-back {
    position: fixed;
    z-index: 1000;
    top: 53px;
    inset-inline-start: 16px;
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
  .page-content {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: #000000;
    .bg-top {
      width: 375px;
      height: 400.5px;
      background: url("@/assets/activity/dragonsWealth/gameRank/topBg.png") no-repeat top center;
      background-size: 375px 400.5px;
      background: #000000;
      position: relative;
      .bg-img {
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 268px;
        .bg-img1 {
          position: absolute;
          top: 0;
          inset-inline-start: 0;
          width: 100%;
          height: 250px;
          background: url("@/assets/activity/dragonsWealth/gameRank/topBg.png") no-repeat top center;
          background-size: cover;
          z-index: 1;
        }
        .bg-img1-ar {
          position: absolute;
          top: 0;
          inset-inline-start: 0;
          width: 100%;
          height: 250px;
          background: url("@/assets/activity/dragonsWealth/gameRank/topBgAr.png") no-repeat top center;
          background-size: cover;
          z-index: 1;
        }
        .bg-img2 {
          position: absolute;
          bottom: 0;
          inset-inline-start: 0;
          width: 100%;
          height: 73px;
          background: url("@/assets/activity/dragonsWealth/gameRank/bgImg2.png") no-repeat top center;
          background-size: cover;
          z-index: 2;
        }
        .bg-img3 {
          position: absolute;
          bottom: 1px;
          inset-inline-start: 50%;
          margin-inline-start: -23px;
          width: 46px;
          height: 43px;
          background: url("@/assets/activity/dragonsWealth/gameRank/bgImg3.png") no-repeat top center;
          background-size: cover;
          z-index: 3;
        }
        .bg-gradient {
          position: absolute;
          top: 0;
          inset-inline-start: 0;
          width: 100%;
          height: 39px;
          background: linear-gradient(180deg, #1b0000 0%, rgba(30, 0, 0, 0) 100%);
          z-index: 4;
          pointer-events: none;
        }
      }
      .time {
        position: absolute;
        top: 272px;
        width: 272px;
        height: 68px;
        left: 50%;
        transform: translateX(-50%);
      }
      .tab-list {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        top: 351.5px;
        left: 0;
        .tab-item {
          width: 124px;
          height: 33.5px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url("@/assets/activity/dragonsWealth/gameRank/homeTabHide.png") no-repeat top center;
          background-size: cover;
          > span {
            width: 100%;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            line-height: 14px;
            background: linear-gradient(180deg, #ffffff 0%, #d8b26d 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        }
        .tab-item-show {
          background: url("@/assets/activity/dragonsWealth/gameRank/homeTabShow.png") no-repeat top center;
          background-size: cover;
        }
      }
      .rules {
        position: absolute;
        top: 235px;
        inset-inline-start: -10px;
        z-index: 5;
        width: 92.5px;
        height: 32px;
        line-height: 32px;
        background: url("@/assets/activity/dragonsWealth/gameRank/rule.png") no-repeat top center;
        background-size: cover;
        box-sizing: border-box;
        padding: 0 0 0 10px;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
      }
    }
    .content {
      width: 100%;
      height: auto;
    }
  }
}
</style>
