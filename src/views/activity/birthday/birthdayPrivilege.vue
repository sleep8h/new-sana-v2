<template>
  <div class="privilege">
    <!-- 生日设置弹窗 -->
    <BirthdaySetting
      v-model:isShow="showBirthdayModal"
      @confirm="onBirthdayConfirm"
      @close="showBirthdayModal = false"
    />

    <!-- 购买确认弹窗 -->
    <BuyToast
      v-model:isShow="showBuyConfirm"
      type="confirm"
      :coins="buyCoins"
      @confirm="confirmPay"
      @close="showBuyConfirm = false"
    />

    <!-- 购买结果弹窗（成功/失败） -->
    <BuyToast
      v-model:isShow="showBuyResult"
      :type="buyResultType"
      :coins="buyCoins"
      @confirm="showBuyResult = false"
      @recharge="getRechargePage"
      @close="showBuyResult = false"
    />

    <GiveToast 
      v-model:isShow="showGiveConfirm" 
      :gift-level="currentSlideLevel" 
      :gift-price="buyCoins" 
      @close="showGiveConfirm = false"
      @recharge="getRechargePage"
    />

    <!-- 用户信息区域 -->
    <div class="user-info">
      <div class="avatar-wrap">
        <img class="avatar" :src="dataInfo?.userInfo?.avatar" alt="" />
      </div>
      <div class="user-detail">
        <div class="info-row">
          <span class="label">{{ t('birthday.birthday') }}</span>
          <div class="info-value" v-if="dataInfo?.userInfo?.birthday">{{ dataInfo?.userInfo?.birthday }}</div>
          <sanaAutoText class="info-value" v-else @click="goBirthdaySetting">{{ t('birthday.noBirthdayRegistered') }}</sanaAutoText>
        </div>
        <div class="info-row">
          <span class="label">{{ t('birthday.wealthLevel') }}</span>
          <div class="info-value">{{ dataInfo?.userInfo?.wealthLevel }}</div>
        </div>
      </div>
      <img @click="goBirthdaySetting" class="edit-icon" src="@/assets/activity/birthday/birthdayPrivilege/btn_edit.png" alt="" />
    </div>

    <!-- 礼物列表 -->
    <div class="gift-list">
      <!-- 特权等级标题 -->
      <div class="privilege-title">
        <span>{{ t('birthday.birthdayPrivilegeLevel', { level: dataInfo.giftList?.[swiperIndex]?.level }) }}</span>
      </div>
      <!-- 等级条件 -->
      <div class="level-condition">
        <span>{{ wealthLevelRange }}</span>
      </div>
      <img class="record-icon" src="@/assets/activity/birthday/birthdayPrivilege/btn_record.png" alt="" @click="emit('openRecord')" />

      <!-- 左箭头 -->
      <img
        class="arrow left"
        src="@/assets/activity/birthday/birthdayPrivilege/btn_left.png"
        alt=""
        @click="last"
      />
      <!-- 右箭头 -->
      <img
        class="arrow right"
        src="@/assets/activity/birthday/birthdayPrivilege/btn_right.png"
        alt=""
        @click="next"
      />

      <!-- Swiper 滑动容器 -->
      <div class="gift-swiper-wrap">
        <Swiper
          :initial-slide="swiperIndex"
          :slides-per-view="1"
          ref="mySwiper"
          :space-between="0"
          @slideChange="onSwiperChange"
          style="height: 100%"
          :key="swiperKey"
        >
          <SwiperSlide v-for="(page, pageIndex) in dataInfo.giftList" :key="pageIndex">
            <div class="gift-page">
              <div class="gift-item" v-for="(item, itemIndex) in page.prizes" :key="itemIndex">
                <div class="gift-img-wrap" :class="`gift-img-wrap${page.level}`">
                  <div class="gift-img">
                    <img v-if="item?.url" :src="item?.url" alt="" />
                  </div>
                  <span class="gift-days" v-if="item?.giftNum">{{ item?.giftNum }}</span>
                </div>
                <sanaAutoText class="gift-name" :key="new Date().getTime()">{{ item?.giftName }}</sanaAutoText>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- 按钮区域 -->
      <div class="btn-area">
        <div class="btn-wrap" @click="handlePay(2)">
          <span class="btn-text">{{ t('birthday.buy') }} {{ dataInfo.giftList?.[swiperIndex]?.price }}</span>
          <img class="gem-icon" src="@/assets/activity/birthday/birthdayPrivilege/amethyst.png" alt="" />
        </div>
        <div class="btn-wrap" @click="handlePay(3)">
          <span class="btn-text">{{ t('birthday.send') }} {{ dataInfo.giftList?.[swiperIndex]?.price }}</span>
          <img class="gem-icon" src="@/assets/activity/birthday/birthdayPrivilege/amethyst.png" alt="" />
        </div>
      </div>
    </div>

    <!-- 领取按钮 -->
    <div
      v-if="dataInfo.hasBirthday"
      :class="['receive-wrap', { disabled: isReceiveDisabled }]"
      @click="handleReceive"
    >
      <span>{{ t('birthday.receive') }}</span>
    </div>

    <!-- 未注册生日提示模块 -->
    <div class="tip-box" v-if="!dataInfo.hasBirthday">
      <div class="tip-content">
        <span class="tip-title">{{ t('birthday.kindTips') }}</span>
        <p class="tip-text">{{ t('birthday.registerBirthdayTip') }}</p>
        <div class="tip-btn" @click="goBirthdaySetting">
          <span>{{ t('birthday.oneClickRegister') }}</span>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import BirthdaySetting from "./components/birthdaySetting.vue";
