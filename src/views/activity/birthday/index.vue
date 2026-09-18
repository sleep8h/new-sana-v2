<template>
  <div class="page">
    <div
      class="nav-container"
      @click="back"
    >
      <img v-if="store.language != 'ar'" src="@/assets/common/left-icon@2x.png" alt="" />
      <img v-else src="@/assets/common/right-icon@2x.png" alt="" />
    </div>
    <!-- bg-top模块 -->
    <div class="bg-top">
      <!-- 音乐按钮 -->
      <div class="music-btns">
        <BackgroundMusic ref="bgMusicRef" :src="birthdayMp3" />
      </div>
      <!-- 我的生日报告按钮 -->
      <div v-if="showReport && isVideoPreloaded" class="bg-report" @click="openBirthdayReport">
        <span>{{ t('birthday.myBirthdayReport') }}</span>
      </div>
      <!-- 规则按钮 -->
      <div class="bg-rules" @click="rulesShow = true">
        <span>{{ t('birthday.rule') }}</span>
      </div>
      <!-- 弹幕 -->
      <div class="barrage">
        <vue-danmaku
          v-model:danmus="recordsList"
          style="height: 228px"
          :speeds="speeds"
          :debounce="debounce"
          :channels="3"
          :loop="true"
          :randomChannel="true"
          :top="0"
        >
          <template #danmu="{ index, danmu }">
            <div class="barrage-item">
              <img class="avatar" :src="danmu.avatar" alt="" />
              <div class="text">{{ t('birthday.barrageText', { name: danmu.nick, level: danmu.level }) }}</div>
            </div>
          </template>
        </vue-danmaku>
      </div>
      <!-- tab模块 -->
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
    <!-- 对应组件模块 -->
    <div class="content">
      <BirthdayPrivilege v-if="curTab === 1" @openRecord="recordShow = true" @birthdaySet="getBirthdayList" />
      <BirthdayStars v-if="curTab === 2" />
      <BirthdayRank v-if="curTab === 3" />
    </div>
    <RuleToast v-model:isShow="rulesShow" content="规则" @close="rulesShow = false" />
    <RecordToast v-model:isShow="recordShow" content="记录礼物" @close="recordShow = false" />
    <BirthdayReport v-model:isShow="birthdayReportShow" :userInfo="userInfo" :hasClaimed="hasClaimed" @close="birthdayReportShow = false" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import vueDanmaku from "vue-danmaku";
import { showToast } from "vant";
import "vant/es/toast/style"; // 关键：单独引入样式
import birthdayMp3 from "@/assets/activity/birthday/birthday.mp3";
import birthdayMp4 from "@/assets/activity/birthday/birthday.mp4";
import blowMp4 from "@/assets/activity/birthday/bllowing.mp4";

// 图片资源
// import tabHide from "@/assets/activity/eidAlAdha/tabHide.png";
// import tabShow from "@/assets/activity/eidAlAdha/tabShow.png";
// import giftImg from "@/assets/activity/eidAlAdha/gift.png";
// import defaultAvatar from "@/assets/activity/eidAlAdha/myRanch/defaultAvatar.png";

// 模块
// 生日特权
import BirthdayPrivilege from "@/views/activity/birthday/birthdayPrivilege.vue";
// 本月寿星
import BirthdayStars from "@/views/activity/birthday/birthdayStars.vue";
// 榜单
import BirthdayRank from "@/views/activity/birthday/birthdayRank.vue";
// 规则弹窗
import RuleToast from '@/views/activity/birthday/components/RuleToast.vue'
import RecordToast from "@/views/activity/birthday/components/recordToast.vue";
import BirthdayReport from "@/views/activity/birthday/components/birthdayReport.vue";
import BackgroundMusic from "@/views/activity/birthday/components/BackgroundMusic.vue";

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const curTab = ref(1);
const rulesShow = ref(false)
const recordShow = ref(false)
const hasClaimed = ref(false)
const birthdayReportShow = ref(false)
const tabList = computed(() => [
  {
    text: t('birthday.myPrivilegeTitle'),
    value: 1
  },
  {
    text: t('birthday.birthdayUser'),
    value: 2
  },
  {
    text: t('birthday.ranking'),
    value: 3
  },
])
const showReport = ref(false)
const userInfo = ref("")

