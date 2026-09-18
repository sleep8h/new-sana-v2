<!-- 生日报弹窗：非生日当天显示倒计时，生日当天显示吹蜡烛->许愿->领取礼物流程 -->
<template>
  <Teleport to="body">
    <div class="content" v-show="isShow">
      <img class="back" @click="closeModal" src="@/assets/activity/birthday/back.png" alt="" />
      <div class="music">
        <!-- 背景音乐 -->
        <BackgroundMusic ref="bgMusicRef" :src="birthdayMp3" />
      </div>

      <!-- ====== 情况1：非生日当天 -> 倒计时页面 ====== -->
      <div v-if="!isBirthdayToday" class="countdown-page">
        <div class="countdown-bg">
          <div class="title"></div>
          <div class="user">
            <div class="avatar">
              <img class="avatar-head" :src="userInfo.avatar" alt="" /> 
              <div class="avatar-frame"></div>
            </div>
            <div class="name">
              <span>{{ userInfo.nick }}</span>
            </div>
          </div>
          <div class="time">
            <CountDownBirthday :time="countDownTime || 0" :key="countDownTime" format="DD:HH:MM" />
          </div>
          <div class="close-btn" @click="closeModal">{{ t('birthday.confirm') }}</div>
        </div>
      </div>

      <!-- ====== 情况2：生日当天 -> 吹蜡烛流程 ====== -->
      <div v-else class="birthday-report" ref="reportRef">
        <!-- 步骤1：吹蜡烛视频 -->
        <div v-show="currentStep === 'candle'">
          <div class="step step-candle" :class="{ 'animate-started': candleAnimateStarted }" @click="handleBlowCandle">
            <div class="title"></div>
            <div class="user">
              <div class="avatar">
                <img class="avatar-head" :src="userInfo.avatar" alt="" /> 
                <div class="avatar-frame"></div>
              </div>
              <div class="name">
                <span>{{ userInfo.nick }}</span>
              </div>
            </div>
            <div class="tips" :class="{ 'is-visible': showTips }">{{ tipsText }}</div>
            <video
              ref="candleVideoRef"
              class="active"
              muted
              loop
              playsinline
              webkit-playsinline
              preload="auto"
              @loadedmetadata="onCandleVideoLoad"
              @error="onVideoError"
            >
              <source :src="birthdayMp4" type="video/mp4" />
            </video>

            <div
              class="finger-guide"
              :class="{ 'is-visible': showFinger }"
              @click="handleBlowCandle"
              @touchstart.prevent="handleBlowCandle"
            >
            </div>
            <div class="bless" ref="blessRef">
              <div class="date">{{ dateText }}</div>
              <div class="text1">{{ text1 }}</div>
              <img :src="happyBirthdayImg" alt="" class="happy-birthday" :class="{ 'is-visible': showHappyBirthday }">
              <div class="text2">{{ text2 }}</div>
            </div>
          </div>
        </div>

        <!-- 步骤2：许愿界面 -->
        <div v-show="currentStep === 'wish'">
          <div class="step step-wish">
            <!-- 标题 Make your wish -->
            <div class="title"></div>
            <div class="user">
              <div class="avatar">
                <img class="avatar-head" :src="userInfo.avatar" alt="" /> 
                <div class="avatar-frame"></div>
              </div>
              <div class="name">
                <span>{{ userInfo.nick }}</span>
              </div>
            </div>
            <video
              ref="blowVideoRef"
              class="active"
              muted
              playsinline
              webkit-playsinline
              @loadedmetadata="onBlowVideoLoad"
              @ended="onBlowVideoEnded"
              @error="onVideoError"
            >
              <source :src="blowMp4" type="video/mp4" />
            </video>

            <!-- 愿望选项列表 -->
            <div class="wish-content" v-show="showWishContent">
              <div class="list">
                <div 
                  class="item" 
                  :class="{ selected: wishValue === item.value }"
                  v-for="(item, index) in wishList" 
                  :key="index" 
                  @click="handleWish(item.value)"
                >
                  <div class="text">{{ item.text }}</div>  
                  <div class="icon">
                    <img :src="wishValue === item.value ? birthdaySelectImg : birthdayUnSelectImg" alt="" />
                  </div>
                </div>
              </div>
              
              <!-- Receive 按钮 -->
              <div class="receive-btn" @click="submitWish">{{ t('birthday.makeAWish') }}</div>
              
              <!-- Skip 文字 -->
              <div class="skip-text" @click="handleClaimGift">{{ t('birthday.skipWish') }}</div>
            </div>
          </div>
        </div>

        <!-- 步骤3：领取礼物 -->
        <template v-if="currentStep === 'claim'">
          <div class="step step-claim" :class="{ 'animate-started': claimAnimateStarted }">
            <!-- 标题 -->
            <div class="title" :class="{ 'is-visible': claimTitleShown }"></div>
            
            <!-- 对话框 + 打字效果 -->
            <div class="tips" :class="{ 'is-visible': claimDialogShown }">{{ claimDialogText }}</div>
            
            <!-- Receive 按钮 -->
            <div class="receive-btn" :class="{ claimed: hasClaimed, 'is-visible': claimBtnShown }" @click="handleClaimGift">{{ t('birthday.receive') }}</div>
            
            <!-- 底部文字 -->
            <div class="skip-text">{{ t('birthday.officialWishes') }}</div>
          </div>
        </template>

        <!-- 步骤4：礼物弹窗 -->
        <div v-if="showGiftModal" class="step step-gift-modal gift-modal">
          <div class="gift-modal-mask" @click="showGiftModal = false"></div>
          <div class="gift-modal-content" ref="giftModalContentRef" :style="giftModalContentStyle">
            <div :class="['reward-list', { 'is-ar': store.language === 'ar' }]">
              <div class="reward-item" v-for="(item, index) in giftInfo" :key="index">
                <div class="gift-bg">
                  <img :src="item.url" alt="" />
                </div>
                <sanaAutoText class="gift-name">{{ item.giftName }}</sanaAutoText>
              </div>
            </div>
            <div class="gift-modal-close" @click="closeGiftModal">{{ t('birthday.ok') }}</div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useMainStore } from "@/pinia/index.js";
