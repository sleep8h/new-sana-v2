<!-- 游戏排名 -->
<template>
  <div class="game-rank">
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
    <div class="list">
      <div class="not-rank" v-if="rankList.length === 0">
        <img :src="notRank" alt="" />
        <span>{{ $t("dragons.notRank") }}</span>
      </div>
      <div class="rank-list" v-else>
        <div class="rank-item" v-for="(item, index) in rankList" :key="index">
          <div class="sort">{{ item.index }}</div>
          <div class="avatar">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="name-userno">
            <div class="name text-hide">{{ item.nick }}</div>
            <div class="erbanNo text-hide">{{ `ID: ${item.erbanNo}` }}</div>
          </div>
          <div class="number">
            <span>{{ formatNumber(item.integral) }}</span>
            <div class="goldIcon"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="rank-my" v-if="myInfo">
      <div class="sort">{{ myInfo.index === 0 ? "99+" : myInfo.index }}</div>
      <div class="avatar" v-if="myInfo.avatar">
        <img :src="myInfo.avatar" alt="" />
      </div>
      <div class="name-userno">
        <div class="name text-hide">{{ myInfo.nick }}</div>
        <div class="erbanNo text-hide">{{ `ID: ${myInfo.erbanNo}` }}</div>
      </div>
      <div class="number">
        <span>{{ formatNumber(myInfo.integral) }}</span>
        <div class="goldIcon"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

import notRank from "@/assets/activity/dragonsWealth/not-get.png";

const { t } = useI18n();
const store = useMainStore();
const curTab = ref(1);
const tabList = [
  {
    text: t("dragons.todayRank"),
    value: 1,
  },
  {
    text: t("dragons.yesterdayRank"),
    value: 2,
  },
  {
    text: t("dragons.weekRank"),
    value: 3,
  },
  {
    text: t("dragons.monthRank"),
    value: 4,
  },
];
const rankList = ref([]);
const myInfo = ref({});
const top1Info = ref(null);
const top2Info = ref(null);
const top3Info = ref(null);

// 切换tab
const tabChange = async (item) => {
  curTab.value = item.value;
  rankList.value = [];
  top1Info.value = null;
  top2Info.value = null;
  top3Info.value = null;
  await getActivityCamp2026Rank();
};

const formatNumber = (num) => {
  if (num === 0) return num;
  console.log(num, "num");
  let n = Number(num);
  let result;
  if (n >= 1e9) {
    result = (n / 1e9).toFixed(1) + "B";
  } else if (n >= 1e6) {
    result = (n / 1e6).toFixed(1) + "M";
  } else if (n >= 1e3) {
    result = (n / 1e3).toFixed(1) + "K";
  } else {
    result = n;
  }
  return result;
};

