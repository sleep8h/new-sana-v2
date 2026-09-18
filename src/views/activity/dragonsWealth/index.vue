<!-- 主页 -->
<template>
  <div class="page">
    <div class="nav-div">
      <div class="nav-back" :class="{ 'nav-back-ar': store.language === 'ar' }" @click="back">
        <img v-if="store.language !== 'ar'" src="@/assets/common/left-black-icon@2x.png" alt="" />
        <img v-else src="@/assets/common/right-black-icon@2x.png" alt="" />
      </div>
      <div class="nav-title">
        {{ $t("dragons.title") }}
      </div>
    </div>
    <div class="page-content">
      <div class="bg-top">
        <div class="bg-title">
          <img v-if="store.language === 'ar'" :src="titleAr" alt="" />
          <img v-else :src="titleEn" alt="" />
        </div>
        <div class="time">
          <CountDownDragon :time="countDownTime || 0" :key="countDownTime" format="DD:HH:MM" />
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
import titleAr from "@/assets/activity/dragonsWealth/gameRank/titleAr.png";
import titleEn from "@/assets/activity/dragonsWealth/gameRank/titleEn.png";

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
  padding-top: 94px;
  background: transparent;
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
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 44px 16px 0 16px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: transparent;
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
      right: 16px;
      left: 0;
    }
    .nav-title {
      width: calc(100vw - 96px);
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .page-content {
    width: 100%;
    height: calc(100vh - 94px);
    overflow-x: hidden;
    overflow-y: auto;
    background: #210502;
    .bg-top {
      width: 375px;
      height: 628px;
      background: url("@/assets/activity/dragonsWealth/gameRank/topBg.png") no-repeat top center;
      background-size: 375px 628px;
      background-color: #210502;
      position: relative;
      .bg-title {
        position: absolute;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        width: 329px;
        height: 133px;
        > img {
          width: 100%;
        }
      }
      .time {
        position: absolute;
        top: 498px;
        width: 275px;
        height: 67px;
        left: 50%;
        transform: translateX(-50%);
      }
      .tab-list {
        width: 100%;
        padding: 0 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        top: 579px;
        left: 0;
        .tab-item {
          width: 119px;
          height: 84px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url("@/assets/activity/dragonsWealth/gameRank/homeTabHide.png") no-repeat top center;
          background-size: cover;
          > span {
            display: inline-block;
            width: 100%;
            box-sizing: border-box;
            padding: 0 12px;
            text-align: center;
            font-weight: bold;
            color: #cb4ff7;
            font-size: 16px;
            line-height: 16px;
          }
        }
        .tab-item-show {
          background: url("@/assets/activity/dragonsWealth/gameRank/homeTabShow.png") no-repeat top center;
          background-size: cover;
          > span {
            color: #fff8a0;
          }
        }
      }
      .rules {
        position: absolute;
        top: 391px;
        left: 0;
        width: 76px;
        height: 34px;
        background: url("@/assets/activity/dragonsWealth/gameRank/rule.png") no-repeat top center;
        background-size: cover;
        box-sizing: border-box;
        padding: 0 8px 0 0;
        font-weight: bold;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffe502;
        line-height: 25px;
      }
    }
    .content {
      width: 100%;
      height: auto;
    }
  }
}
</style>