import BuyToast from "./components/buyToast.vue";
import GiveToast from "./components/giveToast.vue";

const emit = defineEmits(['openRecord', 'birthdaySet']);

// Swiper 相关
const mySwiper = ref(null);
const swiperIndex = ref(0);
const swiperKey = ref(0);
// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const dataInfo = ref({
  hasBirthday: false,
});

// 购买确认弹窗
const showBuyConfirm = ref(false);
const buyCoins = ref("");
const pendingPayType = ref(null);

// 赠送确认弹窗
const showGiveConfirm = ref(false);

// 购买结果弹窗
const showBuyResult = ref(false);
const buyResultType = ref("success"); // success / error

// 打开购买确认弹窗
const openBuyConfirm = (type) => {
  pendingPayType.value = type;
  buyCoins.value = dataInfo.value.giftList?.[swiperIndex.value]?.price || "";
  showBuyConfirm.value = true;
};

// 打开赠送确认弹窗
const openSendConfirm = (type) => {
  buyCoins.value = dataInfo.value.giftList?.[swiperIndex.value]?.price || "";
  showGiveConfirm.value = true;
};

// 确认支付
const confirmPay = async () => {
  if (!pendingPayType.value) return;
  await doPay(pendingPayType.value);
  pendingPayType.value = null;
};

// 根据 currentLevel 计算初始 swiperIndex
const initSwiperIndex = () => {
  const currentLevel = dataInfo.value.currentLevel;
  const giftList = dataInfo.value.giftList || [];
  if (currentLevel && giftList.length > 0) {
    const index = giftList.findIndex(item => item.level === currentLevel);
    swiperIndex.value = index >= 0 ? index : 0;
    swiperKey.value += 1; // 强制重新渲染 Swiper
  }
};

// 当前 slide 对应的等级
const currentSlideLevel = computed(() => {
  return dataInfo.value.giftList?.[swiperIndex.value]?.level;
});

// 领取按钮是否置灰
const isReceiveDisabled = computed(() => {
  if (dataInfo.value.hasClaimed) return true;
  if (!isBirthdayToday.value) return true; // 不是生日当天置灰
  const currentLevel = dataInfo.value.currentLevel;
  const slideLevel = currentSlideLevel.value;
  if (!currentLevel || !slideLevel) return true;
  // 低于自己财富等级区间的礼包置灰
  return slideLevel < currentLevel;
});

// 财富等级档位显示
const wealthLevelRange = computed(() => {
  const level = dataInfo.value.giftList?.[swiperIndex.value]?.level;
  switch (level) {
    case 1:
      return t('birthday.wealthLevelRange1');
    case 2:
      return t('birthday.wealthLevelRange2');
    case 3:
      return t('birthday.wealthLevelRange3');
    case 4:
      return t('birthday.wealthLevelRange4');
    case 5:
      return t('birthday.wealthLevelRange5');
    default:
      return '';
  }
});

// 判断是否是生日当天
const isBirthdayToday = computed(() => {
  if (!dataInfo.value.userInfo?.birthday) return false;
  const today = new Date();
  const birthday = new Date(dataInfo.value.userInfo.birthday);
  return today.getMonth() === birthday.getMonth() && 
         today.getDate() === birthday.getDate();
});

// 切换swiper
const onSwiperChange = (swiper) => {
  swiperIndex.value = swiper.activeIndex;
};

const next = () => {
  if (mySwiper.value && mySwiper.value.$el.swiper) {
    mySwiper.value.$el.swiper.slideNext(300);
  }
};