import { useI18n } from "vue-i18n";
import { postFormData } from "@/utils/http.js";
import { showToast } from "vant";
import "vant/es/toast/style";
import birthdayMp4 from "@/assets/activity/birthday/birthday.mp4";
import blowMp4 from "@/assets/activity/birthday/bllowing.mp4";
import happyBirthdayImg from "@/assets/activity/birthday/happy_birthday.png";
import birthdaySelectImg from "@/assets/activity/birthday/birthday_select.png";
import birthdayUnSelectImg from "@/assets/activity/birthday/birthday_unselect.png";
import birthdayMp3 from "@/assets/activity/birthday/birthday.mp3";
import CountDownBirthday from "@/components/countDown/CountDownBirthday.vue";
import BackgroundMusic from "@/views/activity/birthday/components/BackgroundMusic.vue";

const store = useMainStore();
const { t } = useI18n();

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  userInfo: {
    type: Object,
    default: () => {},
  },
  hasClaimed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:isShow", "close"]);
const bgMusicRef = ref(null);

// ==================== 计算是否生日当天 ====================
const isBirthdayToday = computed(() => {
  if (!props.userInfo.birthday) return false;
  const today = new Date();
  const birthday = new Date(props.userInfo.birthday);
  return (
    today.getMonth() === birthday.getMonth() &&
    today.getDate() === birthday.getDate()
  );
});

const formatBirthdayDate = computed(() => {
  if (!props.userInfo.birthday) return "";
  const d = new Date(props.userInfo.birthday);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
});

// ==================== 倒计时逻辑 ====================
const getNextBirthdayMs = (birthdayStr) => {
  const now = new Date();
  const year = now.getFullYear();

  // 安全解析 MM-DD 或 YYYY-MM-DD
  let [y, m, d] = birthdayStr.split('-').map(Number);
  if (birthdayStr.split('-').length === 2) {
    // 是 "MM-DD" 格式 → 补全年份
    m = y; d = m; y = year; // 交换：原 [m, d] → 现 [y, m, d]
    [y, m, d] = [year, y, d];
  }

  // 构造今年生日
  const thisYearBirthday = new Date(y, m - 1, d); // 注意：month 从 0 开始
  let nextBirthday = thisYearBirthday;

  // 如果今年生日已过 → 改为明年
  if (thisYearBirthday <= now) {
    nextBirthday = new Date(y + 1, m - 1, d);
  }

  return nextBirthday.getTime() - now.getTime(); // ✅ 返回毫秒差（>0）
}

const countDownTime = ref(0);
const startCountdown = () => {
  if (!props.userInfo.birthday) return;
  const msUntilNextBirthday = getNextBirthdayMs(props.userInfo.birthday);
  countDownTime.value = msUntilNextBirthday;
};

