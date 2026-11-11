<!-- 榜单 -->
<template>
  <div class="reward" :class="{'reward3': curTabTime === 2}, {'reward-show': rewardShow}">
    <div class="tab-list">
      <div 
        :class="['tab-item', { 'tab-show': curTab === item.value }]"
        v-for="(item, index) in tabList" 
        :key="index" 
        @click="tabChange(item.value)"
      >{{ item.text }}</div>
    </div>
    <div class="rank" :class="{'rankBg3': curTabTime === 2}" v-if="!rewardShow">
      <div class="more" @click="rewardShow = true">{{ $t('recharge.more') }}</div>
      <div class="recharge-box">
        <div class="recharge-box-title">{{ curTab === 2 ? $t('recharge.weeklyRankingReward') : $t('recharge.monthlyRankingReward')}}</div>
        <div class="recharge-box-sec">
          <Swiper 
          :initial-slide="index" 
          :slides-per-view="1"
          :space-between="0"
          @slideChange="onSwiperChange"
          style="height:100%;">
          <SwiperSlide v-for="(item, idx) in rankRewardList" :key="idx">
            <div class="recharge-box-list">
              <div class="recharge-box-top" v-if="idx === 0">{{ $t('recharge.top1') }}</div>
              <div class="recharge-box-top" v-if="idx === 1">{{ $t('recharge.top2') }}</div>
              <div class="recharge-box-top" v-if="idx === 2">{{ $t('recharge.top3') }}</div>
              <div class="recharge-box-item" v-for="(items, indexs) in item">
                    <div class="recharge-box-pic">
                      <div class="recharge-box-img">
                        <img :src="items.rewardUrl" alt="">
                      </div>
                    </div>
                    <sanaAutoText class="recharge-box-text" :key="new Date().getTime()" v-if="items.rewardName">
                        {{ `${store.language === 'ar' ? items.rewardNameAr : items.rewardName} ${items.rewardValue? ' * ' + items.rewardValue : ''}` }}
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
      <div class="tab-time-list">
        <div 
          :key="index" 
          :class="['tab-time-item', { 'tab-time-show': curTabTime === item.value }]"
          v-for="(item, index) in curTab === 2 ? tabListTime : tabListTime1" 
          @click="tabChangeTime(item.value)"
        >{{ item.text }}</div>
      </div>
      <div class="rank-list-section" v-if="curTabTime === 1">
        <div class="rank-top">
          <div class="rank-top-1" v-if="rankData?.length > 0">
            <div class="rank-top-avatar"></div>
            <img class="rank-top-head" :src="rankData[0].avatar" alt="">
            <div class="rank-top-name">{{ rankData[0].nick }}</div>
          </div>
          <div class="rank-top-2" v-if="rankData?.length > 1">
            <div class="rank-top-avatar"></div>
            <img class="rank-top-head" :src="rankData[1].avatar" alt="">
            <div class="rank-top-name">{{ rankData[1].nick }}</div>
          </div>
          <div class="rank-top-3" v-if="rankData?.length > 2">
            <div class="rank-top-avatar"></div>
            <img class="rank-top-head" :src="rankData[2].avatar" alt="">
            <div class="rank-top-name">{{ rankData[2].nick }}</div>
          </div>
        </div>
        <div class="rank-list">
          <div class="rank-item" v-for="(item, index) in isMore ? rankData.slice(3,20) : rankData.slice(3,10)">
            <div class="sort">{{ item.index}}</div>
            <div class="avatar">
              <img :src="item.avatar" alt="">
            </div>
            <div class="name-id">
              <div class="name">{{  item.nick }}</div>
              <div class="id">{{ $t('recharge.id', {id: item.erbanNo}) }}</div>
            </div>
            <div class="number">
              <img src="@/assets/activity/recharge/rank/diamond.png" alt="" class="diamond">
              <span>{{ item.integral }}</span>
            </div>
          </div>
        </div>
        <div class="more" v-if="rankData.length > 10" @click="isMore = !isMore">More</div>
      </div>
      <div class="rank-last"  v-if="curTabTime === 2">
        <div class="rank-last-item" v-for="(item, index) in lastList">
          <div class="rank-last-item-title">{{ titleFilter(index) }}</div>
          <div class="rank-last-item-top">
            <div :class="'rank-last-item-top-'+(indexs+1)" v-for="(items, indexs) in item" :key="indexs">
              <div class="avatar"></div>
              <div class="head">
                <img :src="items?.avatar" alt="">
              </div>
              <div class="name">{{ items?.nick }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="user-info" v-if="curTabTime !== 2 && !rewardShow">
      <div class="sort">{{ selfData.index === 0 || selfData.index > 99 ? '99+' : selfData.index }}</div>
      <div class="avatar">
        <img :src="selfData.avatar" alt="" class="avatar">
      </div>
      <div class="name-id-value">
        <div class="name">{{ selfData.nick }}</div>
        <div class="id">{{ $t('recharge.id', {id: selfData.erbanNo}) }}</div>
        <div class="value-text">{{ $t('recharge.weeklyRankingValue') }}</div>
        <div class="value">{{ selfData.integral }}</div>
      </div>
      <div class="recharge-btn" @click="getRechargePage">{{ $t('recharge.recharge') }}</div>
    </div>
    <div class="reward-box" v-if="rewardShow">
      <div class="back" @click="rewardShow = false">{{ $t('recharge.back') }}</div>
      <div class="reward-box-banner">
      </div>
      <div class="reward-box-content">
        <div class="reward-box-title">{{ curTab === 2 ? $t('recharge.weeklyRankingReward') : $t('recharge.monthlyRankingReward')}}</div>
        <div class="reward-box-list">
          <div class="reward-box-item" v-for="(item, index) in rankRewardList">
            <div class="item-title" v-if="index === 0">{{ $t('recharge.top1') }}</div>
            <div class="item-title" v-if="index === 1">{{ $t('recharge.top2') }}</div>
            <div class="item-title" v-if="index === 2">{{ $t('recharge.top3') }}</div>
            <div class="item-content">
              <div class="list">
                <div class="item" v-for="(items, indexs) in item">
                  <div class="reward-img">
                    <div class="reward-img-box">
                      <img :src="items.rewardUrl" alt="">
                    </div>
                  </div>
                  <sanaAutoText class="reward-text"  v-if="items.rewardName">
                      {{ `${store.language === 'ar' ? items.rewardNameAr : items.rewardName} ${items.rewardValue? ' * ' + items.rewardValue : ''}` }}
                  </sanaAutoText>
                  <sanaAutoText class="reward-text"  v-else>
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
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import { get, postFormData } from '@/utils/http.js'
import { useMainStore } from '@/pinia/index.js'
import { useI18n } from 'vue-i18n'

// 定义emit
const emit = defineEmits(['timeChange'])

const { t } = useI18n()
const store = useMainStore()
const rewardShow = ref(false)
const rankRewardList = ref([])
const rankData = ref([])
const listData = ref({})
const selfData = ref({})
const isMore = ref(false);
const curTab = ref(2);
const tabList = [
  {
    text: t('recharge.weeklyRanking'),
    value: 2
  },
  {
    text: t('recharge.monthlyRanking'),
    value: 3
  },
];

const curTabTime = ref(1);
const tabListTime = [
  {
    text: t('recharge.ranking'),
    value: 1
  },
  {
    text: t('recharge.lastWeek'),
    value: 2
  },
];

const tabListTime1 = [
  {
    text: t('recharge.ranking'),
    value: 1
  },
  {
    text: t('recharge.lastMonth'),
    value: 2
  },
];

const lastList = computed(() => {
  if(curTab.value === 2){
    const arr = []
    arr.push(listData.value.weekTop3?.listLast || [])
    arr.push(listData.value.weekTop3?.listLastTwo || [])
    return arr
  }
  if(curTab.value === 3){
    const arr = []
    arr.push(listData.value.monthTop3?.listLast || [])
    arr.push(listData.value.monthTop3?.listLastTwo || [])
    return arr
  }
})

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

    const format = (date) => date.toISOString().split('T')[0]; // YYYY-MM-DD

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
      'recharge.January', 'recharge.February', 'recharge.March', 'recharge.April',
      'recharge.May', 'recharge.June', 'recharge.July', 'recharge.August',
      'recharge.September', 'recharge.October', 'recharge.November', 'recharge.December'
    ];

    return `${t(monthNames[targetMonth])}`;
    // 或返回中文格式：`${targetYear}年${targetMonth + 1}月`
  }

  return '';
}

