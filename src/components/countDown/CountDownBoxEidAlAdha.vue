<template>
  <div class="countdown-box">
    <div class="time-countdown">
      <div class="day">{{ day }}</div>
      <div class="day-text">{{ $t("ramadan.days") }}</div>
      <div class="hour">{{ hours }}</div>
      <div class="time-text">:</div>
      <div class="min">{{ minutes }}</div>
      <div class="time-text">:</div>
      <div class="sec">{{ seconds }}</div>
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
      { label: "Day", value: day.value },
      { label: "Hour", value: hours.value },
      { label: "Min", value: minutes.value },
      { label: "Sec", value: seconds.value },
    ];
  } else if (props.format === "DD:HH:MM") {
    return [
      { label: "Day", value: day.value },
      { label: "Hour", value: hours.value },
      { label: "Min", value: minutes.value },
    ];
  } else {
    return [
      { label: "Hour", value: hours.value },
      { label: "Min", value: minutes.value },
      { label: "Sec", value: seconds.value },
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
  width: 321px;
  height: 49px;
  font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
  .time-countdown {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .day,
    .hour,
    .min,
    .sec {
      width: 49px;
      height: 49px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/eidAlAdha/timeBg.png") no-repeat center center;
      background-size: cover;
      font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
      font-weight: bold;
      font-size: 20px;
      color: #fdeb89;
      line-height: 28px;
      text-align: center;
      font-style: normal;
    }
    .day-text {
      min-width: 42px;
      margin: 0 5px;
      height: 25px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: bold;
      font-size: 18px;
      color: #fdeb89;
      line-height: 25px;
      text-align: center;
      font-style: normal;
    }
    .time-text {
      width: 6px;
      height: 28px;
      font-weight: bold;
      font-size: 20px;
      color: #fdeb89;
      line-height: 28px;
      text-align: left;
      font-style: normal;
      margin: 0 5px;
    }
  }
}
</style>
