<!-- 巨龙巢穴 -->
<template>
  <div class="dragons-lair">
    <div class="lair">
      <div class="reward-btn" :class="{'reward-btn-ar': store.language === 'ar'}" @click="rewardShow = true">
        <div class="gift"></div>
        <div class="text">{{ $t("dragons.rewards") }}</div>
      </div>
      <div class="gold">
        <div class="gold-icon" :class="{'gold-icon-ar': store.language === 'ar'}"></div>
        <div class="gold-value">{{ formatWithRegex(weekPoolGold) }}</div>
      </div>
      <div class="knight-dragon">
        <div class="knight">
          <img :src="knightImg" alt="" />
          <span :data-text="$t('dragons.knight')">{{ $t("dragons.knight") }}</span>
        </div>
        <div class="dragon">
          <img :src="dragonImg" alt="" />
          <span :data-text="$t('dragons.dragon')">{{ $t("dragons.dragon") }}</span>
        </div>
      </div>
      <div class="vs">
        <div class="vs-left" :class="{'vs-left-ar': store.language === 'ar'}" :style="'width:' + widthFnA(info.teamATotalContribution, info.teamBTotalContribution)">{{ info.teamATotalContribution }}</div>
        <div class="vs-icon" :class="{'vs-icon-ar': store.language === 'ar'}" :style="(store.language === 'ar'?'right: ':'left: ') + vsLeftFn(info.teamATotalContribution, info.teamBTotalContribution)"></div>
        <div class="vs-right" :class="{'vs-right-ar': store.language === 'ar'}" :style="'width:' + widthFnB(info.teamATotalContribution, info.teamBTotalContribution)">{{ info.teamBTotalContribution }}</div>
      </div>
      <div class="hall-of-fame">
        <div class="left" @click="hallFn(1)">
          <div class="list">
            <div class="item" v-for="(item, index) in info.teamATopUsers" :key="index">
              <img :src="item.avatar" alt=""></img>
            </div>
          </div>
          <div class="icon" :class="{'icon-ar': store.language === 'ar'}"></div>
        </div>
        <div class="right" @click="hallFn(2)">
          <div class="icon" :class="{'icon-ar': store.language === 'ar'}"></div>
          <div class="list">
            <div class="item" v-for="(item, index) in info.teamBTopUsers" :key="index">
              <img :src="item.avatar" alt=""></img>
            </div>
          </div>
        </div>
      </div>
      <div class="button">
        <div
          class="button-left"
          :class="{ 'button-disable': userInfo.availablePropCount < 1 || userInfo.selectedTeam === 0 }"
          @click="campFn(2)"
        >
          <div class="combat-icon"></div>
          <div class="combat-value">1</div>
        </div>
        <div
          class="button-right"
          :class="{ 'button-disable': userInfo.availablePropCount < 10 || userInfo.selectedTeam === 0 }"
          @click="campFn(3)"
        >
          <div class="combat-icon"></div>
          <div class="combat-value">10</div>
        </div>
      </div>
      <div class="my-camp">
        {{
          $t("dragons.myCamp", {
            type: campType === 0 ? "" : campType === 1 ? $t("dragons.knight") : $t("dragons.dragon"),
          })
        }}
      </div>
      <div class="tip" :class="{'tip-ar': store.language === 'ar'}">
        <div>{{ $t("dragons.joinTip") }}</div>
        <div>{{ $t("dragons.battleRewardTip") }}</div>
        <div>{{ $t("dragons.victoryTip") }}</div>
        <!-- <div>{{ $t("dragons.weekInvestment") }}</div> -->
        <div>
          {{
            $t("dragons.itemsProgress", {
              cur: userInfo.availablePropCount
            })
          }}
        </div>
        <div>{{ $t("dragons.clearTip") }}</div>
      </div>
    </div>
    <div class="info-my" :class="{'info-my-ar': store.language === 'ar'}">
      <div class="avatar">
        <img :src="userInfo.avatar" alt="" />
      </div>
      <div class="content">
        <div class="name-prop">
          <div class="name text-hide">{{ userInfo.nick }}</div>
          <div class="prop">
            <img class="prop-icon" :src="combat" alt="" />
            <span>{{ userInfo.availablePropCount }}</span>
          </div>
        </div>
        <div class="contribution">
          <div class="text">{{ $t("dragons.contribution") }}</div>
          <div class="value text-hide">{{ userInfo.contribution }}</div>
        </div>
      </div>
    </div>
    <JoinToast v-model:isShow="joinShow" @close="joinShow = false" @joinCamp="joinCamp" />
    <CampToast v-model:isShow="campShow" :campType="campTypeCur" :campList="campList" @close="campShow = false" />
    <RewardToast v-model:isShow="rewardShow" :rewardList="rewardList" @close="rewardShow = false" />
    <GetRewardToast v-model:isShow="getRewardShow" :getRewardList="getRewardList" :rewardList="rewardList" @close="getRewardShow = false" />
    <NotRewardToast v-model:isShow="notRewardShow" @close="notRewardShow = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import "swiper/swiper-bundle.css";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

