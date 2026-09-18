<!-- 总榜 -->
<template>
  <div class="rank">
    <div class="rank-reward">
      <div class="title">
        <span>{{ $t("ramadan.rankingReward") }}</span>
      </div>
      <div class="text">{{ $t("ramadan.rankingRewardText") }}</div>
      <div class="tab-list">
        <div
          :class="[
            { 'tab-item-show': curTab === item.value },
            { 'tab-item-show-ar': store.language === 'ar' && curTab === item.value },
            'tab-item',
          ]"
          v-for="(item, index) in tabList"
          :key="index"
          @click="changeTab(item)"
        >
          {{ item.text }}
        </div>
      </div>
      <div class="reward">
        <div class="left" @click="last"></div>
        <div class="right" @click="next"></div>
        <div class="reward-swiper">
          <Swiper
            :initial-slide="index"
            :slides-per-view="1"
            ref="mySwiper"
            :space-between="0"
            @slideChange="onSwiperChange"
            style="height: 100%"
          >
            <SwiperSlide v-for="(item, idx) in rewardList" :key="idx">
              <div class="top">{{ topFn(idx) }}</div>
              <div class="reward-list">
                <div class="reward-item" v-for="(items, indexs) in item" :key="indexs">
                  <div class="reward-img">
                    <img :src="items.rewardUrl" alt="" />
                  </div>
                  <sanaAutoText class="reward-name" :key="new Date().getTime()">
                    {{
                      `${store.language === "ar" ? items.rewardNameAr : items.rewardName} ${items.rewardValue ? " * " + items.rewardValue : ""}`
                    }}
                  </sanaAutoText>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <div class="rank-sec">
        <div class="rank-top">
          <div class="top1" v-if="rankList.length > 0">
            <div class="bg-top"></div>
            <div class="avatar"></div>
            <img class="avatar-img" :src="rankList.slice(0, 1)[0].avatar" alt="" />
            <div class="name">{{ rankList.slice(0, 1)[0].nick }}</div>
            <div class="number">
              <img src="@/assets/activity/ramadan/rank/icon.png" alt="" />
              <span>{{ formatNumber(rankList.slice(0, 1)[0].integral) }}</span>
            </div>
          </div>
          <div class="top2" v-if="rankList.length > 1">
            <div class="bg-top"></div>
            <div class="avatar"></div>
            <img class="avatar-img" :src="rankList.slice(1, 2)[0].avatar" alt="" />
            <div class="name">{{ rankList.slice(1, 2)[0].nick }}</div>
            <div class="number">
              <img src="@/assets/activity/ramadan/rank/icon.png" alt="" />
              <span>{{ formatNumber(rankList.slice(1, 2)[0].integral) }}</span>
            </div>
          </div>
          <div class="top3" v-if="rankList.length > 2">
            <div class="bg-top"></div>
            <div class="avatar"></div>
            <img class="avatar-img" :src="rankList.slice(2, 3)[0].avatar" alt="" />
            <div class="name" :class="{ 'name-ar': store.language === 'ar' }">{{ rankList.slice(2, 3)[0].nick }}</div>
            <div class="number">
              <img src="@/assets/activity/ramadan/rank/icon.png" alt="" />
              <span>{{ formatNumber(rankList.slice(2, 3)[0].integral) }}</span>
            </div>
          </div>
        </div>
        <div class="rank-list" v-if="rankList.length > 3">
          <div class="rank-item" v-for="(item, index) in rankList.slice(3)" :key="index">
            <div class="sort">{{ item.index === 0 ? "99+" : item.index }}</div>
            <div class="avatar-img" :class="{ 'avatar-img-ar': store.language === 'ar' }">
              <img :src="item.avatar" alt="" />
            </div>
            <div class="name" :class="{ 'name-ar': store.language === 'ar' }">{{ item.nick }}</div>
            <div class="number" :class="{ 'number-ar': store.language === 'ar' }">
              <img src="@/assets/activity/ramadan/rank/icon.png" alt="" />
              <span>{{ formatNumber(item.integral) }}</span>
            </div>
          </div>
        </div>
        <div class="rank-my" v-if="myInfo">
          <div class="sort">{{ myInfo.index === 0 ? "99+" : myInfo.index }}</div>
          <div class="avatar-img" :class="{ 'avatar-img-ar': store.language === 'ar' }">
            <img :src="myInfo.avatar" alt="" />
          </div>
          <div class="name" :class="{ 'name-ar': store.language === 'ar' }">{{ myInfo.nick }}</div>
          <div class="number" :class="{ 'number-ar': store.language === 'ar' }">
            <img src="@/assets/activity/ramadan/rank/icon.png" alt="" />
            <span>{{ formatNumber(myInfo.integral) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

// 定义emit
const emit = defineEmits(["timeChange"]);

const { t } = useI18n();
const store = useMainStore();
const mySwiper = ref(null); // Swiper实例引用
const index = ref(0);
const activeIndex = ref(0);
const curTab = ref(2);
const rewardValue = ref(4);
const tabList = [
  {
    text: t("ramadan.wealth"),
    value: 2,
    rewardValue: 4,
  },
  {
    text: t("ramadan.charm"),
    value: 3,
    rewardValue: 5,
  },
];
const rewardList = ref([]);
const rankList = ref([]);
const myInfo = ref({});

// 切换tab
const changeTab = (item) => {
  rankList.value = [];
  rewardList.value = [];
  curTab.value = item.value;
  rewardValue.value = item.rewardValue;
  getActivityRamadan2026Rank();
  getRamadan2026rankRewards();
};

// 切换swiper
const onSwiperChange = (swiper) => {
  index.value = swiper.activeIndex;
};

const handleBoxClick = (index) => {
  activeIndex.value = index;
  // 获取Swiper实例并切换到目标slide [1][5][10]
  if (mySwiper.value && mySwiper.value.$el.swiper) {
    mySwiper.value.$el.swiper.slideTo(index, 300); // 300ms动画
  }
};

const next = () => {
  if (mySwiper.value && mySwiper.value.$el.swiper) {
    mySwiper.value.$el.swiper.slideNext(300); // 300ms动画
  }
};

const last = () => {
  if (mySwiper.value && mySwiper.value.$el.swiper) {
    mySwiper.value.$el.swiper.slidePrev(300); // 300ms动画
  }
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
  }
  return result;
};

const topFn = (idx) => {
  console.log(idx, "console idx");
  if (idx === "1") return "top1";
  if (idx === "2") return "top2";
  if (idx === "3") return "top3";
  if (idx === "4") return "top4-10";
};

// 获取排行榜
const getActivityRamadan2026Rank = async () => {
  try {
    const res = await get("/h5doings/activity/ramadan2026/rank", {
      uid: store.uid,
      size: 100,
      type: curTab.value,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      rankList.value = res.data.list || [];
      myInfo.value = res.data.self;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取斋月灯奖励列表
const getRamadan2026rankRewards = async () => {
  try {
    const res = await get("/h5doings/activity/ramadan2026/rankRewards", {
      uid: store.uid,
      groupType: rewardValue.value,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      rewardList.value = res.data;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(() => {
  getActivityRamadan2026Rank();
  getRamadan2026rankRewards();
});
</script>

<style lang="scss" scoped>
.rank {
  width: 100%;
  height: 1602px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  .rank-reward {
    width: 100%;
    height: 1560px;
    box-sizing: border-box;
    padding-top: 22px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background: url("@/assets/activity/ramadan/rank/bg_rank.png") no-repeat bottom center;
    background-size: 100% 1538px;
    > .title {
      width: 100%;
      height: 94px;
      margin-top: -22px;
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
    .text {
      width: 280px;
      height: 40px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #fff099;
      line-height: 20px;
      text-align: center;
      margin: -16px auto 14px;
      white-space: break-all;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      word-break: break-word; /* 兼容混合文本 */
      hyphens: auto; /* 英文连字符优化 */
    }
    .tab-list {
      width: 100%;
      height: 48px;
      box-sizing: border-box;
      padding: 0 45px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tab-item {
        width: 135px;
        height: 48px;
        background: url("@/assets/activity/ramadan/rank/tab_hide.png") no-repeat bottom center;
        background-size: cover;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 600;
        font-size: 16px;
        color: #fff099;
        line-height: 22px;
        text-shadow: 0px 1px 0px #5f2b00;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        &:nth-child(1) {
          margin-right: 16px;
        }
      }
      .tab-item-show {
        background: url("@/assets/activity/ramadan/rank/tab_show.png") no-repeat bottom center;
        background-size: cover;
      }
      .tab-item-show-ar {
        margin-right: 0;
        margin-left: 16px;
      }
    }
    .reward {
      width: 100%;
      height: 381px;
      position: relative;
      .left {
        position: absolute;
        top: 187px;
        left: 23px;
        width: 24px;
        height: 24px;
        z-index: 9;
        background: url("@/assets/activity/ramadan/rank/left.png") no-repeat bottom center;
        background-size: cover;
      }
      .right {
        position: absolute;
        top: 187px;
        right: 23px;
        width: 24px;
        height: 24px;
        z-index: 9;
        background: url("@/assets/activity/ramadan/rank/right.png") no-repeat bottom center;
        background-size: cover;
      }

      .reward-swiper {
        width: 100%;
        height: 100%;
        position: relative;
        .top {
          position: absolute;
          top: 33px;
          left: 50%;
          transform: translateX(-50%);
          width: 76px;
          height: 32px;
          background: url("@/assets/activity/ramadan/rank/top_text.png") no-repeat bottom center;
          background-size: cover;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 600;
          font-size: 14px;
          color: #faee28;
          line-height: 20px;
          text-shadow: 0px 1px 0px #023e13;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding-bottom: 3px;
        }
        .reward-list {
          position: absolute;
          width: 274px;
          top: 65px;
          left: 50%;
          transform: translateX(-50%);
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          .reward-item {
            width: 130px;
            height: 128px;
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .reward-img {
              width: 130px;
              height: 96px;
              background: url("@/assets/activity/ramadan/rank/reward_item.png") no-repeat bottom center;
              background-size: cover;
              display: flex;
              justify-content: center;
              align-items: center;
              > img {
                width: 54px;
                height: 54px;
              }
            }
            .reward-name {
              max-width: 130px;
              width: auto;
              box-sizing: border-box;
              padding: 0 15px;
              height: 24px;
              background: linear-gradient(180deg, #f8d888 0%, #ecaa41 100%);
              border-radius: 13px;
              margin-top: 7px;
              font-family:
                PingFangSC,
                PingFang SC;
              font-weight: 500;
              font-size: 12px;
              color: #470110;
              line-height: 18px;
              text-align: center;
            }
          }
        }
      }
    }
    .rank-sec {
      width: 100%;
      height: 999px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      .rank-top {
        margin-top: 28px;
        width: 100%;
        height: 497px;
        position: relative;
        .top1 {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 172px;
          height: 269px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .bg-top {
            position: absolute;
            width: 152px;
            height: 229px;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            background: url("@/assets/activity/ramadan/rank/top1.png") no-repeat bottom center;
            background-size: cover;
          }
          .avatar {
            position: absolute;
            z-index: 3;
            width: 172px;
            height: 172px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: url("@/assets/activity/ramadan/rank/avatar1.png") no-repeat bottom center;
            background-size: cover;
          }
          .avatar-img {
            position: absolute;
            top: 37px;
            left: 50%;
            transform: translateX(-50%);
            width: 98px;
            height: 98px;
            border-radius: 50%;
            z-index: 2;
          }
          .name {
            width: 100%;
            box-sizing: border-box;
            padding: 0 10px;
            height: 22px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 16px;
            color: #533500;
            line-height: 22px;
            text-align: center;
            margin-top: 169px;
            margin-bottom: 9px;
            position: relative;
            z-index: 4;
          }
          .number {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 4;
            width: 107px;
            height: 24px;
            background: linear-gradient(180deg, #ba863d 0%, #f9e58d 100%);
            box-shadow: 0px 2px 0px 0px rgba(165, 135, 16, 0.43);
            border-radius: 13px;
            > img {
              width: 22px;
              height: 22px;
              background: url("@/assets/activity/ramadan/rank/icon.png") no-repeat bottom center;
              background-size: cover;
              margin-right: 3px;
            }
            > span {
              height: 18px;
              font-family:
                PingFangSC,
                PingFang SC;
              font-weight: 500;
              font-size: 12px;
              color: #470110;
              line-height: 18px;
              text-align: center;
            }
          }
        }
        .top2,
        .top3 {
          position: absolute;
          top: 263px;
          width: 146px;
          height: 234px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .bg-top {
            position: absolute;
            width: 131px;
            height: 191px;
            top: 37px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            background: url("@/assets/activity/ramadan/rank/top2.png") no-repeat bottom center;
            background-size: cover;
          }
          .avatar {
            position: absolute;
            z-index: 3;
            width: 146px;
            height: 146px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: url("@/assets/activity/ramadan/rank/avatar2.png") no-repeat bottom center;
            background-size: cover;
          }
          .avatar-img {
            position: absolute;
            top: 29px;
            left: 50%;
            transform: translateX(-50%);
            width: 88px;
            height: 88px;
            border-radius: 50%;
            z-index: 2;
          }
          .name {
            width: 100%;
            box-sizing: border-box;
            padding: 0 10px;
            height: 22px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 16px;
            color: #533500;
            line-height: 22px;
            text-align: center;
            margin-top: 147px;
            margin-bottom: 6px;
            position: relative;
            z-index: 4;
          }
          .number {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 4;
            width: 107px;
            height: 24px;
            background: linear-gradient(180deg, #ba863d 0%, #f9e58d 100%);
            box-shadow: 0px 2px 0px 0px rgba(165, 135, 16, 0.43);
            border-radius: 13px;
            > img {
              width: 22px;
              height: 22px;
              background: url("@/assets/activity/ramadan/rank/icon.png") no-repeat bottom center;
              background-size: cover;
              margin-right: 3px;
            }
            > span {
              height: 18px;
              font-family:
                PingFangSC,
                PingFang SC;
              font-weight: 500;
              font-size: 12px;
              color: #470110;
              line-height: 18px;
              text-align: center;
            }
          }
        }
        .top2 {
          position: absolute;
          left: 32px;
        }
        .top3 {
          position: absolute;
          right: 32px;
          .bg-top {
            background: url("@/assets/activity/ramadan/rank/top3.png") no-repeat bottom center;
            background-size: cover;
          }
          .avatar {
            background: url("@/assets/activity/ramadan/rank/avatar3.png") no-repeat bottom center;
            background-size: cover;
          }
        }
      }
      .rank-list {
        margin-top: 28px;
        width: 100%;
        height: 384px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .rank-item {
          flex-shrink: 0;
          width: 345px;
          height: 64px;
          box-sizing: border-box;
          padding: 12px 0;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          &:last-child {
            margin-bottom: 78px;
          }
          .sort {
            width: 39px;
            height: 20px;
            margin-right: 5px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 14px;
            color: #f0fb5d;
            line-height: 20px;
            text-align: center;
          }
          .avatar-img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid #eff4a9;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            margin-right: 8px;
            overflow: hidden;
            > img {
              width: 40px;
            }
          }
          .avatar-img-ar {
            margin-right: 0;
            margin-left: 8px;
          }
          .name {
            width: 139px;
            height: 20px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 14px;
            color: #ffffff;
            line-height: 20px;
            text-align: left;
          }
          .name-ar {
            text-align: right;
          }
          .number {
            width: 109px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            > img {
              width: 22px;
              height: 22px;
              margin-right: 4px;
            }
            > span {
              font-family:
                PingFangSC,
                PingFang SC;
              font-weight: 500;
              font-size: 14px;
              color: #fff099;
              line-height: 22px;
              text-align: right;
            }
          }
          .number-ar {
            > img {
              margin-right: 0;
              margin-left: 4px;
            }
          }
        }
      }
      .rank-my {
        position: absolute;
        top: 897px;
        left: 50%;
        transform: translateX(-50%);
        width: 341px;
        height: 78px;
        background: url("@/assets/activity/ramadan/rank/rank_item.png") no-repeat bottom center;
        background-size: cover;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .sort {
          width: 41px;
          height: 20px;
          margin-right: 5px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #f0fb5d;
          line-height: 20px;
          text-align: center;
        }
        .avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #eff4a9;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          margin-right: 8px;
          overflow: hidden;
          > img {
            width: 40px;
          }
        }
        .avatar-img-ar {
          margin-right: 0;
          margin-left: 8px;
        }
        .name {
          width: 139px;
          height: 20px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          text-align: left;
        }
        .name-ar {
          text-align: right;
        }
        .number {
          width: 97px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          > img {
            width: 22px;
            height: 22px;
            margin-right: 4px;
          }
          > span {
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 14px;
            color: #fff099;
            line-height: 22px;
            text-align: right;
          }
        }
        .number-ar {
          > img {
            margin-right: 0;
            margin-left: 4px;
          }
        }
      }
    }
  }
}
</style>
