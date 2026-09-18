<!-- 驿站 -->
<template>
  <div class="post">
    <div class="item-new" :class="item.winTeam === 1 ? 'knight-new' : 'dragons-new'" v-for="(item, index) in list">
      <!-- <div class="title">{{ `${item.stageStartDate}-${item.stageEndDate}` }}</div> -->
      <div class="title">
        {{
          `${item.stageStartDate.slice(5, 7)}${item.stageStartDate.slice(8, 10)} - ${item.stageEndDate.slice(5, 7)}${item.stageEndDate.slice(8, 10)}`
        }}
      </div>
      <div :class="'top' + (indexs + 1)" v-for="(items, indexs) in item.contributors.slice(0, 3)">
        <div class="avatar">
          <div class="avatar-icon">
            <img :src="items.avatar" alt="" />
          </div>
          <div class="avatar-bg"></div>
        </div>
        <div class="name text-hide">{{ items.nick }}</div>
        <div class="hot-gold">
          <div class="hot">
            <div class="icon"></div>
            <div class="value">{{ items.contribution }}</div>
          </div>
          <div class="gold">
            <div class="icon"></div>
            <div class="value">{{ items.shareGold }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="not-rank" :class="{ 'not-rank-ar': store.language === 'ar' }" v-if="list.length === 0">
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
  padding: 30px 0 35px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  .item-new,
  .knight-new,
  .dragons-new {
    width: 100%;
    height: 536px;
    background: url("@/assets/activity/dragonsWealth/post/bg1.png") no-repeat top center;
    background-size: cover;
    position: relative;
    .title {
      position: absolute;
      top: 82px;
      left: 50%;
      transform: translateX(-50%);
      width: 187px;
      height: 22px;
      font-weight: bold;
      font-size: 16px;
      color: #fff8a0;
      line-height: 22px;
      text-align: center;
      white-space: nowrap;
    }
    .top1,
    .top2,
    .top3 {
      position: absolute;
      top: 147px;
      left: 50%;
      transform: translateX(-50%);
      width: 340px;
      height: 110px;
      margin-bottom: 6px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: url("@/assets/activity/dragonsWealth/post/item1.png") no-repeat top center;
      background-size: cover;
      .avatar {
        width: 80px;
        height: 80px;
        position: relative;
        margin: 0 11px 0 18px;
        .avatar-icon {
          width: 50px;
          height: 50px;
          position: absolute;
          z-index: 1;
          top: 14px;
          left: 14px;
          overflow: hidden;
          > img {
            width: 50px;
            height: 50px;
          }
        }
        .avatar-bg {
          width: 80px;
          height: 80px;
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          background: url("@/assets/activity/dragonsWealth/post/top1.png") no-repeat top center;
          background-size: cover;
        }
      }
      .name {
        width: 130px;
        margin-right: 5px;
        height: 22px;
        font-weight: bold;
        font-size: 16px;
        color: #e7da53;
        line-height: 22px;
        text-align: left;
      }
      .hot-gold {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .hot,
        .gold {
          min-width: 69px;
          max-width: 80px;
          box-sizing: border-box;
          padding: 0 5px;
          height: 22px;
          background: linear-gradient(180deg, #9a3f09 0%, #b86400 100%);
          box-shadow: inset 0px 2px 6px 0px rgba(255, 255, 255, 0.26);
          border-radius: 11px;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon {
            width: 16px;
            height: 16px;
            background: url("@/assets/activity/dragonsWealth/post/hot.png") no-repeat top center;
            background-size: cover;
            margin-right: 3px;
            margin-left: 3px;
          }
          .value {
            font-weight: bold;
            font-size: 13px;
            color: #fcf860;
            line-height: 18px;
            text-align: left;
            margin-right: 3px;
            margin-left: 3px;
          }
        }
        .gold {
          margin-top: 7px;
          .icon {
            background: url("@/assets/activity/dragonsWealth/post/gold.png") no-repeat top center;
            background-size: cover;
          }
        }
      }
    }
    .top2 {
      position: absolute;
      top: 263px;
      background: url("@/assets/activity/dragonsWealth/post/item2.png") no-repeat top center;
      background-size: cover;
      .avatar {
        .avatar-bg {
          background: url("@/assets/activity/dragonsWealth/post/top2.png") no-repeat top center;
          background-size: cover;
        }
      }
      .hot-gold {
        .hot,
        .gold {
          background: linear-gradient(180deg, #005b99 0%, #0277b8 100%);
          box-shadow: inset 0px 2px 6px 0px rgba(255, 255, 255, 0.26);
        }
      }
    }
    .top3 {
      position: absolute;
      top: 379px;
      background: url("@/assets/activity/dragonsWealth/post/item3.png") no-repeat top center;
      background-size: cover;
      .avatar {
        .avatar-bg {
          background: url("@/assets/activity/dragonsWealth/post/top3.png") no-repeat top center;
          background-size: cover;
        }
      }
      .hot-gold {
        .hot,
        .gold {
          background: linear-gradient(180deg, #1f7413 0%, #408417 100%);
          box-shadow: inset 0px 2px 6px 0px rgba(255, 255, 255, 0.26);
        }
      }
    }
  }
  .dragons {
    width: 100%;
    height: 536px;
    background: url("@/assets/activity/dragonsWealth/post/bg2.png") no-repeat top center;
    background-size: cover;
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
  .not-rank-ar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