const last = () => {
  if (mySwiper.value && mySwiper.value.$el.swiper) {
    mySwiper.value.$el.swiper.slidePrev(300);
  }
};


// 生日设置弹窗
const showBirthdayModal = ref(false);

const goBirthdaySetting = () => {
  showBirthdayModal.value = true;
};

const onBirthdayConfirm = (birthday) => {
  getBirthdayList();
  emit('birthdaySet', birthday);
};

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

// 领取按钮点击
const handleReceive = () => {
  // 已领取
  if (dataInfo.value.hasClaimed) {
    showToast(t('birthday.alreadyReceived'));
    return;
  }
  if (!isBirthdayToday.value) {
    showToast(t('birthday.onlyOnBirthday'));
    return;
  }
  const currentLevel = dataInfo.value.currentLevel;
  const slideLevel = currentSlideLevel.value;
  // 高于自己财富等级区间
  if (slideLevel > currentLevel) {
    showToast(t('birthday.pleaseUpgradeWealth'));
    return;
  }
  // 低于自己财富等级区间（已置灰，无提示）
  if (slideLevel < currentLevel) {
    return;
  }
  // 等于当前等级，调用领取接口
  // TODO: 调用领取接口
  console.log('领取当前等级礼包');
  doPay(1);
}

// 获取活动列表接口
const getBirthdayList = async () => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      dataInfo.value = res.data;
      initSwiperIndex();
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 购买/赠送按钮点击 - 先弹出确认窗
const handlePay = (type) => {
  if(type == 2){
    openBuyConfirm(type);
  }
  if(type == 3){
    openSendConfirm(type);
  }
};

// 实际支付请求
const doPay = async (type) => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/pay", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      type: type,
      index: currentSlideLevel.value,
    });
    if (res && res.code === 200) {
      if(type === 2){
        buyResultType.value = "success";
        showBuyResult.value = true;
      }
    } else {
      if(type === 2){
        // 金币不足等购买失败情况
        buyResultType.value = "error";
        showBuyResult.value = true;
      }
    }
  } catch (error) {
    console.error("Error fetching pay data:", error);
  }
};

onMounted(async () => {
  await getBirthdayList();
});

</script>

