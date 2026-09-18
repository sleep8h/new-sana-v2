<!-- 主页 -->
<template>
  <div class="page">
    <div
      class="nav-container"
      :class="store.language != 'ar' ? 'nav-container-left' : 'nav-container-right'"
      @click="back"
    >
      <img v-if="store.language != 'ar'" src="@/assets/common/left-black-icon@2x.png" alt="" />
      <img v-else src="@/assets/common/right-black-icon@2x.png" alt="" />
    </div>
    <div class="bg-top">
      <div class="fw">
        <div class="fw-base"></div>
        <div class="fw-content" :class="{ 'fw-content-animation': isAnimation }">
          <div
            class="fw-cp"
            style="--index: 0"
            :class="[{ 'fw-cp-animation': isAnimation }, 'fw-' + (index + 1)]"
            v-for="(item, index) in cpList.slice(0, 7)"
            :key="index"
          >
            <div class="left">
              <img :src="item.avatar" alt="" />
            </div>
            <div class="right">
              <img :src="item.reAvatar" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div class="time">
        <CountDownCp :time="countDownTime || 0" :key="countDownTime" format="DD:HH:MM:SS" />
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
    </div>
    <div class="content">
      <Week v-if="curTab === 1" :cpList="cpList" :cpSelf="cpSelf" />
      <Week v-if="curTab === 2" :cpList="cpList" :cpSelf="cpSelf" />
      <Rewards v-if="curTab === 3" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import CountDownCp from "@/components/countDown/CountDownCp.vue";
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
import Week from "@/views/activity/cp/week.vue";
import Rewards from "@/views/activity/cp/reward.vue";

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const curTab = ref(1);
const isAnimation = ref(false);
const countDownTime = ref(0);
const rulesShow = ref(false);
const cpList = ref([]);
const cpSelf = ref({});
const tabList = [
  {
    imgHide: homeTab1Hide,
    imgShow: homeTab1Show,
    text: t("This Week"),
    value: 1,
  },
  {
    imgHide: homeTab2Hide,
    imgShow: homeTab2Show,
    text: t("Last Week"),
    value: 2,
  },
  {
    imgHide: homeTab3Hide,
    imgShow: homeTab3Show,
    text: t("Rewards"),
    value: 3,
  },
];