// 图片资源
import combat from "@/assets/activity/dragonsWealth/dragonsLair/combat.png";
import knightImg from "@/assets/activity/dragonsWealth/dragonsLair/knight.png";
import dragonImg from "@/assets/activity/dragonsWealth/dragonsLair/dragon.png";

// 组件
// 加入阵营弹窗
import JoinToast from "@/views/activity/dragonsWealth/components/joinToast.vue";
import CampToast from "@/views/activity/dragonsWealth/components/campToast.vue";
import RewardToast from "@/views/activity/dragonsWealth/components/rewardToast.vue";
import GetRewardToast from "@/views/activity/dragonsWealth/components/getRewardToast.vue";
import NotRewardToast from "@/views/activity/dragonsWealth/components/notRewardToast.vue";

const { t } = useI18n();
const store = useMainStore();
const rewardList = ref([]);
// 是否显示加入阵营弹窗
const joinShow = ref(false);
// 是否显示阵容名人堂弹窗
const campShow = ref(false);
// 是否显示奖励弹窗
const rewardShow = ref(false);
// 是否显示获得奖励弹窗
const getRewardShow = ref(false);
// 是否显示未获得奖励弹窗
const notRewardShow = ref(false);
const weekPoolGold = ref(0);
// 1 = 骑士 2 = 巨龙
const campType = ref(0);
const campTypeCur = ref(0);
const info = ref({
  historyList: null,
  isNewUser: null,
  point: null,
  pointLists: null,
  taskVOList: null,
  teamATopUsers: [],
  teamATotalContribution: 0,
  teamBTopUsers: [],
  teamBTotalContribution: 0,
  timeOut: 0,
  timeOutDay: 0,
});
const userInfo = ref({
  availablePropCount: 0,
  avatar: "",
  contribution: 0,
  maxPropByRankScore: 0,
  nick: "",
  selectedTeam: 0,
  uid: null,
  usedPropCount: 0,
});

const campList = ref([]);
const getRewardList = ref([]);
const rewardIdList = ref([]);

const hallFn = (type) => {
  campTypeCur.value = type;
  if (type === 1) {
    campList.value = info.value.teamATopUsers;
  } else if (type === 2) {
    campList.value = info.value.teamBTopUsers;
  }  
  campShow.value = true;
}

const widthFnA = (widthA, widthB) => {
  if(widthA === 0) return '0%';
  let total = widthA + widthB;
  let scale = widthA / total;
  return scale * 100 + '%';
}

const widthFnB = (widthA, widthB) => {
  if(widthB === 0) return '0%';
  let total = widthA + widthB;
  let scale = widthB / total;
  return scale * 100 + '%';
}

const vsLeftFn = (widthA, widthB) => {
  let total = widthA + widthB;
  let scale = widthA / total;
  if(scale < 0.20) return `calc(20% - 42.5px)`;
  if(scale > 0.80) return `calc(80% - 42.5px)`;
  return `calc(${scale * 100}% - 42.5px)`;
}

const formatWithRegex = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 加入阵营
const joinCamp = async (type) => {
  if (!type) return false;
  await getActivityCamp2026Pay(1, type);
};

