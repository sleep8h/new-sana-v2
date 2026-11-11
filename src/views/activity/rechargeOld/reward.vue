<!-- 奖励 -->
<template>
  <div class="reward">
    <div class="tab-list">
      <div 
        :key="index" 
        :class="['tab-item', { 'tab-show': curTab === item.value }]"
        v-for="(item, index) in tabList" 
        @click="tabChange(item.value)"
      >{{ item.text }}</div>
    </div>
    <div class="reward">
      <div class="user-info">
        <div class="avatar">
          <img :src="listData.avatar" alt="">
        </div>
        <div class="id-recharge">
          <div class="id">{{ $t('recharge.id', {id: listData.erbanNo}) }}</div>
          <div class="recharge" v-if="curTab === 1">{{ $t('recharge.mydailyRecharge', {number: amountFilter(listData.dayGold)}) }}</div>
          <div class="recharge" v-if="curTab === 2">{{ $t('recharge.myWeeklyRecharge', {number: amountFilter(listData.weekGold)}) }}</div>
          <div class="recharge" v-if="curTab === 3">{{ $t('recharge.myMonthlyRecharge', {number: amountFilter(listData.monthGold)}) }}</div>
        </div>
      </div>
      <div class="recharge-btn">
        <div class="title" v-if="curTab === 1">{{ $t('recharge.monthlyProgress') }}</div>
        <div class="title" v-if="curTab === 2">{{ $t('recharge.weekProgress') }}</div>
        <div class="title" v-if="curTab === 3">{{ $t('recharge.dailyProgress') }}</div>
        <div class="btn" @click="getRechargePage">{{ $t('recharge.recharge') }}</div>
      </div>
      <div class="treasure-box">
        <!-- <div class="treasure-box-progress"></div> -->
        <div class="treasure-box-sec">
          <div class="treasure-box-list">
            <div class="treasure-box-list-hide"></div>
            <div class="treasure-box-list-show"></div>
            <div class="treasure-box-item" v-for="(item, index) in boxList" @click="handleBoxClick(index)" :key="index">
              <img v-if="boxLv > index" :src="getTreasureboxshowImageUrl(index)" alt="">
              <img v-else :src="getTreasureboxhideImageUrl(index)" alt="">
              <span>{{ mapBoxAmount(index) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="recharge-box">
        <div class="recharge-box-title">{{$t('recharge.Award')}}</div>
        <div class="recharge-box-sec">
          <Swiper 
            :initial-slide="index" 
            :slides-per-view="1"
            ref="mySwiper"
            :space-between="0"
            @slideChange="onSwiperChange"
            style="height:100%;">
              <SwiperSlide v-for="(item, idx) in boxList" :key="idx">
                <div class="recharge-box-list">
                  <div class="recharge-box-item" v-for="(items, indexs) in item" :key="indexs">
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
      <div class="recharge-ranking">
        <div class="recharge-ranking-list">
          <div :class="['recharge-ranking-item', 'recharge-ranking-top'+(index+1)]" v-for="(item, index) in topList" :key="index">
            <div class="recharge-ranking-item-avatar">
              <img class="recharge-ranking-item-frame" v-if="index === 0" src="@/assets/activity/recharge/reward/top1.png" alt="">
              <img class="recharge-ranking-item-frame" v-if="index === 1" src="@/assets/activity/recharge/reward/top2.png" alt="">
              <img class="recharge-ranking-item-frame" v-if="index === 2" src="@/assets/activity/recharge/reward/top3.png" alt="">
              <img class="recharge-ranking-item-head" :src="item.avatar || 'https://file.sanalive.online/FjtjvgevwO1sQbFUcc1AhccABubq'" alt="">
            </div>
            <div class="recharge-ranking-item-name">{{item.nick}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import { get, postFormData } from '@/utils/http.js'
import { useMainStore } from '@/pinia/index.js'
import treasureboxhide1 from '@/assets/activity/recharge/reward/treasure-box-hide1.png'
import treasureboxhide2 from '@/assets/activity/recharge/reward/treasure-box-hide2.png'
import treasureboxhide3 from '@/assets/activity/recharge/reward/treasure-box-hide3.png'
import treasureboxhide4 from '@/assets/activity/recharge/reward/treasure-box-hide4.png'
import treasureboxhide5 from '@/assets/activity/recharge/reward/treasure-box-hide5.png'
import treasureboxshow1 from '@/assets/activity/recharge/reward/treasure-box-show1.png'
import treasureboxshow2 from '@/assets/activity/recharge/reward/treasure-box-show2.png'
import treasureboxshow3 from '@/assets/activity/recharge/reward/treasure-box-show3.png'
import treasureboxshow4 from '@/assets/activity/recharge/reward/treasure-box-show4.png'
import treasureboxshow5 from '@/assets/activity/recharge/reward/treasure-box-show5.png'

// 定义emit
const emit = defineEmits(['timeChange'])

const { t } = useI18n()
const store = useMainStore()
const boxMaxNum = ref(7)
const mySwiper = ref(null)  // Swiper实例引用
const rankData = ref([])
const listData = ref({})
const selfData = ref({})
const boxList = ref([])
const index = ref(0)
const activeIndex = ref(0)
const curTab = ref(1)
const tabList = [
  {
    text: t('recharge.daily'),
    value: 1
  },
  {
    text: t('recharge.weekly'),
    value: 2
  },
  {
    text: t('recharge.monthly'),
    value: 3
  }
]

const topList = computed(() => {
  if(curTab.value === 1){
    return rankData?.value?.slice(0,3) || []
  }
  if(curTab.value === 2){
    return listData?.value?.weekTop3?.listNow || []
  }
  if(curTab.value === 3){
    return listData?.value?.monthTop3?.listNow || []
  }
})

const boxLv = computed(() => {
  if(curTab.value === 1){
    return listData?.value?.boxDayLv || 0
  }
  if(curTab.value === 2){
    return listData?.value?.boxMonthLv || 0
  }
  if(curTab.value === 3){
    return listData?.value?.boxWeekLv || 0
  }
})

const amountFilter = (amount, forceUnit = true) => {
 if (isNaN(amount)) return '0.00M';
  const sign = amount < 0 ? '-' : '';
  const absAmount = Math.abs(amount);
  let value = Math.floor(absAmount / 1000000 * 100) / 100;
  if (value === 0 && !forceUnit) return absAmount.toFixed(2); // 不足1M时返回原值
  return sign + value.toFixed(2) + 'M';
}

const mapBoxAmount = (index) => {
  let day = [500000 ,2500000 ,5000000 ,15000000 ,25000000 ,50000000 ,150000000]
  let week = [5000000, 25000000, 50000000, 100000000, 150000000, 250000000]
  let month = [40000000 ,60000000 ,100000000 ,150000000 ,250000000 ,400000000 ,600000000 ,800000000 ,1250000000]
  if(curTab.value === 1){
    return amountFilter(day[index]) || ''
  }
  if(curTab.value === 2){
    return amountFilter(week[index]) || ''
  }
  if(curTab.value === 3){
    return amountFilter(month[index]) || ''
  }
}

// 方法定义
const tabChange = (value) => {
  curTab.value = value;
  getActivityRechargeRank();
  getActivityRechargeList();
  getActivityRechargeGetGifts(curTab.value-1)

}

// 切换swiper
const onSwiperChange = (swiper) => {
  index.value = swiper.activeIndex
}

const handleBoxClick = (index) => {
  activeIndex.value = index;
  // 获取Swiper实例并切换到目标slide [1][5][10]
  if (mySwiper.value && mySwiper.value.$el.swiper) {
    mySwiper.value.$el.swiper.slideTo(index, 300) // 300ms动画
  }
}

const getTreasureboxhideImageUrl = (index) => {
  if (index === 0) {
    return treasureboxhide1
  } else if (index === 1) {
    return treasureboxhide2
  } else if (index === 2) {
    return treasureboxhide3
  } else if (index === 3) {
    return treasureboxhide4
  } else if (index === 4) {
    return treasureboxhide5
  } else {
    return treasureboxhide5
  }
}

const getTreasureboxshowImageUrl = (index) => {
  if (index === 0) {
    return treasureboxshow1
  } else if (index === 1) {
    return treasureboxshow2
  } else if (index === 2) {
    return treasureboxshow3
  } else if (index === 3) {
    return treasureboxshow4
  } else if (index === 4) {
    return treasureboxshow5
  } else {
    return treasureboxshow5
  }
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

// 获取排行榜
const getActivityRechargeRank = async() => {
  try {
    const res = await get('/h5doings/activity/recharge/rank', {
      uid: store.uid,
      size: 20,
      type: curTab.value,
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
      emit('timeChange',timeData)
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
        // result.push(obj[key]);
        result.push(obj[key]);
      }
      boxList.value = result || []
      boxMaxNum.value = result.length || 0
    } else {
      console.error('Failed to fetch anchor info:', res.message)
    }
  } catch (error) {
    console.error('Error fetching anchor info:', error)
  }
}


onMounted(() => {
  getActivityRechargeRank();
  getActivityRechargeList();
  getActivityRechargeGetGifts(curTab.value-1);
})
</script>

<style lang="scss" scoped>
.reward{
  width: 100%;
  // height: 810px;
  height: 935pxpx;
  background: #360D00;
  margin-top: -57px;
  padding-top: 57px;
  box-sizing: border-box;
  font-family: LogoSCUnboundedSans, system-ui, Avenir, Helvetica, Arial, sans-serif;
  .tab-list{
    width: 100%;
    box-sizing: border-box;
    height: 57px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    >.tab-item{
      width: 115px;
      height: 57px;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 20px;
      text-shadow: 0px 1px 2px #A74700;
      padding: 21px 0 17px 0;
      text-align: center;
      background: url('@/assets/activity/recharge/reward/tabHide.png') no-repeat center center;
      background-size: cover;
    }
    >.tab-show{
      padding: 25px 0 13px 0;
      background: url('@/assets/activity/recharge/reward/tabShow.png') no-repeat center center;
      background-size: cover;
    }
  }
  .reward{
    margin-top: 4px;
    width: 355px;
    // height: 676px;
    // background: url('@/assets/activity/recharge/reward/rechargeBg.png') no-repeat center center;
    // background-size: cover;
    background-image:
      url('@/assets/activity/recharge/rank/rankBg1.png'),
      url('@/assets/activity/recharge/rank/rankBg2.png'),
      url('@/assets/activity/recharge/rank/rankBg3.png');
    background-size: 
      355px 307px, 
      355px 316px, 
      355px 178px;
    background-position: 
      0 0, 
      0 307px, 
      0 623px;
    background-repeat: no-repeat; /* 禁止重复 */
    height: 801px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 67px;
    .user-info{
      width: 303px;
      height: 97px;
      box-sizing: border-box;
      padding: 30px 6px 26px 26px;
      background: url('@/assets/activity/recharge/reward/userBg.png') no-repeat center center;
      background-size: cover;
      display: flex;
      justify-content: flex-start;
      align-content: center;
      .avatar{
        width: 42px;
        height: 42px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        >img{
          width: 42px;
        }
      }
      .id-recharge{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .id{
          height: 18px;
          font-size: 12px;
          color: #FFFC14;
          line-height: 18px;
          margin-top: 5px;
        }
        .recharge{
          width: 100%;
          height: 18px;
          font-size: 12px;
          color: #FFFC14;
          line-height: 18px;
          margin-top: -2px;
          white-space: nowrap;
        }
      }
    }
    .recharge-btn{
      width: 100%;
      height: 33px;
      margin-top: -9px;
      display: flex;
      justify-content: center;
      align-items: center;
      .title{
        height: 18px;
        font-size: 12px;
        color: #FFFC14;
        line-height: 18px;
        margin-right: 3px;
      }
      .btn{
        width: 105px;
        height: 33px;
        box-sizing: border-box;
        padding: 4px 5px 10px 5px;
        font-size: 13px;
        color: #913000;
        line-height: 19px;
        text-align: center;
        background: url('@/assets/activity/recharge/reward/rechargeBth.png') no-repeat center center;
        background-size: cover;
      }
    }
    .treasure-box{
      margin-top: 6px;
      width: 300px;
      height: 79px;
      background: url('@/assets/activity/recharge/reward/rechargeBg1.png') no-repeat center center;
      background-size: cover;
      position: relative;
      .treasure-box-progress{
        position: absolute;
        top: 27px;
        left: 29px;
        width: 241px;
        height: 12px;
        // background: url('@/assets/activity/recharge/reward/progressBar.png') no-repeat center center;
        // background-size: 100% 100%;
      }
      .treasure-box-sec{
        width: 257px;
        overflow-y: auto;
        z-index: 2;
        margin: 0 auto;
        &::-webkit-scrollbar{
          display: none;
        }
        .treasure-box-list{
          width: calc(v-bind(boxMaxNum) * 39px + (v-bind(boxMaxNum) - 1) * 16px);
          display: flex;
          justify-content: flex-start;
          align-items: center;
          position: relative;
          .treasure-box-item{
            width: 39px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            margin-right: 16px;
            position: relative;
            z-index: 5;
            &:last-child{
              margin-right: 0;
            }
            >img{
              margin-top: 11px;
              width: 39px;
              height: 38px;
            }
            >span{
              display: block;
              min-width: 30px;
              padding: 0 5px;
              height: 16px;
              margin-top: -1px;
              background: url('@/assets/activity/recharge/reward/textBg1.png') no-repeat center center;
              background-size: 100% 100%;
              font-weight: bold;
              font-size: 9px;
              color: #FCF5C0;
              line-height: 13px;
              // text-stroke: 1px #733213;
              // -webkit-text-stroke: 1px #733213;
              font-family: DINAlternate, DINAlternate, PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
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
          .treasure-box-list-hide{
            position: absolute;
            left: 9px;
            z-index: 2;
            width: calc(v-bind(boxMaxNum) * 39px + (v-bind(boxMaxNum) - 1) * 16px - 18px);
            height: 12px;
            background: url('@/assets/activity/recharge/reward/progressBarHide.png') no-repeat center left, ;
            background-size: 100% 100%;
          }
          .treasure-box-list-show{
            position: absolute;
            left: 12px;
            z-index: 3;
            width: calc(v-bind(boxLv) * 39px + (v-bind(boxLv) - 1) * 16px - 24px);
            height: 8px;
            background: url('@/assets/activity/recharge/reward/progressBarShow.png') no-repeat center left;
            background-size: 100% 100%; /* 避免横向变形 */
          }
        }
      }
    }
    .recharge-box{
      margin-top: 3px;
      width: 301px;
      // height: 193px;
      // background: url('@/assets/activity/recharge/reward/rechargeBg2.png') no-repeat center center;
      // background-size: cover;
        height: 318px;
      background: url('@/assets/activity/recharge/rank/rechargeBg1.png') no-repeat center center;
      background-size: cover;
      .recharge-box-title{
        height: 22px;
        font-size: 15px;
        color: #8B0303;
        line-height: 22px;
        margin-top: 36px;
        text-align: center;
      }
      .recharge-box-sec{
        width: 100%;
        height: 260px;
        .recharge-box-list{
          width: 100%;
          height: 260px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 0 18px;
          .recharge-box-item{
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            &:nth-child(n+4){
              .recharge-box-pic{
                margin-top: 10px;
              }
            }
            .recharge-box-pic{
              width: 81px;
              height: 77px;
              margin-top: 20px;
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
              width: 88px;
              height: 22px;
              font-weight: bold;
              font-size: 13px;
              color: #FFFFFF;
              line-height: 15px;
              text-align: center;
              background: url('@/assets/activity/recharge/reward/textBg2.png') no-repeat center center;
              background-size: cover;
              display: flex;
              justify-content: center;
              align-items: center;
              font-family: PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
      }
    }
    .recharge-ranking{
      margin-top: 12px;
      width: 301px;
      height: 160px;
      background: url('@/assets/activity/recharge/reward/rechargeBg3.png') no-repeat center center;
      background-size: cover;
      .recharge-ranking-list{
        position: relative;
        width: 100%;
        height: 100%;
        .recharge-ranking-item{
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .recharge-ranking-item-name{
            background: url('@/assets/activity/recharge/reward/textBg3.png') no-repeat center center;
            background-size: cover;
            width: 89px;
            height: 24px;
            font-weight: bold;
            font-size: 12px;
            color: #FFFFFF;
            line-height: 17px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: PingFang-SC, PingFang-SC,  system-ui, Avenir, Helvetica, Arial, sans-serif;
          }
        }
        .recharge-ranking-top1{
          position: absolute;
          top: 13px;
          left: 103px;
          .recharge-ranking-item-avatar{
            width: 91px;
            height: 91px;
            .recharge-ranking-item-frame{
              position: absolute;
              width: 91px;
              height: 91px;
              z-index: 2;
            }
            .recharge-ranking-item-head{
              position: absolute;
              width: 47px;
              height: 47px;
              top: 18px;
              left: 23px;
              border-radius: 50%;
              overflow: hidden;
              z-index: 1;
            }
          }
        }
        .recharge-ranking-top2{
          position: absolute;
          top: 50px;
          left: 20px;
          .recharge-ranking-item-avatar{
            width: 80px;
            height: 80px;
            
            .recharge-ranking-item-frame{
              position: absolute;
              width: 80px;
              height: 80px;
              z-index: 2;
            }
            .recharge-ranking-item-head{
              position: absolute;
              width: 47px;
              height: 47px;
              top: 12px;
              left: 20px;
              border-radius: 50%;
              overflow: hidden;
              z-index: 1;
            }
          }
        }
        .recharge-ranking-top3{
          position: absolute;
          top: 50px;
          right: 24px;
          .recharge-ranking-item-avatar{
              width: 80px;
              height: 80px;
            .recharge-ranking-item-frame{
              position: absolute;
              width: 80px;
              height: 80px;
              z-index: 2;
            }
            .recharge-ranking-item-head{
              position: absolute;
              width: 47px;
              height: 47px;
              top: 12px;
              left: 21px;
              border-radius: 50%;
              overflow: hidden;
              z-index: 1;
            }
          }
        }
      }
    }
  }
}
</style>