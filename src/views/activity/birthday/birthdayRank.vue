<template>
  <div class="rank">
    <!-- 倒计时模块 -->
    <div class="time">
      <CountDownBirthday :time="countDownTime || 0" :key="countDownTime" format="DD:HH:MM" />
    </div>
    
    <!-- 榜单tab模块 -->
    <div :class="['tab-list', { 'tab-send': store.language === 'ar' ? curRankType !== 1 : curRankType === 1, 'tab-receive': store.language === 'ar' ? curRankType === 1 : curRankType !== 1 }]">
      <div
        :class="['tab-item',{ 'tab-item-show': curRankType === item.value }]"
        v-for="(item, index) in rankTypeList"
        :key="index"
        @click="rankTypeChange(item.value)"
      >
        {{ item.text }}
      </div>
    </div>

    <!-- reward 模块 (Swiper + SwiperSlide) -->
    <div class="reward-box">
      <div class="reward-title">{{ t('birthday.rankingReward') }} {{ rewardTitle }}</div>
      <div class="reward-swiper-wrap">
        <Swiper
          :initial-slide="swiperIndex"
          :slides-per-view="1"
          ref="mySwiper"
          :space-between="0"
          @slideChange="onSwiperChange"
          style="height: 100%"
          :key="swiperKey"
        >
          <SwiperSlide v-for="(page, pageIndex) in rewardPages" :key="pageIndex">
            <div class="reward-page">
              <div class="reward-item" v-for="(item, itemIndex) in page" :key="itemIndex">
                <div class="reward-img-wrap">
                  <img class="reward-img" :src="item.rewardUrl" alt="" />
                </div>
                <div class="reward-days-padding">
                  <sanaAutoText class="reward-days">
                    <span> {{ `${store.language === "ar" ? item.rewardNameAr : item.rewardName}*${item.rewardValue}` }}</span>
                  </sanaAutoText>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

    <!-- 榜单模块 -->
    <div class="ranking-section">
      <!-- TOP3 -->
      <div class="rank-top3">
        <div class="rank-top1" v-if="rankList.length > 0">
          <!-- <img class="rank-frame" src="@/assets/activity/birthday/birthdayRank/top1_frame.png" alt="" /> -->
          <img class="rank-avatar" :src="rankList[0].avatar" alt="" />
          <div class="rank-name ellipsis">{{ rankList[0].nick }}</div>
          <div class="rank-id">ID: {{ rankList[0].erbanNo }}</div>
          <div class="rank-value">
            <img src="@/assets/activity/birthday/birthdayPrivilege/amethyst.png" alt="" />
            <span>{{ formatNumber(rankList[0].integral) }}</span>
          </div>
        </div>
        <div class="rank-top2" v-if="rankList.length > 1">
          <!-- <img class="rank-frame" src="@/assets/activity/birthday/birthdayRank/top2_frame.png" alt="" /> -->
          <img class="rank-avatar" :src="rankList[1].avatar" alt="" />
          <div class="rank-name ellipsis">{{ rankList[1].nick }}</div>
          <div class="rank-id">ID: {{ rankList[1].erbanNo }}</div>
          <div class="rank-value">
            <img src="@/assets/activity/birthday/birthdayPrivilege/amethyst.png" alt="" />
            <span>{{ formatNumber(rankList[1].integral) }}</span>
          </div>
        </div>
        <div class="rank-top3" v-if="rankList.length > 2">
          <!-- <img class="rank-frame" src="@/assets/activity/birthday/birthdayRank/top3_frame.png" alt="" /> -->
          <img class="rank-avatar" :src="rankList[2].avatar" alt="" />
          <div class="rank-name ellipsis">{{ rankList[2].nick }}</div>
          <div class="rank-id">ID: {{ rankList[2].erbanNo }}</div>
          <div class="rank-value">
            <img src="@/assets/activity/birthday/birthdayPrivilege/amethyst.png" alt="" />
            <span>{{ formatNumber(rankList[2].integral) }}</span>
          </div>
        </div>
      </div>

      <!-- 榜单列表 -->
      <div class="rank-list">
        <div class="rank-item" v-for="(item, index) in displayList" :key="index">
          <div class="rank-sort">{{ item.index }}</div>
          <div class="rank-avatar">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="rank-info">
            <div class="rank-name ellipsis">{{ item.nick }}</div>
            <div class="rank-id">ID: {{ item.erbanNo }}</div>
          </div>
          <div class="rank-value">
            <img src="@/assets/activity/birthday/birthdayPrivilege/amethyst.png" alt="" />
            <span>{{ formatNumber(item.integral) }}</span>
          </div>
        </div>
        <!-- More按钮 -->
        <div class="more-btn" v-if="!isMore && rankList.length > 10" @click="isMore = !isMore">
          <span>{{ t('birthday.more') }}</span>
        </div>
      </div>

    </div>

    <!-- 底部固定展示 -->
    <div class="rank-footer">
      <div class="rank-sort">{{ selfRank }}</div>
      <div class="rank-avatar">
        <img :src="selfData.avatar" alt="" />
      </div>
      <div class="rank-info">
        <div class="rank-name ellipsis">{{ selfData.nick }}</div>
        <div class="rank-id">ID: {{ selfData.erbanNo }}</div>
      </div>
      <div class="rank-value">
        <img src="@/assets/activity/birthday/birthdayPrivilege/amethyst.png" alt="" />
        <span>{{ formatNumber(selfData.value) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useMainStore } from "@/pinia/index.js";
import { useI18n } from "vue-i18n";
import { Swiper, SwiperSlide } from "swiper/vue";
import { get, postFormData } from "@/utils/http.js";
import "swiper/swiper-bundle.css";
import CountDownBirthday from "@/components/countDown/CountDownBirthday.vue";

const { t } = useI18n();

// Swiper 相关
const mySwiper = ref(null);
const swiperIndex = ref(0);
const swiperKey = ref(0);

const store = useMainStore();

// 倒计时
const countDownTime = ref(0);

// 奖励标题
const rewardTitle = computed(() => {
  const titles = ['TOP1', 'TOP2', 'TOP3', 'TOP4-10'];
  return titles[swiperIndex.value] || 'TOP1';
});

// 榜单类型Tab
const curRankType = ref(1);
const rankTypeList = computed(() => [
  { text: t('birthday.sendBirthdayGiftRanking'), value: 1 },
  { text: t('birthday.receiveBirthdayGiftRanking'), value: 2 },
]);


const onSwiperChange = (swiper) => {
  swiperIndex.value = swiper.activeIndex;
};

const rankTypeChange = (value) => {
  curRankType.value = value;
  swiperIndex.value = 0;
  swiperKey.value += 1;
  // 切换榜单时重新获取数据
  getRankData();
  getRankRewardData();
};

// 数字格式化：千转K，百万转M
const formatNumber = (num) => {
  if (!num || isNaN(num)) return "0";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  }
  return num.toString();
};