// 视频预加载状态
const videoPreloadStatus = ref({
  birthday: false,
  blow: false,
});
const isVideoPreloaded = computed(() => videoPreloadStatus.value.birthday && videoPreloadStatus.value.blow);

// 预加载单个视频（用 video 元素加载到浏览器缓存，不清理 src）
const preloadVideo = (src, key) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.style.cssText = 'display:none;position:absolute;visibility:hidden;';

    const onLoad = () => {
      console.log(`Video preload success: ${src}`);
      videoPreloadStatus.value[key] = true;
      resolve();
    };

    const onError = () => {
      console.warn(`Video preload failed: ${src}`);
      videoPreloadStatus.value[key] = true;
      resolve();
    };

    video.addEventListener('loadeddata', onLoad);
    video.addEventListener('error', onError);
    document.body.appendChild(video);
  });
};

// 预加载所有视频
const preloadAllVideos = () => {
  preloadVideo(birthdayMp4, 'birthday');
  preloadVideo(blowMp4, 'blow');
};

// 打开生日报告（检查预加载状态）
const openBirthdayReport = () => {
  birthdayReportShow.value = true;
};

// 计算距离本年度生日还有多少毫秒
const getNextBirthdayMs = (birthdayStr) => {
  const now = new Date();
  const year = now.getFullYear();
  let [y, m, d] = birthdayStr.split('-').map(Number);
  if (birthdayStr.split('-').length === 2) {
    [y, m, d] = [year, y, d];
  }
  const thisYearBirthday = new Date(y, m - 1, d);
  let nextBirthday = thisYearBirthday;
  // 只比较月份和日期，忽略时间部分，确保生日当天也能正确识别
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const birthdayThisYear = new Date(year, m - 1, d);
  if (birthdayThisYear < today) {
    nextBirthday = new Date(y + 1, m - 1, d);
  }
  return nextBirthday.getTime() - now.getTime();
};

// 计算距离本年度生日还有多少天
const getDaysUntilBirthday = (birthdayStr) => {
  if (!birthdayStr) return Infinity;
  const msPerDay = 24 * 60 * 60 * 1000;
  const msUntilBirthday = getNextBirthdayMs(birthdayStr);
  return Math.ceil(msUntilBirthday / msPerDay);
};
const recordsList = ref([])
const speeds = ref(25); // 初始速度
const debounce = ref(6000); // 初始刷新频率
const intervalTimeId = ref(null);
const bgMusicRef = ref(null);
// 生成随机参数
const randomizeSettings = () => {
  speeds.value = Math.floor(Math.random() * 50) + 10; // 速度范围：10-60px/s
  debounce.value = Math.floor(Math.random() * 5000) + 1000; // 频率范围：1-6秒
};

const tabChange = (item) => {
  curTab.value = item.value
}

const back = () => {
  if (store.os === "android") {
    WebViewJavascriptBridge.backToFront(null, null);
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.backToFront.postMessage(null);
  } else {
    console.error("未知平台，无法返回");
  }
};