// 方法定义
const tabChange = (value) => {
  curTab.value = value
  getActivityRechargeRank()
  getActivityRechargeList()
  getActivityRechargeGetGifts(curTab.value + 1)
}
const tabChangeTime = (value) => {
  curTabTime.value = value
}

// 去充值
const getRechargePage = () =>{
  if(store.platform == 'ios'){
    WKWebViewJavascriptBridge.callHandler('goto',{"page":'1'})
  }else if(store.platform == 'android'){
    console.log('jsBridge- to -andriod')
    WebViewJavascriptBridge.goto("{'page':'1','uid':''}",null)
  }else{
    console.log('充值')
  }
}

// 切换swiper
const onSwiperChange = (swiper) => {
  index.value = swiper.activeIndex
}

// 获取排行榜
const getActivityRechargeRank = async() => {
  try {
    const res = await get('/h5doings/activity/recharge/rank', {
      uid: store.uid,
      type: curTab.value,
      size: 20,
      ticket: store.ticket,
      language: store.language
    })
    if (res && res.code === 200) {
      rankData.value = res.data.list || []
      selfData.value = res.data.self || []
    } else {
      console.error('Failed to fetch anchor info:', res.message)
    }
  } catch (error) {
    console.error('Error fetching anchor info:', error)
  }
}

