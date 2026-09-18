<!-- 我的牧场 -->
<template>
  <div class="my-ranch">
    <div class="ranch">
      <div class="ranch-title">
        {{ `${swiperIndex + 1 === 5 ? $t("eidAlAdha.circulateLv4") : $t("Lv." + (swiperIndex + 1))}` }}
      </div>
      <img
        class="questions"
        @click="howToPlayShow = true"
        src="@/assets/activity/eidAlAdha/myRanch/questions.png"
        alt=""
      />
      <div class="hall-of-fame" @click="hallOfFameFn">
        <div class="left">
          <div class="avatar-list">
            <div class="avatar" v-for="(item, index) in lampFullUsers?.slice(0, 3)" :key="index">
              <img :src="item.avatar" alt="" />
            </div>
          </div>
        </div>
        <img src="@/assets/activity/eidAlAdha/myRanch/rightIcon.png" alt="" class="right-icon" />
      </div>
      <div class="ranch-content">
        <div class="left" @click="last"></div>
        <div class="right" @click="next"></div>
        <Swiper
          :initial-slide="swiperIndex"
          :slides-per-view="1"
          ref="mySwiper"
          :space-between="0"
          @slideChange="onSwiperChange"
          style="height: 100%"
        >
          <SwiperSlide v-for="(item, idx) in ranchList" :key="idx">
            <div class="ranch-slide">
              <div class="tip-text" v-if="activityInfo.currentLevel >= item.type && tipTextShow">
                {{ $t(item.tipText) }}
              </div>
              <vap
                v-if="activityInfo.currentLevel >= item.type"
                :key="idx"
                :url="item.url"
                :config="item.json"
                :domId="'ranch' + (idx + 1)"
              ></vap>
              <img v-else :src="item.hideImg" alt="" />
            </div>
            <div class="ranch-progress">
              <div class="ranch-percentage" :style="ranchPercentageNumber(item.currentFeedValue, item.needValue)">
                <div class="bar"></div>
              </div>
              <div class="number">{{ `${item.currentFeedValue}/${item.needValue}` }}</div>
            </div>
            <div
              v-if="item.type !== 5"
              :class="'ranch-treasure-box-' + item.status"
              @click="getRamadan2026PayReward(item.level, item.status)"
            >
              <div v-if="item.status !== 0"></div>
            </div>
            <div
              v-if="item.type === 5"
              :class="'ranch-treasure-box-cycleLv4-' + (activityInfo.cycleLv4PendingRewardCount > 0 ? '1' : '0')"
              @click="getRamadan2026PayRewardCycleLv4(item.level, activityInfo.cycleLv4PendingRewardCount)"
            >
              <div>{{ `${100 - activityInfo.cycleLv4Count + activityInfo.cycleLv4PendingRewardCount}` }}</div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div class="my-points">{{ $t("eidAlAdha.myPoints", { number: activityInfo.pointBalance }) }}</div>
      <div class="prop-list">
        <div class="prop-item" v-for="(item, index) in propList" :key="index">
          <div class="food">
            <img class="prop-icon" :src="propImgMap(item.type)" alt="" />
            <div class="prop-count">{{ $t("eidAlAdha.points", { number: item.feedValue }) }}</div>
          </div>
          <div class="feed">
            <div
              :class="['feed-btn', 'feed-btn' + index]"
              @click="getRamadan2026Pay(item.type, item.multiples[0], item.feedValue)"
            >
              {{ `feed ${item.multiples[0]} times` }}
            </div>
            <div
              :class="['feed-btn', 'feed-btn' + index]"
              @click="getRamadan2026Pay(item.type, item.multiples[1], item.feedValue)"
            >
              {{ `feed ${item.multiples[1]} times` }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="task">
      <div class="task-title">{{ $t("eidAlAdha.task") }}</div>
      <div class="task-countDown">
        {{ $t("eidAlAdha.taskCountDown") }}
        <van-count-down :time="activityInfo.timeOutDay" class="time" />
      </div>
      <div class="task-list">
        <div class="task-item" :class="{ 'task-item1': index === 2 }" v-for="(task, index) in taskVOList" :key="index">
          <div class="task-desc">
            <span
              v-if="store.language === 'ar'"
              v-html="$t('eidAlAdha.taskDesc', { number: task.exp, text: task.descAr })"
            ></span>
            <span
              v-if="store.language === 'zh'"
              v-html="$t('eidAlAdha.taskDesc', { number: task.exp, text: task.descZh })"
            ></span>
            <span v-else v-html="$t('eidAlAdha.taskDesc', { number: task.exp, text: task.descEn })"></span>
          </div>
          <div class="task-progress">（{{ task.finishNumber }}/{{ task.number }}）</div>
        </div>
      </div>
    </div>
    <HallOfFame
      v-model:isShow="hallOfFameShow"
      @close="hallOfFameShow = false"
      :level="swiperIndex"
      :list="lampFullUsers"
      :key="new Date().getTime()"
    />
    <HallOfFameLv4
      v-model:isShow="hallOfFameLv4Show"
      @close="hallOfFameLv4Show = false"
      :level="swiperIndex"
      :list="lampFullUsers"
      :rewardList="rewardLevel4List"
      :key="new Date().getTime()"
    />
    <GetReward
      v-model:isShow="getRewardShow"
      @close="getRewardShow = false"
      :level="swiperIndex"
      :rewardList="rewardList"
    />
    <HowToPlay v-model:isShow="howToPlayShow" :content="$t('eidAlAdha.howToPlay')" @close="howToPlayShow = false" />
    <TipToast v-model:isShow="tipShow" @close="tipShow = false" />
    <ConfirmPay v-model:isShow="confirmPayShow" @close="confirmPayShow = false" @confirm="confirmPayFn" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import { CountDown } from "vant";
import vueDanmaku from "vue-danmaku";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import { Barrage } from "vant";
// 积分不足提示弹窗
import TipToast from "@/views/activity/eidAlAdha/components/tipToast.vue";
import HowToPlay from "@/views/activity/eidAlAdha/components/howToPlay.vue";
import HallOfFame from "@/views/activity/eidAlAdha/components/hallOfFame.vue";
import HallOfFameLv4 from "@/views/activity/eidAlAdha/components/hallOfFameLv4.vue";
import ConfirmPay from "@/views/activity/eidAlAdha/components/confirmPay.vue";
import GetReward from "@/views/activity/eidAlAdha/components/getReward.vue";
import Vap from "@/views/activity/eidAlAdha/components/vap.vue";
// 图片引入
import level1_icon from "@/assets/activity/eidAlAdha/myRanch/level1_icon.png";
import level2_icon from "@/assets/activity/eidAlAdha/myRanch/level2_icon.png";
import level3_icon from "@/assets/activity/eidAlAdha/myRanch/level3_icon.png";
import level4_icon from "@/assets/activity/eidAlAdha/myRanch/level4_icon.png";
import level1 from "@/assets/activity/eidAlAdha/myRanch/level1.png";
import level2 from "@/assets/activity/eidAlAdha/myRanch/level2.png";
import level3 from "@/assets/activity/eidAlAdha/myRanch/level3.png";
import level4 from "@/assets/activity/eidAlAdha/myRanch/level4.png";
import level5 from "@/assets/activity/eidAlAdha/myRanch/level5.png";
import level2Hide from "@/assets/activity/eidAlAdha/myRanch/level2Hide.png";
import level3Hide from "@/assets/activity/eidAlAdha/myRanch/level3Hide.png";
import level4Hide from "@/assets/activity/eidAlAdha/myRanch/level4Hide.png";
import level5Hide from "@/assets/activity/eidAlAdha/myRanch/level5Hide.png";
import mpLv1 from "@/assets/activity/eidAlAdha/myRanch/video_1.mp4";
import mpLv2 from "@/assets/activity/eidAlAdha/myRanch/video_2.mp4";
import mpLv3 from "@/assets/activity/eidAlAdha/myRanch/video_3.mp4";
import mpLv4 from "@/assets/activity/eidAlAdha/myRanch/video_4.mp4";
import mpLv5 from "@/assets/activity/eidAlAdha/myRanch/video_5.mp4";
import mpJson1 from "@/assets/activity/eidAlAdha/myRanch/vapc_1.json";
import mpJson2 from "@/assets/activity/eidAlAdha/myRanch/vapc_2.json";
import mpJson3 from "@/assets/activity/eidAlAdha/myRanch/vapc_3.json";
import mpJson4 from "@/assets/activity/eidAlAdha/myRanch/vapc_4.json";
import mpJson5 from "@/assets/activity/eidAlAdha/myRanch/vapc_5.json";

// 定义emit
const emit = defineEmits(["timeChange"]);

const { t } = useI18n();
const store = useMainStore();
const tipTimeId = ref(null);
const tipTextTimeId = ref(null);
const tipShow = ref(false);
const howToPlayShow = ref(false);
const hallOfFameShow = ref(false);
const hallOfFameLv4Show = ref(false);
const confirmPayShow = ref(false);
const getRewardShow = ref(false);
const tipTextShow = ref(true);
const mySwiper = ref(null); // Swiper实例引用
const swiperIndex = ref(null);
const propList = ref([]);
const taskVOList = ref([]);
const lampFullUsers = ref([]);
const rewardLevel4List = ref([]);
const rewardList = ref([]);
const activityInfo = ref({});
const confirmPayData = ref({});
const ranchList = ref([
  {
    type: 1,
    level: 1,
    currentFeedValue: 0,
    url: mpLv1,
    json: mpJson1,
    needValue: 300000,
    showImg: level1,
    hideImg: level1,
    tipText: "eidAlAdha.lv1Tip",
  },
  {
    type: 2,
    level: 2,
    currentFeedValue: 0,
    url: mpLv2,
    json: mpJson2,
    needValue: 700000,
    showImg: level2,
    hideImg: level2Hide,
    tipText: "eidAlAdha.lv2Tip",
  },
  {
    type: 3,
    level: 3,
    currentFeedValue: 0,
    url: mpLv3,
    json: mpJson3,
    needValue: 2200000,
    showImg: level3,
    hideImg: level3Hide,
    tipText: "eidAlAdha.lv3Tip",
  },
  {
    type: 4,
    level: 4,
    currentFeedValue: 0,
    url: mpLv4,
    json: mpJson4,
    needValue: 5500000,
    showImg: level4,
    hideImg: level4Hide,
    tipText: "eidAlAdha.lv4Tip",
  },
  {
    type: 5,
    level: 5,
    currentFeedValue: 0,
    url: mpLv5,
    json: mpJson5,
    needValue: 5500000,
    showImg: level5,
    hideImg: level5Hide,
    tipText: "eidAlAdha.lv5Tip",
  },
]);

// 切换swiper
const onSwiperChange = async (swiper) => {
  swiperIndex.value = swiper.activeIndex;
  await getFeedingRank(swiperIndex.value + 5);
  tipTextShow.value = true;
  closeTimeFn();
};

const next = () => {
  if (mySwiper.value && mySwiper.value.$el.swiper) {
    mySwiper.value.$el.swiper.slideNext(300); // 300ms动画
  }
};

const closeTimeFn = () => {
  clearTimeout(tipTextTimeId.value);
  tipTextTimeId.value = setTimeout(() => {
    tipTextShow.value = false;
  }, 3000);
};

const last = () => {
  if (mySwiper.value && mySwiper.value.$el.swiper) {
    mySwiper.value.$el.swiper.slidePrev(300); // 300ms动画
  }
};

const ranchPercentageNumber = (currentFeedValue, needValue) => {
  if (currentFeedValue === needValue) return "width: clac(100% - 2px)";
  return "width:" + (currentFeedValue / needValue) * 100 + "%";
};

const hallOfFameFn = () => {
  if (lampFullUsers.value.length === 0) {
    return false;
  } else {
    if (swiperIndex.value === 4) {
      hallOfFameLv4Show.value = true;
    } else {
      hallOfFameShow.value = true;
    }
  }
};

const propImgMap = (type) => {
  const map = {
    1: level1_icon,
    2: level2_icon,
    3: level3_icon,
    4: level4_icon,
  };
  return map[type] || "";
};

const confirmPayFn = () => {
  confirmPayShow.value = false;
  getRamadan2026Pay(confirmPayData.value.index, confirmPayData.value.multiple, confirmPayData.value.feedValue);
};

// 喂养10/50次接口
const getRamadan2026Pay = async (index, multiple, feedValue) => {
  // 判断积分是否不足
  if (multiple * feedValue > activityInfo.value.pointBalance) {
    tipShow.value = true;
    clearTimeout(tipTimeId.value);
    tipTimeId.value = setTimeout(() => {
      tipShow.value = false;
    }, 2000);
    return;
  }
  // 判断是否打开弹窗 每天第一次喂养需要打开弹窗
  const today = new Date().toLocaleDateString(); // 格式如 "2026/5/21"
  const lastVisitDate = localStorage.getItem("lastVisitDate");

  if (lastVisitDate !== today) {
    confirmPayShow.value = true;
    confirmPayData.value = {
      index: index,
      multiple: multiple,
      feedValue: feedValue,
    };
    localStorage.setItem("lastVisitDate", today);
    return false;
  }
  try {
    const res = await postFormData("/h5doings/activity/eidAlAdha2026/pay", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      type: "1",
      index: index,
      multiple: multiple,
    });
    getEidAlAdha2026List();
    // showToast(res.message);
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 领取宝箱接口
const getRamadan2026PayReward = async (level, status) => {
  if (status !== 1) return;
  try {
    const res = await postFormData("/h5doings/activity/eidAlAdha2026/pay", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      type: "2",
      lv: level > 4 ? 4 : level,
    });
    rewardList.value = res.data;
    getRewardShow.value = true;
    ranchList.value[swiperIndex.value].status = 2;
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

const getRamadan2026PayRewardCycleLv4 = async (level, cycleLv4PendingRewardCount) => {
  if (cycleLv4PendingRewardCount === 0) return;
  try {
    const res = await postFormData("/h5doings/activity/eidAlAdha2026/pay", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      type: "2",
      lv: level > 4 ? 4 : level,
    });
    rewardList.value = res.data;
    getRewardShow.value = true;
    activityInfo.value.cycleLv4PendingRewardCount -= 1;
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取活动信息接口 （task info）
const getEidAlAdha2026List = async () => {
  console.log("getEidAlAdha2026List called");
  try {
    const res = await postFormData("/h5doings/activity/eidAlAdha2026/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      if (activityInfo.value.currentLevel !== undefined && activityInfo.value.currentLevel !== res.data.currentLevel) {
        next();
      }
      activityInfo.value = res.data;
      if (activityInfo.value.currentLevel === 4 && activityInfo.value.rewardStatusList[3]?.status !== 0) {
        activityInfo.value.currentLevel = 5;
      }
      taskVOList.value = res.data.taskVOList;
      propList.value = res.data.propList;
      ranchList.value.map((item, index) => {
        console.log(item, index, "index");
        item.currentFeedValue =
          activityInfo.value.currentLevel > item.level
            ? item.needValue
            : activityInfo.value.currentLevel === item.level
              ? activityInfo.value.currentFeedValue
              : 0;
        item.status = activityInfo.value.rewardStatusList[index]?.status || 0;
      });
      swiperIndex.value = activityInfo.value.currentLevel - 1;
      mySwiper.value.$el.swiper.slideTo(swiperIndex.value); // 手动更新Swiper[4][6]
      // await getFeedingRank(swiperIndex.value + 5);
      console.log(ranchList.value, "ranchList");
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取等级殿堂lv4循环奖励列表
const getFeedingHallRankReward = async (groupType) => {
  try {
    const res = await get("/h5doings/activity/eidAlAdha2026/rankRewards", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      groupType: groupType,
    });
    if (res && res.code === 200) {
      rewardLevel4List.value = Object.values(res.data)[0];
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取lv1-4 4+排行数据
const getFeedingRank = async (type) => {
  try {
    const res = await get("/h5doings/activity/eidAlAdha2026/rank", {
      uid: store.uid,
      type: type,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      lampFullUsers.value = res.data.list;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(async () => {
  await getEidAlAdha2026List();
  await getFeedingHallRankReward(28);
  closeTimeFn();
  // await getActivityRechargeRank();
  // await getRamadan2026rankRewards(0);
  // await getRamadan2026rankRewards(3);
  // await getRamadan2026rankRewards(10);
  // await getRamadan2026rankDrawInfo();
});
</script>

<style lang="scss" scoped>
.my-ranch {
  width: 100%;
  height: 1277px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  .ranch {
    width: 100%;
    height: 692px;
    background: url("@/assets/activity/eidAlAdha/myRanch/ranchBg.png") no-repeat center top;
    background-size: cover;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    .ranch-title {
      width: 144px;
      height: 36px;
      background: url("@/assets/activity/eidAlAdha/myRanch/ranchTitle.png") no-repeat center top;
      background-size: cover;
      margin: 16px auto;
      font-weight: bold;
      font-size: 18px;
      color: #f8fc98;
      line-height: 36px;
      text-align: center;
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
      text-stroke: 1px #723503;
      -webkit-text-stroke: 1px #723503;
    }
    .questions {
      position: absolute;
      top: 80px;
      left: 31px;
      width: 30px;
      height: 30px;
    }
    .hall-of-fame {
      margin: 16px auto 0;
      width: 156px;
      height: 54px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: url("@/assets/activity/eidAlAdha/myRanch/hallOfFameBg.png") no-repeat center center;
      background-size: cover;
      .left {
        width: 120px;
        height: 30px;
        .avatar-list {
          width: 100%;
          height: 30px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          box-sizing: border-box;
          margin-left: 12px;
          .avatar {
            width: 30px;
            height: 30px;
            background: #d8d8d8;
            border: 1px solid #f8e47b;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 6px;
            overflow: hidden;
            > img {
              width: 28px;
              height: 28px;
              border-radius: 50%;
            }
          }
        }
      }
      .right-icon {
        width: 20px;
        height: 20px;
      }
    }
    .ranch-content {
      width: 100%;
      height: 307px;
      position: relative;
      .left {
        position: absolute;
        left: 29px;
        top: 106px;
        width: 39px;
        height: 45px;
        background: url("@/assets/activity/eidAlAdha/myRanch/last.png") no-repeat center center;
        background-size: cover;
        z-index: 10;
      }
      .right {
        position: absolute;
        top: 106px;
        right: 29px;
        width: 39px;
        height: 45px;
        background: url("@/assets/activity/eidAlAdha/myRanch/next.png") no-repeat center center;
        background-size: cover;
        z-index: 10;
      }
      .ranch-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 250px;
        height: 250px;
        margin: 0 auto;
        position: relative;
        .tip-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 264px;
          min-height: 72px;
          background: rgba(179, 91, 1, 0.85);
          border-radius: 12px;
          border: 1px solid #ffd656;
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding: 16px 20px;
        }
        > img {
          width: 250px;
        }
      }
      .ranch-progress {
        width: 256px;
        height: 20px;
        background: #00491e;
        border-radius: 12px;
        border: 1px solid #f5a832;
        position: absolute;
        top: 266px;
        left: 52px;
        overflow: hidden;
        .ranch-percentage {
          position: absolute;
          top: 1px;
          left: 1px;
          width: 252px;
          height: 16px;
          border-radius: 12px;
          background: linear-gradient(180deg, #fef5a2 0%, #feab56 39.35%, #feab56 39.4%, #e3872d 62.72%, #f98f23 100%);
          .bar {
            width: 100%;
            height: 100%;
            border-radius: 12px;
            background: url("@/assets/activity/eidAlAdha/myRanch/progressbar.png") repeat center center;
            background-size: 12px 16px;
          }
        }
        .number {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
          font-size: 13px;
          color: #fffcaf;
          line-height: 18px;
          text-align: center;
          text-stroke: 1px #0a4225;
          -webkit-text-stroke: 1px #0a4225;
        }
      }
      .ranch-treasure-box-0 {
        position: absolute;
        top: 255px;
        right: 15px;
        width: 40px;
        height: 40px;
        background: url("@/assets/activity/eidAlAdha/myRanch/treasureBox0.png") repeat center center;
        background-size: cover;
      }
      .ranch-treasure-box-1 {
        position: absolute;
        top: 255px;
        right: 15px;
        width: 40px;
        height: 40px;
        background: url("@/assets/activity/eidAlAdha/myRanch/treasureBox1.png") repeat center center;
        background-size: cover;
        transform-origin: center center;
        animation: combo 1.5s ease-in-out infinite;
        > div {
          position: absolute;
          top: 0;
          right: 0;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          background: linear-gradient(180deg, #e7431e 0%, #e0350e 100%);
          border: 1px solid #fcc74b;
        }
      }
      @keyframes combo {
        0% {
          transform: rotate(-10deg);
        }
        50% {
          transform: rotate(10deg);
        }
        100% {
          transform: rotate(-10deg);
        }
      }
      .ranch-treasure-box-2 {
        position: absolute;
        top: 255px;
        right: 15px;
        width: 40px;
        height: 40px;
        background: url("@/assets/activity/eidAlAdha/myRanch/treasureBox2.png") repeat center center;
        background-size: cover;
        > div {
          position: absolute;
          top: -4px;
          right: -3px;
          width: 14px;
          height: 13px;
          background: url("@/assets/activity/eidAlAdha/myRanch/check.png") repeat center center;
          background-size: cover;
        }
      }

      .ranch-treasure-box-cycleLv4-0 {
        position: absolute;
        top: 255px;
        right: 15px;
        width: 40px;
        height: 40px;
        background: url("@/assets/activity/eidAlAdha/myRanch/treasureBox0.png") repeat center center;
        background-size: cover;
        > div {
          position: absolute;
          top: 0;
          right: 0;
          border-radius: 6px;
          width: 21px;
          height: 12px;
          background: linear-gradient(180deg, #e7431e 0%, #e0350e 100%);
          border-radius: 6px;
          border: 1px solid #fcc74b;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
          color: #fff754;
          line-height: 18px;
          filter: grayscale(100%);
        }
      }
      .ranch-treasure-box-cycleLv4-1 {
        position: absolute;
        top: 255px;
        right: 15px;
        width: 40px;
        height: 40px;
        background: url("@/assets/activity/eidAlAdha/myRanch/treasureBox1.png") repeat center center;
        background-size: cover;
        transform-origin: center center;
        animation: combo 1.5s ease-in-out infinite;
        > div {
          position: absolute;
          top: 0;
          right: 0;
          border-radius: 6px;
          width: 21px;
          height: 12px;
          background: linear-gradient(180deg, #e7431e 0%, #e0350e 100%);
          border-radius: 6px;
          border: 1px solid #fcc74b;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
          color: #fff754;
          line-height: 18px;
        }
      }
    }
    .my-points {
      min-width: 134px;
      max-width: 234px;
      height: 24px;
      background: #106840;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.17);
      font-weight: bold;
      font-size: 12px;
      color: #fffbae;
      line-height: 24px;
      text-align: center;
      margin: 0 auto 16px;
    }
    .prop-list {
      width: 100%;
      height: 162px;
      box-sizing: border-box;
      padding: 0 21px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .prop-item {
        width: 79px;
        height: 162px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .food {
          width: 79px;
          height: 71px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .prop-icon {
            width: 60px;
            height: 62px;
            flex-shrink: 0;
          }
          .prop-count {
            width: 78px;
            height: 20px;
            flex-shrink: 0;
            background: url("@/assets/activity/eidAlAdha/myRanch/textBg.png") no-repeat center center;
            background-size: cover;
            font-size: 11px;
            color: #ffe747;
            line-height: 20px;
            text-align: center;
            margin-top: -11px;
          }
        }
        .feed {
          margin-top: 13px;
          .feed-btn {
            width: 79px;
            height: 34px;
            box-sizing: border-box;
            padding: 3px 5px 7px 5px;
            font-weight: bold;
            font-size: 12px;
            color: #fcffae;
            line-height: 12px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            &:nth-child(1) {
              margin-bottom: 11px;
            }
          }
          .feed-btn0 {
            background: url("@/assets/activity/eidAlAdha/myRanch/level1Bg.png") no-repeat center center;
            background-size: cover;
            text-stroke: 1px #004c59;
            -webkit-text-stroke: 1px #004c59;
          }
          .feed-btn1 {
            background: url("@/assets/activity/eidAlAdha/myRanch/level2Bg.png") no-repeat center center;
            background-size: cover;
            text-stroke: 1px #1c4501;
            -webkit-text-stroke: 1px #1c4501;
          }
          .feed-btn2 {
            background: url("@/assets/activity/eidAlAdha/myRanch/level3Bg.png") no-repeat center center;
            background-size: cover;
            text-stroke: 1px #5c4500;
            -webkit-text-stroke: 1px #5c4500;
          }
          .feed-btn3 {
            background: url("@/assets/activity/eidAlAdha/myRanch/level4Bg.png") no-repeat center center;
            background-size: cover;
            text-stroke: 1px #781205;
            -webkit-text-stroke: 1px #781205;
          }
        }
      }
    }
  }

  .task {
    width: 100%;
    height: 525px;
    background: url("@/assets/activity/eidAlAdha/myRanch/taskBg.png") no-repeat center top;
    background-size: cover;
    .task-title {
      width: 181px;
      height: 16px;
      margin: 32px auto 44px;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: bold;
      font-size: 16px;
      color: #f8fc98;
      line-height: 16px;
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
      text-align: center;
    }
    .task-countDown {
      width: 100%;
      height: 20px;
      font-weight: bold;
      font-size: 14px;
      color: #6cca63;
      line-height: 20px;
      text-align: center;
      margin-bottom: 19px;
      display: flex;
      justify-content: center;
      align-items: center;
      .time {
        font-weight: bold;
        font-size: 14px;
        color: #6cca63;
        line-height: 20px;
      }
    }
    .task-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .task-item {
        width: 341px;
        height: 72px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: url("@/assets/activity/eidAlAdha/myRanch/taskItemBg1.png") no-repeat center center;
        background-size: cover;
        box-sizing: border-box;
        padding: 14px 20px 18px 34px;
        .task-desc {
          width: 220px;
          height: 40px;
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          text-align: left;
          ::v-deep(.yellow) {
            color: #ffe043;
          }
        }
        .task-progress {
          width: 50px;
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          text-align: right;
          margin-left: 4px;
        }
      }
      .task-item1 {
        width: 341px;
        height: 96px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: url("@/assets/activity/eidAlAdha/myRanch/taskItemBg2.png") no-repeat center center;
        background-size: cover;
        box-sizing: border-box;
        padding: 16px 20px 20px 34px;
      }
    }
  }
  .text-line-hide {
    white-space: nowrap; /* 强制文本不换行 */
    overflow: hidden; /* 隐藏溢出内容 */
    text-overflow: ellipsis; /* 显示省略号 */
  }
}
</style>