// 获取排行榜信息
const getActivityCamp2026Rank = async () => {
  try {
    const res = await get("/h5doings/activity/camp2026/rank", {
      uid: store.uid,
      size: 100,
      type: curTab.value,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      rankList.value = res.data.list || [];
      console.log(rankList.value, "rankList.value");
      myInfo.value = res.data.self;
      if (rankList.value.length > 0) {
        top1Info.value = rankList.value[0];
      }
      if (rankList.value.length > 1) {
        top2Info.value = rankList.value[1];
      }
      if (rankList.value.length > 2) {
        top3Info.value = rankList.value[2];
      }
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(async () => {
  await getActivityCamp2026Rank();
});
</script>

<style lang="scss" scoped>
.game-rank {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;

  .tab-list {
    width: 355px;
    height: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tab-item {
      width: 86.5px;
      height: 25px;
      background: url("@/assets/activity/dragonsWealth/gameRank/tabHide.png") no-repeat top center;
      background-size: 86.5px 25px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 0 5px;
      opacity: 0.7;
      > span {
        display: inline-block;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 12px;
        line-height: 10px;
        background: linear-gradient(180deg, #ffffff 0%, #d8b26d 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    }
    .tab-item-show {
      opacity: 1;
      background: url("@/assets/activity/dragonsWealth/gameRank/tabShow.png") no-repeat top center;
      background-size: 86.5px 25px;
    }
  }
  .list {
    margin: 13.5px auto 91px;
    width: 360.5px;
    height: 813px;
    box-sizing: border-box;
    padding: 78px 23px 61px;
    background: url("@/assets/activity/dragonsWealth/gameRank/rankBg.png") no-repeat top center;
    background-size: cover;
    .rank-list {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 5.5px;
      .rank-item {
        width: 314.5px;
        height: 62.5px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: url("@/assets/activity/dragonsWealth/gameRank/topItem.png") no-repeat top center;
        background-size: 314.5px 62.5px;
        flex-shrink: 0;
        &:nth-child(1) {
          background: url("@/assets/activity/dragonsWealth/gameRank/top1.png") no-repeat top center;
          background-size: 314.5px 62.5px;
        }
        &:nth-child(2) {
          background: url("@/assets/activity/dragonsWealth/gameRank/top2.png") no-repeat top center;
          background-size: 314.5px 62.5px;
        }
        &:nth-child(3) {
          background: url("@/assets/activity/dragonsWealth/gameRank/top3.png") no-repeat top center;
          background-size: 314.5px 62.5px;
        }
        .sort {
          width: 18px;
          height: 18px;
          font-weight: bold;
          font-size: 16px;
          line-height: 18px;
          text-align: start;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-inline-start: 7px;
          margin-inline-end: 7px;
        }
        .avatar {
          width: 52px;
          height: 52px;
          border: 1px solid linear-gradient(180deg, #370006 0%, #ffe5ee 100%);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-inline-end: 10px;
          > img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
        .name-userno {
          width: 129px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          .name {
            width: 129px;
            height: 20px;
            line-height: 20px;
            font-weight: bold;
            font-size: 16px;
            background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-align: start;
          }
          .erbanNo {
            width: 129px;
            height: 20px;
            line-height: 20px;
            font-weight: bold;
            font-size: 12px;
            color: #ffffff;
            text-align: start;
          }
        }
        .number {
          width: 82px;
          height: 21px;
          font-weight: bold;
          font-size: 15px;
          color: #fcf860;
          line-height: 21px;
          text-align: end;
          margin-inline-end: 11px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 5px;
          > .goldIcon {
            width: 23.5px;
            height: 22px;
            background: url("@/assets/activity/dragonsWealth/gameRank/goldIcon.png") no-repeat top center;
            background-size: 23.5px 22px;
          }
        }
      }
    }
    .not-rank {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > img {
        width: 197px;
        height: 194.5px;
        margin-bottom: 1px;
      }
      > span {
        height: 25px;
        font-weight: bold;
        font-size: 18px;
        color: #f0fb5d;
        line-height: 25px;
        text-shadow:
          1px 1px 0px #613c01,
          -1px -1px 0px #613c01,
          -1px 1px 0px #613c01,
          1px -1px 0px #613c01;
      }
    }
  }
  .rank-my {
    position: absolute;
    bottom: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 91px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: url("@/assets/activity/dragonsWealth/gameRank/rankSelftBg.png") no-repeat top center;
    background-size: cover;
    .sort {
      min-width: 38px;
      height: 38px;
      font-weight: bold;
      font-size: 19px;
      line-height: 38px;
      text-align: start;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-inline-start: 7px;
    }
    .avatar {
      width: 62px;
      height: 62px;
      border: 1px solid linear-gradient(180deg, #370006 0%, #ffe5ee 100%);
      border-radius: 50%;
      margin-inline-start: 10px;
      margin-inline-end: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      > img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }
    .name-userno {
      width: 129px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .name {
        width: 129px;
        height: 20px;
        line-height: 20px;
        font-weight: bold;
        font-size: 16px;
        background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-align: start;
      }
      .erbanNo {
        width: 129px;
        height: 20px;
        line-height: 20px;
        font-weight: bold;
        font-size: 12px;
        color: #ffffff;
        text-align: start;
      }
    }
    .number {
      width: 102px;
      height: 21px;
      font-weight: bold;
      font-size: 15px;
      color: #fcf860;
      line-height: 21px;
      text-align: end;
      margin-inline-end: 16px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 5px;
      > .goldIcon {
        width: 23.5px;
        height: 22px;
        background: url("@/assets/activity/dragonsWealth/gameRank/goldIcon.png") no-repeat top center;
        background-size: 23.5px 22px;
      }
    }
  }
}
</style>