const getActivityRechargeList = async() => {
  try {
    const res = await postFormData('/h5doings/activity/recharge/list', {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language
    })
    if (res && res.code === 200) {
      listData.value = res.data || {}
      let timeData = {
        timeOutDay: listData.value.timeOutDay,
        weekTimeOut: listData.value.weekTimeOut,
        monthTimeOut: listData.value.monthTimeOut,
        curTab: curTab.value
    }
    emit('timeChange', timeData)
    } else {
      console.error('Failed to fetch anchor info:', res.message)
    }
  } catch (error) {
    console.error('Error fetching anchor info:', error)
  }
}

const getActivityRechargeGetGifts = async(type) => {
  try {
    const res = await get('/h5doings/activity/recharge/getGifts', {
      type: type,
      uid: store.uid,
      ticket: store.ticket,
      language: store.language
    })
    if (res && res.code === 200) {
      const obj = res.data
      const result = [];
      for (let key in obj) {
        result.push(obj[key]);
      }
      rankRewardList.value = result || []
    } else {
      console.error('Failed to fetch anchor info:', res.message)
    }
  } catch (error) {
    console.error('Error fetching anchor info:', error)
  }
}

onMounted(async () => {
  getActivityRechargeRank()
  getActivityRechargeList()
  getActivityRechargeGetGifts(curTab.value + 1)
})

</script>

