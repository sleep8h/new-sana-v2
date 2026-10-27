<template>
  <div class="countdown-box">
    <div class="time-countdown">
      <div v-for="item in timeList" :key="item.text" class="coutdown-item">
        <div class="countdown-number">{{ item.value }}</div>
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
    default: "DD:HH:MM:SS", // 支持 'DD:HH:MM:SS' / 'HH:MM:SS' / 'DD:HH:MM'
  },
  unit: {
    type: String,
    default: "ms", // 支持 'ms' / 's'
  },
});

const day = ref(0);
const hours = ref("00");
const minutes = ref("00");
const seconds = ref("00");
let timer = null;

// 根据 format 生成展示项：Day 用数字，Hour/Min/Sec 用补零字符串
const timeList = computed(() => {
  const labels =
    props.format === "DD:HH:MM:SS"
      ? ["Day", "Hour", "Min", "Sec"]
      : props.format === "DD:HH:MM"
        ? ["Day", "Hour", "Min"]
        : ["Hour", "Min", "Sec"];
  const values = { Day: day.value, Hour: hours.value, Min: minutes.value, Sec: seconds.value };
  return labels.map((text) => ({ text, value: values[text] }));
});

function startCountdown() {
  if (timer) clearInterval(timer);
  let remainingTime = props.unit === "ms" ? Math.floor(props.time / 1000) : Math.floor(props.time);

  const updateCountdown = () => {
    remainingTime = Math.max(0, remainingTime);
    day.value = Math.floor(remainingTime / 86400);
    hours.value = String(Math.floor((remainingTime % 86400) / 3600)).padStart(2, "0");
    minutes.value = String(Math.floor((remainingTime % 3600) / 60)).padStart(2, "0");
    seconds.value = String(remainingTime % 60).padStart(2, "0");

    if (remainingTime <= 0) {
      clearInterval(timer);
      timer = null;
      return;
    }
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
  width: 272px;
  height: 68px;
  font-family: PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
  .time-countdown {
    width: 272px;
    height: 68px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .coutdown-item {
      width: 68px;
      height: 68px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      background: url("@/assets/activity/dragonsWealth/gameRank/timeItemBg.png") no-repeat top center;
      background-size: cover;
      .countdown-number {
        width: 100%;
        height: 38px;
        line-height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        margin-top: 5px;
        font-weight: bold;
        font-size: 32px;
        background: linear-gradient(180deg, #ffe5b2 24.44%, #a2794d 80%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .countdown-text {
        width: 32px;
        height: 20px;
        font-weight: bold;
        font-size: 14px;
        color: #ffffff;
        line-height: 20px;
        text-align: center;
        margin-top: 0 !important;
      }
    }
  }
}
</style>
