<!-- 斋月祈福 -->
<template>
  <div class="blessing">
    <!-- 活动礼物 -->
    <div class="event-gift">
      <div class="title">
        <span>{{ $t("ramadan.eventGift") }}</span>
      </div>
      <div class="text">{{ $t("ramadan.pointConversionRate") }}</div>
      <div class="event-gift-list">
        <div class="item" v-for="(item, index) in eventGiftList">
          <div class="lucky" v-if="item.luckyGift">{{ $t("ramadan.lucky") }}</div>
          <img class="gift-img" :src="item.rewardUrl" alt="" />
        </div>
      </div>
    </div>

    <!-- 斋月祈福 -->
    <div class="prayers">
      <div class="title">
        <span>{{ $t("ramadan.ramadanPrayers") }}</span>
      </div>
      <div class="prayer-reward">
        <div class="text">{{ $t("ramadan.prayerReward") }}</div>
        <div class="list">
          <div class="item" v-for="(item, index) in prayerRewardList" :key="index">
            <img class="prayers-img" :src="item.rewardUrl" alt="" />
          </div>
        </div>
        <img
          class="right-icon"
          :class="{ 'left-icon': store.language === 'ar' }"
          src="@/assets/activity/ramadan/blessing/right.png"
          alt=""
          @click="prayerRewardShow = true"
        />
      </div>
      <!-- 弹幕 -->
      <div class="barrage">
        <vue-danmaku
          v-model:danmus="barrageInfo.barrageList"
          style="height: 362px"
          :speeds="72"
          :mirror="store.language === 'ar'"
          :debounce="1200"
          :channels="4"
          :loop="true"
          :randomChannel="true"
        >
          <template #danmu="{ index, danmu }">
            <div class="barrage-item" :class="{ 'barrage-item-ar': store.language === 'ar' }">
              <div class="avatar">
                <img :src="danmu.avatar" alt="" />
              </div>
              <div :class="'level' + danmu.level">
                <div>{{ store.language === "ar" ? danmu.ar : danmu.en }}</div>
                <img v-if="danmu.level === 10" src="@/assets/activity/ramadan/blessing/multiplex10.png" alt="" />
              </div>
            </div>
          </template>
        </vue-danmaku>
      </div>
      <div class="btn-record" @click="openRecord">{{ $t("ramadan.record") }}</div>
      <div class="btn">
        <div :class="[{ 'button-disabled': barrageInfo.pointBalance < 40000 }, 'time1']" @click="draw(1)">
          <span class="times">{{ $t("ramadan.time1") }}</span>
          <span class="number">{{ $t("ramadan.points", { number: 40000 }) }}</span>
        </div>
        <div :class="[{ 'button-disabled': barrageInfo.pointBalance < 400000 }, 'time10']" @click="draw(10)">
          <span class="times">{{ $t("ramadan.time10") }}</span>
          <span class="number">{{ $t("ramadan.points", { number: 400000 }) }}</span>
        </div>
      </div>
      <div class="my-points">{{ $t("ramadan.myPointsNumber", { number: barrageInfo.pointBalance }) }}</div>
    </div>

    <!-- 斋月祈福日排名 -->
    <div class="ranking">
      <div class="title">
        <span>{{ $t("ramadan.prayerDayRanking") }}</span>
      </div>
      <div class="btn-reward" @click="rankRewardShow = true">{{ $t("ramadan.reward") }}</div>
      <div class="top">
        <div class="top1" v-if="rankList.length > 0">
          <img class="avatar-img" :src="rankList.slice(0, 1)[0].avatar" alt="" />
          <div class="avatar"></div>
          <div class="name text-line-hide">{{ rankList.slice(0, 1)[0].nick }}</div>
          <div class="points text-line-hide">
            {{ $t("ramadan.points", { number: rankList.slice(0, 1)[0].integral }) }}
          </div>
        </div>
        <div class="top2" v-if="rankList.length > 1">
          <img class="avatar-img" :src="rankList.slice(1, 2)[0].avatar" alt="" />
          <div class="avatar"></div>
          <div class="name text-line-hide">{{ rankList.slice(1, 2)[0].nick }}</div>
          <div class="points text-line-hide">
            {{ $t("ramadan.points", { number: rankList.slice(1, 2)[0].integral }) }}
          </div>
        </div>
        <div class="top3" v-if="rankList.length > 2">
          <img class="avatar-img" :src="rankList.slice(2, 3)[0].avatar" alt="" />
          <div class="avatar"></div>
          <div class="name text-line-hide">{{ rankList.slice(2, 3)[0].nick }}</div>
          <div class="points text-line-hide">
            {{ $t("ramadan.points", { number: rankList.slice(2, 3)[0].integral }) }}
          </div>
        </div>
      </div>
      <div class="rank-list" v-if="rankList.length > 3">
        <div class="item" v-for="(item, index) in rankList.slice(3)" :key="index">
          <div class="sort">{{ item.index === 0 ? "99+" : item.index }}</div>
          <div class="avatar">
            <img class="avatar-img" :src="item.avatar" alt="" />
          </div>
          <div class="name text-line-hide" :class="{ 'name-left': store.language === 'ar' }">{{ item.nick }}</div>
          <div class="points text-line-hide" :class="{ 'points-left': store.language === 'ar' }">
            {{ $t("ramadan.points", { number: item.integral }) }}
          </div>
        </div>
      </div>
      <div class="my-rank">
        <div class="sort">{{ myInfo.index === 0 ? "99+" : myInfo.index }}</div>
        <div class="avatar">
          <img class="avatar-img" :src="myInfo.avatar" alt="" />
        </div>
        <div class="name text-line-hide" :class="{ 'name-left': store.language === 'ar' }">{{ myInfo.nick }}</div>
        <div class="points text-line-hide" :class="{ 'points-left': store.language === 'ar' }">
          {{ $t("ramadan.points", { number: myInfo.integral }) }}
        </div>
      </div>
    </div>
    <!-- 全部祈福奖励弹窗 -->
    <prayerReward v-model:isShow="prayerRewardShow" @close="prayerRewardShow = false" :list="prayerRewardList" />
    <!-- 祈福榜单奖励 -->
    <rankReward v-model:isShow="rankRewardShow" @close="rankRewardShow = false" :list="dayRankRewardList" />
    <!-- 积分不足提示弹窗 -->
    <tipToast v-model:isShow="tipShow" :content="$t('ramadan.tip')" @close="tipShow = false" />
    <!-- 抽奖记录暂无记录弹窗 -->
    <tipToast v-model:isShow="tipShow1" :content="$t('ramadan.tip1')" @close="tipShow1 = false" />
    <!-- 选择祈福文案1/10次弹窗 -->
    <prayerText
      v-model:isShow="prayerTextShow"
      @close="prayerTextShow = false"
      :type="prayerType"
      :key="new Date().getTime()"
      @confirm="prayerConfirm"
    />
    <!-- 祈福奖励弹窗 1次 -->
    <prayerReward1 v-model:isShow="prayerReward1Show" @close="prayerReward1Show = false" :list="prayerRewardList1" />
    <!-- 祈福奖励弹窗 10次 -->
    <prayerReward10
      v-model:isShow="prayerReward10Show"
      @close="prayerReward10Show = false"
      :list="prayerRewardList10"
    />
    <!-- 祈福记录 -->
    <record v-model:isShow="recordShow" @close="recordShow = false" :list="barrageInfo.drawHistory" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import vueDanmaku from "vue-danmaku";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import img from "@/assets/activity/ramadan/reward.png";