const tabChange = (item) => {
  isAnimation.value = false;
  curTab.value = item.value;
  console.log(curTab.value, "curTab.value");
  cpList.value = [];
  cpSelf.value = {};
  if (curTab.value === 1 || curTab.value === 2) {
    getActivityRechargeRank();
  }
  if (curTab.value === 3) {
    getActivityRechargeRank(2);
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

const getActivityRechargeRank = async (type) => {
  try {
    const res = await get("/h5doings/activity/cpRank/rank", {
      uid: store.uid,
      ticket: store.ticket,
      type: type || curTab.value,
      language: store.language,
    });
    if (res && res.code === 200) {
      cpList.value = res.data.cpList || [];
      // for(let i = 0; i < 50; i++){
      //   res.data.cpList[0] && cpList.value.push(res.data.cpList[0])
      // }
      cpSelf.value = res.data.cpSelf;
      if (res.data.cpList.length > 1) {
        isAnimation.value = true;
      }
    } else {
      console.error("code !== 200 error:", res.message);
    }
  } catch (error) {
    console.error("catch error:", error);
  }
};

const getRankList = async () => {
  try {
    const res = await postFormData("/h5doings/activity/cpRank/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      countDownTime.value = res.data.timeOut;
    } else {
      console.error("code !== 200 error:", res.message);
    }
  } catch (error) {
    console.error("catch error:", error);
  }
};

onMounted(() => {
  getActivityRechargeRank();
  getRankList();
});
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background: #75008b;
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
    > img {
      width: 32px;
      height: 32px;
    }
  }
  .nav-container-left {
    top: 52px;
    left: 16px;
  }
  .nav-container-right {
    top: 52px;
    right: 16px;
  }
  .bg-top {
    background: url("@/assets/activity/cp/bg.png") no-repeat center center;
    background-size: 100% 100%;
    width: 100%;
    height: 572px;
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    .fw {
      width: 100%;
      height: 366px;
      left: 0;
      top: 156px;
      position: relative;
      .fw-base {
        position: absolute;
        bottom: 1px;
        left: 81px;
        width: 218px;
        height: 215px;
        background: url("@/assets/activity/cp/ferris-wheel-base.png") no-repeat center center;
        background-size: 100% 100%;
      }
      .fw-content-animation {
        animation: rotateWheel 15s linear infinite; /* 10秒匀速无限循环 */
        @keyframes rotateWheel {
          0% {
            transform: translateX(-50%) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) rotate(360deg);
          }
        }
      }
      .fw-content {
        position: absolute;
        top: 25px;
        left: 50%;
        transform: translateX(-50%);
        width: 308px;
        height: 301px;
        background: url("@/assets/activity/cp/ferris-wheel-content.png") no-repeat center center;
        background-size: 100% 100%;
        .fw-cp-animation {
          animation: counterRotate 15s linear infinite;
          --radius: 150px; /* 摩天轮半径 */
          --angle: calc(360deg / 7 * var(--index)); /* 7个子项均分360° */
          transform: rotate(var(--angle)) translateY(calc(-1 * var(--radius))) rotate(calc(-1 * var(--angle)));
          @keyframes counterRotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(-360deg);
            } /* 反向抵消父级旋转 */
          }
        }
        .fw-cp {
          position: absolute;
          width: 134px;
          height: 85px;
          background: url("@/assets/activity/cp/ferris-wheel-item.png") no-repeat center center;
          background-size: 100% 100%;
          .left,
          .right {
            width: 47px;
            height: 47px;
            border: 1px solid #ffec00;
            border-radius: 50%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            > img {
              width: 45px;
            }
          }
          .left {
            position: absolute;
            top: 23px;
            left: 27px;
            z-index: 1;
          }
          .right {
            position: absolute;
            top: 23px;
            right: 20px;
            z-index: 2;
          }
        }
        .fw-1 {
          position: absolute;
          top: 102px;
          left: 72.5px;
          width: 163px;
          height: 99px;
          .left,
          .right {
            width: 38px;
            height: 38px;
            border: 1px solid #ffec00;
            border-radius: 50%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            > img {
              width: 36px;
            }
          }
          .left {
            position: absolute;
            top: 32px;
            left: 47px;
            z-index: 1;
          }
          .right {
            position: absolute;
            top: 32px;
            right: 43px;
            z-index: 2;
          }
        }
        .fw-2 {
          position: absolute;
          top: -24px;
          left: 99px;
        }
        .fw-3 {
          position: absolute;
          top: 46px;
          right: -23px;
        }
        .fw-4 {
          position: absolute;
          top: 169px;
          right: -29px;
        }
        .fw-5 {
          position: absolute;
          bottom: -14px;
          left: 80px;
        }
        .fw-6 {
          position: absolute;
          left: -28px;
          bottom: 49px;
        }
        .fw-7 {
          position: absolute;
          top: 46px;
          left: -27px;
        }
      }
    }
    .time {
      position: absolute;
      top: 523px;
      left: 50%;
      transform: translateX(-50%);
    }
    .tab-list {
      position: absolute;
      width: 349px;
      height: 42px;
      top: 593px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tab-item {
        width: 116px;
        height: 42px;
        background: url("@/assets/activity/cp/tab-hide.png") no-repeat center center;
        background-size: 100% 100%;
        padding: 5px 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        > span {
          font-family: LogoSCUnboundedSans, LogoSCUnboundedSans;
          font-weight: 400;
          text-align: center;
          font-size: 12px;
          color: #ffec24;
          line-height: 12px;
          text-shadow: 0px 1px 0px #c543b9;
          font-style: normal;
        }
      }
      .tab-item-show {
        background: url("@/assets/activity/cp/tab-show.png") no-repeat center center;
        background-size: 100% 100%;
        > span {
          color: #ffe400;
        }
      }
    }
  }
}
</style>
