<!-- 奖励 -->
<template>
  <div class="reward-page">
    <div class="tab-list">
      <div
        :key="index"
        :class="['tab-item', { 'tab-show': curTab === item.value }]"
        v-for="(item, index) in tabList"
        @click="tabChange(item.value)"
      >
        <span>{{ item.text }}</span>
      </div>
    </div>
    <div class="reward">
      <!-- 宝箱标题图 -->
      <img class="treasure-title" src="@/assets/activity/recharge/reward/box.png" alt="" />
      <div class="user-info">
        <div class="avatar">
          <img :src="listData.avatar" alt="" />
        </div>
        <div class="id-recharge">
          <div class="id">{{ $t("recharge.id", { id: listData.erbanNo }) }}</div>
          <div class="recharge" v-if="curTab === 1">
            <span class="label">{{ $t("recharge.mydailyRecharge", { number: "" }) }}</span>
            <i class="coin"></i>
            <span class="amount">{{ amountFilter(listData.dayGold) }}</span>
          </div>
          <div class="recharge" v-if="curTab === 2">
            <span class="label">{{ $t("recharge.myWeeklyRecharge", { number: "" }) }}</span>
            <i class="coin"></i>
            <span class="amount">{{ amountFilter(listData.weekGold) }}</span>
          </div>
          <div class="recharge" v-if="curTab === 3">
            <span class="label">{{ $t("recharge.myMonthlyRecharge", { number: "" }) }}</span>
            <i class="coin"></i>
            <span class="amount">{{ amountFilter(listData.monthGold) }}</span>
          </div>
        </div>
      </div>
      <div class="recharge-btn">
        <div class="title" v-if="curTab === 1">{{ $t("recharge.monthlyProgress") }}</div>
        <div class="title" v-if="curTab === 2">{{ $t("recharge.weekProgress") }}</div>
        <div class="title" v-if="curTab === 3">{{ $t("recharge.dailyProgress") }}</div>
        <div class="btn" @click="getRechargePage">
          <span>{{ $t("recharge.recharge") }}</span>
        </div>
      </div>
      <div class="treasure-box">
        <!-- <div class="treasure-box-progress"></div> -->
        <div class="treasure-box-sec">
          <div class="treasure-box-list">
            <div class="treasure-box-item" v-for="(item, index) in boxList" @click="handleBoxClick(index)" :key="index">
              <img v-if="boxLv > index" :style="boxSize(index)" :src="getTreasureboxshowImageUrl(index)" alt="" />
              <img v-else class="is-lock" :style="boxSize(index)" :src="getTreasureboxhideImageUrl(index)" alt="" />
              <span>{{ mapBoxAmount(index) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="recharge-box">
        <div class="recharge-box-title">
          <span>{{ $t("recharge.awardTitle", { amount: mapBoxAmount(index) }) }}</span>
        </div>
        <div class="recharge-box-sec">
          <Swiper
            :initial-slide="index"
            :slides-per-view="1"
            ref="mySwiper"
            :space-between="0"
            @slideChange="onSwiperChange"
            style="height: 100%"
          >
            <SwiperSlide v-for="(item, idx) in boxList" :key="idx">
              <div class="recharge-box-list">
                <div class="recharge-box-item" v-for="(items, indexs) in item" :key="indexs">
                  <div class="recharge-box-pic">
                    <div class="recharge-box-img">
                      <img :src="items.rewardUrl" alt="" />
                    </div>
                  </div>
                  <sanaAutoText class="recharge-box-text" :key="new Date().getTime()" v-if="items.rewardName">
                    {{
                      `${store.language === "ar" ? items.rewardNameAr : items.rewardName} ${items.rewardValue ? " * " + items.rewardValue : ""}`
                    }}
                  </sanaAutoText>
                  <sanaAutoText class="recharge-box-text" :key="new Date().getTime()" v-else>
                    {{ `${items.rewardValue}` }}
                  </sanaAutoText>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <div class="recharge-ranking">
        <div class="recharge-ranking-list">
          <div
            :class="['recharge-ranking-item', 'recharge-ranking-top' + (index + 1)]"
            v-for="(item, index) in topList"
            :key="index"
          >
            <div class="recharge-ranking-item-avatar">
              <img class="recharge-ranking-item-head" :src="item.avatar" alt="" />
            </div>
            <div class="recharge-ranking-item-name">{{ item.nick }}</div>
            <div class="recharge-ranking-item-value">
              <i class="coin"></i>
              <span>{{ item.integral }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import box1 from "@/assets/activity/recharge/reward/box1.png";
import box2 from "@/assets/activity/recharge/reward/box2.png";
import box3 from "@/assets/activity/recharge/reward/box3.png";
import box4 from "@/assets/activity/recharge/reward/box4.png";
import box5 from "@/assets/activity/recharge/reward/box5.png";

// 定义emit
const emit = defineEmits(["timeChange"]);

const { t } = useI18n();
const store = useMainStore();
const boxMaxNum = ref(7);
const mySwiper = ref(null); // Swiper实例引用
const rankData = ref([]);
const listData = ref({});
const selfData = ref({});
const boxList = ref([]);
const index = ref(0);
const activeIndex = ref(0);
const curTab = ref(1);
const tabList = [
  {
    text: t("recharge.daily"),
    value: 1,
  },
  {
    text: t("recharge.weekly"),
    value: 2,
  },
  {
    text: t("recharge.monthly"),
    value: 3,
  },
];

const topList = computed(() => {
  if (curTab.value === 1) {
    return rankData?.value?.slice(0, 3) || [];
  }
  if (curTab.value === 2) {
    return listData?.value?.weekTop3?.listNow || [];
  }
  if (curTab.value === 3) {
    return listData?.value?.monthTop3?.listNow || [];
  }
});

const boxLv = computed(() => {
  if (curTab.value === 1) {
    return listData?.value?.boxDayLv || 0;
  }
  if (curTab.value === 2) {
    return listData?.value?.boxMonthLv || 0;
  }
  if (curTab.value === 3) {
    return listData?.value?.boxWeekLv || 0;
  }
});

const amountFilter = (amount, forceUnit = true) => {
  if (isNaN(amount)) return "0.00M";
  const sign = amount < 0 ? "-" : "";
  const absAmount = Math.abs(amount);
  let value = Math.floor((absAmount / 1000000) * 100) / 100;
  if (value === 0 && !forceUnit) return absAmount.toFixed(2); // 不足1M时返回原值
  return sign + value.toFixed(2) + "M";
};

const mapBoxAmount = (index) => {
  let day = [500000, 2500000, 5000000, 15000000, 25000000, 50000000, 150000000];
  let week = [5000000, 25000000, 50000000, 100000000, 150000000, 250000000];
  let month = [40000000, 60000000, 100000000, 150000000, 250000000, 400000000, 600000000, 800000000, 1250000000];
  if (curTab.value === 1) {
    return amountFilter(day[index]) || "";
  }
  if (curTab.value === 2) {
    return amountFilter(week[index]) || "";
  }
  if (curTab.value === 3) {
    return amountFilter(month[index]) || "";
  }
};

// 方法定义
const tabChange = (value) => {
  curTab.value = value;
  getActivityRechargeRank();
  getActivityRechargeList();
  getActivityRechargeGetGifts(curTab.value - 1);
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

// 宝箱图片：box1 ~ box5 对应第 1~5 档，超过第 5 个沿用第 5 个
const treasureBoxImgs = [box1, box2, box3, box4, box5];
const getTreasureboxhideImageUrl = (index) => treasureBoxImgs[Math.min(index, treasureBoxImgs.length - 1)];

const getTreasureboxshowImageUrl = (index) => treasureBoxImgs[Math.min(index, treasureBoxImgs.length - 1)];

// 宝箱尺寸（设计稿 ÷2），超过第 5 个沿用第 5 个
const boxSizes = [
  { width: "47px", height: "37px" },
  { width: "47px", height: "33px" },
  { width: "49px", height: "38px" },
  { width: "44px", height: "34px" },
  { width: "54px", height: "39px" },
];
const boxSize = (index) => boxSizes[Math.min(index, boxSizes.length - 1)];

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

// 获取排行榜
const getActivityRechargeRank = async () => {
  try {
    const res = await get("/h5doings/activity/recharge/rank", {
      uid: store.uid,
      size: 20,
      type: curTab.value,
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
        // result.push(obj[key]);
        result.push(obj[key]);
      }
      boxList.value = result || [];
      boxMaxNum.value = result.length || 0;
    } else {
      console.error("Failed to fetch anchor info:", res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

onMounted(() => {
  getActivityRechargeRank();
  getActivityRechargeList();
  getActivityRechargeGetGifts(curTab.value - 1);
});
</script>

<style lang="scss" scoped>
.reward-page {
  width: 100%;
  height: 1748px;
  position: relative;
  box-sizing: border-box;
  top: -2px;
  background-color: #4e0708;
  background-image: url("@/assets/activity/recharge/reward/bg2.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100% 600px;
  box-sizing: border-box;
  font-family: LogoSCUnboundedSans, system-ui, Avenir, Helvetica, Arial, sans-serif;
  .tab-list {
    // 设计稿页面坐标 top 2064 ÷ 2 = 1032；本元素顶部在页面 811，故 1032 - 811 = 221
    position: absolute;
    top: 221px;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    height: 51px;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > .tab-item {
      width: 118px;
      height: 51px;
      flex-shrink: 0;
      border-radius: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "Noto Sans", PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
      font-weight: 800;
      font-size: 22px;
      line-height: 100%;
      text-align: center;
      background: url("@/assets/activity/recharge/reward/timeHide.png") no-repeat center center;
      background-size: 100% 100%;
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
    > .tab-show {
      background-image: url("@/assets/activity/recharge/reward/timeShow.png");
    }
  }
  .reward {
    width: 100%;
    height: 1447px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    top: 301px;
    z-index: 0; // 必须建立层叠上下文，否则 z-index:-1 的背景会跑到 .reward-page 背景后面看不见
    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 375px;
      background-repeat: no-repeat;
      pointer-events: none;
      z-index: -1;
    }
    &::before {
      top: 0;
      height: 507px;
      background-image: url("@/assets/activity/recharge/reward/rewardBgTop.png");
      background-size: 100% auto;
      z-index: -1;
    }
    &::after {
      top: 506px; // 507 上移 1px 做重叠：506 + 941 = 1447，正好等于容器高度
      height: 941px;
      background-image: url("@/assets/activity/recharge/reward/rewardBgBottom.png");
      background-size: 100% 100%;
      z-index: -2;
    }
    // 宝箱标题图：155×154 @ 页面 top 2197 / left 298（÷2 = 77.5×77 @ 1098.5 / 149）
    // 本元素顶部在页面 1110，故 1098.5 - 1110 = -11.5
    .treasure-title {
      position: absolute;
      top: -12px;
      left: 50%;
      width: 78px;
      height: 77px;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 1;
    }
    .user-info {
      position: relative;
      width: 100%;
      height: 100px;
      margin-top: 87px;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .avatar {
        background: linear-gradient(
          90.99deg,
          #fcdeae 8.22%,
          #fff3db 26.02%,
          #e5c28a 47.62%,
          #9d7449 69.41%,
          #daae79 95.87%
        );
        margin-inline-start: 28px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .id-recharge {
        margin-inline-start: 18px;
        width: 200px;
        min-height: 42px;
        .id,
        .recharge {
          width: 100%;
          min-height: 20px;
          font-family: "Readex Pro", LogoSCUnboundedSans, system-ui, sans-serif;
          font-weight: bold;
          font-size: 14px;
          line-height: 20px;
          text-align: start;
          color: #ffe1a2;
        }
        .recharge {
          display: flex;
          flex-wrap: wrap; // 让 label 独占一行，金币 + 金额换到下一行
          align-items: center;
          // 文案独占一行
          .label {
            width: 100%;
          }
          // 只有金额是白色
          .amount {
            color: #ffffff;
          }
          // 金币夹在文字和金额中间
          .coin {
            flex-shrink: 0;
            width: 16px;
            height: 12px;
            margin-inline: 3px;
            background: url("@/assets/activity/recharge/gold.png") no-repeat center center;
            background-size: 100% 100%;
          }
        }
      }
    }
    .recharge-btn {
      width: 100%;
      margin-top: 50px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      .title {
        height: 32px;
        font-family: "Readex Pro", LogoSCUnboundedSans, system-ui, sans-serif;
        font-weight: bold;
        font-size: 18px;
        line-height: 32px;
        text-align: center;
        margin-inline-end: 3px;
        // 金色渐变文字
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
        filter: drop-shadow(0px 2px 2px #0000008c);
      }
      .btn {
        width: 110px;
        height: 32px;
        box-sizing: border-box;
        border-radius: 44px;
        font-size: 13px;
        color: #913000;
        line-height: 32px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url("@/assets/activity/recharge/reward/rechargeBtn.png") no-repeat center center;
        background-size: 100% 100%;
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
          filter: drop-shadow(0px 2px 2px #0000008c);
        }
      }
    }
    .treasure-box {
      margin-top: 29px;
      width: 300px;
      height: 90px;
      background-size: cover;
      position: relative;
      .treasure-box-progress {
        position: absolute;
        top: 27px;
        left: 29px;
        width: 241px;
        height: 12px;
      }
      .treasure-box-sec {
        width: 287px;
        z-index: 2;
        margin: 0 auto;
        overflow-x: auto;
        overflow-y: hidden;
        &::-webkit-scrollbar {
          display: none;
        }
        .treasure-box-list {
          width: max-content;
          min-width: 287px;
          height: 54px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 8px;
          padding: 0 6px 0 10px;
          box-sizing: border-box;
          // 轨道 + 进度条：两层背景，进度宽度随 boxLv 变化，不用绝对定位
          background-image:
            url("@/assets/activity/recharge/reward/progressBar.png"),
            url("@/assets/activity/recharge/reward/rechargeBg1.png");
          background-repeat: no-repeat, no-repeat;
          background-position:
            12px 17px,
            0 17px;
          background-size:
            calc(v-bind(boxLv) * 56px - 22px) 14px,
            100% 14px;
          .treasure-box-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 0 0 auto;
            z-index: 5;
            > img {
              display: block;
              // 未解锁的宝箱：灰度 + 压暗
              &.is-lock {
                filter: grayscale(100%) brightness(0.7);
              }
            }
            > span {
              display: block;
              min-width: 30px;
              padding: 0 5px;
              height: 16px;
              margin-top: -1px;
              background-size: 100% 100%;
              font-weight: bold;
              font-size: 9px;
              color: #fcf5c0;
              line-height: 13px;
              font-family:
                DINAlternate, DINAlternate, PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
              text-shadow:
                -1px -1px 0 #733213,
                1px -1px 0 #733213,
                -1px 1px 0 #733213,
                1px 1px 0 #733213; /* 四方向阴影模拟描边 */
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
    .recharge-box {
      width: 323px;
      height: 453px;
      box-sizing: border-box;
      border: 4px solid #fffb81;
      border-radius: 11px;
      background: linear-gradient(180deg, rgba(155, 0, 3, 0.8) 0%, rgba(88, 18, 19, 0.8) 100%);
      .recharge-box-title {
        width: 162px;
        height: 44px;
        margin: -26px auto 0;
        background: url("@/assets/activity/recharge/reward/rewardTitleBg.png") no-repeat center center;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        > span {
          font-family: "Noto Sans", LogoSCUnboundedSans, system-ui, sans-serif;
          font-weight: bold;
          font-size: 10px;
          line-height: 1.3;
          text-align: center;
          padding: 4px 15px;
          box-sizing: border-box;
          // 金色渐变文字
          background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0px 2px 2px #320000fc);
        }
      }
      .recharge-box-sec {
        margin-top: 61px;
        width: 100%;
        height: 358px;
        .recharge-box-list {
          width: 100%;
          height: 358px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 18px;
          .recharge-box-item {
            width: 105px;
            height: 170px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .recharge-box-pic {
              width: 105px;
              height: 100px;
              border-radius: 11px;
              background: linear-gradient(180deg, rgba(255, 85, 88, 0.8) 0%, rgba(153, 51, 53, 0.8) 100%);
              display: flex;
              justify-content: center;
              align-items: center;
              .recharge-box-img {
                width: 87px;
                height: 87px;
                display: flex;
                justify-content: center;
                align-items: center;
                > img {
                  display: inline-block;
                  width: 100%;
                }
              }
            }
            .recharge-box-text {
              margin-top: 8px;
              width: 105px;
              height: 52px;
              font-family: "Readex Pro", LogoSCUnboundedSans, system-ui, sans-serif;
              font-weight: bold;
              font-size: 14px;
              color: #ffffff;
              line-height: 20px;
              text-align: center;
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }
          }
        }
      }
    }
    .recharge-ranking {
      margin-top: 30px;
      width: 323px;
      height: 453px;
      box-sizing: border-box;
      border: 4px solid #fffb81;
      border-radius: 11px;
      background: linear-gradient(180deg, rgba(155, 0, 3, 0.8) 0%, rgba(88, 18, 19, 0.8) 100%);
      .recharge-ranking-list {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        padding: 26px 10px 0;
        box-sizing: border-box;
        .recharge-ranking-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          .recharge-ranking-item-avatar {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            padding: 2px;
            border-radius: 50%;
            background: linear-gradient(
              90.99deg,
              #fcdeae 8.22%,
              #fff3db 26.02%,
              #e5c28a 47.62%,
              #9d7449 69.41%,
              #daae79 95.87%
            );
            .recharge-ranking-item-head {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              object-fit: cover;
            }
          }
          .recharge-ranking-item-name {
            margin-top: 6px;
            max-width: 130px;
            font-family: "Readex Pro", LogoSCUnboundedSans, system-ui, sans-serif;
            font-weight: bold;
            font-size: 14px;
            color: #ffe1a2;
            line-height: 20px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .recharge-ranking-item-value {
            margin-top: 4px;
            display: flex;
            align-items: center;
            font-size: 11px;
            color: #ffffff;
            .coin {
              flex-shrink: 0;
              width: 16px;
              height: 12px;
              margin-inline-end: 3px;
              background: url("@/assets/activity/recharge/gold.png") no-repeat center center;
              background-size: 100% 100%;
            }
          }
        }
        .recharge-ranking-top1 {
          width: 100%;
          .recharge-ranking-item-avatar {
            width: 110px;
            height: 110px;
          }
        }
        .recharge-ranking-top2 {
          width: 50%;
          margin-top: 14px;
          .recharge-ranking-item-avatar {
            width: 92px;
            height: 92px;
          }
        }
        .recharge-ranking-top3 {
          width: 50%;
          margin-top: 14px;
          .recharge-ranking-item-avatar {
            width: 92px;
            height: 92px;
          }
        }
      }
    }
  }
}
</style>