// ==================== 生日当天流程状态 ====================
const currentStep = ref("candle"); // candle | wish | claim
const blowVideoPlayed = ref(false);
const showGiftModal = ref(false);
const giftInfo = ref({});
const wishText = ref("");
const wishValue = ref(1);
const wishList = computed(() => [
  { value: 1, text: t('birthday.wish1') },
  { value: 2, text: t('birthday.wish2') },
  { value: 3, text: t('birthday.wish3') },
  { value: 4, text: t('birthday.wish4') },
]);

const candleVideoRef = ref(null);
const blowVideoRef = ref(null);

// 吹蜡烛
const handleBlowCandle = () => {
  // 手指没显示时不能吹蜡烛
  if (!showFinger.value) return;
  if (blowVideoPlayed.value) return;
  // 如果已经领取过奖励，提示用户
  if (props.hasClaimed) {
    console.log('2')
    showToast(t('birthday.alreadyClaimed'));
    return;
  }
  blowVideoPlayed.value = true;
  currentStep.value = "wish";

  // 等 DOM 更新后，播放视频并滚动到视口中间
  nextTick(() => {
    if (blowVideoRef.value) {
      blowVideoRef.value.currentTime = 0;
      blowVideoRef.value
        .play()
        .catch((e) => console.warn("Blow auto-play blocked:", e));
      blowVideoRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
};

// 蜡烛视频加载完成自动播放
const onCandleVideoLoad = () => {
  if (candleVideoRef.value) {
    candleVideoRef.value.classList.add('is-loaded');
    candleVideoRef.value
      .play()
      .catch((e) => console.warn("Candle auto-play blocked:", e));
  }
};

// 吹蜡烛视频加载完成不自动播放，等切换到 wish 步骤后再播放
const onBlowVideoLoad = () => {
  // 视频元数据已加载，但不自动播放
  // 播放逻辑在切换到 wish 步骤后由 handleBlowCandle 控制
};

const onBlowVideoEnded = () => {
  // 视频播放完显示 wish-content 并滚动到底部
  showWishContent.value = true;
  nextTick(() => {
    // 滚动到 wish-content 位置
    const wishContent = document.querySelector('.step-wish .wish-content');
    if (wishContent) {
      wishContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  });
};

const handleWish = (value) => {
  wishValue.value = value;
}

const closeGiftModal = () => {
  showGiftModal.value = false;
}

// 提交许愿
const submitWish = () => {
   // 如果选了愿望，保存愿望文字
  const selected = wishList.value.find(item => item.value === wishValue.value);
  if (selected) {
    wishText.value = selected.text;
  }
  currentStep.value = "claim";
  // 可选：调用接口保存愿望
};

// 领取礼物
const handleClaimGift = async () => {
  if (props.hasClaimed) {
    showToast(t('birthday.alreadyClaimed'));
    return;
  }
  try {
    const res = await postFormData("/h5doings/activity/birthday/pay", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      type: 1,
    });
    if (res && res.code === 200) {
      props.hasClaimed = true;
      giftInfo.value = res.data || {};
      showGiftModal.value = true;
    } else {
      showToast(res.message || t("birthday.claimFailed"));
    }
  } catch (error) {
    console.error("Claim gift error:", error);
    showToast(t("birthday.claimFailed"));
  }
};

// 完成全部流程
const finishAll = () => {
  showGiftModal.value = false;
  closeModal();
};

// ==================== 公共方法 ====================
const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
  resetState();
};

const resetState = () => {
  // 设置取消标记，阻止所有正在进行的动画继续执行
  animationCancelled = true;
  // 清理所有 timer（包括 setInterval 和 setTimeout）
  activeTimers.forEach(timer => clearInterval(timer));
  activeTimers.length = 0;
  
  currentStep.value = "candle";
  blowVideoPlayed.value = false;
  showGiftModal.value = false;
  giftInfo.value = {};
  candleAnimateStarted.value = false;
  dateText.value = "";
  text1.value = "";
  text2.value = "";
  tipsText.value = "";
  showHappyBirthday.value = false;
  showTips.value = false;
  showFinger.value = false;
  showWishContent.value = false;
  claimAnimateStarted.value = false;
  claimTitleShown.value = false;
  claimDialogShown.value = false;
  claimDialogText.value = "";
  claimBtnShown.value = false;
};

const onVideoError = (e) => {
  console.error("Video load error:", e.target.src);
};

// ==================== 监听弹窗显示 ====================
watch(
  () => props.isShow,
  (val) => {
    if (val) {
      resetState();
      // 重新打开时重置取消标记，允许新动画执行
      // 注意：必须在 resetState 之后设置，因为 resetState 会将其设为 true
      animationCancelled = false;
      if (!isBirthdayToday.value) {
        startCountdown();
      }
      // // 弹窗打开时播放音乐
      // nextTick(() => {
      //   bgMusicRef.value?.play();
      // });
    }
  }
);

// ==================== 生日报 step-candle 入场动画 ====================
const candleAnimateStarted = ref(false);
const dateText = ref("");
const text1 = ref("");
const text2 = ref("");
const tipsText = ref("");
const showHappyBirthday = ref(false);
const showTips = ref(false);
const showFinger = ref(false);
const showWishContent = ref(false);
const blessRef = ref(null);
// claim 步骤动画
const claimAnimateStarted = ref(false);
const claimTitleShown = ref(false);
const claimDialogShown = ref(false);
const claimDialogText = ref("");
const claimBtnShown = ref(false);

const giftModalContentRef = ref(null);
const giftModalContentStyle = ref({});

const updateGiftModalScale = () => {
  const vh = window.innerHeight;
  if (vh < 700) {
    const scale = vh / 693;
    giftModalContentStyle.value = {
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
    };
  } else {
    giftModalContentStyle.value = {};
  }
};

const claimDialogFullText = computed(() => t('birthday.claimDialogText'));

const dateFullText = computed(() => {
  if (!props.userInfo?.birthday) return "";
  return props.userInfo.birthday.replace(/\-/g, ".");
});

const text1Full = computed(() => t('birthday.blessText1'));
const text2Full = computed(() => t('birthday.blessText2'));
const tipsFullText = computed(() => t('birthday.blowCandleTip'));

// 全局 timer 存储，用于关闭时清理
const activeTimers = [];
// 动画取消标记，用于关闭弹窗时中断正在进行的动画序列
let animationCancelled = false;

// 安全的延迟函数，支持取消
const delay = (ms) => new Promise((resolve) => {
  const timer = setTimeout(() => {
    const idx = activeTimers.indexOf(timer);
    if (idx > -1) activeTimers.splice(idx, 1);
    resolve();
  }, ms);
  activeTimers.push(timer);
});

// 打字机效果（fullText 必须是字符串，调用时传入 .value）
const typeWriter = (targetRef, fullText, speed = 60) => {
  return new Promise((resolve) => {
    const text = String(fullText || '');
    let i = 0;
    targetRef.value = "";
    const timer = setInterval(() => {
      if (animationCancelled) {
        clearInterval(timer);
        const idx = activeTimers.indexOf(timer);
        if (idx > -1) activeTimers.splice(idx, 1);
        resolve();
        return;
      }
      if (i < text.length) {
        targetRef.value += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        const idx = activeTimers.indexOf(timer);
        if (idx > -1) activeTimers.splice(idx, 1);
        resolve();
      }
    }, speed);
    activeTimers.push(timer);
  });
};

// 启动动画序列
const startCandleAnimation = async () => {
  if (candleAnimateStarted.value) return;
  candleAnimateStarted.value = true;

  // 1. 头像已显示（CSS 控制 fadeInUp）
  await delay(600);
  if (animationCancelled) return;

  // 2. 标题淡入（CSS 控制 fadeInDown）
  await delay(800);
  if (animationCancelled) return;

  // 3. 日期打字效果
  await typeWriter(dateText, dateFullText.value, 50);
  if (animationCancelled) return;
  
  // 日期显示后滚动到 bless 区域
  if (blessRef.value) {
    blessRef.value.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  await delay(300);
  if (animationCancelled) return;

  // 4. text1 打字效果
  await typeWriter(text1, text1Full.value, 40);
  if (animationCancelled) return;

  // 5. text1 打完 → 显示 happy-birthday
  showHappyBirthday.value = true;
  await delay(600);
  if (animationCancelled) return;

  // 6. text2 打字效果
  await typeWriter(text2, text2Full.value, 35);
  if (animationCancelled) return;

  // 7. text2 打完 → 显示 tips 背景 + 打字
  showTips.value = true;
  await typeWriter(tipsText, tipsFullText.value, 45);
  if (animationCancelled) return;

  // 8. tips 打完 → 显示手指
  showFinger.value = true;
};

// 启动 claim 动画序列
const startClaimAnimation = async () => {
  if (claimAnimateStarted.value) return;
  claimAnimateStarted.value = true;

  // 滚动到最顶部
  nextTick(() => {
    const report = document.querySelector('.birthday-report');
    if (report) {
      report.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // 1. 显示标题
  claimTitleShown.value = true;
  await delay(800);
  if (animationCancelled) return;

  // 2. 显示对话框 + 打字效果
  claimDialogShown.value = true;
  await typeWriter(claimDialogText, claimDialogFullText.value, 45);
  if (animationCancelled) return;

  // 3. 显示领取按钮
  await delay(300);
  if (animationCancelled) return;
  claimBtnShown.value = true;

  nextTick(() => {
    const receiveBtn = document.querySelector('.step-claim .receive-btn');
    if (receiveBtn) {
      receiveBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
};


// 当切换到 candle 步骤时启动动画
watch(
  () => currentStep.value,
  (val) => {
    if (val === "candle" && isBirthdayToday.value) {
      nextTick(() => {
        startCandleAnimation();
      });
    }
    if (val === "claim") {
      nextTick(() => {
        startClaimAnimation();
      });
    }
  }
);

// 当弹窗显示且是生日当天时启动动画
watch(
  () => props.isShow,
  (val) => {
    if (val && isBirthdayToday.value && currentStep.value === "candle") {
      nextTick(() => {
        startCandleAnimation();
      });
    }
  }
);

onMounted(() => {
  updateGiftModalScale();
  window.addEventListener('resize', updateGiftModalScale);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateGiftModalScale);
});
</script>

<style lang="scss" scoped>
.content {
  position: fixed;
  z-index: 2000;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #0e0213;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .back{
    width: 12px;
    height: 20px;
    position:absolute;
    top: 55px;
    left: 17px;
    z-index: 11;
  }
  .music{
    width: 32px;
    height: 32px;
    position:absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 56px;
    right: 24px;
    z-index: 11;
    >img{
      width: 32px;
      height: 32px;
    }
  }
  // ====== 倒计时页面 ======
  .countdown-page {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    .countdown-bg{
      background: url("@/assets/activity/birthday/birthday_countdown_bg.png") no-repeat top center;
      background-size: cover;
      width: 375px;
      height: 812px;
      position: relative;
      .title{
        position: absolute;
        top: 58px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        width: 214px;
        height: 41px;
        background: url("@/assets/activity/birthday/birthday_text4.png") no-repeat top center;
        background-size: cover;
      }
      .user{
        position: absolute;
        top: 146px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        width: 161px;
        height: 197px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .avatar{
          width: 161px;
          height: 164px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          .avatar-head{
            position: absolute;
            top: 42px;
            left: 30px;
            width: 102px;
            height: 102px;
            border-radius: 50%;
            object-fit: cover;
          }
          .avatar-frame{
            position: absolute;
            top: 0;
            left: 0;
            width: 161px;
            height: 164px;
            background: url("@/assets/activity/birthday/birthday_avatar.png") no-repeat top center;
            background-size: cover;
          }
        }
        .name{
          position: absolute;
          top: 146px;
          left: 50%;
          transform: translateX(-50%);
          width: 144px;
          height: 50px;
          font-size: 16px;
          color: #fff;
          background: url("@/assets/activity/birthday/birthday_name.png") no-repeat top center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9;
          >span{
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 124px;
            height: 50px;
            font-family: PingFang SC;
            font-weight: bold;
            font-size: 12px;
            color: #EFD863;
            line-height: 14px;
            background: linear-gradient(160deg, #D1A15E 1.7578125%, #FDDEB6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            white-space: nowrap;        /* 强制文本在一行内显示，不换行 */
            overflow: hidden;           /* 隐藏溢出部分 */
            text-overflow: ellipsis;    /* 溢出时显示省略号 */
          }
        }
      }
      .time{
        position: absolute;
        top: 361px;
        left: 50%;
        transform: translateX(-50%);
      }
      .close-btn {
        background: url("@/assets/activity/birthday/birthday_button.png") no-repeat top center;
        background-size: cover;
        position: absolute;
        top: 714px;
        left: 50%;
        transform: translateX(-50%);
        width: 172px;
        height: 53px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-family: PingFang SC;
        font-weight: bold;
        font-size: 12px;
        line-height: 14px;
        color: #200B1F;
      }
    }

  }

  // ====== 生日当天流程页面 ======
  .birthday-report {
    width: 100%;
    height: auto;
    // ========== 步骤1：吹蜡烛 入场动画 ==========
    .step-candle {
      width: 100%;
      height: 1061px;
      background: url("@/assets/activity/birthday/birthday_bg.png") no-repeat top center;
      background-size: cover;
      .title{
        position: absolute;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        width: 296px;
        height: 86px;
        background: url("@/assets/activity/birthday/birthday_text1.png") no-repeat top center;
        background-size: cover;
        opacity: 0;
      }
      .user{
        position: absolute;
        top: 146px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        width: 161px;
        height: 197px;
        display: flex;
        flex-direction: column;
        align-items: center;
        opacity: 0;
        .avatar{
          width: 161px;
          height: 164px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          .avatar-head{
            position: absolute;
            top: 42px;
            left: 30px;
            width: 102px;
            height: 102px;
            border-radius: 50%;
            object-fit: cover;
          }
          .avatar-frame{
            position: absolute;
            top: 0;
            left: 0;
            width: 161px;
            height: 164px;
            background: url("@/assets/activity/birthday/birthday_avatar.png") no-repeat top center;
            background-size: cover;
          }
        }
        .name{
          position: absolute;
          top: 146px;
          left: 50%;
          transform: translateX(-50%);
          width: 144px;
          height: 50px;
          font-size: 16px;
          color: #fff;
          background: url("@/assets/activity/birthday/birthday_name.png") no-repeat top center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9;
          >span{
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 124px;
            height: 50px;
            font-family: PingFang SC;
            font-weight: bold;
            font-size: 12px;
            color: #EFD863;
            line-height: 14px;
            background: linear-gradient(160deg, #D1A15E 1.7578125%, #FDDEB6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            white-space: nowrap;        /* 强制文本在一行内显示，不换行 */
            overflow: hidden;           /* 隐藏溢出部分 */
            text-overflow: ellipsis;    /* 溢出时显示省略号 */
          }
        }
      }
      .tips{
        position: absolute;
        top: 381px;
        right: 41px;
        z-index: 10;
        width: 156px;
        height: 53px;
        background: url("@/assets/activity/birthday/birthday_tips.png") no-repeat top center;
        background-size: cover;
        font-family: PingFang SC;
        font-size: 11px;
        color: #FFFFFF;
        line-height: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 0 10px 0 10px;
        opacity: 0;
      }
      video {
        position: absolute;
        top: 205px;
        left: 0;
        width: 100%;
        height: auto;
        object-fit: cover;
        opacity: 0;
        background: #0e0213;
        transition: opacity 0.4s ease;
        &.is-loaded {
          opacity: 1;
        }
        &::-webkit-media-controls {
          display: none !important;
        }
        &::-webkit-media-controls-enclosure {
          display: none !important;
        }
        &::-webkit-media-controls-panel {
          display: none !important;
        }
        &::-webkit-media-controls-play-button {
          display: none !important;
        }
        &::-webkit-media-controls-start-playback-button {
          display: none !important;
        }
      }
      // 手指引导
      .finger-guide {
        position: absolute;
        top: 451px;
        right: 30px;
        width: 62px;
        height: 84px;
        z-index: 10;
        background: url("@/assets/activity/birthday/icon_hand.png") no-repeat top center;
        background-size: cover;
        animation: fingerTap 1.5s infinite;
        transform-origin: center bottom;
        will-change: transform;
        backface-visibility: hidden;
        opacity: 0;
        @keyframes fingerTap {
          0% {
            transform: rotate(-6deg) translateY(0);
          }
          20% {
            transform: rotate(4deg);
          }
          40% {
            transform: rotate(-4deg);
          }
          60% {
            transform: translateY(8px) scale(0.92);
          }
          80% {
            transform: translateY(0) scale(1.05);
          }
          100% {
            transform: translateY(0) scale(1) rotate(0);
          }
        }
      }
      .bless{
        position: absolute;
        top: 751px;
        left: 50%;
        transform: translateX(-50%);
        width: 375px;
        height: auto;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .date{
          height: 18px;
          font-family: PingFang SC;
          font-weight: 600;
          font-size: 15px;
          color: #FFC658;
          line-height: 18px;
          background: linear-gradient(160deg, #D1A15E 1.7578125%, #FDDEB6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
          opacity: 0;
        }
        .text1{
          width: 181px;
          min-height: 18px;
          font-family: PingFang SC;
          font-weight: bold;
          font-size: 15px;
          color: #FFFFFF;
          line-height: 18px;
          text-align: center;
          opacity: 0;
        }
        .happy-birthday{
          width: 189px;
          height: 40px;
          margin: 9px auto 28px;
          opacity: 0;
        }
        .text2{
          width: 298px;
          min-height: 20px;
          font-family: PingFang SC;
          font-weight: 400;
          font-size: 15px;
          color: #FFFFFF;
          line-height: 20px;
          text-align: center;
          opacity: 0;
        }
      }
      // ========== 步骤1：吹蜡烛 入场动画 ==========
      &.animate-started {
        .user {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .title {
          animation: fadeInDown 0.8s ease-out 0.6s both;
        }
        .bless .date {
          animation: fadeIn 0.3s ease-out 1.4s both;
        }
        .bless .text1 {
          animation: fadeIn 0.3s ease-out 1.4s both;
        }
        .bless .happy-birthday {
          opacity: 0;
          transform: scale(0.6);
          transition: all 0.8s ease-out;
          &.is-visible {
            opacity: 1;
            transform: scale(1);
          }
        }
        .bless .text2 {
          animation: fadeIn 0.3s ease-out 2.8s both;
        }
        .tips {
          opacity: 0;
          transition: opacity 0.6s ease-out;
          &.is-visible {
            opacity: 1;
          }
        }
        .finger-guide {
          opacity: 0;
          transition: opacity 0.6s ease-out;
          &.is-visible {
            opacity: 1;
            animation: fingerTap 1.5s infinite;
          }
        }
      }
    }

    // ========== 步骤2：许愿 入场动画 ==========
    .step-wish{
      width: 100%;
      height: 1123px;
      background: url("@/assets/activity/birthday/birthday_make_your_wish_bg.png") no-repeat top center;
      background-size: cover;
      .title{
        position: absolute;
        top: 85px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        width: 253px;
        height: 46px;
        background: url("@/assets/activity/birthday/birthday_text2.png") no-repeat top center;
        background-size: cover;
        opacity: 1;
      }
      .user{
        position: absolute;
        top: 146px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        width: 161px;
        height: 197px;
        display: flex;
        flex-direction: column;
        align-items: center;
        opacity: 1;
        .avatar{
          width: 161px;
          height: 164px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          .avatar-head{
            position: absolute;
            top: 42px;
            left: 30px;
            width: 102px;
            height: 102px;
            border-radius: 50%;
            object-fit: cover;
          }
          .avatar-frame{
            position: absolute;
            top: 0;
            left: 0;
            width: 161px;
            height: 164px;
            background: url("@/assets/activity/birthday/birthday_avatar.png") no-repeat top center;
            background-size: cover;
          }
        }
        .name{
          position: absolute;
          top: 146px;
          left: 50%;
          transform: translateX(-50%);
          width: 144px;
          height: 50px;
          font-size: 16px;
          color: #fff;
          background: url("@/assets/activity/birthday/birthday_name.png") no-repeat top center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9;
          >span{
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 124px;
            height: 50px;
            font-family: PingFang SC;
            font-weight: bold;
            font-size: 12px;
            color: #EFD863;
            line-height: 14px;
            background: linear-gradient(160deg, #D1A15E 1.7578125%, #FDDEB6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            white-space: nowrap;        /* 强制文本在一行内显示，不换行 */
            overflow: hidden;           /* 隐藏溢出部分 */
            text-overflow: ellipsis;    /* 溢出时显示省略号 */
          }
        }
      }
      video {
        position: absolute;
        top: 115px;
        left: 0;
        width: 100%;
        height: auto;
        object-fit: cover;
        opacity: 1;
        transition: opacity 0.4s ease;
        &::-webkit-media-controls {
          display: none !important;
        }
        &::-webkit-media-controls-enclosure {
          display: none !important;
        }
        &::-webkit-media-controls-panel {
          display: none !important;
        }
        &::-webkit-media-controls-play-button {
          display: none !important;
        }
        &::-webkit-media-controls-start-playback-button {
          display: none !important;
        }
      }
      .wish-content {
        position: absolute;
        top: 697px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        width: 320px;
        height: 426px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .list{
          width: 100%;
          margin-bottom: 22px;
          .item{
            width: 100%;
            height: 54px;
            background: url("@/assets/activity/birthday/make_a_vow_bg.png") no-repeat top center;
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 22px 0 32px;
            margin-bottom: 11px;
            &:last-child{
              margin-bottom: 0;
            }
            .text {
              width: 220px;
              min-height: 15px;
              font-family: PingFang SC;
              font-size: 13px;
              font-weight: bold;
              line-height: 15px;
              color: #fff;
            }
            
            .icon {
              width: 23px;
              height: 23px;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .receive-btn {
          width: 172px;
          height: 53px;
          background: url("@/assets/activity/birthday/birthday_button.png") no-repeat top center;
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: PingFang SC;
          font-weight: bold;
          font-size: 12px;
          color: #200B1F;
          line-height: 14px;
        }
        
        .skip-text {
          margin-top: 18px;
          width: 195px;
          min-height: 29px;
          font-family: PingFang SC;
          font-weight: 400;
          font-size: 11px;
          color: #FFFFFF;
          line-height: 18px;
          text-decoration-line: underline;
          text-align: center;
        }
      }
    }

    // ========== 步骤3：领取礼物页面 入场动画 ==========
    .step-claim {
      width: 100%;
      height: 812px;
      background: url("@/assets/activity/birthday/birthday_get_bg.png") no-repeat top center;
      background-size: cover;
      position: relative;
      .title{
        position: absolute;
        top: 82px;
        left: 50%;
        z-index: 10;
        width: 258px;
        height: 75px;
        background: url("@/assets/activity/birthday/birthday_text3.png") no-repeat top center;
        background-size: cover;
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
        transition: all 0.8s ease-out;
        &.is-visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      .tips{
        position: absolute;
        top: 235px;
        left: 17px;
        z-index: 10;
        width: 180px;
        height: 67px;
        background: url("@/assets/activity/birthday/dialogue_bg.png") no-repeat top center;
        background-size: cover;
        font-family: PingFang SC;
        font-size: 11px;
        color: #FFFFFF;
        line-height: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 0 24px 0 24px;
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.6s ease-out;
        &.is-visible {
          opacity: 1;
          transform: scale(1);
        }
      }
      .receive-btn {
        position: absolute;
        top: 677px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        width: 172px;
        height: 53px;
        background: url("@/assets/activity/birthday/birthday_button.png") no-repeat top center;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFang SC;
        font-weight: bold;
        font-size: 12px;
        color: #200B1F;
        line-height: 14px;
        opacity: 0;
        transition: all 0.6s ease-out;
        
        &.is-visible {
          opacity: 1;
        }
      }
      .claimed{
        filter: grayscale(100%);
        cursor: not-allowed;
        pointer-events: none;
      }
      .skip-text {
        position: absolute;
        top: 751px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        width: 295px;
        min-height: 29px;
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 11px;
        color: #FFFFFF;
        line-height: 18px;
        text-align: center;
      }
      // ========== 步骤3：许愿 入场动画 ==========
      &.animate-started {
        .title {
          animation: fadeInDown 0.8s ease-out;
        }
        .tips {
          opacity: 0;
          transition: opacity 0.6s ease-out 0.8s both;
          &.is-visible {
            opacity: 1;
          }
        }
      }
    }

    // 礼物弹窗
    .gift-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;

      .gift-modal-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
      }

      .gift-modal-content {
        position: relative;
        width: 362px;
        height: 693px;
        background: url("@/assets/activity/birthday/birthday_reward_bg.png") no-repeat top center;
        background-size: cover;
        z-index: 1;

        .reward-list{
          width: 307px;
          margin: 231px auto 0;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: flex-start;
          &.is-ar{
            margin-inline-start: 20px;
          }
          .reward-item{
            width: 99px;
            height: 124px;
            margin-right: 5px;
            &:last-child{
              margin-right: 0;
            }
            .gift-bg{
              width: 99px;
              height: 99px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
              padding-bottom: 10px;
              background: url("@/assets/activity/birthday/birthday_reward_gift_bg.png") no-repeat top center;
              background-size: cover;
              >img{
                width: 80px;
                height: auto;
              }
            }
            .gift-name{
              width: 99px;
              box-sizing: border-box;
              padding: 0 5px;
              height: 13px;
              font-family: PingFang SC;
              font-weight: bold;
              font-size: 11px;
              color: #FEEBD3;
              line-height: 13px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .gift-modal-close {
          background: url("@/assets/activity/birthday/birthday_button.png") no-repeat top center;
          background-size: cover;
          position: absolute;
          bottom: 34px;
          left: 50%;
          transform: translateX(-50%);
          width: 172px;
          height: 53px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-family: PingFang SC;
          font-weight: bold;
          font-size: 12px;
          line-height: 14px;
          color: #200B1F;
        }
      }
    }
  }

  // 关闭按钮
  .close-btn,
  .close-btn-report {
    position: absolute;
    top: 52px;
    right: 16px;
    width: 32px;
    height: 32px;
    z-index: 100;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

// 浮动动画
@keyframes floatUp {
  0% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
  100% {
    transform: translateX(-50%) translateY(0);
  }
}

// ========== 动画关键帧 ==========
@keyframes fadeInUp {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  60% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
/* 移除所有浏览器的默认 overlay */
video::before,
video::after,
video::-webkit-media-controls-overlay,
video::-moz-media-controls-overlay,
video::-ms-media-controls-overlay,
video::-webkit-media-controls-panel,
video::-webkit-media-controls-start-playback-button {
  display: none !important;
  content: "" !important;
  background: none !important;
  opacity: 0 !important;
}

/* 防止 Safari 在无 poster 时显示文字 */
video::-webkit-media-text-track-display {
  display: none !important;
}

/* 确保 video 元素自身无背景干扰 */
video {
  background-color: transparent;
  background-image: none;
}
</style>