// 积分不足提示弹窗
import tipToast from "@/views/activity/ramadan/components/tipToast.vue";
// 全部祈福奖励弹窗
import prayerReward from "@/views/activity/ramadan/components/prayerReward.vue";
// 祈福1次弹窗
import prayerReward1 from "@/views/activity/ramadan/components/prayerReward1.vue";
// 祈福10次弹窗
import prayerReward10 from "@/views/activity/ramadan/components/prayerReward10.vue";
// 选择祈福文案1次或者10次
import prayerText from "@/views/activity/ramadan/components/prayerText.vue";
// 祈福记录
import record from "@/views/activity/ramadan/components/record.vue";
// 祈福榜单奖励
import rankReward from "@/views/activity/ramadan/components/rankReward.vue";
import { Barrage } from "vant";
// 定义emit
const emit = defineEmits(["timeChange"]);

const { t } = useI18n();
const store = useMainStore();
const rankList = ref([]);
const myInfo = ref({});
const barrageInfo = ref({
  barrageList: [],
  barrageTextsAr: [],
  barrageTextsEn: [],
  drawHistory: [],
  pointBalance: 0,
  uid: null,
});
const prayerType = ref(1);
const eventGiftList = ref([]);
const prayerRewardList = ref([]);
const dayRankRewardList = ref([]);
const prayerRewardList1 = ref([]);
const prayerRewardList10 = ref([]);
const tipShow = ref(false);
const tipShow1 = ref(false);
const prayerRewardShow = ref(false);
const prayerReward1Show = ref(false);
const prayerReward10Show = ref(false);
const prayerTextShow = ref(false);
const recordShow = ref(false);
const rankRewardShow = ref(false);
const toDayString = ref("");
// 祈福1/10次
const draw = (num) => {
  let drawNumber = num === 1 ? 40000 : 400000;
  if (barrageInfo.value.pointBalance < drawNumber) {
    tipShow.value = true;
  }
  if (barrageInfo.value.pointBalance >= drawNumber) {
    prayerType.value = num;
    prayerTextShow.value = true;
  }
};

