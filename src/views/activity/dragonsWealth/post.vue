<!-- 驿站 -->
<template>
  <div class="post">
    <div class="item-new" :class="item.winTeam === 1 ? 'knight-new' : 'dragons-new'" v-for="(item, index) in list">
      <div class="knight-logo" v-if="item.winTeam === 1"></div>
      <div class="dragons-logo" v-if="item.winTeam === 2"></div>
      <div class="title">
        {{
          `${item.stageStartDate.slice(5, 7)}${item.stageStartDate.slice(8, 10)} - ${item.stageEndDate.slice(5, 7)}${item.stageEndDate.slice(8, 10)}`
        }}
      </div>
      <div class="top" v-for="(items, indexs) in item.contributors.slice(0, 3)">
        <div :class="'sort' + indexs"></div>
        <div class="avatar">
          <img :src="items.avatar" alt="" />
        </div>
        <div class="name text-hide">{{ items.nick }}</div>
        <div class="hot-gold">
          <div class="gold">
            <div class="icon"></div>
            <div class="value">{{ items.shareGold }}</div>
          </div>
          <div class="hot">
            <div class="icon"></div>
            <div class="value">{{ items.contribution }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="not-rank" v-if="list.length === 0">
      <img :src="notRank" alt="" />
      <span>{{ $t("dragons.notRank") }}</span>
    </div>
    <div class="more" v-if="noMore" @click="moreFn">
      <div class="more-text">{{ $t("recharge.more") }}</div>
      <div class="more-icon"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import "swiper/swiper-bundle.css";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import notRank from "@/assets/activity/dragonsWealth/not-rank.png";

const { t } = useI18n();
const store = useMainStore();
const noMore = ref(false);
const list = ref([]);
const pageNum = ref(1);

// 获取斋月灯奖励列表
// 获取历史战绩
const getActivityCamp2026History = async (type, campType) => {
  try {
    const res = await postFormData("/h5doings/activity/camp2026/history", {
      pageNum: pageNum.value,
      pageSize: 2,
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      list.value = res.data ? list.value.concat(res.data) : [];
      if (res.data.length === 2) {
        noMore.value = true;
      } else {
        noMore.value = false;
      }
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

const moreFn = async () => {
  pageNum.value += 1;
  await getActivityCamp2026History();
};

onMounted(async () => {
  await getActivityCamp2026History();
});
</script>

<style lang="scss" scoped>
.post {
  width: 100%;
  min-height: 482px;
  // min-height: 1182px;
  box-sizing: border-box;
  padding: 0 0 35px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  .item-new,
  .knight-new,
  .dragons-new {
    width: 360.5px;
    height: 495px;
    background: url("@/assets/activity/dragonsWealth/post/bg.png") no-repeat top center;
    background-size: cover;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      margin-top: 80px;
      margin-bottom: 22px;
      width: 187px;
      height: 22px;
      font-size: 22px;
      line-height: 22px;
      font-weight: bold;
      background: linear-gradient(180deg, #ffffff 0%, #d8b26d 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-align: center;
      white-space: nowrap;
    }
    .top {
      width: 319px;
      height: 87px;
      margin-bottom: 10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: url("@/assets/activity/dragonsWealth/post/item.png") no-repeat top center;
      background-size: 319px 87px;
      .sort0,
      .sort1,
      .sort2 {
        width: 52px;
        height: 50px;
        margin-inline-start: 2.5px;
        margin-inline-end: 7px;
      }
      .sort0 {
        background: url("@/assets/activity/dragonsWealth/post/top1.png") no-repeat top center;
        background-size: cover;
      }
      .sort1 {
        background: url("@/assets/activity/dragonsWealth/post/top2.png") no-repeat top center;
        background-size: cover;
      }
      .sort2 {
        background: url("@/assets/activity/dragonsWealth/post/top3.png") no-repeat top center;
        background-size: cover;
      }
      .avatar {
        width: 48px;
        height: 48px;
        background: linear-gradient(
          90.99deg,
          #fcdeae 8.22%,
          #fff3db 26.02%,
          #e5c28a 47.62%,
          #9d7449 69.41%,
          #daae79 95.87%
        );
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }
      }
      .name {
        width: 130px;
        margin-inline-start: 5px;
        margin-inline-end: 5px;
        height: 22px;
        font-weight: bold;
        font-size: 14px;
        color: #ffe1a2;
        line-height: 22px;
        text-align: start;
      }
      .hot-gold {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin-inline-end: 9px;
        .hot,
        .gold {
          min-width: 69px;
          max-width: 80px;
          box-sizing: border-box;
          padding: 0 5px;
          height: 22px;
          border-radius: 11px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .icon {
            width: 19px;
            height: 19px;
            background: url("@/assets/activity/dragonsWealth/post/hot.png") no-repeat top center;
            background-size: cover;
            margin-inline-end: 3px;
          }
          .value {
            font-weight: bold;
            font-size: 14px;
            color: #fff8f8;
            line-height: 18px;
            text-align: start;
            margin-inline-start: 3px;
          }
        }
        .gold {
          margin-top: 7px;
          .icon {
            width: 12px;
            height: 14px;
            background: url("@/assets/activity/dragonsWealth/post/gold.png") no-repeat top center;
            background-size: cover;
          }
        }
      }
    }
    
  }

  .knight-new {
    margin-top: 86.5px;
    position: relative;
    .knight-logo {
      position: absolute;
      top: -86.5px;
      left: -12.5px;
      width: 138.5px;
      height: 208px;
      background: url("@/assets/activity/dragonsWealth/post/knight.png") no-repeat top center;
      background-size: cover;
    }
  }
  .dragons-new {
    margin-top: 35px;
    position: relative;
    .dragons-logo {
      position: absolute;
      top: -35px;
      right: -44.5px;
      width: 195px;
      height: 230px;
      background: url("@/assets/activity/dragonsWealth/post/dragons.png") no-repeat top center;
      background-size: cover;
    }
  }
  .not-rank {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
  .more {
    width: 102px;
    height: 34px;
    margin: 11px auto 0;
    background: url("@/assets/activity/dragonsWealth/post/button.png") no-repeat top center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    .more-text {
      margin-right: 4px;
      font-weight: bold;
      font-size: 16px;
      line-height: 22px;
      box-sizing: border-box;
      padding-top: 3px;
      color: #f0fb5d;
      text-shadow:
        1px 1px 0px #613c01,
        -1px -1px 0px #613c01,
        -1px 1px 0px #613c01,
        1px -1px 0px #613c01;
    }
    .more-icon {
      width: 16px;
      height: 16px;
      background: url("@/assets/activity/dragonsWealth/post/more.png") no-repeat top center;
      background-size: cover;
    }
  }
}
</style>
