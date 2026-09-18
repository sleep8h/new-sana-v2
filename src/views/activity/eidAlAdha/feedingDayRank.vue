<!-- 喂养日榜 -->
<template>
  <div class="feeding-day-rank">
    <div class="rank">
      <div class="tip">{{ $t("eidAlAdha.dayRankTip") }}</div>
      <div class="date-step" ref="scrollContainer">
        <div class="date-list">
          <div class="line"></div>
          <div
            class="date-item"
            v-for="(item, index) in processedDateList"
            :key="index"
            @click="changeDate(item)"
            :id="`date-${index}`"
          >
            <div
              class="date-type"
              :class="{
                actived: item.date === curDate,
                'not-arrive': item.isFuture,
                'past-date': item.isPast || item.isToday,
              }"
            >
              <div v-if="item.date === curDate" class="actived-child"></div>
            </div>
            <span>{{ item.dateText }}</span>
          </div>
        </div>
      </div>
      <div class="gift" @click="dailyRankRewardShow = true"></div>
      <div class="top">
        <div class="top1" v-if="dayRankList?.length > 0">
          <div class="avatar">
            <div class="avatar-frame"></div>
            <div class="profile-picture">
              <img :src="top1Info.avatar" alt="" />
            </div>
          </div>
          <div class="name text-line-hide">{{ top1Info.nick }}</div>
          <div class="points">{{ $t("eidAlAdha.points", { number: top1Info.integral }) }}</div>
        </div>
        <div class="top2" v-if="dayRankList?.length > 1">
          <div class="avatar">
            <div class="avatar-frame"></div>
            <div class="profile-picture">
              <img :src="top2Info.avatar" alt="" />
            </div>
          </div>
          <div class="name text-line-hide">{{ top2Info.nick }}</div>
          <div class="points">{{ $t("eidAlAdha.points", { number: top2Info.integral }) }}</div>
        </div>
        <div class="top3" v-if="dayRankList?.length > 2">
          <div class="avatar">
            <div class="avatar-frame"></div>
            <div class="profile-picture">
              <img :src="top3Info.avatar" alt="" />
            </div>
          </div>
          <div class="name text-line-hide">{{ top3Info.nick }}</div>
          <div class="points">{{ $t("eidAlAdha.points", { number: top3Info.integral }) }}</div>
        </div>
      </div>
      <div class="rank-list">
        <div
          class="rank-item"
          :class="{ 'rank-item-ar': store.language === 'ar' }"
          v-for="(item, index) in isMore ? dayRankList?.slice(3) : dayRankList?.slice(3, 9)"
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
          <div class="points">{{ $t("eidAlAdha.points", { number: item.integral }) }}</div>
        </div>
      </div>
      <div class="more" v-if="!isMore && dayRankList?.length > 9" @click="isMore = true">
        {{ $t("eidAlAdha.viewMore") }}
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
      <div class="points">{{ $t("eidAlAdha.points", { number: selfvalue.integral }) }}</div>
    </div>
    <DailyRankReward
      v-model:isShow="dailyRankRewardShow"
      :content="$t('eidAlAdha.dailyRankingReward')"
      :list="dailyRankRewardList"
      @close="dailyRankRewardShow = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

// 喂养日榜奖励列表组件
import DailyRankReward from "@/views/activity/eidAlAdha/components/dailyRankReward.vue";

// 定义emit
const emit = defineEmits(["timeChange"]);

const { t } = useI18n();
const store = useMainStore();
const now = new Date(); // 自动使用本地时区
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始
const day = String(now.getDate()).padStart(2, "0");
const today = `${year}-${month}-${day}`; // 格式如 "2026-05-20"
const curDate = ref(`${year}-${month}-${day}`);
const scrollContainer = ref(null);
const dateList = ref([
  {
    dateText: "5.25",
    date: "2026-05-25",
  },
  {
    dateText: "5.26",
    date: "2026-05-26",
  },
  {
    dateText: "5.27",
    date: "2026-05-27",
  },
  {
    dateText: "5.28",
    date: "2026-05-28",
  },
  {
    dateText: "5.29",
    date: "2026-05-29",
  },
  {
    dateText: "5.30",
    date: "2026-05-30",
  },
  {
    dateText: "5.31",
    date: "2026-05-31",
  },
  {
    dateText: "6.01",
    date: "2026-06-01",
  },
  {
    dateText: "6.02",
    date: "2026-06-02",
  },
  {
    dateText: "6.03",
    date: "2026-06-03",
  },
]);