<style lang="scss" scoped>
.privilege {
  min-height: 903px;
  margin-top: -201px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  /* 用户信息区域 */
  .user-info {
    width: 357px;
    height: 191px;
    background: url("@/assets/activity/birthday/birthdayPrivilege/bg_user.png") no-repeat center center;
    background-size: cover;
    position: relative;
    .avatar-wrap {
      position: absolute;
      top: 35px;
      left: 36px;
      width: 133px;
      height: 139px;
      background: url("@/assets/activity/birthday/birthdayPrivilege/avatar.png") no-repeat center center;
      background-size: cover;
      .avatar {
        position: absolute;
        top: 19px;
        left: 20px;
        width: 88px;
        height: 88px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .user-detail {
      position: absolute;
      width: 145px;
      padding-top: 8px;
      top: 35px;
      right: 37px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .info-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1px;
        text-align: center;

        .label {
          width: 100%;
          box-sizing: border-box;
          padding: 8px 0px 4px 0px;
          font-weight: bold;
          font-size: 14px;
          line-height: 14px;
          color: #FFFFFF;
        }

        .info-value {
          width: 100%;
          height: 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 14px;
          font-size: 14px;
          font-weight: bold;
          color: #F6ED70;
          background: url("@/assets/activity/birthday/birthdayPrivilege/bg_text.png") no-repeat center center;
          background-size: cover;
        }
      }
    }

    .edit-icon {
      position: absolute;
      top: 32px;
      right: 17px;
      width: 32px;
      height: 32px;
    }
  }

  
  /* 礼物列表 */
  .gift-list {
    width: 357px;
    height: 614px;
    background: url("@/assets/activity/birthday/birthdayPrivilege/bg_privilege.png") no-repeat center center;
    background-size: cover;
    position: relative;
    
    /* 特权等级标题 */
    .privilege-title {
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translateX(-50%);
      width: 160px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
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
  
    /* 等级条件 */
    .level-condition {
      position: absolute;
      width: 300px;
      top: 62px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #FFFFFF;
      height: 13px;
      font-size: 13px;
      line-height: 13px;
    }

    .record-icon{
      position: absolute;
      top: 36px;
      right: 16px;
      width: 32px;
      height: 32px;
    }

    .arrow {
      position: absolute;
      top: 282px;
      width: 20px;
      height: 30px;
      z-index: 2;
      cursor: pointer;

      &.left {
        left: 12px;
      }

      &.right {
        right: 6px;
      }
    }

    /* Swiper 容器 */
    .gift-swiper-wrap {
      width: 100%;
      height: 425px;
      position: relative;
      top: 95px;
      left: 50%;
      transform: translateX(-50%);
      .gift-page {
        width: 298px;
        height: 425px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start;
        .gift-item {
          width: 95px;
          height: 134px;
          display: flex;
          flex-direction: column;
          margin-right: 6.5px;
          &:nth-child(3n){
            margin-right: 0px;
          }
          .gift-img-wrap {
            width: 95px;
            height: 109px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .gift-img {
              width: 74px;
              height: 64px;
              margin-top: 14px;
              margin-bottom: 9px;
              display: flex;
              justify-content: center;
              align-items: center;
              >img{
                width: 100%;
                height: auto;
                object-fit: cover;
              }
            }
  
            .gift-days {
              font-weight: bold;
              font-size: 12px;
              color: #FFFFFF;
              line-height: 12px;
              text-shadow:
                1px 1px 0px #000000,
                -1px -1px 0px #000000,
                -1px 1px 0px #000000,
                1px -1px 0px #000000;
            }
          }

          .gift-img-wrap1{
            background: url("@/assets/activity/birthday/birthdayPrivilege/bg_gifts_1.png") no-repeat center center;
            background-size: 100% 100%;
          }
          .gift-img-wrap2{
            background: url("@/assets/activity/birthday/birthdayPrivilege/bg_gifts_2.png") no-repeat center center;
            background-size: 100% 100%;
          }
          .gift-img-wrap3{
            background: url("@/assets/activity/birthday/birthdayPrivilege/bg_gifts_3.png") no-repeat center center;
            background-size: 100% 100%;
          }
          .gift-img-wrap4{
            background: url("@/assets/activity/birthday/birthdayPrivilege/bg_gifts_4.png") no-repeat center center;
            background-size: 100% 100%;
          }
          .gift-img-wrap5{
            background: url("@/assets/activity/birthday/birthdayPrivilege/bg_gifts_5.png") no-repeat center center;
            background-size: 100% 100%;
          }
  
          .gift-name {
            width: 90px;
            height: 25px;
            font-size: 12px;
            line-height: 25px;
            white-space: nowrap;
            color: #FFFFFF;
          }
        }
      }
    }
  }

  /* 按钮区域 */
  .btn-area {
    width: 314px;
    height: 53px;
    position: absolute;
    top: 520px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn-wrap {
      width: 151px;
      height: 53px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/birthday/birthdayPrivilege/btn_buy_send.png") no-repeat center center;
      background-size: cover;
      .btn-text {
        font-weight: bold;
        font-size: 14px;
        color: #13021B;
      }
      .gem-icon {
        width: 23px;
        height: 33px;
        margin-inline-start: 4px;
      }
    }
  }

  /* 领取按钮 */
  .receive-wrap {
    width: 118px;
    height: 51px;
    position: relative;
    top: -6px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("@/assets/activity/birthday/birthdayPrivilege/btn_receive.png") no-repeat center center;
    background-size: cover;
    >span{
      font-weight: bold;
      color: #EBD975;
      font-size: 14px;
      line-height: 14px;
      background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    &.disabled {
      filter: grayscale(1);
    }
  }

  /* 未注册生日提示模块 */
  .tip-box {
    width: 357px;
    height: 191px;
    margin-top: 14px;
    background: url("@/assets/activity/birthday/birthdayPrivilege/bg_tip.png") no-repeat center center;
    background-size: cover;
    margin-bottom: 40px;
    .tip-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 35px 0;
      box-sizing: border-box;

      .tip-title {
        font-weight: bold;
        font-size: 12px;
        color: #FFFFFF;
        line-height: 12px;
        align-self: flex-start;
        margin-bottom: 10px;
      }

      .tip-text {
        width: 253px;
        height: 46px;
        font-size: 12px;
        color: #FFFFFF;
        line-height: 18px;
        text-align: center;
        margin-bottom: 16px;
      }

      .tip-btn {
        width: 239px;
        height: 43px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url("@/assets/activity/birthday/birthdayPrivilege/btn_tip.png") no-repeat center center;
        background-size: cover;
        cursor: pointer;

        >span {
          font-weight: bold;
          font-size: 11px;
          color: #13021B;
          line-height: 11px;
        }
      }
    }
  }
}
</style>