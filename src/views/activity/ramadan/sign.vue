<!-- 斋月签到 -->
<template>
  <div class="sign">
    <!-- 钻石奖池 -->
    <div class="pool">
      <div class="title">
        <span>{{ $t("ramadan.diamondPool") }}</span>
      </div>
      <div class="text">{{ $t("ramadan.shareConditionDays") }}</div>
      <div class="number" :data-text="signModule.poolTotalGold">{{ signModule.poolTotalGold }}</div>
      <div class="tip">{{ $t("ramadan.initialPoolAmount") }}</div>
      <div class="info">
        <div class="avatar">
          <img :src="signModule.avatar" alt="" />
        </div>
        <div class="name">{{ signModule.nick }}</div>
        <div
          :class="[
            { 'breathing-button': !signModule.todaySigned, 'btn-signed': signModule.todaySigned },
            'btn-sign-in',
          ]"
          @click="signButton"
        >
          {{ !signModule.todaySigned ? $t("ramadan.signIn") : $t("ramadan.signedInToday") }}
        </div>
      </div>
    </div>
    <!-- 累计签到奖励 -->
    <div class="rewards">
      <div class="title">
        <span>{{ $t("ramadan.cumulativeRewards") }}</span>
      </div>
      <div class="text">
        {{ $t("ramadan.progressStatus", { number1: signModule.totalSignDays, number2: signModule.needDaysTo25 }) }}
      </div>
      <div class="sign-in-days">
        {{ $t("ramadan.totalSignInDays", { day: signModule.totalSignDays }) }}
      </div>
      <div class="list">
        <!-- 状态：0不可领取 1未领取 2已领取 -->
        <div class="item" :data-date="item.day" v-for="(item, index) in signModule.rewardStatusList" :key="index">
          <div class="content">
            <div class="day">{{ $t("ramadan.dayReward", { x: item.day }) }}</div>
            <div class="is-check" v-if="item.status === 2">
              <img src="@/assets/activity/ramadan/received_icon.png" alt="" />
            </div>
            <div class="reward-img">
              <img :src="item.rewardUrl" alt="" />
            </div>
            <sanaAutoText class="reward-name" :key="new Date().getTime()">
              {{ `${item.rewardName}*${item.rewardNum}` }}
            </sanaAutoText>
          </div>
          <div
            :class="[
              { status3: item.status === 0 },
              { status2: item.status === 1 },
              { status1: item.status === 2 },
              'btn-received',
            ]"
            @click="addUpSign(item)"
          >
            {{ $t("ramadan.received") }}
          </div>
        </div>
      </div>
    </div>
    <!-- 签到日历 -->
    <div class="calendar">
      <div class="calendar-rule" @click="reSignRuleShow = true">{{ $t("ramadan.reSignRules") }}</div>
      <div class="title">
        <span>{{ $t("ramadan.calendar") }}</span>
      </div>
      <div class="list">
        <div
          class="item"
          @click="calendarSgin(item)"
          :class="'item' + item.status"
          v-for="(item, index) in signModule.signList"
          :key="index"
        >
          <div class="date">{{ item.index }}</div>
          <img class="reward" src="@/assets/activity/ramadan/sign_gift.png" alt="" />
          <img class="is-check" v-if="item.signed" src="@/assets/activity/ramadan/received_icon.png" alt="" />
          <div class="re-sign" v-if="item.canFill">{{ $t("ramadan.makeUpSignIn") }}</div>
          <div class="sun ani-rotate" v-if="item.status === 1 || item.status === 2"></div>
        </div>
      </div>
    </div>
    <!-- 补签规则 -->
    <reSignRuleToast v-model:isShow="reSignRuleShow" @close="reSignRuleShow = false" />
    <!-- 累计签到奖励 -->
    <signRewardToast
      v-model:isShow="signRewardShow"
      @close="signRewardShow = false"
      :list="signRewardList"
      :title="$t('ramadan.reSignRewardTitle')"
    />
    <!-- 补签确认弹窗 -->
    <backSignatureConfirm
      :canFillIndex="canFillIndex"
      v-model:isShow="backSignatureConfirmShow"
      @close="backSignatureConfirmShow = false"
      @confirm="backSignConfirm"
    />
    <!-- 补签成功弹窗 -->
    <backSignatureSuccess
      :canFillIndex="canFillIndex"
      v-model:isShow="backSignatureSuccessShow"
      @close="backSignatureSuccessShow = false"
    />
    <!-- 补签失败弹窗 -->
    <backSignatureRecharge
      v-model:isShow="backSignatureRechargeShow"
      @close="backSignatureRechargeShow = false"
      @confirm="confirmRecharge"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import img from "@/assets/activity/ramadan/reward.png";