// 战斗
const campFn = async (type) => {
  if (userInfo.value.selectedTeam === 0) {
    joinShow.value = true;
  }
  let num = type === 2 ? 1 : 10;
  if (userInfo.value.availablePropCount < num) {
    return showToast(t("dragons.notProp"));
  }
  await getActivityCamp2026Pay(type);
};

// 获取活动基本信息
const getActivityCamp2026List = async () => {
  try {
    const res = await postFormData("/h5doings/activity/camp2026/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      info.value = res.data;
      userInfo.value = res.data.userInfo;
      campType.value = res.data.userInfo.selectedTeam;
      weekPoolGold.value = res.data.weekPoolGold;
      if (userInfo.value.selectedTeam === 0) {
        joinShow.value = true;
      }
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// type: 1 = 加入阵营;  2 = 使用道具*1;  3 = 使用道具*10;
// index: 1 = 骑士 2 = 巨龙
const getActivityCamp2026Pay = async (type, campType) => {
  console.log("123456");
  try {
    const res = await postFormData("/h5doings/activity/camp2026/pay", {
      type: type,
      index: campType?.value || campType,
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      console.log(res, 'res');
      if(type === 2){
        if(rewardIdList.value.indexOf(res.data[0].giftId)>-1){
          getRewardList.value = res.data;
          getRewardShow.value = true;
        }else{
          notRewardShow.value = true;
        }
      } else if(type === 3){
        let arr = res.data || []
        let newArr = []
        newArr = arr.filter((item)=>{
          return rewardIdList.value.indexOf(item.giftId)>-1
        })
        if(newArr.length !== 0){
          getRewardList.value = newArr;
          getRewardShow.value = true;
        } else{
          notRewardShow.value = true;
        }
      }
      showToast(res.message);
      getActivityCamp2026List();
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

const getActivityCamp2026RankRewards = async () => {
  try {
    const res = await get("/h5doings/activity/camp2026/rankRewards", {
      groupType: 1,
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      rewardList.value = Object.values(res.data)[0];
      rewardIdList.value = [];
      rewardList.value.forEach((item)=>{
        rewardIdList.value.push(item.rewardRefId);
      })
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(async () => {
  await getActivityCamp2026List();
  await getActivityCamp2026RankRewards();
});
</script>

<style lang="scss" scoped>
.dragons-lair {
  margin-top: -42px;
  width: 100%;
  height: 783px;

  .lair {
    width: 100%;
    height: 728px;
    text-align: center;
    background: url("@/assets/activity/dragonsWealth/dragonsLair/bg.png") no-repeat top center;
    background-size: cover;
    box-sizing: border-box;
    padding-top: 47px;
    .reward-btn {
      width: auto;
      max-width: 100px;
      box-sizing: border-box;
      padding: 0 5px;
      height: 30px;
      background: rgba(255, 137, 86, 0.14);
      border-radius: 0 33px 33px 0;
      border: 1px solid rgba(255, 255, 255, 0.14);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      top: 57px;
      left: 0;
      z-index: 10;
      .gift {
        margin-right: 5px;
        width: 20px;
        height: 20px;
        background: url("@/assets/activity/dragonsWealth/dragonsLair/gift.png") no-repeat top center;
        background-size: cover;
      }
      > .text {
        height: 20px;
        font-weight: bold;
        font-size: 14px;
        color: #ffe502;
        line-height: 20px;
      }
    }
    .reward-btn-ar{
      width: 75px;
      position: relative;
      top: 57px;
      right: 0;
      z-index: 10;
      border-radius: 33px 0 0 33px;
      >.gift{
        margin-left: 5px;
      }
    }
    .gold {
      width: 223px;
      height: 42px;
      border-radius: 21px;
      border: 1px solid rgba(255, 211, 25, 0.59);
      box-sizing: border-box;
      padding: 0 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      .gold-icon {
        width: 25px;
        height: 24px;
        background: url("@/assets/activity/dragonsWealth/dragonsLair/gold.png") no-repeat top center;
        background-size: cover;
        margin-right: 5px;
      }
      .gold-icon-ar{
        margin-left: 5px;
        margin-right: 0;
      }
      .gold-value {
        max-width: 141px;
        height: 37px;
        font-weight: bold;
        font-size: 26px;
        line-height: 37px;
        text-align: left;
        background: linear-gradient(180deg, #fbcd0c 0%, #fefcec 43%, #f3cf43 100%);
        -webkit-background-clip: text; /* Safari/Chrome 兼容 */
        background-clip: text; /* 现代浏览器标准属性 */
        color: transparent; /* 文字透明以显示背景渐变 */
        display: inline-block; /* 必须为块级或行内块元素 [1][3][6] */
      }
    }
    .knight-dragon {
      width: 100%;
      height: 259px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 0 12px;
      margin: 10px 0 0 0;
      .knight,
      .dragon {
        width: 174px;
        height: 259px;
        position: relative;
        > img {
          position: absolute;
          top: 0;
          left: 0;
          width: 174px;
          height: 259px;
        }
        > span {
          position: absolute;
          top: 186px;
          left: 50%;
          transform: translateX(-50%);
          font-weight: bold;
          font-size: 16px;
          line-height: 16px;
          &::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: #cdb67e;
            text-shadow:
              1px 1px 0px #052150,
              -1px -1px 0px #052150,
              -1px 1px 0px #052150,
              1px -1px 0px #052150;
          }
          &::before {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, #ffeec2 0%, #a58948 100%);
            color: transparent;
            -webkit-background-clip: text;
            z-index: 2;
            background-clip: text;
          }
        }
      }
      .dragon {
        > span {
          &::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            text-shadow:
              1px 1px 0px #500603,
              -1px -1px 0px #500603,
              -1px 1px 0px #500603,
              1px -1px 0px #500603;
          }
          &::before {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, #ffeec2 0%, #a58948 100%);
            color: transparent;
            -webkit-background-clip: text;
            z-index: 2;
            background-clip: text;
          }
        }
      }
    }
    .vs {
      width: 100%;
      padding: 0 12px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 21px;
      margin-bottom: 12px;
      .vs-left,
      .vs-right {
        width: 175px;
        min-width: 51px;
        height: 24px;
        background: url("@/assets/activity/dragonsWealth/dragonsLair/lineLeft.png") no-repeat top center;
        background-size: cover;
        box-sizing: border-box;
        padding-left: 7px;
        font-weight: bold;
        font-size: 13px;
        line-height: 24px;
        text-align: left;
        color: #f0fb5d;
        text-shadow:
          1px 1px 0px #613c01,
          -1px -1px 0px #613c01,
          -1px 1px 0px #613c01,
          1px -1px 0px #613c01;
      }
      .vs-left-ar{
        text-align: right !important;
        padding-right: 7px !important;
      }
      .vs-right-ar{
        text-align: left !important;
        padding-left: 7px !important;
      }
      .vs-icon {
        position: absolute;
        left: calc(50% - 30.5px);
        width: 61px;
        height: 52px;
        background: url("@/assets/activity/dragonsWealth/dragonsLair/vs.png") no-repeat top center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .vs-right {
        background: url("@/assets/activity/dragonsWealth/dragonsLair/lineRight.png") no-repeat top center;
        background-size: cover;
        box-sizing: border-box;
        padding-right: 7px;
        text-align: right;
      }
    }
    .hall-of-fame {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 13px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 13px;
      .left {
        width: 118px;
        height: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .list {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .item {
            width: 30px;
            height: 30px;
            border: 1px solid #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            box-sizing: border-box;
            margin-right: 2px;
            overflow: hidden;
            > img {
              width: 28px;
              height: 28px;
            }
          }
        }
        .icon {
          margin-left: 4px;
          width: 18px;
          height: 18px;
          background: url("@/assets/activity/dragonsWealth/dragonsLair/right.png") no-repeat top center;
          background-size: cover;
        }
        .icon-ar{
          margin-right: 4px;
          margin-left: 0;
          transform: rotate(180deg);
        }
      }
      .right {
        width: 118px;
        height: 30px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .icon {
          margin-right: 4px;
          width: 18px;
          height: 18px;
          background: url("@/assets/activity/dragonsWealth/dragonsLair/left.png") no-repeat top center;
          background-size: cover;
        }
        .icon-ar{
          margin-left: 4px;
          margin-right: 0;
          transform: rotate(180deg);
        }
        .list {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .item {
            width: 30px;
            height: 30px;
            border: 1px solid #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            box-sizing: border-box;
            margin-right: 2px;
            overflow: hidden;
            > img {
              width: 28px;
              height: 28px;
            }
          }
        }
      }
    }
    .button {
      width: 100%;
      box-sizing: border-box;
      padding: 0 27px 0 33px;
      height: 48px;
      margin-top: 20px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .button-disable {
        filter: grayscale(100%);
      }
      .button-left {
        width: 140px;
        height: 48px;
        background: url("@/assets/activity/dragonsWealth/dragonsLair/buttonLeft.png") no-repeat top center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        .combat-icon {
          width: 18px;
          height: 18px;
          background: url("@/assets/activity/dragonsWealth/dragonsLair/combat.png") no-repeat top center;
          background-size: cover;
          margin-right: 5px;
        }
        .combat-value {
          font-weight: bold;
          font-size: 16px;
          line-height: 22px;
          color: #f0fb5d;
          text-shadow:
            1px 1px 0px #613c01,
            -1px -1px 0px #613c01,
            -1px 1px 0px #613c01,
            1px -1px 0px #613c01;
        }
      }
      .button-right {
        width: 140px;
        height: 48px;
        background: url("@/assets/activity/dragonsWealth/dragonsLair/buttonRight.png") no-repeat top center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        .combat-icon {
          width: 18px;
          height: 18px;
          background: url("@/assets/activity/dragonsWealth/dragonsLair/combat.png") no-repeat top center;
          background-size: cover;
          margin-right: 5px;
        }
        .combat-value {
          font-weight: bold;
          font-size: 16px;
          line-height: 22px;
          color: #f0fb5d;
          text-shadow:
            1px 1px 0px #023768,
            -1px -1px 0px #023768,
            -1px 1px 0px #023768,
            1px -1px 0px #023768;
        }
      }
    }
    .my-camp {
      width: 200px;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #fcf860;
      font-weight: bold;
      text-align: center;
      margin: 14px auto 20px;
    }
    .tip {
      width: 351px;
      height: 103px;
      background: rgba(255, 137, 86, 0.14);
      border-radius: 12px;
      box-sizing: border-box;
      padding: 10px 12px 8px 12px;
      overflow-y: auto;
      font-size: 12px;
      color: #d1b893;
      line-height: 17px;
      text-align: left;
      margin: 0 auto;
    }
    .tip-ar{
      text-align: right;
    }
  }
  .info-my {
    width: 375px;
    height: 65px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 11;
    background: url("@/assets/activity/dragonsWealth/dragonsLair/bgMy.png") no-repeat top center;
    background-size: cover;
    box-sizing: border-box;
    padding-top: 7px;
    padding-right: 16px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .avatar {
      width: 37px;
      height: 37px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #eff4a9;
      border-radius: 50%;
      margin-left: 14px;
      margin-right: 7px;
      border-radius: 50%;
      overflow: hidden;
      > img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
    }
    .content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name-prop {
        flex: 1;
        max-width: 180px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .name {
          max-width: 180px;
          font-weight: bold;
          font-size: 12px;
          color: #ffffff;
          line-height: 17px;
          text-align: left;
          margin-bottom: 2px;
        }
        .prop {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 21px;
          .prop-icon {
            width: 16px;
            height: 16px;
            margin-right: 3px;
          }
          > span {
            height: 21px;
            font-weight: bold;
            font-size: 15px;
            color: #fcf860;
            line-height: 21px;
            text-align: left;
          }
        }
      }
      .contribution {
        max-width: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .text {
          font-weight: bold;
          font-size: 12px;
          color: #ffffff;
          line-height: 17px;
          text-align: left;
          margin-bottom: 2px;
        }
        .value {
          max-width: 120px;
          height: 21px;
          font-weight: bold;
          font-size: 15px;
          color: #fcf860;
          line-height: 21px;
          text-align: left;
        }
      }
    }
  }
  .info-my-ar{
    padding-right: 5px;
    padding-left: 16px;
  }
}
</style>