// 获取领取记录列表接口
const getBirthdayRecord = async () => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/records", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      type: 0,
      size: 50
    });
    if (res && res.code === 200) {
      recordsList.value = res.data;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取活动列表接口
const getBirthdayList = async () => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      userInfo.value = res.data.userInfo || {};
      hasClaimed.value = res.data.hasClaimed || false;
      // 年度生日报告入口只给距离本年度生日≤7天的用户开放
      const daysUntil = getDaysUntilBirthday(userInfo.value.birthday);
      showReport.value = daysUntil <= 7;
      // 每天第一次打开页面，满足条件时自动打开生日报告（等视频预加载完成后）
      if (showReport.value) {
        const today = new Date().toDateString();
        const lastAutoOpen = localStorage.getItem('birthdayReportAutoOpen');
        if (lastAutoOpen !== today) {
          localStorage.setItem('birthdayReportAutoOpen', today);
          // 等待视频预加载完成后再弹窗
          const waitForPreload = () => {
            if (isVideoPreloaded.value) {
              birthdayReportShow.value = true;
            } else {
              setTimeout(waitForPreload, 200);
            }
          };
          waitForPreload();
        }
      }
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取活动列表接口
// const getBirthdayReport = async () => {
//   try {
//     const res = await postFormData("/h5doings/activity/birthday/report", {
//       uid: store.uid,
//       ticket: store.ticket,
//       language: store.language,
//     });
//     if (res && res.code === 200) {
//       hasBirthday.value = res.data.hasBirthday;
//     } else {
//       showToast(res.message);
//     }
//   } catch (error) {
//     console.error("Error fetching anchor info:", error);
//   }
// };

onMounted(async () => {
  await getBirthdayRecord();
  await getBirthdayList();
  // await getBirthdayReport();
  clearInterval(intervalTimeId.value);
  intervalTimeId.value = null;
  intervalTimeId.value = setInterval(randomizeSettings, 10000); // 每10秒更新一次参数
  // 默认开启背景音乐
  bgMusicRef.value?.play();
  preloadAllVideos();
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
  background: #1A0227;
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
    inset-block-start: 52px;
    inset-inline-start: 4px;
    > img {
      width: 48px;
      height: 48px;
    }
  }

  /* bg-top模块 */
  .bg-top {
    background: url("@/assets/activity/birthday/bg_head.png") no-repeat top center;
    background-size: cover;
    width: 100%;
    height: 745px;
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    .music-btns {
      position: absolute;
      inset-block-start: 147px;
      inset-inline-end: 17px;
      z-index: 10;
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }
    .bg-report {
      position: absolute;
      z-index: 2;
      width: 125px;
      height: 43px;
      top: 442px;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/birthday/bg_report.png") no-repeat top center;
      background-size: cover;
      padding: 0 30px 0 10px;
      >span{
        font-weight: bold;
        font-size: 12px;
        line-height: 12px;
        color: #EBD975;
        background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
      }
    }
    .bg-rules {
      position: absolute;
      z-index: 2;
      width: 71px;
      height: 43px;
      top: 442px;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/birthday/bg_rules.png") no-repeat top center;
      background-size: cover;
      padding: 0 8px 0 30px;
      >span{
        font-weight: bold;
        font-size: 12px;
        line-height: 12px;
        color: #EBD975;
        background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
      }
    }
  
    .barrage {
      width: 100%;
      min-height: 250px;
      box-sizing: border-box;
      position: absolute;
      top: 172px;
      left: 0;
      .barrage-item {
        width: 343px;
        height: 76px;
        background: url("@/assets/activity/birthday/barrageItemBg.png") no-repeat center center;
        background-size: cover;
        position: relative;
        .avatar{
          position: absolute;
          top: 21px;
          left: 28.5px;
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
        .text{
          position: absolute;
          top: 24px;
          left: 73px;
          width: 174px;
          min-height: 15px;
          font-size: 11px;
          line-height: 15px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #FFFFFF;
          white-space: normal;
          text-align: start;
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  /* tab模块 */
  .tab-list {
    position: absolute;
    top: 491px;
    left: 50%;
    transform: translateX(-50%);
    width: 364px;
    height: 51px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tab-item{
      width: 118px;
      min-height: 51px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/birthday/birthdayPrivilege/bg_tab_hide.png") no-repeat center center;
      background-size: 100% 100%;
      color: #EBD975;
      >span{
        font-weight: bold;
        font-size: 12px;
        background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .tab-item-show{
      background: url("@/assets/activity/birthday/birthdayPrivilege/bg_tab_show.png") no-repeat center center;
      background-size: cover;
      >span{
        color: #13021B;
        background: transparent;
        -webkit-text-fill-color: #13021B;
      }
    }
  }
  /* 对应组件模块 */
  .content {
    position: relative;
    z-index: 3;
    width: 100%;
    height: auto;
  }
}
</style>