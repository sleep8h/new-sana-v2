<!-- 游戏排名 -->
<template>
  <div class="game-rank">
    <div class="tab" :class="{ 'tab-ar': store.language === 'ar' }">
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
    <div class="list">
      <div class="top">
        <div class="top1" v-if="top1Info">
          <img class="avatar" :src="top1Info.avatar" alt="" />
          <div class="avatar-bg"></div>
          <div class="name text-hide">{{ top1Info.nick }}</div>
          <div class="number">{{ formatNumber(top1Info.integral) }}</div>
        </div>
        <div class="top2" v-if="top2Info">
          <img class="avatar" :src="top2Info.avatar" alt="" />
          <div class="avatar-bg"></div>
          <div class="name text-hide">{{ top2Info.nick }}</div>
          <div class="number">{{ formatNumber(top2Info.integral) }}</div>
        </div>
        <div class="top3" v-if="top3Info">
          <img class="avatar" :src="top3Info.avatar" alt="" />
          <div class="avatar-bg"></div>
          <div class="name text-hide">{{ top3Info.nick }}</div>
          <div class="number">{{ formatNumber(top3Info.integral) }}</div>
        </div>
      </div>
      <div class="rank-list">
        <div class="rank-item" v-for="(item, index) in rankList.slice(3)" :key="index">
          <div class="sort">{{ item.index }}</div>
          <div class="avatar" :class="{ 'avatar-ar': store.language === 'ar' }">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="name text-hide" :class="{ 'name-ar': store.language === 'ar' }">{{ item.nick }}</div>
          <div class="number" :class="{ 'number-ar': store.language === 'ar' }">{{ formatNumber(item.integral) }}</div>
        </div>
      </div>
      <div class="not-rank" v-if="rankList.length === 0">
        <img :src="notRank" alt="" />
        <span>{{ $t("dragons.notRank") }}</span>
      </div>
    </div>
    <div class="rank-my" v-if="myInfo">
      <div class="sort">{{ myInfo.index === 0 ? "99+" : myInfo.index }}</div>
      <div class="avatar" :class="{ 'avatar-ar': store.language === 'ar' }">
        <img :src="myInfo.avatar" alt="" />
      </div>
      <div class="name text-hide" :class="{ 'name-ar': store.language === 'ar' }">{{ myInfo.nick }}</div>
      <div class="number" :class="{ 'number-ar': store.language === 'ar' }">{{ formatNumber(myInfo.integral) }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

import notRank from "@/assets/activity/dragonsWealth/not-rank.png";

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
  height: 1178px;
  box-sizing: border-box;
  margin: 38px 0 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  background: url("@/assets/activity/dragonsWealth/gameRank/rankBg.png") no-repeat top center;
  background-size: cover;
  .tab {
    width: calc(100% - 60px);
    height: 46px;
    margin-top: 97px;
    margin-left: 30px;
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .tab-list {
      width: auto;
      height: 46px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .tab-item {
        width: 120px;
        height: 46px;
        background: url("@/assets/activity/dragonsWealth/gameRank/tabHide.png") no-repeat top center;
        background-size: cover;
        margin-right: 9px;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 0 5px;
        > span {
          font-weight: bold;
          font-size: 15px;
          line-height: 15px;
          color: #d4b320;
          text-shadow:
            1px 1px 0px #805600,
            -1px -1px 0px #805600,
            -1px 1px 0px #805600,
            1px -1px 0px #805600;
        }
      }
      .tab-item-show {
        background: url("@/assets/activity/dragonsWealth/gameRank/tabShow.png") no-repeat top center;
        background-size: cover;
        > span {
          color: #ffe640;
          text-shadow:
            1px 1px 0px #572d00,
            -1px -1px 0px #572d00,
            -1px 1px 0px #572d00,
            1px -1px 0px #572d00;
        }
      }
    }
  }
  .tab-ar {
    width: calc(100% - 60px);
    height: 46px;
    margin-top: 97px;
    margin-right: 26px;
    margin-left: 0;
  }
  .list {
    width: 100%;
    height: 927px;
    position: relative;
    .top {
      width: 100%;
      height: 488px;
      margin-top: 27px;
      position: absolute;
      .top1 {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 190px;
        height: 246px;
        .avatar {
          width: 114px;
          height: 114px;
          position: absolute;
          top: 38px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          border-radius: 50%;
        }
        .avatar-bg {
          width: 190px;
          height: 190px;
          background: url("@/assets/activity/dragonsWealth/gameRank/top1.png") no-repeat top center;
          background-size: cover;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }
        .name {
          width: 190px;
          height: 20px;
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          text-align: center;
          position: absolute;
          top: 191px;
        }
        .number {
          position: absolute;
          top: 212px;
          left: 50%;
          transform: translateX(-50%);
          width: 102px;
          height: 34px;
          background: url("@/assets/activity/dragonsWealth/gameRank/bgNumber.png") no-repeat top center;
          background-size: cover;
          font-weight: bold;
          font-size: 16px;
          line-height: 16px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding-top: 5px;
          color: #f0fb5d;
          text-shadow:
            1px 1px 0px #613c01,
            -1px -1px 0px #613c01,
            -1px 1px 0px #613c01,
            1px -1px 0px #613c01;
        }
      }
      .top2,
      .top3 {
        position: absolute;
        top: 259px;
        width: 152px;
        height: 208px;
        .avatar {
          width: 84px;
          height: 84px;
          position: absolute;
          top: 34px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          border-radius: 50%;
        }
        .avatar-bg {
          width: 152px;
          height: 152px;
          background: url("@/assets/activity/dragonsWealth/gameRank/top2.png") no-repeat top center;
          background-size: cover;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }
        .name {
          width: 152px;
          height: 20px;
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          text-align: center;
          position: absolute;
          top: 153px;
        }
        .number {
          position: absolute;
          top: 174px;
          left: 50%;
          transform: translateX(-50%);
          width: 102px;
          height: 34px;
          background: url("@/assets/activity/dragonsWealth/gameRank/bgNumber.png") no-repeat top center;
          background-size: cover;
          font-weight: bold;
          font-size: 16px;
          line-height: 16px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding-top: 5px;
          color: #f0fb5d;
          text-shadow:
            1px 1px 0px #613c01,
            -1px -1px 0px #613c01,
            -1px 1px 0px #613c01,
            1px -1px 0px #613c01;
        }
      }
      .top2 {
        position: absolute;
        left: 28px;
      }
      .top3 {
        position: absolute;
        right: 28px;
        .avatar-bg {
          background: url("@/assets/activity/dragonsWealth/gameRank/top3.png") no-repeat top center;
          background-size: cover;
        }
      }
    }
    .rank-list {
      width: 100%;
      height: 412px;
      position: absolute;
      top: 508px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .rank-item {
        width: 323px;
        height: 61px;
        margin-bottom: 8px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: url("@/assets/activity/dragonsWealth/gameRank/itemBg.png") no-repeat top center;
        background-size: cover;
        flex-shrink: 0;
        &:last-child {
          margin-bottom: 0;
        }
        .sort {
          width: 32px;
          height: 32px;
          background: url("@/assets/activity/dragonsWealth/gameRank/index.png") no-repeat top center;
          background-size: cover;
          font-weight: bold;
          font-size: 13px;
          line-height: 18px;
          text-align: center;
          color: #fcf860;
          display: flex;
          justify-content: center;
          align-items: center;
          text-shadow:
            1px 1px 0px #4c2200,
            -1px -1px 0px #4c2200,
            -1px 1px 0px #4c2200,
            1px -1px 0px #4c2200;
          margin: 0 6px 0 7px;
        }
        .avatar {
          width: 38px;
          height: 38px;
          background: #d8d8d8;
          border: 1px solid #eff4a9;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 6px;
          > img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
          }
        }
        .avatar-ar {
          margin-right: 0;
          margin-left: 6px;
        }
        .name {
          width: 134px;
          height: 20px;
          font-weight: bold;
          font-size: 14px;
          color: #ffe4c1;
          line-height: 20px;
          text-align: left;
        }
        .name-ar {
          text-align: right;
        }
        .number {
          width: 82px;
          height: 21px;
          font-weight: bold;
          font-size: 15px;
          color: #fcf860;
          line-height: 21px;
          text-align: right;
        }
        .number-ar {
          text-align: left;
        }
      }
    }
    .not-rank {
      position: absolute;
      top: 535px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > img {
        width: 83px;
        height: 83px;
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
    width: 355px;
    height: 67px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: url("@/assets/activity/dragonsWealth/gameRank/bgMy.png") no-repeat top center;
    background-size: cover;
    .sort {
      width: 32px;
      height: 32px;
      background: url("@/assets/activity/dragonsWealth/gameRank/index.png") no-repeat top center;
      background-size: cover;
      font-weight: bold;
      font-size: 13px;
      line-height: 18px;
      text-align: center;
      color: #fcf860;
      display: flex;
      justify-content: center;
      align-items: center;
      text-shadow:
        1px 1px 0px #4c2200,
        -1px -1px 0px #4c2200,
        -1px 1px 0px #4c2200,
        1px -1px 0px #4c2200;
      margin: 0 6px 0 7px;
    }
    .avatar {
      width: 38px;
      height: 38px;
      background: #d8d8d8;
      border: 1px solid #eff4a9;
      border-radius: 50%;
      margin-right: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      > img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
    }
    .avatar-ar {
      margin-right: 0;
      margin-left: 6px;
    }
    .name {
      width: 167px;
      height: 20px;
      font-weight: bold;
      font-size: 14px;
      color: #ffe4c1;
      line-height: 20px;
      text-align: left;
    }
    .name-ar {
      text-align: right;
    }
    .number {
      width: 82px;
      height: 21px;
      font-weight: bold;
      font-size: 15px;
      color: #fcf860;
      line-height: 21px;
      text-align: right;
    }
    .number-ar {
      text-align: left;
    }
  }
}
</style>