const dayRankList = ref([]);
const isMore = ref(false);
const selfvalue = ref(null);
const top1Info = ref({});
const top2Info = ref({});
const top3Info = ref({});
const dailyRankRewardShow = ref(false);
const dailyRankRewardList = ref([]);

// 为每个日期添加状态标记
const processedDateList = computed(() => {
  return dateList.value.map((item) => {
    const isToday = item.date === today;
    const isPast = new Date(item.date) < new Date(today);
    const isFuture = new Date(item.date) > new Date(today);
    return { ...item, isToday, isPast, isFuture };
  });
});

const changeDate = (item) => {
  if (item.isFuture) return false;
  curDate.value = item.date;
  // 找到选中日期的索引
  const index = dateList.value.findIndex((d) => d.date === item.date);
  if (index >= 0) {
    nextTick(() => {
      const targetEl = document.getElementById(`date-${index}`);
      if (targetEl && scrollContainer.value) {
        // 横向滚动到目标元素中心位置
        const container = scrollContainer.value;
        const targetLeft = targetEl.offsetLeft;
        const containerWidth = container.clientWidth;
        container.scrollTo({
          left: targetLeft - containerWidth / 2 + targetEl.clientWidth / 2,
          behavior: "smooth",
        });
      }
    });
  }
  getEidAlAdha2026Rank();
};