<style lang="scss" scoped>
.reward{
  width: 100%;
  height: 1334px;
  background: #360D00;
  margin-top: -58px;
  padding-top: 58px;
  box-sizing: border-box;
  font-family: LogoSCUnboundedSans, system-ui, Avenir, Helvetica, Arial, sans-serif;
  .tab-list{
    width: 100%;
    height: 68px;
    box-sizing: border-box;
    padding: 0 43px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >.tab-item{
      width: 137px;
      height: 68px;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 13px;
      text-shadow: 0px 1px 2px #585858;
      padding: 26px 20px 15px;
      text-align: center;
      background: url('@/assets/activity/recharge/rank/tabHide.png') no-repeat center center;
      background-size: cover;
    }
    .tab-show{
      background: url('@/assets/activity/recharge/rank/tabShow.png') no-repeat center center;
      background-size: cover;
    }
  }
  .rank{
    width: 355px;
    height: 1120px;
    margin: -25px auto 0; 
    // background: url('@/assets/activity/recharge/rank/rankBg.png') no-repeat top center;
    // background-size: 100% 100%;
    background-image: 
      url('@/assets/activity/recharge/rank/rankBg1.png'),
      url('@/assets/activity/recharge/rank/rankBg2.png'),
      url('@/assets/activity/recharge/rank/rankBg3.png');
    background-size: 
      355px 307px, 
      355px 611px, 
      355px 178px;
    background-position: 
      0 25px, 
      0 332px, 
      0 942px;
    background-repeat: no-repeat; /* 禁止重复 */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    .more{
      width: 63px;
      height: 29px;
      position: absolute;
      right: 23px;
      top: 74px;
      padding: 3px 6px 3px 0px;
      box-sizing: border-box;
      text-align: right;
      font-family: PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
      font-weight: bold;
      font-size: 15px;
      color: #FFEB0D;
      line-height: 21px;
      background: url('@/assets/activity/recharge/rank/more.png') no-repeat top center;
      background-size: 100% 100%;
    }
    .recharge-box{
      margin-top: 73px;
      width: 301px;
      // height: 193px;
      height: 318px;
      background: url('@/assets/activity/recharge/rank/rechargeBg1.png') no-repeat center center;
      background-size: cover;
      .recharge-box-title{
        width: 153px;
        height: 22px;
        font-size: 15px;
        color: #8B0303;
        line-height: 11px;
        text-align: center;
        margin: 36px auto 0;
      }
      .recharge-box-sec{
        width: 100%;
        height: 257px;
        .recharge-box-list{
          width: 100%;
          height: 257px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 0 18px;
          position: relative;
          .recharge-box-top{
            position: absolute;
            top: 2px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 13px;
            color: #FFFE85;
            line-height: 19px;
            font-weight: bold;
            font-family: PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
          }
          .recharge-box-item{
            margin-top: 19px;
            width: 88px;
            height: 102px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .recharge-box-pic{
              width: 81px;
              height: 77px;
              background: url('@/assets/activity/recharge/reward/rechargeBoxBg.png') no-repeat center center;
              background-size: cover;
              display: flex;
              justify-content: center;
              align-items: center;
              .recharge-box-img{
                width: 60px;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                >img{
                  display: inline-block;
                  width: 60px;
                }
              }
            }
            .recharge-box-text{
              margin-top: 4px;
              width: 78px;
              height: 22px;
              font-weight: bold;
              font-size: 13px;
              padding: 0 5px;
              box-sizing: border-box;
              color: #FFFFFF;
              line-height: 15px;
              text-align: center;
              background: url('@/assets/activity/recharge/rank/rechargeTextBg.png') no-repeat center center;
              background-size: cover;
              display: flex;
              justify-content: center;
              align-items: center;
              font-family: DINAlternate, DINAlternate, PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
      }
    }
    .tab-time-list{
      width: 269px;
      height: 37px;
      box-sizing: border-box;
      padding: 0 7px 0 7px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 7px auto 4px;
      >.tab-time-item{
        width: 124px;
        height: 37px;
        font-size: 14px;
        color: #A42D00;
        line-height: 20px;
        text-shadow: 
          -1px -1px 0 #FFEC8E,  
          1px -1px 0 #FFEC8E,
          -1px 1px 0 #FFEC8E,
          1px 1px 0 #FFEC8E; /* 四方向阴影模拟描边 */
        padding: 7px 0 10px 0;
        text-align: center;
        background: url('@/assets/activity/recharge/rank/timeHide.png') no-repeat center center;
        background-size: cover;
      }
      .tab-time-show{
        background: url('@/assets/activity/recharge/rank/timeShow.png') no-repeat center center;
        background-size: cover;
      }
    }
    .rank-list-section{
      width: 100%;
      height: 154px;
      font-family: PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
      .rank-top{
        width: 100%;
        height: 154px;
        position: relative;
        .rank-top-1{
          position: absolute;
          width: 111px;
          height: 122px;
          top: 6px;
          left: 123px;
          background: url('@/assets/activity/recharge/rank/top1.png') no-repeat center center;
          background-size: cover;
          .rank-top-avatar{
            position: absolute;
            width: 118px;
            height: 92px;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            background: url('@/assets/activity/recharge/rank/topAvatar1.png') no-repeat center center;
            background-size: cover;
            z-index: 10;
          }
          .rank-top-head{
            position: absolute;
            width: 44px;
            height: 44px;
            top: 20px;
            left: 33px;
            border-radius: 50%;
            z-index: 9;
          }
        }
        .rank-top-2{
          position: absolute;
          width: 99px;
          height: 110px;
          top: 58px;
          left: 30px;
          background: url('@/assets/activity/recharge/rank/top2.png') no-repeat center center;
          background-size: cover;
          .rank-top-avatar{
            position: absolute;
            width: 100px;
            height: 83px;
            top: -5px;
            left: 50%;
            transform: translateX(-50%);
            background: url('@/assets/activity/recharge/rank/topAvatar2.png') no-repeat center center;
            background-size: cover;
            z-index: 10;
          }
          .rank-top-head{
            position: absolute;
            width: 40px;
            height: 40px;
            top: 20px;
            left: 30px;
            border-radius: 50%;
            z-index: 9;
          }
        }
        .rank-top-3{
          position: absolute;
          width: 101px;
          height: 111px;
          top: 62px;
          right: 33px;
          background: url('@/assets/activity/recharge/rank/top3.png') no-repeat center center;
          background-size: cover;
          .rank-top-avatar{
            position: absolute;
            width: 100px;
            height: 83px;
            top: -5px;
            left: 50%;
            transform: translateX(-50%);
            background: url('@/assets/activity/recharge/rank/topAvatar3.png') no-repeat center center;
            background-size: cover;
            z-index: 10;
          }
          .rank-top-head{
            position: absolute;
            width: 40px;
            height: 40px;
            top: 20px;
            left: 30px;
            border-radius: 50%;
            z-index: 9;
          }
        }
        .rank-top-1,.rank-top-2,.rank-top-3{
          position: absolute;
          .rank-top-name{
            font-family: DingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
            position: absolute;
            top: 94px;
            left: 50%;
            transform: translateX(-50%);
            width: 67px;
            min-height: 17px;
            max-height: 34px;
            font-size: 12px;
            color: #FFFFFF;
            line-height: 17px;
            text-align: center;
          }
        }
        .rank-top-1{
          .rank-top-name{
            top: 88px;
            width: 111px;
          }
        }
        .rank-top-2{
          .rank-top-name{
            top: 79px;
            width: 110px;
          }
        }
        .rank-top-3{
          .rank-top-name{
            top: 78px;
            width: 110px;
          }
        }
      }
      .rank-list{
        width: 292PX;
        height: 436px;
        overflow-y: auto;
        margin: 25px auto 4px;
        &::-webkit-scrollbar{
          display: none;
        }
        .rank-item{
          width: 292px;
          height: 58px;
          margin-bottom: 5px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 11px;
          padding-right: 23px;
          background: url('@/assets/activity/recharge/rank/itemBg.png') no-repeat center center;
          background-size: cover;
          &:last-child{
            margin-bottom: 0;
          }
          .sort{
            width: 23px;
            text-align: center;
            font-size: 17px;
            color: #F0CC5D;
            line-height: 21px;
          }
          .avatar{
            width: 40px;
            height: 40px;
            border: 1px solid #FFFFFF;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            >img{
              width: 40px;
            }
          }
          .name-id{
            width: 104px;
            height: 34px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            .name{
              font-weight: bold;
              margin-bottom: 1px;
              font-size: 13px;
              color: #FFE5AD;
              line-height: 19px;
            }
            .id{
              font-size: 10px;
              color: #FFF0D0;
              line-height: 14px;
            }
          }
          .number{
            width: 81px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .diamond{
              width: 10px;
              height: 10px;
              margin-right: 3px;
            }
            >span{
              font-weight: bold;
              font-size: 13px;
              color: #F4D35E;
              line-height: 19px;
            }
          }
        }
      }
      .more{
        width: 99px;
        height: 33px;
        font-weight: bold;
        font-size: 15px;
        color: #FFEB0D;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 0 7px 0;
        margin: 4px auto 0;
        background: url('@/assets/activity/recharge/rank/textBg.png') no-repeat center center;
        background-size: cover;
      }
    }
    .rank-last{
      .rank-last-item{
        width: 284px;
        height: 202px;
        margin-bottom: 5px;
        background: url('@/assets/activity/recharge/rank/lastBg.png') no-repeat top center;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .rank-last-item-title{
          height: 17px;
          font-weight: bold;
          font-size: 12px;
          color: #835E00;
          line-height: 17px;
          text-align: center;
          margin: 13px auto 8px;
          font-family: DINAlternate, DINAlternate, PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
        }
        .rank-last-item-top{
          position: relative;
          width: 100%;
          height: 100%;
          .rank-last-item-top-1{
            width: 93px;
            height: 93px;
            position: absolute;
            top: 0;
            left: 95px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .avatar{
              position: absolute;
              top: 0;
              left: 50%;
              z-index: 2;
              transform: translateX(-50%);
              width: 93px;
              height: 93px;
              background: url('@/assets/activity/recharge/rank/lastTop1.png') no-repeat top center;
              background-size: 100% 100%;
            }
            .head{
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
              >img{
                width: 47px;
              }
            }
            .name{
              position: absolute;
              top: 90px;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              text-align: center;
              height: 17px;
              font-family: PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
              font-weight: bold;
              font-size: 12px;
              color: #FFFFFF;
              line-height: 17px;
              white-space: nowrap;   /* 强制文本不换行 */
              overflow: hidden;      /* 隐藏溢出内容 */
              text-overflow: ellipsis; /* 溢出时显示省略号 */
            }
          }
          .rank-last-item-top-2{
            width: 80px;
            height: 80px;
            position: absolute;
            top: 53px;
            left: 4px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .avatar{
              position: absolute;
              top: 0;
              left: 50%;
              z-index: 2;
              transform: translateX(-50%);
              width: 80px;
              height: 80px;
              background: url('@/assets/activity/recharge/rank/lastTop2.png') no-repeat top center;
              background-size: 100% 100%;
              
            }
            .head{
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
              >img{
                width: 47px;
              }
            }
            .name{
              position: absolute;
              top: 78px;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              text-align: center;
              height: 17px;
              font-family: PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
              font-weight: bold;
              font-size: 12px;
              color: #FFFFFF;
              line-height: 17px;
              white-space: nowrap;   /* 强制文本不换行 */
              overflow: hidden;      /* 隐藏溢出内容 */
              text-overflow: ellipsis; /* 溢出时显示省略号 */
            }
          }
          .rank-last-item-top-3{
            width: 80px;
            height: 80px;
            position: absolute;
            top: 43px;
            right: 13px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .avatar{
              position: absolute;
              top: 0;
              left: 50%;
              z-index: 2;
              transform: translateX(-50%);
              width: 80px;
              height: 80px;
              background: url('@/assets/activity/recharge/rank/lastTop3.png') no-repeat top center;
              background-size: 100% 100%;
            }
            .head{
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
              >img{
                width: 47px;
              }
            }
            .name{
              position: absolute;
              top: 78px;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              text-align: center;
              height: 17px;
              font-family: PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
              font-weight: bold;
              font-size: 12px;
              color: #FFFFFF;
              line-height: 17px;
              white-space: nowrap;   /* 强制文本不换行 */
              overflow: hidden;      /* 隐藏溢出内容 */
              text-overflow: ellipsis; /* 溢出时显示省略号 */
            }
          }
        }
      }
    }
  }
  .rankBg3{
    // background: url('@/assets/activity/recharge/rank/rankBg3.png') no-repeat top center;
    // background-size: 100% 100%;
    // height: 1167px;
    background-image: 
      url('@/assets/activity/recharge/rank/rankBg1.png'),
      url('@/assets/activity/recharge/rank/rankBg2.png'),
      url('@/assets/activity/recharge/rank/rankBg3.png');
    background-size: 
      355px 307px, 
      355px 805px, 
      355px 178px;
    background-position: 
      0 25px, 
      0 332px, 
      0 1134px;
    background-repeat: no-repeat; /* 禁止重复 */
    height: 1312px;
  }
  .user-info{
    position: fixed;
    z-index: 999;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 124px;
    background: url('@/assets/activity/recharge/rank/userBg.png') no-repeat top center;
    background-size: 100% 100%;
    padding: 51px 27px 6px 15px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-family:  PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
    >.sort{
      margin-top: 17px;
      width: 24px;
      font-weight: bold;
      font-size: 13px;
      color: #FFE157;
      line-height: 51px;
      text-align: center;
    }
    >.avatar{
      width: 40px;
      height: 40px;
      border: 1px solid #FFFFFF;
      border-radius: 50%;
      overflow: hidden;
      margin: 18px 9px 0 1px;
      display: flex;
      justify-content: center;
      align-items: center;
      >img{
        width: 100%;
      }
    }
    .name-id-value{
      width: 145px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .name{
        font-weight: bold;
        font-size: 13px;
        color: #FFE157;
        line-height: 19px;
        text-align: center;
        font-style: normal;
      }
      .id{
        width: 61px;
        height: 19px;
        font-weight: bold;
        font-size: 13px;
        color: #FFE157;
        line-height: 19px;
        text-align: center;
        margin-top: -3px;
      }
      .value-text,
      .value{
        width: 138px;
        height: 19px;
        font-weight: 600;
        font-size: 13px;
        color: #FFE157;
        line-height: 19px;
        text-align: left;
        margin-top: -2px;
      }
    }
    .recharge-btn{
      width: 96px;
      height: 29px;
      margin: 26px auto 0 20px;
      font-weight: bold;
      font-size: 15px;
      color: #FFEB0D;
      line-height: 21px;
      text-align: center;
      padding: 2px 0 6px 0;
      background: url('@/assets/activity/recharge/rank/textBg.png') no-repeat top center;
      background-size: 100% 100%;
    }
  }
  >.reward-box{
    width: 355px;
    margin: -25px auto 0; 
    height: 733px;
    background: url('@/assets/activity/recharge/rank/rewardBoxBg.png') no-repeat top center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    .back{
      width: 63px;
      height: 29px;
      position: absolute;
      right: 23px;
      top: 74px;
      padding: 3px 6px 3px 0px;
      box-sizing: border-box;
      text-align: right;
      font-family: PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
      font-weight: bold;
      font-size: 15px;
      color: #FFEB0D;
      line-height: 21px;
      background: url('@/assets/activity/recharge/rank/more.png') no-repeat top center;
      background-size: 100% 100%;
    }
    .reward-box-banner{
      width: 275px;
      height: 97px;
      background: url('@/assets/activity/recharge/rank/banner.png') no-repeat top center;
      background-size: 100% 100%;
      margin: 97px auto 16px;
    }
    .reward-box-content{
      width: 301px;
      height: 501px;
      margin: 0 auto;
      background: url('@/assets/activity/recharge/rank/rewardBg.png') no-repeat top center;
      background-size: 100% 100%;
      .reward-box-title{
        width: 153px;
        height: 21px;
        font-family: LogoSCUnboundedSans, system-ui, Avenir, Helvetica, Arial, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #8B0303;
        line-height: 11px;
        text-align: center;
        margin: 34px auto 13px;
      }
      .reward-box-list{
        height: 420px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow-y: auto;
        &::-webkit-scrollbar{
          display: none;
        }
        .reward-box-item{
          width: 264px;
          height: auto;
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          &:last-child{
            margin-bottom: 0;
          }
          .item-title{
            width: 100%;
            height: 19px;
            font-family: PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
            font-weight: bold;
            font-size: 13px;
            color: #FFFE85;
            line-height: 19px;
            text-align: center;
          }
          .item-content{
            width: 100%;
            height: auto;
            &::-webkit-scrollbar{
              display: none;
            }
            .list{
              width: auto;
              min-height: 109px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-wrap: wrap;
              .item{
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                .reward-img{
                  width: 81px;
                  height: 77px;
                  background: url('@/assets/activity/recharge/rank/rewardImg.png') no-repeat top center;
                  background-size: 100% 100%;
                  margin: 5px auto 4px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-sizing: border-box;
                  padding-top: 1px;
                  >.reward-img-box{
                    width: 60px;
                    height: 60px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    >img{
                      width: 60px;
                    };
                  }
                }
                .reward-text{
                  width: 88px;
                  height: 22px;
                  background: url('@/assets/activity/recharge/rank/rewardText.png') no-repeat top center;
                  background-size: 100% 100%;
                  text-align: center;
                  font-family: DINAlternate, DINAlternate, PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
                  font-weight: bold;
                  font-size: 13px;
                  color: #FFFFFF;
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

.reward3{
  // height: 1396px;
  // height: 1272px;
  height: 1417px;
}
.reward-show{
  height: 866px;
}
</style>