// 榜单数据
const rankList = ref([]);
const isMore = ref(false);
const selfData = ref({});

// 展示列表（默认前10，展开前30）
const displayList = computed(() => {
  if (isMore.value) {
    return rankList.value.slice(3, 30);
  }
  return rankList.value.slice(3, 10);
});

// 自己排名
const selfRank = computed(() => {
  const rank = selfData.value.index;
  if (!rank || rank > 99) return "99+";
  return rank;
});


// 获取榜单数据
const getRankData = async () => {
  try {
    const res = await get("/h5doings/activity/birthday/rank", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      type: curRankType.value,
    });
    if (res && res.code === 200) {
      rankList.value = res.data.list || [];
      selfData.value = res.data.self || {};
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching rank data:", error);
  }
};

// 获取奖励数据
const getRankRewardData = async () => {
  try {
    const res = await get("/h5doings/activity/birthday/rankRewards", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      groupType: curRankType.value === 1 ? 3 : 2,
    });
    if (res && res.code === 200) {
      const data = res.data || {};
      // 取前4个名次的奖励（key: 1-4 对应 TOP1-TOP3 和 TOP4-10）
      const pages = [];
      for (let i = 1; i <= 4; i++) {
        const key = String(i);
        if (data[key]) {
          pages.push(data[key]);
        }
      }
      rewardPages.value = pages;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching reward data:", error);
  }
};


