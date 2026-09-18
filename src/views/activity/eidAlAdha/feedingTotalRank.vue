<!-- 总榜 -->
<template>
  <div class="pages">
    <div class="tab">
      <div class="tab-list">
        <div
          class="tab-item"
          :class="{ 'tab-item-show': curTab === item.value }"
          @click="changeTab(item)"
          v-for="item in tabList"
          :key="item.value"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="tip" v-if="curTab === 1" v-html="$t('eidAlAdha.wealthRankTip')"></div>
    <div class="tip" v-if="curTab === 2" v-html="$t('eidAlAdha.charmRankTip')"></div>
    <div class="feeding-total-rank">
      <div class="reward">
        <div class="title">{{ $t("eidAlAdha.rankReward") }}</div>
        <div class="left" @click="last"></div>
        <div class="right" @click="next"></div>
        <div class="reward-swiper">
          <Swiper
            :initial-slide="swiperIndex"
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
      <div class="rank">
        <div class="top">
          <div class="top1" v-if="rankList?.length > 0">
            <div class="avatar">
              <div class="avatar-frame"></div>
              <div class="profile-picture">
                <img :src="top1Info.avatar" alt="" />
              </div>
            </div>
            <div class="name-points">
              <div class="name text-line-hide">{{ top1Info.nick }}</div>
              <div class="points">
                <div class="gold"></div>
                <div class="number">{{ formatNumber(top1Info.integral) }}</div>
              </div>
            </div>
          </div>
          <div class="top2" v-if="rankList?.length > 1">
            <div class="avatar">
              <div class="avatar-frame"></div>
              <div class="profile-picture">
                <img :src="top2Info.avatar" alt="" />
              </div>
            </div>
            <div class="name-points">
              <div class="name text-line-hide">{{ top2Info.nick }}</div>
              <div class="points">
                <div class="gold"></div>
                <div class="number">{{ formatNumber(top2Info.integral) }}</div>
              </div>
            </div>
          </div>
          <div class="top3" v-if="rankList?.length > 2">
            <div class="avatar">
              <div class="avatar-frame"></div>
              <div class="profile-picture">
                <img :src="top3Info.avatar" alt="" />
              </div>
            </div>
            <div class="name-points">
              <div class="name text-line-hide">{{ top3Info.nick }}</div>
              <div class="points">
                <div class="gold"></div>
                <div class="number">{{ formatNumber(top3Info.integral) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="rank-list">
          <div
            class="rank-item"
            :class="{ 'rank-item-ar': store.language === 'ar' }"
            v-for="(item, index) in isMore ? rankList?.slice(3) : rankList?.slice(3, 9)"
            :key="index"
          >
            <div class="sort">
              {{ item.index === 0 || item.index > 99 ? "99+" : item.index }}
            </div>
            <div class="avatar">
              <div class="avatar-frame"></div>
              <div class="profile-picture">
                <img :src="item.avatar" alt="" />
              </div>
            </div>
            <div class="name text-line-hide">{{ item.nick }}</div>
            <div class="gold"></div>
            <div class="points">{{ formatNumber(item.integral) }}</div>
          </div>
        </div>
        <div class="more" v-if="!isMore && rankList?.length > 9" @click="isMore = true">
          {{ $t("eidAlAdha.viewMore") }}
        </div>
      </div>
    </div>
    <div class="user-info" :class="{ 'user-info-ar': store.language === 'ar' }" v-if="selfvalue">
      <div class="sort" :class="{ sort99: selfvalue.index === 0 || selfvalue.index > 99 }">
        {{ selfvalue.index === 0 || selfvalue.index > 99 ? "99+" : selfvalue.index }}
      </div>
      <div class="avatar">
        <!-- <div class="avatar-frame"></div>
        <div class="profile-picture"></div> -->
        <img class="profile-picture" :src="selfvalue.avatar" alt="" />
      </div>
      <div class="name text-line-hide">{{ selfvalue.nick }}</div>
      <div class="gold"></div>
      <div class="points">{{ formatNumber(selfvalue.integral) }}</div>
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
const swiperIndex = ref(0);
const activeIndex = ref(0);
const curTab = ref(1);
const rankValue = ref(2);
const rewardValue = ref(26);
const tabList = [
  {
    text: t("eidAlAdha.wealth"),
    value: 1,
    rewardValue: 26,
    rankValue: 2,
  },
  {
    text: t("eidAlAdha.charm"),
    value: 2,
    rewardValue: 27,
    rankValue: 3,
  },
];
const rewardList = ref([]);
const rankList = ref([]);
const isMore = ref(false);
const selfvalue = ref(null);
const top1Info = ref({});
const top2Info = ref({});
const top3Info = ref({});

// 切换tab
const changeTab = async (item) => {
  rankList.value = [];
  rewardList.value = [];
  curTab.value = item.value;
  rewardValue.value = item.rewardValue;
  rankValue.value = item.rankValue;
  await getFeedingTotalRankReward();
  await getFeedingTotalRank();
};

// 切换swiper
const onSwiperChange = (swiper) => {
  swiperIndex.value = swiper.activeIndex;
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

// 获取喂养总榜奖励列表
const getFeedingTotalRankReward = async () => {
  try {
    const res = await get("/h5doings/activity/eidAlAdha2026/rankRewards", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      groupType: rewardValue.value,
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

// 获取总榜数据
const getFeedingTotalRank = async () => {
  try {
    const res = await get("/h5doings/activity/eidAlAdha2026/rank", {
      uid: store.uid,
      type: rankValue.value,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      rankList.value = res.data.list;
      selfvalue.value = res.data.self || null;
      if (rankList?.value?.length > 0) {
        top1Info.value = rankList?.value[0];
      }
      if (rankList?.value?.length > 1) {
        top2Info.value = rankList?.value[1];
      }
      if (rankList?.value?.length > 2) {
        top3Info.value = rankList?.value[2];
      }
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(async () => {
  await getFeedingTotalRankReward();
  await getFeedingTotalRank();
});
</script>

<style lang="scss" scoped>
.pages {
  width: 100%;
  height: 1841px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  .tab {
    width: 191px;
    height: 34px;
    background: #106840;
    border-radius: 17px;
    border: 1px solid rgba(255, 255, 255, 0.17);
    .tab-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tab-item {
        width: 96px;
        height: 36px;
        box-sizing: border-box;
        padding-bottom: 4px;
        font-weight: bold;
        font-size: 14px;
        color: #3eb07d;
        line-height: 14px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .tab-item-show {
        width: 96px;
        height: 36px;
        box-sizing: border-box;
        padding-bottom: 4px;
        background: url("@/assets/activity/eidAlAdha/feedingTotalRank/tab.png") no-repeat center -2px;
        background-size: cover;
        font-weight: bold;
        font-size: 14px;
        color: #843601;
        line-height: 14px;
        text-align: center;
      }
    }
  }
  .tip {
    width: 332px;
    height: 20px;
    font-weight: bold;
    font-size: 14px;
    color: #6cca63;
    line-height: 20px;
    text-align: center;
    margin: 16px auto 19px;
    ::v-deep(.yellow) {
      color: #faee28;
    }
  }
  .feeding-total-rank {
    width: 100%;
    height: 1652px;
    background: url("@/assets/activity/eidAlAdha/feedingTotalRank/bg.png") no-repeat center center;
    background-size: cover;
    position: relative;
    .reward {
      width: 100%;
      height: 526px;
      position: relative;
      .title {
        position: absolute;
        top: 32px;
        left: 50%;
        transform: translateX(-50%);
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: bold;
        font-size: 16px;
        height: 16px;
        line-height: 16px;
        color: #f8fc98;
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
        text-align: center;
      }
      .left {
        position: absolute;
        top: 257px;
        left: 16px;
        width: 39px;
        height: 45px;
        z-index: 9;
        background: url("@/assets/activity/eidAlAdha/feedingTotalRank/last.png") no-repeat bottom center;
        background-size: cover;
      }
      .right {
        position: absolute;
        top: 257px;
        right: 16px;
        width: 39px;
        height: 45px;
        z-index: 9;
        background: url("@/assets/activity/eidAlAdha/feedingTotalRank/next.png") no-repeat bottom center;
        background-size: cover;
      }

      .reward-swiper {
        width: 100%;
        height: 100%;
        position: relative;
        top: 88px;
        .top {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 77px;
          height: 36px;
          background: url("@/assets/activity/eidAlAdha/feedingTotalRank/topBg.png") no-repeat bottom center;
          background-size: cover;
          font-weight: bold;
          font-size: 14px;
          color: #8d3200;
          line-height: 36px;
          text-align: center;
        }
        .reward-list {
          position: absolute;
          width: 240px;
          top: 57px;
          left: 50%;
          transform: translateX(-50%);
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          .reward-item {
            width: 110px;
            height: 138px;
            margin-bottom: 19px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .reward-img {
              width: 110px;
              height: 110px;
              background: url("@/assets/activity/eidAlAdha/feedingTotalRank/rankingItemBg.png") no-repeat bottom center;
              background-size: cover;
              display: flex;
              justify-content: center;
              align-items: center;
              > img {
                width: 60px;
                height: 60px;
              }
            }
            .reward-name {
              max-width: 110px;
              width: auto;
              box-sizing: border-box;
              padding: 0 15px;
              height: 20px;
              font-weight: bold;
              font-size: 14px;
              color: #faee28;
              line-height: 18px;
              text-align: center;
            }
          }
        }
      }
    }
    .rank {
      width: 100%;
      height: 1126px;
      position: relative;
      .top {
        width: 100%;
        height: 545px;
        position: absolute;
        top: 0;
        left: 0;
        .top1,
        .top2,
        .top3 {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }
        .top1 {
          position: absolute;
          width: 256px;
          height: 277px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          .avatar {
            width: 256px;
            height: 194px;
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
            .avatar-frame {
              position: absolute;
              top: 0;
              left: 0;
              width: 256px;
              height: 194px;
              background: url("@/assets/activity/eidAlAdha/feedingTotalRank/top1.png") no-repeat center center;
              background-size: cover;
              z-index: 2;
            }
            .profile-picture {
              position: absolute;
              width: 104px;
              height: 104px;
              top: 45px;
              left: 50%;
              transform: translateX(-50%);
              overflow: hidden;
              > img {
                width: 104px;
                height: 104px;
                border-radius: 50%;
              }
            }
          }
          .name-points {
            position: absolute;
            z-index: 1;
            width: 140px;
            height: 205px;
            top: 72px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            background: url("@/assets/activity/eidAlAdha/feedingTotalRank/top1Bg.png") no-repeat center center;
            background-size: cover;
            .name {
              position: absolute;
              width: 120px;
              height: 20px;
              top: 110px;
              left: 50%;
              transform: translateX(-50%);
              font-weight: bold;
              font-size: 14px;
              color: #5f3e01;
              line-height: 20px;
              text-align: center;
            }
            .points {
              position: absolute;
              top: 135px;
              left: 50%;
              transform: translateX(-50%);
              width: 84px;
              height: 24px;
              background: linear-gradient(180deg, #f88a4d 0%, #c1252b 100%);
              border-radius: 13px;
              border: 1px solid #fcc74b;
              display: flex;
              justify-content: center;
              align-items: center;
              .gold {
                width: 16px;
                height: 16px;
                margin-right: 3px;
                background: url("@/assets/activity/eidAlAdha/feedingTotalRank/gold.png") no-repeat center center;
                background-size: cover;
              }
              .number {
                width: 41px;
                height: 18px;
                font-weight: bold;
                font-size: 12px;
                color: #fffcaf;
                line-height: 18px;
                text-align: left;
              }
            }
          }
        }
        .top2 {
          position: absolute;
          width: 126px;
          height: 222px;
          top: 285px;
          left: 36px;
          .avatar {
            width: 126px;
            height: 126px;
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
            .avatar-frame {
              position: absolute;
              top: 0;
              left: 0;
              width: 126px;
              height: 126px;
              background: url("@/assets/activity/eidAlAdha/feedingTotalRank/top2.png") no-repeat center center;
              background-size: cover;
              z-index: 2;
            }
            .profile-picture {
              position: absolute;
              width: 90px;
              height: 90px;
              top: 18px;
              left: 50%;
              transform: translateX(-50%);
              overflow: hidden;

              > img {
                width: 90px;
                height: 90px;
                border-radius: 50%;
              }
            }
          }
          .name-points {
            position: absolute;
            z-index: 1;
            width: 112px;
            height: 137px;
            top: 85px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            background: url("@/assets/activity/eidAlAdha/feedingTotalRank/top2Bg.png") no-repeat center center;
            background-size: cover;
            .name {
              position: absolute;
              top: 48px;
              width: 100px;
              height: 20px;
              font-weight: 500;
              font-size: 14px;
              color: #240b90;
              line-height: 20px;
              text-align: center;
            }
            .points {
              position: absolute;
              top: 73px;
              left: 50%;
              transform: translateX(-50%);
              width: 84px;
              height: 24px;
              background: linear-gradient(180deg, #f88a4d 0%, #c1252b 100%);
              border-radius: 13px;
              border: 1px solid #fcc74b;
              display: flex;
              justify-content: center;
              align-items: center;
              > .gold {
                width: 16px;
                height: 16px;
                background: url("@/assets/activity/eidAlAdha/feedingTotalRank/gold.png") no-repeat center center;
                background-size: cover;
                margin-right: 3px;
              }
              .number {
                width: 41px;
                height: 18px;
                font-weight: bold;
                font-size: 12px;
                color: #fffcaf;
                line-height: 18px;
                text-align: left;
              }
            }
          }
        }
        .top3 {
          position: absolute;
          width: 126px;
          height: 222px;
          top: 285px;
          right: 36px;
          .avatar {
            width: 126px;
            height: 126px;
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
            .avatar-frame {
              position: absolute;
              top: 0;
              left: 0;
              width: 126px;
              height: 126px;
              background: url("@/assets/activity/eidAlAdha/feedingTotalRank/top3.png") no-repeat center center;
              background-size: cover;
              z-index: 2;
            }
            .profile-picture {
              position: absolute;
              width: 90px;
              height: 90px;
              top: 18px;
              left: 50%;
              transform: translateX(-50%);
              overflow: hidden;
              > img {
                width: 90px;
                height: 90px;
                border-radius: 50%;
              }
            }
          }
          .name-points {
            position: absolute;
            z-index: 1;
            width: 112px;
            height: 137px;
            top: 85px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            background: url("@/assets/activity/eidAlAdha/feedingTotalRank/top3Bg.png") no-repeat center center;
            background-size: cover;
            .name {
              position: absolute;
              top: 48px;
              width: 100px;
              height: 20px;
              font-weight: 500;
              font-size: 14px;
              color: #240b90;
              line-height: 20px;
              text-align: center;
            }
            .points {
              position: absolute;
              top: 73px;
              left: 50%;
              transform: translateX(-50%);
              width: 84px;
              height: 24px;
              background: linear-gradient(180deg, #f88a4d 0%, #c1252b 100%);
              border-radius: 13px;
              border: 1px solid #fcc74b;
              display: flex;
              justify-content: center;
              align-items: center;
              > .gold {
                width: 16px;
                height: 16px;
                background: url("@/assets/activity/eidAlAdha/feedingTotalRank/gold.png") no-repeat center center;
                background-size: cover;
                margin-right: 3px;
              }
              .number {
                width: 41px;
                height: 18px;
                font-weight: bold;
                font-size: 12px;
                color: #fffcaf;
                line-height: 18px;
                text-align: left;
              }
            }
          }
        }
      }
      .rank-list {
        width: 100%;
        height: 510px;
        position: absolute;
        top: 545px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .rank-item {
          width: 341px;
          height: 75px;
          background: url("@/assets/activity/eidAlAdha/feedingTotalRank/itemBg.png") no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 8px;
          .sort {
            width: 36px;
            height: 36px;
            background: url("@/assets/activity/eidAlAdha/feedingTotalRank/sortBg.png") no-repeat center center;
            background-size: cover;
            margin: 0 11px 0 26px;
            font-weight: bold;
            font-size: 14px;
            color: #d4f08c;
            line-height: 20px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .avatar {
            width: 47px;
            height: 47px;
            margin-right: 14px;
            overflow: hidden;
            border-radius: 50%;
            // .avatar-frame {
            // }
            .profile-picture {
              width: 47px;
              height: 47px;
              overflow: hidden;
              border-radius: 50%;
              > img {
                width: 47px;
                height: 47px;
              }
            }
          }
          .name {
            width: 95px;
            min-height: 18px;
            margin-right: 10px;
            font-weight: bold;
            font-size: 13px;
            color: #2c411b;
            line-height: 18px;
            text-align: left;
          }
          .gold {
            width: 16px;
            height: 16px;
            background: url("@/assets/activity/eidAlAdha/feedingTotalRank/gold.png") no-repeat center center;
            background-size: cover;
          }
          .points {
            width: 70px;
            margin-left: 5px;
            min-height: 20px;
            font-weight: bold;
            font-size: 14px;
            color: #0f5a37;
            line-height: 20px;
            text-align: left;
          }
        }
        .rank-item-ar {
          .sort {
            margin: 0 33px 0 11px;
          }
          .avatar {
            margin-right: 0;
            margin-left: 14px;
          }
          .name {
            text-align: right;
            margin-left: 0px;
            margin-right: 10px;
          }
          .points {
            text-align: right;
            margin-left: 0px;
            margin-right: 5px;
          }
        }
      }
      .more {
        position: absolute;
        top: 1049px;
        left: 50%;
        transform: translateX(-50%);
        width: 79px;
        height: 24px;
        background: linear-gradient(180deg, #f8d888 0%, #ecaa41 100%);
        border-radius: 13px;
        border: 1px solid #e9a905;
        font-size: 12px;
        color: #473a01;
        line-height: 24px;
        text-align: center;
      }
    }
  }
  .user-info {
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: url("@/assets/activity/eidAlAdha/feedingTotalRank/userInfoBg.png") no-repeat center center;
    background-size: cover;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .sort {
      width: 36px;
      height: 36px;
      margin: 0 11px 0 9px;
      font-weight: bold;
      font-size: 14px;
      color: #b8f775;
      line-height: 20px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/eidAlAdha/feedingTotalRank/sortBg.png") no-repeat center center;
      background-size: cover;
    }
    .sort99 {
      font-size: 10px !important;
    }
    .avatar {
      width: 47px;
      height: 47px;
      margin-right: 14px;
      border-radius: 50%;
      overflow: hidden;
      // .avatar-frame {
      // }
      .profile-picture {
        width: 47px;
        height: 47px;
      }
    }
    .name {
      width: 145px;
      min-height: 18px;
      margin-right: 10px;
      font-weight: bold;
      font-size: 13px;
      color: #2c411b;
      line-height: 18px;
      text-align: left;
    }
    .gold {
      width: 16px;
      height: 16px;
      background: url("@/assets/activity/eidAlAdha/feedingTotalRank/gold.png") no-repeat center center;
      background-size: cover;
    }
    .points {
      max-width: 78px;
      min-height: 20px;
      font-weight: bold;
      font-size: 14px;
      color: #0f5a37;
      line-height: 20px;
      text-align: right;
      margin-left: 5px;
    }
  }
  .user-info-ar {
    .sort {
      margin: 0 9px 0 11px;
    }
    .avatar {
      margin-right: 0;
      margin-left: 14px;
    }
    .name {
      text-align: right;
      margin-left: 10px;
      margin-right: 0px;
    }
    .points {
      text-align: right;
      margin-left: 0px;
      margin-right: 5px;
    }
  }
}
.text-line-hide {
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
}
</style>
