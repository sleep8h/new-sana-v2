<!-- 榜单 -->
<template>
  <div class="reward" :class="({ reward3: curTabTime === 2 }, { 'reward-show': rewardShow })">
    <div class="tab-list">
      <div
        :class="['tab-item', { 'tab-show': curTab === item.value }]"
        v-for="(item, index) in tabList"
        :key="index"
        @click="tabChange(item.value)"
      >
        <span>{{ item.text }}</span>
      </div>
    </div>
    <div class="recharge-box">
      <div class="recharge-box-title">
        {{ curTab === 2 ? $t("recharge.weeklyRankingReward") : $t("recharge.monthlyRankingReward") }}
      </div>
      <div class="recharge-box-sec">
        <Swiper :slides-per-view="1" :space-between="0" @slideChange="onSwiperChange" style="height: 100%">
          <SwiperSlide v-for="(item, idx) in rankRewardList" :key="idx">
            <div class="recharge-box-list">
              <div class="recharge-box-top" v-if="idx === 0">{{ $t("recharge.top1") }}</div>
              <div class="recharge-box-top" v-if="idx === 1">{{ $t("recharge.top2") }}</div>
              <div class="recharge-box-top" v-if="idx === 2">{{ $t("recharge.top3") }}</div>
              <div
                class="recharge-track"
                :key="`${curTab}-${idx}`"
                :class="{
                  'is-marquee': item?.length >= 3,
                  'is-active': activeRewardIndex === idx,
                  'marquee-ar': store.language === 'ar',
                }"
                :style="item?.length >= 3 ? { animationDuration: `${item.length * 4}s` } : {}"
              >
                <div class="recharge-box-item" v-for="(items, indexs) in marqueeList(item)" :key="indexs">
                  <div class="recharge-box-pic">
                    <img :src="items.rewardUrl" alt="" />
                  </div>
                  <sanaAutoText class="recharge-box-text" v-if="items.rewardName">
                    {{
                      `${store.language === "ar" ? items.rewardNameAr : items.rewardName}${items.rewardValue ? " * " + items.rewardValue : ""}`
                    }}
                  </sanaAutoText>
                  <sanaAutoText class="recharge-box-text" v-else>
                    {{ `${items.rewardValue}` }}
                  </sanaAutoText>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div class="more" @click="rewardShow = true">
        <span>{{ $t("recharge.more") }}</span>
      </div>
    </div>
    <div class="rank" v-if="!rewardShow">
      <div class="rank-title">{{ $t("recharge.rank") }}</div>
      <div class="tab-time-list">
        <div
          :key="index"
          :class="['tab-time-item', { 'tab-time-show': curTabTime === item.value }]"
          v-for="(item, index) in curTab === 2 ? tabListTime : tabListTime1"
          @click="tabChangeTime(item.value)"
        >
          <span>{{ item.text }}</span>
        </div>
      </div>
      <div class="rank-list-section" v-if="curTabTime === 1">
        <div class="rank-top">
          <div class="rank-top-1" v-if="rankData?.length > 0">
            <div class="rank-top-avatar"></div>
            <img class="rank-top-head" :src="rankData[0].avatar" alt="" />
            <div class="rank-top-text">
              <div class="rank-top-name">{{ rankData[0].nick }}</div>
              <div class="rank-top-number">
                <div class="gold"></div>
                <span>{{ rankData[0].integral }}</span>
              </div>
            </div>
          </div>
          <div class="rank-top-2" v-if="rankData?.length > 1">
            <div class="rank-top-avatar"></div>
            <img class="rank-top-head" :src="rankData[1].avatar" alt="" />
            <div class="rank-top-text">
              <div class="rank-top-name">{{ rankData[1].nick }}</div>
              <div class="rank-top-number">
                <div class="gold"></div>
                <span>{{ rankData[1].integral }}</span>
              </div>
            </div>
          </div>
          <div class="rank-top-3" v-if="rankData?.length > 2">
            <div class="rank-top-avatar"></div>
            <img class="rank-top-head" :src="rankData[2].avatar" alt="" />
            <div class="rank-top-text">
              <div class="rank-top-name">{{ rankData[2].nick }}</div>
              <div class="rank-top-number">
                <div class="gold"></div>
                <span>{{ rankData[2].integral }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rank-list">
          <div class="rank-item" v-for="(item, index) in rankData.slice(3, 20)">
            <div class="sort">
              <span>{{ item.index }}</span>
              <span>TOP</span>
            </div>
            <div class="avatar">
              <img :src="item.avatar" alt="" />
            </div>
            <div class="name-id">
              <div class="name">{{ item.nick }}</div>
              <!-- <div class="id">{{ $t("recharge.id", { id: item.erbanNo }) }}</div> -->
            </div>
            <div class="number">
              <img src="@/assets/activity/recharge/reward/gold.png" alt="" class="diamond" />
              <span>{{ item.integral }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="rank-last" v-if="curTabTime === 2">
        <div class="rank-last-item" v-for="(item, index) in lastList" :key="index">
          <div class="rank-last-item-title">
            <span>{{ titleFilter(index) }}</span>
          </div>
          <div class="rank-top">
            <div class="rank-top-1" v-if="item?.length > 0">
              <div class="rank-top-avatar"></div>
              <img class="rank-top-head" :src="item[0]?.avatar" alt="" />
              <div class="rank-top-text">
                <div class="rank-top-name">{{ item[0]?.nick }}</div>
                <div class="rank-top-number">
                  <div class="gold"></div>
                  <span>{{ item[0]?.integral }}</span>
                </div>
              </div>
            </div>
            <div class="rank-top-2" v-if="item?.length > 1">
              <div class="rank-top-avatar"></div>
              <img class="rank-top-head" :src="item[1]?.avatar" alt="" />
              <div class="rank-top-text">
                <div class="rank-top-name">{{ item[1]?.nick }}</div>
                <div class="rank-top-number">
                  <div class="gold"></div>
                  <span>{{ item[1]?.integral }}</span>
                </div>
              </div>
            </div>
            <div class="rank-top-3" v-if="item?.length > 2">
              <div class="rank-top-avatar"></div>
              <img class="rank-top-head" :src="item[2]?.avatar" alt="" />
              <div class="rank-top-text">
                <div class="rank-top-name">{{ item[2]?.nick }}</div>
                <div class="rank-top-number">
                  <div class="gold"></div>
                  <span>{{ item[2]?.integral }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="user-info" v-if="curTabTime !== 2 && !rewardShow">
      <div class="user-main">
        <div class="sort">
          <span>{{ selfData.index === 0 || selfData.index > 99 ? "99+" : selfData.index }}</span>
          <span>TOP</span>
        </div>
        <div class="avatar">
          <img :src="selfData.avatar" alt="" />
        </div>
        <div class="user-text">
          <div class="name">{{ selfData.nick }}</div>
          <div class="value">
            <i class="coin"></i>
            <span>{{ selfData.integral }}</span>
          </div>
        </div>
      </div>
      <div class="recharge-btn" @click="getRechargePage">{{ $t("recharge.recharge") }}</div>
      <div class="gap" v-if="gapToPrev > 0">
        {{ $t("recharge.gapToPrev", { gap: gapToPrev }) }}
      </div>
    </div>
    <div class="reward-box" v-if="rewardShow">
      <div class="back" @click="rewardShow = false">{{ $t("recharge.back") }}</div>
      <div class="reward-box-banner"></div>
      <div class="reward-box-content">
        <div class="reward-box-title">
          {{ curTab === 2 ? $t("recharge.weeklyRankingReward") : $t("recharge.monthlyRankingReward") }}
        </div>
        <div class="reward-box-list">
          <div class="reward-box-item" v-for="(item, index) in rankRewardList">
            <div class="item-title" v-if="index === 0">{{ $t("recharge.top1") }}</div>
            <div class="item-title" v-if="index === 1">{{ $t("recharge.top2") }}</div>
            <div class="item-title" v-if="index === 2">{{ $t("recharge.top3") }}</div>
            <div class="item-content">
              <div class="list">
                <div class="item" v-for="(items, indexs) in item">
                  <div class="reward-img">
                    <div class="reward-img-box">
                      <img :src="items.rewardUrl" alt="" />
                    </div>
                  </div>
                  <sanaAutoText class="reward-text" v-if="items.rewardName">
                    {{
                      `${store.language === "ar" ? items.rewardNameAr : items.rewardName} ${items.rewardValue ? " * " + items.rewardValue : ""}`
                    }}
                  </sanaAutoText>
                  <sanaAutoText class="reward-text" v-else>
                    {{ `${items.rewardValue}` }}
                  </sanaAutoText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import { useI18n } from "vue-i18n";
// 换皮临时假数据用的头像，去掉假数据后可一并删除
import mockAvatar from "@/assets/common/logo.png";

// 定义emit
const emit = defineEmits(["timeChange"]);

const { t } = useI18n();
const store = useMainStore();
const rewardShow = ref(false);
const rankRewardList = ref([]);
const rankData = ref([]);
const listData = ref({});
const selfData = ref({});
const curTab = ref(2);
// 当前展示的奖励档位（0/1/2），用于让该屏跑马灯从第一个礼物重新开始
const activeRewardIndex = ref(0);
const tabList = [
  {
    text: t("recharge.weeklyRanking"),
    value: 2,
  },
  {
    text: t("recharge.monthlyRanking"),
    value: 3,
  },
];

const curTabTime = ref(1);
const tabListTime = [
  {
    text: t("recharge.ranking"),
    value: 1,
  },
  {
    text: t("recharge.lastWeek"),
    value: 2,
  },
];

const tabListTime1 = [
  {
    text: t("recharge.ranking"),
    value: 1,
  },
  {
    text: t("recharge.lastMonth"),
    value: 2,
  },
];

// 内容超过一屏时复制一份，配合 CSS 动画实现无缝跑马灯
const marqueeList = (list) => {
  const arr = list || [];
  return arr.length >= 3 ? [...arr, ...arr] : arr;
};

const lastList = computed(() => {
  if (curTab.value === 2) {
    const arr = [];
    arr.push(listData.value.weekTop3?.listLast || []);
    arr.push(listData.value.weekTop3?.listLastTwo || []);
    return arr;
  }
  if (curTab.value === 3) {
    const arr = [];
    arr.push(listData.value.monthTop3?.listLast || []);
    arr.push(listData.value.monthTop3?.listLastTwo || []);
    return arr;
  }
});

// 与上一名的差距，直接用接口返回的 selfData.integralSub
const gapToPrev = computed(() => Number(selfData.value?.integralSub) || 0);

const titleFilter = (index) => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=周日, 1=周一...
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 计算距离本周一的天数差

  if (curTab.value === 2) {
    // 周排行：计算上周、上上周的日期范围
    const mondayThisWeek = new Date(now);
    mondayThisWeek.setDate(now.getDate() - diffToMonday);

    const mondayLastWeek = new Date(mondayThisWeek);
    mondayLastWeek.setDate(mondayThisWeek.getDate() - 7);

    const mondayBeforeLast = new Date(mondayLastWeek);
    mondayBeforeLast.setDate(mondayLastWeek.getDate() - 7);

    const sundayLastWeek = new Date(mondayLastWeek);
    sundayLastWeek.setDate(mondayLastWeek.getDate() + 6);

    const sundayBeforeLast = new Date(mondayBeforeLast);
    sundayBeforeLast.setDate(mondayBeforeLast.getDate() + 6);

    const format = (date) => date.toISOString().split("T")[0]; // YYYY-MM-DD

    if (index === 0) {
      return `${format(mondayLastWeek)} ~ ${format(sundayLastWeek)}`;
    } else if (index === 1) {
      return `${format(mondayBeforeLast)} ~ ${format(sundayBeforeLast)}`;
    }
  }

  if (curTab.value === 3) {
    // 月排行：计算上月、上上月
    const year = now.getFullYear();
    let month = now.getMonth(); // 0-11

    // 获取上个月和上上个月
    let targetMonth, targetYear;
    if (index === 0) {
      // 上月
      targetMonth = month - 1;
      targetYear = month === 0 ? year - 1 : year;
      if (targetMonth < 0) targetMonth = 11;
    } else if (index === 1) {
      // 上上月
      targetMonth = month - 2;
      targetYear = month < 2 ? year - 1 : year;
      if (targetMonth < 0) targetMonth += 12;
    }

    const monthNames = [
      "recharge.January",
      "recharge.February",
      "recharge.March",
      "recharge.April",
      "recharge.May",
      "recharge.June",
      "recharge.July",
      "recharge.August",
      "recharge.September",
      "recharge.October",
      "recharge.November",
      "recharge.December",
    ];

    return `${t(monthNames[targetMonth])}`;
    // 或返回中文格式：`${targetYear}年${targetMonth + 1}月`
  }

  return "";
};

// 方法定义
const tabChange = (value) => {
  curTab.value = value;
  getActivityRechargeRank();
  getActivityRechargeList();
  getActivityRechargeGetGifts(curTab.value + 1);
};
const tabChangeTime = (value) => {
  curTabTime.value = value;
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

// 切换 swiper：记录当前档位，切到该屏时跑马灯动画从 0 开始
const onSwiperChange = (swiper) => {
  activeRewardIndex.value = swiper.activeIndex;
};

// 获取排行榜
const getActivityRechargeRank = async () => {
  try {
    const res = await get("/h5doings/activity/recharge/rank", {
      uid: store.uid,
      type: curTab.value,
      size: 23,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      rankData.value = res.data.list || [];
      selfData.value = res.data.self || [];
    } else {
      console.error("Failed to fetch anchor info:", res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

const getActivityRechargeList = async () => {
  try {
    const res = await postFormData("/h5doings/activity/recharge/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      listData.value = res.data || {};
      let timeData = {
        timeOutDay: listData.value.timeOutDay,
        weekTimeOut: listData.value.weekTimeOut,
        monthTimeOut: listData.value.monthTimeOut,
        curTab: curTab.value,
      };
      emit("timeChange", timeData);
    } else {
      console.error("Failed to fetch anchor info:", res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
  // 换皮临时：每次拉完榜单都补上「上周 / 上月」Top3 假数据
  if (USE_LAST_MOCK) applyLastMock();
};

const getActivityRechargeGetGifts = async (type) => {
  try {
    const res = await get("/h5doings/activity/recharge/getGifts", {
      type: type,
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      const obj = res.data;
      const result = [];
      for (let key in obj) {
        result.push(obj[key]);
      }
      rankRewardList.value = result || [];
    } else {
      console.error("Failed to fetch anchor info:", res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// ===== 换皮临时假数据：仅「上周 / 上月」Top3，USE_LAST_MOCK 改 false 即可关闭 =====
const USE_LAST_MOCK = true;
const MOCK_LAST_NICKS = ["KnightOfDawn", "小甜甜", "DragonSlayer", "夜行客", "StarLord", "月下独酌"];
const mockLastTop3 = (offset) =>
  Array.from({ length: 3 }, (_, i) => ({
    avatar: mockAvatar,
    nick: MOCK_LAST_NICKS[(offset + i) % MOCK_LAST_NICKS.length],
    integral: 980000 - (offset + i) * 76000,
  }));

const applyLastMock = () => {
  listData.value = {
    ...listData.value,
    weekTop3: { listLast: mockLastTop3(0), listLastTwo: mockLastTop3(3) },
    monthTop3: { listLast: mockLastTop3(1), listLastTwo: mockLastTop3(4) },
  };
};
// ===== 假数据结束 =====

onMounted(async () => {
  getActivityRechargeRank();
  getActivityRechargeList();
  getActivityRechargeGetGifts(curTab.value + 1);
});
</script>

<style lang="scss" scoped>
.reward {
  width: 100%;
  height: 1748px;
  padding-top: 58px;
  box-sizing: border-box;
  position: relative;
  top: -2px;
  background-image:
    url("@/assets/activity/recharge/reward/bg2.png"), url("@/assets/activity/recharge/reward/bg3.png"),
    url("@/assets/activity/recharge/reward/bg4.png");
  // 三张图上下拼接：相邻两层各重叠 2px，避免 rem 换算后取整出现细缝
  background-size:
    100% 600px,
    100% 626px,
    100% 524px;
  background-position:
    0 0,
    0 598px,
    0 1222px;
  background-repeat: no-repeat;
  font-family: LogoSCUnboundedSans, system-ui, Avenir, Helvetica, Arial, sans-serif;
  .tab-list {
    position: absolute;
    top: 177.5px;
    left: 0;
    width: 100%;
    height: 51px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > .tab-item {
      width: 187.5px;
      height: 51px;
      font-size: 13px;
      color: #ffffff;
      line-height: 14px;
      text-align: center;
      background: url("@/assets/activity/recharge/reward/timeType.png") no-repeat center center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.7;
      transition: transform 0.12s ease;
      // 点击按压效果
      &:active {
        transform: scale(0.94);
      }
      > span {
        background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        // 用 drop-shadow 跟随字形，box-shadow 会画成矩形色块
        filter: drop-shadow(0px 2px 2px #320000fc);
      }
    }
    .tab-show {
      opacity: 1;
    }
  }
  .recharge-box {
    position: absolute;
    top: 223px;
    left: 50%;
    transform: translateX(-51%);
    width: 387px;
    height: 368px;
    background: url("@/assets/activity/recharge/reward/rewardBg.png") no-repeat center center;
    background-size: cover;
    .recharge-box-title {
      position: absolute;
      top: 28px;
      left: 50%;
      transform: translateX(-50%);
      width: 153px;
      height: 15px;
      font-size: 13px;
      line-height: 15px;
      text-align: center;
      background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      filter: drop-shadow(0px 2px 2px #320000fc);
    }
    .recharge-box-sec {
      position: absolute;
      top: 71px;
      left: 50%;
      transform: translateX(-50%);
      width: 325px;
      height: 192px;
      .recharge-box-list {
        width: 325px;
        height: 192px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        box-sizing: border-box;
        padding-top: 30px;
        position: absolute;
        overflow: hidden; // 跑马灯裁切，避免溢出到弹窗外
        .recharge-box-top {
          position: absolute;
          top: 0px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 13px;
          line-height: 30px;
          font-weight: bold;
          background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0px 2px 2px #320000fc);
        }
        .recharge-track {
          display: flex;
          flex-wrap: nowrap; // 不换行
          align-items: flex-start;
          width: max-content;
          // 只给当前展示的那一屏挂动画：切过去时动画从 0 开始，即从第一个礼物开始
          &.is-marquee.is-active {
            animation: rechargeMarquee 24s linear infinite; // 时长由行内样式按数量覆盖
          }
          &.is-marquee.is-active.marquee-ar {
            animation-name: rechargeMarqueeAr; // ar 反方向
          }
          @keyframes rechargeMarquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
          @keyframes rechargeMarqueeAr {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(50%);
            }
          }
        }
        .recharge-box-item {
          width: 105px;
          height: 131px;
          flex: 0 0 auto;
          margin-inline-end: 10px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .recharge-box-pic {
            width: 105px;
            height: 100px;
            background-size: 105px 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: url("@/assets/activity/recharge/reward/rewardItemBg.png") no-repeat center center;
            background-size: cover;
            > img {
              display: block;
              width: 92.5px;
              height: 92.5px;
            }
          }
          .recharge-box-text {
            margin-top: 6px;
            width: 105px;
            height: 25px;
            font-weight: bold;
            font-size: 16.5px;
            padding: 0;
            box-sizing: border-box;
            color: #ffffff;
            line-height: 25px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family:
              DINAlternate, DINAlternate, PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
    .more {
      width: 167px;
      height: 46px;
      position: absolute;
      top: 275px;
      left: 50%;
      transform: translateX(-50%);
      box-sizing: border-box;
      font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
      font-weight: bold;
      font-size: 22px;
      line-height: 21px;
      background: url("@/assets/activity/recharge/reward/rewardMore.png") no-repeat top center;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: transform 0.12s ease;
      // 点击按压效果
      &:active {
        transform: translateX(-50%) scale(0.92);
      }
      > span {
        background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        // 用 drop-shadow 跟随字形，box-shadow 会画成矩形色块
        filter: drop-shadow(0px 2px 2px #320000fc);
      }
    }
  }
  .rank {
    position: absolute;
    top: 591px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 1137px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .rank-title {
      position: absolute;
      top: 30px;
      left: 50%;
      font-size: 22px;
      line-height: 32px;
      font-weight: bold;
      transform: translateX(-50%);
      background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      // 用 drop-shadow 跟随字形，box-shadow 会画成矩形色块
      filter: drop-shadow(0px 2px 2px #320000fc);
    }
    .tab-time-list {
      width: 269px;
      height: 37px;
      box-sizing: border-box;
      padding: 0 7px 0 7px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 73px auto 10px;
      > .tab-time-item {
        width: 126.5px;
        height: 36.5px;
        font-size: 18px;
        line-height: 36.5px;
        text-align: center;
        background: url("@/assets/activity/recharge/reward/rankTypeHide.png") no-repeat center center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.12s ease;
        // 点击按压效果
        &:active {
          transform: scale(0.94);
        }
        > span {
          background: linear-gradient(
            106.83deg,
            #fcdeae 25.48%,
            #fff3db 35.18%,
            #e5c28a 46.95%,
            #9d7449 58.81%,
            #daae79 73.22%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          // 用 drop-shadow 跟随字形，box-shadow 会画成矩形色块
          filter: drop-shadow(0px 2px 2px #0000008c);
        }
      }
      .tab-time-show {
        background: url("@/assets/activity/recharge/reward/rankTypeShow.png") no-repeat center center;
        background-size: cover;
      }
    }
    .rank-list-section,
    .rank-last {
      width: 100%;
      height: 1017px;
      font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
      .rank-top {
        width: 100%;
        height: 449px;
        position: relative;
        .rank-top-1 {
          position: absolute;
          width: 193px;
          height: 237.5px;
          top: 0px;
          left: 50%;
          transform: translateX(-50%);
          .rank-top-avatar {
            position: absolute;
            width: 193px;
            height: 197.5px;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background: url("@/assets/activity/recharge/reward/top1.png") no-repeat center center;
            background-size: cover;
            z-index: 10;
          }
          .rank-top-head {
            position: absolute;
            width: 116px;
            height: 116px;
            top: 42px;
            inset-inline-start: 40px;
            border-radius: 50%;
            z-index: 9;
          }
        }
        .rank-top-2 {
          position: absolute;
          width: 155px;
          height: 218px;
          top: 231px;
          inset-inline-start: 23px;
          .rank-top-avatar {
            position: absolute;
            width: 155px;
            height: 161.5px;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background: url("@/assets/activity/recharge/reward/top2.png") no-repeat center center;
            background-size: cover;
            z-index: 10;
          }
          .rank-top-head {
            position: absolute;
            width: 97px;
            height: 97px;
            top: 32px;
            inset-inline-start: 30px;
            border-radius: 50%;
            z-index: 9;
          }
        }
        .rank-top-3 {
          position: absolute;
          width: 160.5px;
          height: 232px;
          top: 227px;
          inset-inline-end: 23px;
          .rank-top-avatar {
            position: absolute;
            width: 160.5px;
            height: 170px;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background: url("@/assets/activity/recharge/reward/top3.png") no-repeat center center;
            background-size: cover;
            z-index: 10;
          }
          .rank-top-head {
            position: absolute;
            width: 97px;
            height: 97px;
            top: 39px;
            inset-inline-start: 30px;
            border-radius: 50%;
            z-index: 9;
          }
        }
        .rank-top-1,
        .rank-top-2,
        .rank-top-3 {
          position: absolute;
          .rank-top-text {
            position: absolute;
            // 相对领奖台容器水平居中（left + translate 在 LTR / RTL 下都对称）
            left: 50%;
            transform: translateX(-50%);
            width: 160px;
            height: 73px;
            background: url("@/assets/activity/recharge/reward/bgTopTextBg.png") no-repeat center center;
            background-size: cover;
            z-index: 11;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .rank-top-name {
              font-family: DingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
              width: 160px;
              height: 20px;
              line-height: 20px;
              font-size: 14px;
              color: #ffe1a2;
              text-align: center;
              // 单行显示，超出省略
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .rank-top-number {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 20px;
              line-height: 20px;
              font-size: 11px;
              color: #ffffff;
              .gold {
                width: 15.5px;
                height: 11.5px;
                background: url("@/assets/activity/recharge/reward/gold.png") no-repeat center center;
                background-size: cover;
              }
            }
          }
        }
        .rank-top-1 {
          .rank-top-text {
            top: 164.5px;
          }
        }
        .rank-top-2 {
          .rank-top-text {
            top: 145px;
          }
        }
        .rank-top-3 {
          .rank-top-text {
            top: 149px;
          }
        }
      }
      .rank-list {
        width: 100%;
        height: 508px;
        overflow-y: auto;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        &::-webkit-scrollbar {
          display: none;
        }
        .rank-item {
          flex-shrink: 0;
          width: 336px;
          height: 130px;
          margin-bottom: -18.5px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-inline-start: 20px;
          padding-inline-end: 27px;
          box-sizing: border-box;
          background: url("@/assets/activity/recharge/reward/itemBg.png") no-repeat center center;
          background-size: cover;
          &:last-child {
            margin-bottom: 80px;
          }
          .sort {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 23px;
            text-align: center;
            font-size: 14px;
            color: #f0cc5d;
            line-height: 20px;
            font-weight: bold;
            > span {
              background: linear-gradient(
                106.83deg,
                #fcdeae 25.48%,
                #fff3db 35.18%,
                #e5c28a 46.95%,
                #9d7449 58.81%,
                #daae79 73.22%
              );
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
              &:nth-child(1) {
                font-size: 32px;
                line-height: 40px;
              }
            }
          }
          .avatar {
            width: 69px;
            height: 69px;
            border-radius: 50%;
            overflow: hidden;
            margin-inline-start: 10px;
            margin-inline-end: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(
              90.99deg,
              #fcdeae 8.22%,
              #fff3db 26.02%,
              #e5c28a 47.62%,
              #9d7449 69.41%,
              #daae79 95.87%
            );
            > img {
              width: 65px;
              height: 65px;
              border-radius: 50%;
            }
          }
          .name-id {
            width: 104px;
            min-height: 34px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            .name {
              width: 100%;
              font-weight: bold;
              font-size: 14px;
              color: #ffe1a2;
              line-height: 19px;
              // 最多三行，超出省略
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              word-break: break-word;
            }
            .id {
              font-size: 10px;
              color: #fff0d0;
              line-height: 14px;
            }
          }
          .number {
            width: 81px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .diamond {
              flex-shrink: 0;
              width: 15.5px;
              height: 11.5px;
              margin-inline-end: 3px;
            }
            > span {
              // 数字是连续字符，默认不换行，break-all 才能按字符断开
              min-width: 0;
              font-weight: bold;
              font-size: 13px;
              color: #ffffff;
              line-height: 19px;
              text-align: end;
              // 最多三行，超出省略
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              word-break: break-all;
            }
          }
        }
      }
    }
    .rank-last {
      // 上周 / 上月：固定高度，内容超出纵向滚动
      // height: 970px;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        display: none;
      }
      .rank-last-item {
        width: 100%;
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .rank-last-item-title {
          min-width: 114px;
          height: 46px;
          font-weight: bold;
          font-size: 22px;
          line-height: 46px;
          text-align: center;
          margin: 0 auto;
          font-family:
            DINAlternate, DINAlternate, PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
          background: url("@/assets/activity/recharge/reward/lastTitle.png") top center;
          background-size: 100% 100%;
          > span {
            background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
            filter: drop-shadow(0px 2px 2px #320000fc);
          }
        }
        .rank-last-item-top {
          position: relative;
          width: 100%;
          height: 100%;
          .rank-last-item-top-1 {
            width: 93px;
            height: 93px;
            position: absolute;
            top: 0;
            left: 95px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .avatar {
              position: absolute;
              top: 0;
              left: 50%;
              z-index: 2;
              transform: translateX(-50%);
              width: 93px;
              height: 93px;
              background: url("@/assets/activity/recharge/rank/lastTop1.png") no-repeat top center;
              background-size: 100% 100%;
            }
            .head {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 47px;
              height: 47px;
              position: absolute;
              top: 20px;
              left: 23px;
              border-radius: 50%;
              overflow: hidden;
              z-index: 1;
              > img {
                width: 47px;
              }
            }
            .name {
              position: absolute;
              top: 90px;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              text-align: center;
              height: 17px;
              font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
              font-weight: bold;
              font-size: 12px;
              color: #ffffff;
              line-height: 17px;
              white-space: nowrap; /* 强制文本不换行 */
              overflow: hidden; /* 隐藏溢出内容 */
              text-overflow: ellipsis; /* 溢出时显示省略号 */
            }
          }
          .rank-last-item-top-2 {
            width: 80px;
            height: 80px;
            position: absolute;
            top: 53px;
            left: 4px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .avatar {
              position: absolute;
              top: 0;
              left: 50%;
              z-index: 2;
              transform: translateX(-50%);
              width: 80px;
              height: 80px;
              background: url("@/assets/activity/recharge/rank/lastTop2.png") no-repeat top center;
              background-size: 100% 100%;
            }
            .head {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 47px;
              height: 47px;
              position: absolute;
              top: 15px;
              left: 16px;
              border-radius: 50%;
              overflow: hidden;
              z-index: 1;
              > img {
                width: 47px;
              }
            }
            .name {
              position: absolute;
              top: 78px;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              text-align: center;
              height: 17px;
              font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
              font-weight: bold;
              font-size: 12px;
              color: #ffffff;
              line-height: 17px;
              white-space: nowrap; /* 强制文本不换行 */
              overflow: hidden; /* 隐藏溢出内容 */
              text-overflow: ellipsis; /* 溢出时显示省略号 */
            }
          }
          .rank-last-item-top-3 {
            width: 80px;
            height: 80px;
            position: absolute;
            top: 43px;
            right: 13px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .avatar {
              position: absolute;
              top: 0;
              left: 50%;
              z-index: 2;
              transform: translateX(-50%);
              width: 80px;
              height: 80px;
              background: url("@/assets/activity/recharge/rank/lastTop3.png") no-repeat top center;
              background-size: 100% 100%;
            }
            .head {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 47px;
              height: 47px;
              position: absolute;
              top: 15px;
              left: 16px;
              border-radius: 50%;
              overflow: hidden;
              z-index: 1;
              > img {
                width: 47px;
              }
            }
            .name {
              position: absolute;
              top: 78px;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              text-align: center;
              height: 17px;
              font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
              font-weight: bold;
              font-size: 12px;
              color: #ffffff;
              line-height: 17px;
              white-space: nowrap; /* 强制文本不换行 */
              overflow: hidden; /* 隐藏溢出内容 */
              text-overflow: ellipsis; /* 溢出时显示省略号 */
            }
          }
        }
      }
    }
  }
  .user-info {
    position: fixed;
    z-index: 999;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 160px;
    background: url("@/assets/activity/recharge/reward/selfBg.png") no-repeat center 10px;
    background-size: 404px 160px;
    font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;

    .user-main {
      position: absolute;
      inset-inline-start: 3px;
      width: 227px;
      top: 39px;
      display: flex;
      align-items: center;
      .sort {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 45px;
        text-align: center;
        font-size: 14px;
        color: #f0cc5d;
        line-height: 20px;
        font-weight: bold;
        > span {
          background: linear-gradient(
            106.83deg,
            #fcdeae 25.48%,
            #fff3db 35.18%,
            #e5c28a 46.95%,
            #9d7449 58.81%,
            #daae79 73.22%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          &:nth-child(1) {
            font-size: 22px;
            line-height: 40px;
          }
        }
      }
      .avatar {
        flex-shrink: 0;
        margin-inline-start: 3px;
        margin-inline-end: 8px;
        width: 69px;
        height: 69px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        // 与榜单列表头像一致：外层渐变做金属环，内层图片留出 2px 边框
        background: linear-gradient(
          90.99deg,
          #fcdeae 8.22%,
          #fff3db 26.02%,
          #e5c28a 47.62%,
          #9d7449 69.41%,
          #daae79 95.87%
        );
        > img {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .user-text {
        max-width: 99px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .name {
          max-width: 99px;
          font-weight: bold;
          font-size: 14px;
          color: #ffe157;
          line-height: 19px;
          text-align: start;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .value {
          display: flex;
          align-items: center;
          font-weight: bold;
          font-size: 13px;
          color: #ffffff;
          line-height: 19px;
          .coin {
            width: 12px;
            height: 12px;
            margin-inline-end: 4px;
            background: url("@/assets/activity/recharge/reward/gold.png") no-repeat center center;
            background-size: 100% 100%;
          }
        }
      }
    }
    .recharge-btn {
      position: absolute;
      inset-inline-end: 18px;
      top: 57.5px;
      width: 126.5px;
      height: 36.5px;
      box-sizing: border-box;
      font-weight: bold;
      font-size: 14px;
      color: #fff8f8;
      line-height: 36.5px;
      text-align: center;
      background: url("@/assets/activity/recharge/reward/rechargeBtn.png") no-repeat center center;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: transform 0.12s ease;
      // 点击按压效果
      &:active {
        transform: scale(0.94);
      }
    }
    .gap {
      position: absolute;
      inset-inline-start: 24px;
      bottom: 14px;
      font-size: 14px;
      color: #fff8f8;
      line-height: 16px;
      text-align: start;
    }
  }
  > .reward-box {
    width: 355px;
    margin: -25px auto 0;
    height: 733px;
    background: url("@/assets/activity/recharge/rank/rewardBoxBg.png") no-repeat top center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    .back {
      width: 63px;
      height: 29px;
      position: absolute;
      right: 23px;
      top: 74px;
      padding: 3px 6px 3px 0px;
      box-sizing: border-box;
      text-align: right;
      font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
      font-weight: bold;
      font-size: 15px;
      color: #ffeb0d;
      line-height: 21px;
      background: url("@/assets/activity/recharge/rank/more.png") no-repeat top center;
      background-size: 100% 100%;
      transition: transform 0.12s ease;
      // 点击按压效果
      &:active {
        transform: scale(0.92);
      }
    }
    .reward-box-banner {
      width: 275px;
      height: 97px;
      background: url("@/assets/activity/recharge/rank/banner.png") no-repeat top center;
      background-size: 100% 100%;
      margin: 97px auto 16px;
    }
    .reward-box-content {
      width: 301px;
      height: 501px;
      margin: 0 auto;
      background: url("@/assets/activity/recharge/rank/rewardBg.png") no-repeat top center;
      background-size: 100% 100%;
      .reward-box-title {
        width: 153px;
        height: 21px;
        font-family: LogoSCUnboundedSans, system-ui, Avenir, Helvetica, Arial, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #8b0303;
        line-height: 11px;
        text-align: center;
        margin: 34px auto 13px;
      }
      .reward-box-list {
        height: 420px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .reward-box-item {
          width: 264px;
          height: auto;
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          &:last-child {
            margin-bottom: 0;
          }
          .item-title {
            width: 100%;
            height: 19px;
            font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
            font-weight: bold;
            font-size: 13px;
            color: #fffe85;
            line-height: 19px;
            text-align: center;
          }
          .item-content {
            width: 100%;
            height: auto;
            &::-webkit-scrollbar {
              display: none;
            }
            .list {
              width: auto;
              min-height: 109px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-wrap: wrap;
              .item {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                .reward-img {
                  width: 81px;
                  height: 77px;
                  background: url("@/assets/activity/recharge/rank/rewardImg.png") no-repeat top center;
                  background-size: 100% 100%;
                  margin: 5px auto 4px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-sizing: border-box;
                  padding-top: 1px;
                  > .reward-img-box {
                    width: 60px;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    > img {
                      width: 60px;
                    }
                  }
                }
                .reward-text {
                  width: 88px;
                  height: 22px;
                  background: url("@/assets/activity/recharge/rank/rewardText.png") no-repeat top center;
                  background-size: 100% 100%;
                  text-align: center;
                  font-family:
                    DINAlternate, DINAlternate, PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial,
                    sans-serif;
                  font-weight: bold;
                  font-size: 13px;
                  color: #ffffff;
                  line-height: 15px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  white-space: nowrap;
                  overflow: hidden;
                }
              }
            }
          }
        }
      }
    }
  }
}

.reward3 {
  // height: 1396px;
  // height: 1272px;
  height: 1417px;
}
.reward-show {
  height: 866px;
}
</style>