// 获取活动列表接口
const getBirthdayList = async () => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      countDownTime.value = res.data.timeOutMonth || 0;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// Reward 数据 (二维数组)
const rewardPages = ref([]);

onMounted(() => {
  getRankData();
  getRankRewardData();
  getBirthdayList();
});
</script>

<style lang="scss" scoped>
.rank {
  min-height: 1580px;
  margin-top: -201px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  /* 倒计时模块 */
  .time{
    position: absolute;
    top: 17px;
    left: 50%;
    transform: translateX(-50%);
  }

  /* 榜单tab模块 */
  .tab-list {
    position: absolute;
    top: 105px;
    width: 344px;
    height: 57px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    .tab-item {
      width: 45%;
      height: 57px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
      padding: 0 20px;
      font-size: 12px;
      font-weight: bold;
      line-height: 12px;
      color: #1E0C1E;
      background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .tab-item-show {
      font-weight: bold;
      font-size: 12px;
      color: #1E0C1E;
      -webkit-text-fill-color: #1E0C1E;
      background: none;
      -webkit-background-clip: unset;
    }

  }

  .tab-send {
    background: url("@/assets/activity/birthday/birthdayRank/tab_rank_hide.png") no-repeat center center;
    background-size: cover;
    width: 344px;
    height: 57px;
  }

  .tab-receive {
    background: url("@/assets/activity/birthday/birthdayRank/tab_rank_show.png") no-repeat center center;
    background-size: cover;
    width: 344px;
    height: 57px;
  }

  /* reward 模块 */
  .reward-box {
    position: absolute;
    width: 357px;
    height: 333px;
    top: 185px;
    background: url("@/assets/activity/birthday/birthdayRank/bg_ranking_reward.png") no-repeat center center;
    background-size: cover;
    .reward-title {
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 180px;
      height: 50px;
      line-height: 14px;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      color: #EBD975;
      font-size: 14px;
      line-height: 14px;
      background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .reward-swiper-wrap {
      position: absolute;
      top: 64px;
      left: 50%;
      transform: translateX(-50%);
      width: 298px;
      height: 204px;
      .reward-page {
        width: 100%;
        height: 204px;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: center;
        margin-bottom: 8px;
        .reward-item {
          width: 92px;
          height: 94px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-inline-end: 11px;
          position: relative;
          &:nth-child(3){
            margin-inline-end: 0;
          }
          
          .reward-img-wrap {
            width: 92px;
            height: 92px;
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            background: url("@/assets/activity/birthday/birthdayRank/bg_reward_item.png") no-repeat center center;
            background-size: cover;
  
            .reward-img {
              margin-top: 17px;
              width: 52px;
              height: auto;
            }
          }
          .reward-days-padding{
            width: 81px;
            height: 26px;
            box-sizing: border-box;
            padding: 0 8px;
            position: absolute;
            bottom: -3px;
            left: 50%;
            width: 81px;
            height: 26px;
            box-sizing: border-box;
            transform: translateX(-50%);
            background: url("@/assets/activity/birthday/birthdayRank/bg_reward_text.png") no-repeat center center;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            .reward-days {
              width: 65px;
              height: 26px;
              >span{
                >span{
                  font-weight: bold;
                  color: #EBD975;
                  font-size: 12px;
                  line-height: 12px;
                  background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
              }
            }
          }
        }
      }
    }
  }

  /* 榜单模块 */
  .ranking-section {
    position: absolute;
    top: 476px;
    width: 357px;
    height: 1049px;
    background: url("@/assets/activity/birthday/birthdayRank/bg_rank.png") no-repeat top center;
    background-size: cover;
    /* TOP3 */
    .rank-top3 {
      width: 100%;
      height: 507px;
      position: absolute;
      .rank-top1 {
        position: absolute;
        top: 55px;
        left: 50%;
        transform: translateX(-50%);
        width: 259px;
        height: 233px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: url("@/assets/activity/birthday/birthdayRank/bg_top1.png") no-repeat top center;
        background-size: cover;
        z-index: 3;
        .rank-frame {
          position: absolute;
          width: 113px;
          height: 44px;
          top: 120px;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
        }
        .rank-avatar {
          position: absolute;
          top: 48px;
          left: 50%;
          transform: translateX(-50%);
          width: 88px;
          height: 88px;
          border-radius: 50%;
          object-fit: cover;
          z-index: 4;
        }
        .rank-name {
          position: absolute;
          top: 165px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 100px;
          height: 10px;
          font-size: 12px;
          line-height: 12px;
          color: #FFFFFF;
          font-weight: bold;
        }
        .rank-id {
          position: absolute;
          top: 178px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 100px;
          height: 10px;
          font-size: 10px;
          line-height: 10px;
          color: #F8C8DB;
          font-weight: bold;
        }
        .rank-value {
          position: absolute;
          top: 191px;
          left: 50%;
          transform: translateX(-50%);
          width: 74px;
          height: 22px;
          background: linear-gradient(180deg, #AC12E2 0%, #41036B 100%);
          border-radius: 10px;
          border: 1px solid #FFEFBD;
          display: flex;
          align-items: center;
          justify-content: center;

          >img {
            width: 15px;
            height: 22px;
            margin-inline-end: 4px;
          }

          span {
            font-weight: bold;
            font-size: 10px;
            color: #FFFFFF;
            text-shadow:
              1px 1px 0px #000000,
              -1px -1px 0px #000000,
              -1px 1px 0px #000000,
              1px -1px 0px #000000;
          }
        }
      }

      .rank-top2 {
        position: absolute;
        top: 284px;
        left: 16px;
        width: 171px;
        height: 204px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: url("@/assets/activity/birthday/birthdayRank/bg_top2.png") no-repeat top center;
        background-size: cover;
        z-index: 3;

        .rank-frame {
          position: absolute;
          width: 77px;
          height: 30px;
          top: 98px;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
        }
        .rank-avatar {
          position: absolute;
          top: 33px;
          left: 50%;
          transform: translateX(-50%);
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          z-index: 4;
        }
        .rank-name {
          position: absolute;
          top: 129px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 80px;
          height: 10px;
          font-size: 12px;
          line-height: 12px;
          color: #FFFFFF;
          font-weight: bold;
        }
        .rank-id {
          position: absolute;
          top: 142px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 80px;
          height: 10px;
          font-size: 10px;
          line-height: 10px;
          color: #123061;
          font-weight: bold;
        }
        .rank-value {
          position: absolute;
          top: 156px;
          left: 50%;
          transform: translateX(-50%);
          width: 74px;
          height: 22px;
          background: linear-gradient(180deg, #AC12E2 0%, #41036B 100%);
          border-radius: 10px;
          border: 1px solid #FFEFBD;
          display: flex;
          align-items: center;
          justify-content: center;

          >img {
            width: 15px;
            height: 22px;
            margin-inline-end: 4px;
          }

          span {
            font-weight: bold;
            font-size: 10px;
            color: #FFFFFF;
            text-shadow:
              1px 1px 0px #000000,
              -1px -1px 0px #000000,
              -1px 1px 0px #000000,
              1px -1px 0px #000000;
          }
        }
      }

      .rank-top3 {
        position: absolute;
        top: 284px;
        right: 13px;
        width: 162px;
        height: 208px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: url("@/assets/activity/birthday/birthdayRank/bg_top3.png") no-repeat top center;
        background-size: cover;
        z-index: 3;

        .rank-frame {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .rank-avatar {
          position: absolute;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
        }

        .rank-name {
          position: absolute;
          top: 129px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 80px;
          height: 10px;
          font-size: 12px;
          line-height: 12px;
          color: #FFFFFF;
          font-weight: bold;
        }

        .rank-id {
          position: absolute;
          top: 142px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 80px;
          height: 10px;
          font-size: 10px;
          line-height: 10px;
          color: #541018;
          font-weight: bold;
        }
        .rank-value {
          position: absolute;
          top: 156px;
          left: 50%;
          transform: translateX(-50%);
          width: 74px;
          height: 22px;
          background: linear-gradient(180deg, #AC12E2 0%, #41036B 100%);
          border-radius: 10px;
          border: 1px solid #FFEFBD;
          display: flex;
          align-items: center;
          justify-content: center;

          >img {
            width: 15px;
            height: 22px;
            margin-inline-end: 4px;
          }

          span {
            font-weight: bold;
            font-size: 10px;
            color: #FFFFFF;
            text-shadow:
              1px 1px 0px #000000,
              -1px -1px 0px #000000,
              -1px 1px 0px #000000,
              1px -1px 0px #000000;
          }
        }
      }
    }

    /* 榜单列表 */
    .rank-list {
      position: absolute;
      top: 506px;
      left: 50%;
      transform: translateX(-50%);
      width: 307px;
      height: 467px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;

      .rank-item {
        width: 307px;
        height: 64px;
        flex-shrink: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        box-sizing: border-box;
        background: url("@/assets/activity/birthday/birthdayRank/bg_item.png") no-repeat center center;
        background-size: cover;
        margin-bottom: 13px;
        .rank-sort {
          width: 30px;
          font-size: 14px;
          font-weight: bold;
          text-align: end;
          margin-inline-start: 5px;
          color: #EBD975;
          font-size: 14px;
          line-height: 14px;
          background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

        }

        .rank-avatar {
          width: 43px;
          height: 43px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 11px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .rank-info {
          width: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .rank-name {
            font-size: 12px;
            color: #ffffff;
            font-weight: bold;
            max-width: 120px;
          }

          .rank-id {              
            font-size: 10px;
            font-weight: bold; 
            color: #F8C8DB;
          }
        }

        .rank-value {
          width: 70px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          img {
            width: 15px;
            height: 22px;
            margin-inline-end: 3px;
          }

          span {
            font-weight: bold;
            color: #EBD975; 
            font-size: 12px;
            line-height: 12px;
            background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
      /* More按钮 */
      .more-btn {
        width: 91px;
        height: 37px;
        background: linear-gradient(-4deg, #7023E3, #B134E4);
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        margin: 0 auto;
        >span{
          font-weight: bold;
          color: #EBD975;
          font-size: 14px;
          line-height: 14px;
          background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }

 
  }

  /* 底部固定展示 */
  .rank-footer {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 101px;
    background: #250E3D;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-bottom: 21px;
    z-index: 10;

    .rank-sort {
      width: 26px;
      text-align: start;
      margin-inline-start: 27px;
      font-size: 14px;
      font-weight: bold;
      line-height: 14px;
      background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .rank-avatar {
      width: 54px;
      height: 54px;
      background: linear-gradient(175deg, #FFFFD1, #F9DD59);
      border: 1px solid #FFEFBD;
      border-radius: 50%;
      margin-inline-start: 8px;
      margin-inline-end: 6px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .rank-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .rank-name {
        font-size: 12px;
        color: #ffffff;
        font-weight: bold;
      }
      
      .rank-id {
        font-size: 10px;
        font-weight:  bold;
        color: #F8C8DB;
      }
    }

    .rank-value {
      display: flex;
      align-items: center;
      margin-inline-start: 10px;
      margin-inline-end: 27px;

      img {
        width: 15px;
        height: 22px;
        margin-inline-end: 5px;
      }

      span {
        font-size: 12px;
        font-weight: bold;
        line-height: 14px;
        background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}

/* 省略号处理 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>