// 补签规则弹窗
import reSignRuleToast from "@/views/activity/ramadan/components/reSignRuleToast.vue";
// 累计签到奖励弹窗
import signRewardToast from "@/views/activity/ramadan/components/signRewardToast.vue";
// 补签确认弹窗
import backSignatureConfirm from "@/views/activity/ramadan/components/backSignatureConfirm.vue";
// 补签成功弹窗
import backSignatureSuccess from "@/views/activity/ramadan/components/backSignatureSuccess.vue";
// 补签失败弹窗
import backSignatureRecharge from "@/views/activity/ramadan/components/backSignatureRecharge.vue";
// 定义emit
const emit = defineEmits(["timeChange"]);

const { t } = useI18n();
const store = useMainStore();
const signList = ref([]);
const curTab = ref(1);
const signRewardOriginList = ref([]);
const signRewardList = ref([]);
// 记录补签索引
const canFillIndex = ref(null);
const scrollToDayId = ref(null);
const signModule = ref({});
const reSignRuleShow = ref(false);
const signRewardShow = ref(false);
const backSignatureConfirmShow = ref(false);
const backSignatureSuccessShow = ref(false);
const backSignatureRechargeShow = ref(false);

// 累计签到奖励滚动到指定天数
const scrollToDay = () => {
  clearTimeout(scrollToDayId.value);
  scrollToDayId.value = null;
  scrollToDayId.value = setTimeout(() => {
    const dayOrigin = signModule.value.totalSignDays;
    if (dayOrigin <= signModule.value.rewardStatusList[0].day) {
      return false;
    }
    const day = findFirstValidReward(signModule.value.rewardStatusList, dayOrigin);
    const container = document.querySelector(".list");
    const targetElement = document.querySelector(`[data-date="${day}"]`);
    if (container && targetElement) {
      // 3. 计算滚动位置（居中显示）
      const containerWidth = container.clientWidth;
      const targetWidth = targetElement.offsetWidth;
      const targetLeft = targetElement.offsetLeft;

      // 公式：元素左侧位置 - (容器宽度/2 - 元素宽度/2)
      const scrollLeft = targetLeft - (containerWidth / 2 - targetWidth / 2) + targetWidth;
      // 4. 触发滚动
      container.scrollTo({
        left: scrollLeft - 3,
        behavior: "smooth",
      });
    }
  }, 1000);
};

function findFirstValidReward(rewards, targetDay) {
  let left = 0,
    right = rewards.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (rewards[mid].day <= targetDay) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  if (right >= 0) {
    const nextIndex = right + 1;
    if (rewards[right].day <= targetDay && (nextIndex >= rewards.length || rewards[nextIndex].day > targetDay)) {
      return rewards[right].day;
    }
  }
  return 30; // 未找到
}