// 获取喂养日榜数据
const getEidAlAdha2026Rank = async () => {
  try {
    const res = await get("/h5doings/activity/eidAlAdha2026/rank", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      size: 99,
      type: curDate.value === today ? "1" : "4",
      sub: true,
      str: curDate.value === today ? "" : curDate.value,
    });
    if (res && res.code === 200) {
      dayRankList.value = res.data.list || [];
      selfvalue.value = res.data.self || null;
      if (dayRankList?.value?.length > 0) {
        top1Info.value = dayRankList.value[0];
      }
      if (dayRankList?.value?.length > 1) {
        top2Info.value = dayRankList.value[1];
      }
      if (dayRankList?.value?.length > 2) {
        top3Info.value = dayRankList.value[2];
      }
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取喂养日榜奖励列表
const getFeedingTotalRankReward = async () => {
  try {
    const res = await get("/h5doings/activity/eidAlAdha2026/rankRewards", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      groupType: "25",
    });
    if (res && res.code === 200) {
      dailyRankRewardList.value = res.data;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(() => {
  const todayIndex = dateList.value.findIndex((d) => d.date === today);
  if (todayIndex >= 0) {
    changeDate(dateList.value[todayIndex]);
  } else {
    getEidAlAdha2026Rank();
  }
  getFeedingTotalRankReward();
});
</script>

<style lang="scss" scoped>
.feeding-day-rank {
  width: 100%;
  height: 1278px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  .rank {
    width: 100%;
    height: 1182px;
    background: url("@/assets/activity/eidAlAdha/feedingDayRank/bg.png") no-repeat center center;
    background-size: cover;
    position: relative;
    .tip {
      width: 305px;
      height: 40px;
      margin: 60px auto 11px;
      font-weight: bold;
      font-size: 14px;
      color: #6cca63;
      line-height: 20px;
      text-align: center;
    }
    .date-step {
      width: 337px;
      height: 44px;
      margin: 0 11px 0 27px;
      overflow-x: auto;
      display: flex;
      overflow-x: auto;
      scroll-behavior: smooth; /* 平滑滚动 */
      white-space: nowrap;
      &::-webkit-scrollbar {
        display: none;
      }
      .date-list {
        width: 557px;
        height: 44px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        .line {
          position: absolute;
          left: 15px;
          top: 19px;
          width: 500px;
          height: 2px;
          background: #f0dd80;
        }
        .date-item {
          width: 25px;
          height: 44px;
          flex-shrink: 0;
          margin-right: 31px;
          font-size: 14px;
          color: #333333;
          line-height: 44px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .past-date {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #b7a239;
            margin: 16px auto 3px;
            position: relative;
            z-index: 3;
          }
          .actived {
            position: relative;
            z-index: 3;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid rgba(255, 238, 143, 0.38);
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 12px auto 0px;
            .actived-child {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #ff8200;
              border: 1px solid #ffee8f;
            }
          }
          .not-arrive {
            position: relative;
            z-index: 3;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin: 16px auto 3px;
            background: #06b336;
            border: 1px solid #ffee8f;
          }
          > span {
            display: inline-block;
            width: 25px;
            height: 17px;
            margin-top: -1px;
            font-weight: bold;
            font-size: 12px;
            color: rgba(255, 251, 127, 0.35);
            line-height: 17px;
            text-align: center;
          }
        }
      }
    }
    .gift {
      position: absolute;
      top: 195px;
      left: 14px;
      width: 62px;
      height: 62px;
      z-index: 6;
      background: url("@/assets/activity/eidAlAdha/feedingDayRank/gift.png") no-repeat center center;
      background-size: cover;
    }
    .top {
      width: 100%;
      height: 500px;
      position: absolute;
      top: 155px;
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
        width: 216px;
        height: 198px;
        top: 83px;
        left: 50%;
        transform: translateX(-50%);
        .avatar {
          width: 216px;
          height: 146px;
          position: absolute;
          top: 0;
          left: 0;
          .avatar-frame {
            position: absolute;
            top: 0;
            left: 0;
            width: 216px;
            height: 146px;
            background: url("@/assets/activity/eidAlAdha/feedingDayRank/top1.png") no-repeat center center;
            background-size: cover;
            z-index: 2;
          }
          .profile-picture {
            position: absolute;
            top: 21px;
            left: 50%;
            transform: translateX(-50%);
            width: 104px;
            height: 104px;
            overflow: hidden;
            > img {
              width: 104px;
              border-radius: 50%;
            }
          }
        }
        .name {
          position: absolute;
          width: 78px;
          height: 20px;
          top: 149px;
          left: 50%;
          transform: translateX(-50%);
          background: url("@/assets/activity/eidAlAdha/feedingDayRank/nameBg.png") no-repeat center center;
          background-size: cover;
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          text-align: center;
        }
        .points {
          position: absolute;
          top: 174px;
          left: 50%;
          transform: translateX(-50%);
          width: 107px;
          height: 24px;
          background: linear-gradient(180deg, #f88a4d 0%, #c1252b 100%);
          border-radius: 13px;
          border: 1px solid #fcc74b;
          font-weight: bold;
          font-size: 12px;
          color: #fffcaf;
          line-height: 24px;
          text-align: center;
        }
      }
      .top2 {
        position: absolute;
        width: 124px;
        height: 177px;
        top: 293px;
        left: 37px;
        .avatar {
          width: 124px;
          height: 124px;
          position: absolute;
          top: 0;
          left: 0;
          .avatar-frame {
            position: absolute;
            top: 0;
            left: 0;
            width: 124px;
            height: 124px;
            background: url("@/assets/activity/eidAlAdha/feedingDayRank/top2.png") no-repeat center center;
            background-size: cover;
            z-index: 2;
          }
          .profile-picture {
            position: absolute;
            top: 17px;
            left: 50%;
            transform: translateX(-50%);
            width: 90px;
            height: 90px;
            overflow: hidden;

            > img {
              width: 90px;
              border-radius: 50%;
            }
          }
        }
        .name {
          position: absolute;
          width: 78px;
          height: 20px;
          top: 149px;
          left: 50%;
          transform: translateX(-50%);
          background: url("@/assets/activity/eidAlAdha/feedingDayRank/nameBg.png") no-repeat center center;
          background-size: cover;
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          text-align: center;
        }
        .points {
          position: absolute;
          top: 174px;
          left: 50%;
          transform: translateX(-50%);
          width: 107px;
          height: 24px;
          background: linear-gradient(180deg, #f88a4d 0%, #c1252b 100%);
          border-radius: 13px;
          border: 1px solid #fcc74b;
          font-weight: bold;
          font-size: 12px;
          color: #fffcaf;
          line-height: 24px;
          text-align: center;
        }
      }
      .top3 {
        position: absolute;
        width: 124px;
        height: 177px;
        top: 293px;
        right: 38px;
        .avatar {
          width: 124px;
          height: 124px;
          position: absolute;
          top: 0;
          left: 0;
          .avatar-frame {
            position: absolute;
            top: 0;
            left: 0;
            width: 124px;
            height: 124px;
            background: url("@/assets/activity/eidAlAdha/feedingDayRank/top2.png") no-repeat center center;
            background-size: cover;
            z-index: 2;
          }
          .profile-picture {
            position: absolute;
            top: 17px;
            left: 50%;
            transform: translateX(-50%);
            width: 90px;
            height: 90px;
            overflow: hidden;
            > img {
              width: 90px;
              border-radius: 50%;
            }
          }
        }
        .name {
          position: absolute;
          width: 78px;
          height: 20px;
          top: 149px;
          left: 50%;
          transform: translateX(-50%);
          background: url("@/assets/activity/eidAlAdha/feedingDayRank/nameBg.png") no-repeat center center;
          background-size: cover;
          font-weight: bold;
          font-size: 14px;
          color: #ffffff;
          line-height: 20px;
          text-align: center;
        }
        .points {
          position: absolute;
          top: 174px;
          left: 50%;
          transform: translateX(-50%);
          width: 107px;
          height: 24px;
          background: linear-gradient(180deg, #f88a4d 0%, #c1252b 100%);
          border-radius: 13px;
          border: 1px solid #fcc74b;
          font-weight: bold;
          font-size: 12px;
          color: #fffcaf;
          line-height: 24px;
          text-align: center;
        }
      }
    }
    .rank-list {
      width: 100%;
      height: 444px;
      position: absolute;
      top: 655px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .rank-item {
        width: 352px;
        height: 66px;
        background: url("@/assets/activity/eidAlAdha/feedingDayRank/itemBg.png") no-repeat center center;
        background-size: cover;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 8px;
        .sort {
          width: 36px;
          height: 36px;
          background: url("@/assets/activity/eidAlAdha/feedingDayRank/sortBg.png") no-repeat center center;
          background-size: cover;
          margin: 0 11px 0 33px;
          font-weight: bold;
          font-size: 14px;
          color: #107110;
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
          width: 91px;
          min-height: 18px;
          margin-right: 10px;
          font-weight: bold;
          font-size: 13px;
          color: #b8f775;
          line-height: 18px;
          text-align: left;
        }
        .points {
          width: 71px;
          min-height: 20px;
          font-weight: bold;
          font-size: 14px;
          color: #cfff26;
          line-height: 20px;
          text-align: right;
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
          text-align: left;
        }
      }
    }
    .more {
      position: absolute;
      top: 1099px;
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
  .user-info {
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: url("@/assets/activity/eidAlAdha/feedingDayRank/userInfo.png") no-repeat center center;
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
      color: #107110;
      line-height: 20px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/eidAlAdha/feedingDayRank/sortBg.png") no-repeat center center;
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
      width: 162px;
      min-height: 18px;
      margin-right: 10px;
      font-weight: bold;
      font-size: 13px;
      color: #b8f775;
      line-height: 18px;
      text-align: left;
    }
    .points {
      width: 71px;
      min-height: 20px;
      font-weight: bold;
      font-size: 14px;
      color: #cfff26;
      line-height: 20px;
      text-align: right;
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
      margin-left: 0px;
      margin-right: 10px;
    }
    .points {
      text-align: left;
    }
  }
}
.text-line-hide {
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
}
</style>