// 选择祈福文案弹窗确认
const prayerConfirm = (e) => {
  let type = prayerType.value === 1 ? 3 : 4;
  prayerTextShow.value = false;
  getRamadan2026Pay(type, e);
};

const openRecord = () => {
  if (barrageInfo.value.drawHistory.length > 0) {
    // 有历史记录
    recordShow.value = true;
  } else {
    // 没有历史记录 弹窗提示
    tipShow1.value = true;
  }
  // 没有历史记录
};

// 祈福1/10次接口
const getRamadan2026Pay = async (type, index) => {
  try {
    const res = await postFormData("/h5doings/activity/ramadan2026/pay", {
      uid: store.uid,
      ticket: store.ticket,
      type: type,
      index: index,
      language: store.language,
    });

    if (res && res.code === 200) {
      if (prayerType.value === 1) {
        prayerRewardList1.value = res.data;
        prayerRewardList1.value = prayerRewardList1.value.map((item) => {
          const arr = prayerRewardList.value.find((items) => items.rewardRefId === item.giftId) || {};
          return {
            ...item,
            ...arr,
          };
        });
        prayerReward1Show.value = true;
      }
      if (prayerType.value === 10) {
        prayerRewardList10.value = res.data;
        prayerRewardList10.value = prayerRewardList10.value.map((item) => {
          const arr = prayerRewardList.value.find((items) => items.rewardRefId === item.giftId) || {};
          return {
            ...item,
            ...arr,
          };
        });
        prayerReward10Show.value = true;
      }
      getActivityRechargeRank();
      getRamadan2026rankDrawInfo();
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取祈福日榜
const getActivityRechargeRank = async () => {
  try {
    const res = await get("/h5doings/activity/ramadan2026/rank", {
      uid: store.uid,
      size: 100,
      type: 1,
      sub: false,
      str: toDayString.value,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      rankList.value = res.data.list || [];
      myInfo.value = res.data.self || {};
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取活动礼物 0活动礼物 3祈祷日榜奖励 10抽奖池物料
const getRamadan2026rankRewards = async (groupType) => {
  try {
    const res = await get("/h5doings/activity/ramadan2026/rankRewards", {
      uid: store.uid,
      groupType: groupType,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      const obj = res.data;
      const values = Object.values(obj);
      if (groupType === 0) {
        values.forEach((item) => {
          item.forEach((items) => {
            eventGiftList.value.push(items);
          });
        });
      }
      if (groupType === 3) {
        dayRankRewardList.value = values;
      }
      if (groupType === 10) {
        values.forEach((item) => {
          item.forEach((items) => {
            prayerRewardList.value.push(items);
          });
        });
        console.log(prayerRewardList.value, "prayerRewardList.value");
      }
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取抽奖信息
const getRamadan2026rankDrawInfo = async (groupType) => {
  try {
    const res = await get("/h5doings/activity/ramadan2026/draw/info", {
      uid: store.uid,
      ticket: store.ticket,
      recordSize: 100,
      barrageSize: 100,
      language: store.language,
    });
    if (res && res.code === 200) {
      barrageInfo.value = res.data;
      barrageInfo.value.drawHistory = barrageInfo.value.drawHistory.map((item) => {
        const arr = prayerRewardList.value.find((items) => items.rewardRefId === item.giftId) || {};
        return {
          ...item,
          ...arr,
        };
      });
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取日期
const getActivityRamadan2026List = async () => {
  try {
    const res = await postFormData("/h5doings/activity/ramadan2026/list", {
      uid: store.uid,
      size: 20,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      const data = res.data.signModule.signList.find((item) => item.index === res.data.signModule.todayIndex);
      toDayString.value = data.date;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(async () => {
  await getActivityRamadan2026List();
  await getActivityRechargeRank();
  await getRamadan2026rankRewards(0);
  await getRamadan2026rankRewards(3);
  await getRamadan2026rankRewards(10);
  await getRamadan2026rankDrawInfo();
});
</script>

<style lang="scss" scoped>
.blessing {
  width: 100%;
  height: 2090px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  .event-gift {
    width: 100%;
    height: 347px;
    box-sizing: border-box;
    padding-top: 40px;
    background: url("@/assets/activity/ramadan/blessing/bg_event_gift.png") no-repeat bottom center;
    background-size: 375px 307px;
    .text {
      width: 298px;
      height: 100px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #fff099;
      line-height: 20px;
      text-align: center;
      margin: 5px auto 20px;
    }
    .event-gift-list {
      width: 332px;
      height: 79px;
      box-sizing: border-box;
      padding-top: 11px;
      margin: 0 16px 0 27px;
      overflow-x: auto;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .item {
        width: 68px;
        height: 68px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        position: relative;
        background: url("@/assets/activity/ramadan/blessing/event_gift.png") no-repeat bottom center;
        background-size: cover;
        margin-right: 12px;
        flex-shrink: 0;
        .lucky {
          position: absolute;
          top: -11px;
          left: 50%;
          transform: translateX(-50%);
          width: 54px;
          height: 17px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 12px;
          color: #594100;
          line-height: 17px;
          background: url("@/assets/activity/ramadan/blessing/lucky.png") no-repeat bottom center;
          background-size: cover;
        }
        .gift-img {
          width: 50px;
          height: 50px;
        }
      }
    }
  }
  .prayers {
    width: 100%;
    height: 648px;
    margin-top: 16px;
    margin-bottom: 15px;
    box-sizing: border-box;
    padding-top: 40px;
    background: url("@/assets/activity/ramadan/blessing/bg_prayers.png") no-repeat bottom center;
    background-size: 375px 608px;
    position: relative;
    .prayer-reward {
      width: 259px;
      height: 59px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: url("@/assets/activity/ramadan/blessing/prayer_reward.png") no-repeat bottom center;
      background-size: cover;
      box-sizing: border-box;
      padding: 12px 11px 12px 17px;
      .text {
        width: 42px;
        min-height: 28px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-size: 12px;
        color: #ffec70;
        line-height: 14px;
        text-align: center;
        margin-right: 12px;
      }
      .list {
        width: 152px;
        margin-right: 5px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow-x: auto;
        .item {
          width: 35px;
          height: 35px;
          margin-right: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          background: url("@/assets/activity/ramadan/blessing/prayer_reward_item.png") no-repeat bottom center;
          background-size: cover;
          .prayers-img {
            width: 28px;
            height: 28px;
          }
        }
      }
      .right-icon {
        width: 20px;
        height: 20px;
      }
      .left-icon {
        width: 20px;
        height: 20px;
        transform: rotate(180deg);
      }
    }
    .barrage {
      width: 100%;
      height: 362px;
      // border: 1px solid red;
      box-sizing: border-box;
      .barrage-item {
        width: 286px;
        height: 64px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        .avatar {
          position: absolute;
          left: 0;
          top: 13px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
          > img {
            width: 38px;
            height: 38px;
          }
        }
        .level1,
        .level10 {
          position: absolute;
          left: 24px;
          top: 17px;
          width: 282px;
          height: 30px;
          background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
          z-index: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          box-sizing: border-box;
          padding-left: 25px;
          > div {
            height: 20px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 14px;
            color: #fdffbb;
            line-height: 20px;
            text-align: left;
            text-shadow:
              1px 1px 0px #704a0d,
              -1px -1px 0px #704a0d,
              -1px 1px 0px #704a0d,
              1px -1px 0px #704a0d;
          }
          > img {
            width: 38px;
            height: 24px;
            position: absolute;
            right: 3px;
            top: 3px;
          }
        }
        .level10 {
          background: linear-gradient(90deg, #ffc700 0%, rgba(255, 199, 0, 0) 100%);
          > div {
            color: #563705;
            text-shadow:
              1px 1px 0px #fff790,
              -1px -1px 0px #fff790,
              -1px 1px 0px #fff790,
              1px -1px 0px #fff790;
          }
        }
      }
      .barrage-item-ar {
        // flex-direction: row-reverse;
        .avatar {
          left: unset;
          right: 0;
        }
        .level1,
        .level10 {
          left: unset;
          right: 24px;
          padding-left: unset;
          padding-right: 25px;
          background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
          > img {
            right: unset;
            left: 3px;
          }
        }
        .level10 {
          background: linear-gradient(270deg, #ffc700 0%, rgba(255, 199, 0, 0) 100%);
        }
      }
    }
    .btn-record {
      position: absolute;
      top: 460px;
      right: 17px;
      width: 66px;
      height: 30px;
      background: url("@/assets/activity/ramadan/blessing/reward.png") no-repeat bottom center;
      background-size: cover;
      z-index: 9;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: bold;
      font-size: 12px;
      color: #412702;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: 12px;
      padding-bottom: 4px;
    }
    .btn {
      margin-top: 33px;
      width: 100%;
      height: 52px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 0 43px 0 39px;
      .time1,
      .time10 {
        width: 138px;
        height: 52px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }
      .time1 {
        margin-right: 15px;
        background: url("@/assets/activity/ramadan/blessing/multiple1.png") no-repeat bottom center;
        background-size: cover;
        > span {
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 12px;
          line-height: 17px;
          text-align: left;
          color: #ffffff;
          text-shadow:
            1px 1px 0px #013666,
            -1px -1px 0px #013666,
            -1px 1px 0px #013666,
            1px -1px 0px #013666;
          &:nth-child(1) {
            margin-top: 8px;
          }
          &:nth-child(2) {
            margin-top: -2px;
          }
        }
      }
      .time10 {
        background: url("@/assets/activity/ramadan/blessing/multiple10.png") no-repeat bottom center;
        background-size: cover;
        > span {
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 12px;
          line-height: 17px;
          text-align: left;
          color: #ffe640;
          text-shadow:
            1px 1px 0px #572d00,
            -1px -1px 0px #572d00,
            -1px 1px 0px #572d00,
            1px -1px 0px #572d00;
          &:nth-child(1) {
            margin-top: 8px;
          }
          &:nth-child(2) {
            margin-top: -2px;
          }
        }
      }
    }
    .my-points {
      min-width: 108px;
      height: 18px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 500;
      font-size: 12px;
      color: #fff099;
      line-height: 18px;
      text-align: center;
      font-style: normal;
    }
  }
  .ranking {
    width: 100%;
    height: 998px;
    box-sizing: border-box;
    padding-top: 40px;
    background: url("@/assets/activity/ramadan/blessing/bg_rank.png") no-repeat bottom center;
    background-size: 375px 958px;
    position: relative;
    .btn-reward {
      position: absolute;
      top: 124px;
      right: 12px;
      width: 59px;
      height: 27px;
      background: url("@/assets/activity/ramadan/blessing/reward.png") no-repeat bottom center;
      background-size: cover;
      z-index: 9;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: bold;
      font-size: 12px;
      color: #412702;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: 12px;
      padding-bottom: 4px;
    }
    .top {
      width: 100%;
      height: 362px;
      position: relative;
      .top1 {
        width: 220px;
        height: 173px;
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        .avatar-img {
          position: absolute;
          top: 49px;
          left: 50%;
          border-radius: 50%;
          z-index: 1;
          transform: translateX(-50%);
          width: 60px;
          height: 60px;
        }
        .avatar {
          width: 220px;
          height: 158px;
          background: url("@/assets/activity/ramadan/blessing/top1.png") no-repeat center center;
          background-size: cover;
          position: absolute;
          z-index: 2;
          border-radius: 50%;
          overflow: hidden;
        }
        .name {
          position: absolute;
          top: 127px;
          left: 50%;
          transform: translateX(-50%);
          width: 220px;
          height: 20px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          text-align: center;
        }
        .points {
          position: absolute;
          top: 149px;
          left: 50%;
          transform: translateX(-50%);
          min-width: 107px;
          height: 24px;
          background: linear-gradient(180deg, #ba863d 0%, #f9e58d 100%);
          border-radius: 13px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: bold;
          font-size: 12px;
          color: #470110;
          line-height: 18px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .top2,
      .top3 {
        position: absolute;
        width: 148px;
        height: 152px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .avatar-img {
          position: absolute;
          top: 29px;
          left: 50%;
          border-radius: 50%;
          z-index: 1;
          transform: translateX(-50%);
          width: 54px;
          height: 54px;
        }
        .avatar {
          width: 148px;
          height: 114px;
          background: url("@/assets/activity/ramadan/blessing/top2.png") no-repeat center center;
          background-size: cover;
          position: absolute;
          z-index: 2;
          border-radius: 50%;
          overflow: hidden;
        }
        .name {
          position: absolute;
          top: 106px;
          left: 50%;
          transform: translateX(-50%);
          width: 148px;
          height: 20px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          text-align: center;
        }
        .points {
          position: absolute;
          top: 128px;
          min-width: 107px;
          height: 24px;
          background: linear-gradient(180deg, #ba863d 0%, #f9e58d 100%);
          border-radius: 13px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: bold;
          font-size: 12px;
          color: #470110;
          line-height: 18px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .top2 {
        position: absolute;
        top: 194px;
        left: 25px;
      }

      .top3 {
        position: absolute;
        top: 194px;
        right: 25px;
        .avatar {
          background: url("@/assets/activity/ramadan/blessing/top3.png") no-repeat center center;
          background-size: cover;
        }
      }
    }
    .rank-list {
      width: 331px;
      height: 453px;
      overflow-y: auto;
      overflow-x: hidden;
      .item {
        width: 331px;
        height: 70px;
        background: url("@/assets/activity/ramadan/blessing/bg_rank_item.png") no-repeat bottom center;
        background-size: cover;
        margin-top: -5px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &:last-child {
          margin-bottom: 35px;
        }
        .sort {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(180deg, #e9eaa7 0%, #74b117 100%);
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.23);
          margin: 0 12px 0 14px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 12px;
          color: #386302;
          line-height: 12px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border: 1px solid #eff4a9;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          .avatar-img {
            width: 36px;
          }
        }
        .name {
          margin-left: 7px;
          width: 97px;
          height: 17px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 12px;
          text-align: left;
          color: #f0fb5d;
          line-height: 17px;
        }
        .name-left {
          text-align: right;
          margin-left: 0px;
          margin-right: 7px;
        }
        .points {
          margin-right: 14px;
          width: 135px;
          text-align: right;
          height: 17px;
          color: #a4ea93;
          line-height: 17px;
          text-shadow:
            1px 1px 0px #004b2c,
            -1px -1px 0px #004b2c,
            -1px 1px 0px #004b2c,
            1px -1px 0px #004b2c;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 12px;
        }
        .points-left {
          text-align: left;
          padding-left: 20px;
        }
      }
    }
    .my-rank {
      position: absolute;
      top: 871px;
      left: 50%;
      transform: translateX(-50%);
      width: 341px;
      height: 72px;
      background: url("@/assets/activity/ramadan/blessing/my.png") no-repeat bottom center;
      background-size: cover;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .sort {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(180deg, #e9eaa7 0%, #f0fb5d 100%);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.23);
        margin: 0 11px 0 15px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 12px;
        color: #634802;
        line-height: 12px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .avatar {
        width: 36px;
        height: 36px;
        border: 1px solid #eff4a9;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        .avatar-img {
          width: 36px;
        }
      }
      .name {
        margin-left: 7px;
        width: 97px;
        height: 17px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 12px;
        text-align: left;
        color: #f0fb5d;
        line-height: 17px;
      }
      .name-left {
        text-align: right;
        margin-left: 0px;
        margin-right: 7px;
      }
      .points {
        margin-right: 14px;
        width: 135px;
        text-align: right;
        height: 17px;
        color: #f0fb5d;
        line-height: 17px;
        text-shadow:
          1px 1px 0px #613c01,
          -1px -1px 0px #613c01,
          -1px 1px 0px #613c01,
          1px -1px 0px #613c01;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 12px;
      }
      .points-left {
        text-align: left;
        padding-left: 20px;
      }
    }
  }

  // 标题
  .event-gift,
  .prayers,
  .ranking {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    > .title {
      width: 100%;
      height: 94px;
      margin-top: -40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/ramadan/sign_reward_title.png") no-repeat bottom center;
      background-size: cover;
      > span {
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 600;
        font-size: 16px;
        color: #ffe638;
        line-height: 22px;
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
        text-align: center;
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