// 获取活动数据
const getActivityRamadan2026List = async () => {
  try {
    const res = await postFormData("/h5doings/activity/ramadan2026/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      console.log(res, "res");
      // rewardStatusList.value = res.data.signModule.rewardStatusList;
      signModule.value = res.data.signModule;
      signList.value = res.data.signModule.signList;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

const getRamadan2026RankRewards = async () => {
  try {
    const res = await get("/h5doings/activity/ramadan2026/rankRewards", {
      uid: store.uid,
      groupType: 1,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      const obj = res.data;
      const values = Object.values(obj);
      values.forEach((item) => {
        signRewardOriginList.value.push(...item);
      });
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 签到&补签
const getRamadan2026Pay = async (type, index, flag = false) => {
  try {
    const res = await postFormData("/h5doings/activity/ramadan2026/pay", {
      uid: store.uid,
      type: type,
      index: index,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 2103) {
      // 提示充值
      backSignatureRechargeShow.value = true;
    }
    if (res && res.code === 200) {
      console.log(res, "res");
      // 补签的成功的弹窗
      if (type === 1 && flag) {
        backSignatureSuccessShow.value = true;
      } else if (type === 1 && !flag) {
        // 正常签到成功的弹窗
        // 签到成功，奖励已发放！
        showToast(t("ramadan.signSuccess"));
      }
      if (type === 2) {
        signRewardList.value = res.data.map((item) => {
          const arr = signRewardOriginList.value.find((items) => items.rewardRefId === item.giftId) || {};
          console.log(arr, "arr");
          return {
            ...item,
            ...arr,
          };
        });
        console.log(signRewardList.value, "signRewardList");
        signRewardShow.value = true;
      }
      getActivityRamadan2026List();
      getRamadan2026RankRewards();
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 日历上点击签到
const calendarSgin = (item) => {
  console.log(item, item.index, "点击日历上的签到");
  // 点击未到签到的天数  点击已签到的天数 点击不可补签的天数
  if (item.status === 0 || item.status === 2 || item.status === 4) {
    return;
  }
  // 点击今天签到的天数
  if (item.status === 1) {
    getRamadan2026Pay(1, item.index);
    return;
  }
  // 点击可以补签的天数
  if (item.status === 3) {
    // 弹出补签弹窗
    canFillIndex.value = item.index;
    backSignatureConfirmShow.value = true;
  }
};

// 补签弹窗点击确认
const backSignConfirm = () => {
  backSignatureConfirmShow.value = false;
  getRamadan2026Pay(1, canFillIndex.value, true);
};

// 点击签到按钮签到
const signButton = () => {
  if (signModule.todaySigned) return;
  getRamadan2026Pay(1, signModule.value.todayIndex);
};

// 点击累计签到
const addUpSign = (item) => {
  if (item.status !== 1) return;
  getRamadan2026Pay(2);
};

// 点击确认充值
const confirmRecharge = () => {
  backSignatureRechargeShow.value = false;
  getRechargePage();
};

// 去充值
const getRechargePage = () => {
  if (store.platform == "ios") {
    WKWebViewJavascriptBridge.callHandler("goto", { page: "1" });
  } else if (store.platform == "android") {
    console.log("jsBridge- to -andriod");
    WebViewJavascriptBridge.goto("{'page':'1','uid':''}", null);
  } else {
    console.log("充值");
  }
};

onMounted(async () => {
  getActivityRamadan2026List();
  getRamadan2026RankRewards();
  await scrollToDay();
});

onUnmounted(() => {
  clearTimeout(scrollToDayId.value);
  scrollToDayId.value = null;
});
</script>

<style lang="scss" scoped>
.sign {
  width: 100%;
  height: 1742px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .pool {
    width: 100%;
    height: 579px;
    background: url("@/assets/activity/ramadan/bg_sign.png") no-repeat top center;
    background-size: cover;
    .title {
      width: 229px;
      height: 58px;
      margin-top: 143px;
      background: url("@/assets/activity/ramadan/bg_sign_title.png") no-repeat top center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        background: linear-gradient(180deg, #ffe748 0%, #fff6bd 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
      }
    }
    .text {
      width: 235px;
      height: 54px;
      background: linear-gradient(180deg, #00461f 0%, #006729 100%);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
      border-radius: 13px;
      border: 1px solid #65b050;
      margin: 10px auto 20px;
      box-sizing: border-box;
      padding: 7px 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family:
        PingFangSC,
        PingFang SC;
      font-size: 14px;
      color: #ffef74;
      line-height: 20px;
      text-align: center;
      font-style: normal;
    }
    .number {
      width: 100%;
      text-align: center;
      height: 68px;
      font-family: D-DIN, D-DIN;
      font-weight: bold;
      font-size: 68px;
      line-height: 74px;
      position: relative;
      margin-bottom: 14px;
      &::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        background: linear-gradient(180deg, #fcff8c 0%, #fbf524 46%, #fda70c 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        z-index: 2;
      }
      &::after {
        content: attr(data-text);
        position: absolute;
        z-index: 1;
        top: 3px;
        left: 50%;
        transform: translateX(-50%);
        color: transparent;
        text-shadow: 0px 2px 0px #452a00;
      }
    }
    .tip {
      width: 298px;
      height: 133px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #fff099;
      line-height: 20px;
      text-align: center;
      font-style: normal;
    }
    .info {
      width: 100%;
      height: 52px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      box-sizing: border-box;
      padding: 0 26px 0 40px;
      .avatar {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        overflow: hidden;
        > img {
          width: 46px;
          height: auto;
        }
      }
      .name {
        width: 106px;
        margin: 0 5px 0 14px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-size: 14px;
        color: #fff099;
        line-height: 20px;
        text-align: left;
      }
      .btn-sign-in {
        width: 138px;
        height: 52px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url("@/assets/activity/ramadan/btn_sign.png") no-repeat top center;
        background-size: cover;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #ffe640;
        line-height: 20px;
        text-shadow:
          1px 1px 0px #572d00,
          -1px -1px 0px #572d00,
          -1px 1px 0px #572d00,
          1px -1px 0px #572d00;
      }
      .btn-signed {
        filter: grayscale(100%);
      }
    }
  }
  .rewards {
    width: 100%;
    height: 454px;
    margin-top: 17px;
    margin-bottom: 13px;
    box-sizing: border-box;
    padding-top: 40px;
    background: url("@/assets/activity/ramadan/bg_sign_rewards.png") no-repeat bottom center;
    background-size: 100% 414px;
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
      font-style: normal;
      margin: 5px auto 20px;
    }
    .sign-in-days {
      margin-bottom: 15px;
      width: 235px;
      height: 34px;
      background: linear-gradient(180deg, #00461f 0%, #006729 100%);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
      border-radius: 13px;
      border: 1px solid #65b050;
      box-sizing: border-box;
      padding: 5px 15px 9px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-size: 14px;
      color: #ffef74;
      line-height: 20px;
      text-align: center;
    }
    .list {
      width: 332px;
      margin-left: 28px;
      margin-right: 15px;
      overflow-y: auto;
      height: 147px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .item {
        width: 86px;
        height: 147px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin-right: 14px;
        .content {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          position: relative;
          margin: 10px auto 6px;
          width: 86px;
          height: 103px;
          background: url("@/assets/activity/ramadan/bg_rewards_item.png") no-repeat center center;
          background-size: cover;
          .day {
            position: absolute;
            width: 54px;
            height: 17px;
            text-align: center;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: url("@/assets/activity/ramadan/bg_day.png") no-repeat center center;
            background-size: cover;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 12px;
            color: #594100;
            line-height: 17px;
            text-align: center;
          }
          .is-check {
            position: absolute;
            top: 8px;
            right: 4px;
            width: 26px;
            height: 26px;
            > img {
              width: 26px;
            }
          }
          .reward-img {
            width: 66px;
            height: 66px;
            margin-top: 10px;
            > img {
              width: 66px;
            }
          }
          .reward-name {
            width: 98%;
            height: 17px;
            margin-top: -1px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-size: 12px;
            color: #fff099;
            line-height: 17px;
            text-align: center;
          }
        }
        .btn-received {
          width: 81px;
          height: 28px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding-bottom: 2px;
          line-height: 12px;
          text-align: center;
        }
        .status1 {
          color: #dfdfdf;
          text-shadow:
            1px 1px 0px #333333,
            -1px -1px 0px #333333,
            -1px 1px 0px #333333,
            1px -1px 0px #333333;
          background: url("@/assets/activity/ramadan/btn_sign_received.png") no-repeat center center;
          background-size: cover;
        }
        .status2 {
          color: #ffe640;
          text-shadow:
            1px 1px 0px #572d00,
            -1px -1px 0px #572d00,
            -1px 1px 0px #572d00,
            1px -1px 0px #572d00;
          background: url("@/assets/activity/ramadan/btn_sign_receive.png") no-repeat center center;
          background-size: cover;
        }
        .status3 {
          color: #ffe640;
          text-shadow:
            1px 1px 0px #572d00,
            -1px -1px 0px #572d00,
            -1px 1px 0px #572d00,
            1px -1px 0px #572d00;
          background: url("@/assets/activity/ramadan/bg_sign_not_reach.png") no-repeat center center;
          background-size: cover;
          opacity: 0.8;
        }
      }
    }
  }
  .calendar {
    width: 100%;
    height: 609px;
    box-sizing: border-box;
    padding-top: 40px;
    background: url("@/assets/activity/ramadan/bg_calendar.png") no-repeat center center;
    background-size: 100% 569px;
    position: relative;
    .calendar-rule {
      position: absolute;
      top: 69px;
      right: 0;
      width: 96px;
      height: 27px;
      background: url("@/assets/activity/ramadan/bg_re_sign_rules.png") no-repeat center center;
      background-size: cover;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 500;
      font-size: 12px;
      color: #412702;
      line-height: 17px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
      padding-bottom: 5px;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      width: 351px;
      height: 462px;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 9px 13px 0 13px;
      .item {
        width: 60px;
        height: 60px;
        position: relative;
        margin-right: 6px;
        &:nth-child(5n) {
          margin-right: 0;
        }
        .date {
          position: absolute;
          z-index: 5;
          top: 3px;
          left: 7px;
          height: 14px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 10px;
          line-height: 14px;
          color: #ffffff;
          text-shadow:
            1px 1px 0px #074535,
            -1px -1px 0px #074535,
            -1px 1px 0px #074535,
            1px -1px 0px #074535;
        }
        .reward {
          width: 36px;
          height: 36px;
          position: absolute;
          z-index: 3;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .is-check {
          width: 26px;
          height: 26px;
          position: absolute;
          z-index: 4;
          top: -10px;
          right: -10px;
          > img {
            width: 26px;
          }
        }
        .re-sign {
          position: absolute;
          z-index: 3;
          bottom: 1px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 14px;
          background: url("@/assets/activity/ramadan/bg_re_sign.png") no-repeat center center;
          background-size: cover;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 10px;
          color: #ffffff;
          line-height: 14px;
          text-align: center;
          white-space: nowrap;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .sun {
          width: 50px;
          height: 50px;
          background: url("@/assets/activity/ramadan/bg_sun.png") no-repeat center center;
          background-size: cover;
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .item0 {
        background: url("@/assets/activity/ramadan/bg_sign5.png") no-repeat center center;
        background-size: cover;
      }
      .item1 {
        background: url("@/assets/activity/ramadan/bg_sign3.png") no-repeat center center;
        background-size: cover;
      }
      .item2 {
        background: url("@/assets/activity/ramadan/bg_sign2.png") no-repeat center center;
        background-size: cover;
      }
      .item3 {
        background: url("@/assets/activity/ramadan/bg_sign1.png") no-repeat center center;
        background-size: cover;
      }
      .item4 {
        background: url("@/assets/activity/ramadan/bg_sign1.png") no-repeat center center;
        background-size: cover;
      }
    }
  }
  .pool,
  .rewards,
  .calendar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .rewards,
  .calendar {
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
}
</style>
