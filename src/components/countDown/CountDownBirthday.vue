<template>
  <div class="countdown-box">
    <div class="time-countdown">
      <div v-for="item in timeList" :key="item.label" :class="['coutdown-item']">
        <div
          class="countdown-bg"
          :style="{
            ...(bgUrl ? { background: `url('${bgUrl}') no-repeat`, backgroundSize: '100% 100%' } : {}),
          }"
        >
          <span
            :class="{ 'linear-gradient': gradient }"
            :style="{
              ...(!gradient ? {} : {}),
            }"
          >
            {{ item.value }}
          </span>
        </div>
        <div class="countdown-text">{{ item.text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";

const props = defineProps({
  time: {
    type: Number,
    default: 0,
    required: true,
  },
  format: {
    type: String,
    default: "DD:HH:MM:SS", // 支持 'DD:HH:MM:SS' 或 'HH:MM:SS' 或 'DD:HH:MM'
  },
  unit: {
    type: String,
    default: "ms", // 支持 'ms' 或 's'
  },
  bgUrl: {
    type: String,
    default: "",
  },
  isRow: {
    type: Boolean,
    default: true,
  },
  width: {
    type: Number,
    default: 3,
  },
  height: {
    ype: Number,
    default: 3,
  },
  color: {
    type: String,
    default: "#fff",
  },
  gradient: {
    type: Boolean,
    default: false,
  },
  showLable: {
    type: Boolean,
    default: true,
  },
  fontSize: {
    type: Number,
    default: 0.85,
  },
});

const day = ref(0);
const hours = ref("00");
const minutes = ref("00");
const seconds = ref("00");
let timer = null;

const showDay = computed(() => props.format === "DD:HH:MM:SS" || props.format === "DD:HH:MM");

// 统一倒计时展示内容
const timeList = computed(() => {
  if (props.format === "DD:HH:MM:SS") {
    return [
      { label: "Day", text: "Day", value: day.value },
      { label: "Hour", text: "Hrs", value: hours.value },
      { label: "Min", text: "Min", value: minutes.value },
      { label: "Sec", text: "Sec", value: seconds.value },
    ];
  } else if (props.format === "DD:HH:MM") {
    return [
      { label: "Day", text: "D", value: day.value },
      { label: "Hour", text: "H", value: hours.value },
      { label: "Min", text: "M", value: minutes.value },
    ];
  } else {
    return [
      { label: "Hour", text: "Hrs", value: hours.value },
      { label: "Min", text: "Min", value: minutes.value },
      { label: "Sec", text: "Sec", value: seconds.value },
    ];
  }
});

function startCountdown() {
  if (timer) clearInterval(timer);
  let remainingTime = props.unit === "ms" ? Math.floor(props.time / 1000) : Math.floor(props.time);

  const updateCountdown = () => {
    if (remainingTime <= 0) {
      day.value = 0;
      hours.value = "00";
      minutes.value = "00";
      seconds.value = "00";
      clearInterval(timer);
      return;
    }
    let totalSeconds = remainingTime;
    let days = Math.floor(totalSeconds / 86400);
    let h = Math.floor((totalSeconds % 86400) / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;

    day.value = days;
    hours.value = h.toString().padStart(2, "0");
    minutes.value = m.toString().padStart(2, "0");
    seconds.value = s.toString().padStart(2, "0");

    remainingTime--;
  };

  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
}

watch(
  () => props.time,
  (newVal) => {
    if (newVal > 0) {
      startCountdown();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style lang="scss">
.countdown-box {
  width: 351px;
  height: 73px;
  font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
  background: url("@/assets/activity/birthday/birthdayRank/bg_time_sec.png") no-repeat center center;
  background-size: cover;
  .time-countdown {
    width: 100%;
    height: 73px;
    display: flex;
    justify-content: center;
    align-items: center;
    .coutdown-item {
      display: flex;
      justify-content: center;
      align-items: center;
      .countdown-bg {
        width: 45px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        background: url("@/assets/activity/birthday/birthdayRank/bg_time.png") no-repeat center center;
        background-size: cover;
        /* 如果图片不存在，使用备用背景色 */
        > span {
          font-family: DIN Alternate;
          font-weight: bold;
          font-size: 24px;
          color: #13021B;
          background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .countdown-text {
        font-family: DIN Alternate;
        font-size: 24px;
        color: #13021B;
        line-height: 24px;
        font-weight: bold;
        background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0 5px;
      }
    }
  }
}
</style>