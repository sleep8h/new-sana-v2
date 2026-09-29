<template>
  <div class="celebrity-countdown">
    <div v-for="item in timeList" :key="item.label" class="cd-item">
      <div class="cd-num">{{ item.value }}</div>
      <div class="cd-label">{{ item.text }}</div>
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
    default: "DD:HH:MM:SS", // 支持 'DD:HH:MM:SS' 或 'HH:MM:SS'
  },
  unit: {
    type: String,
    default: "ms", // 支持 'ms' 或 's'
  },
});

const day = ref(0);
const hours = ref("00");
const minutes = ref("00");
const seconds = ref("00");
let timer = null;

const timeList = computed(() => {
  if (props.format === "DD:HH:MM") {
    return [
      { label: "Day", text: "Day", value: day.value },
      { label: "Hour", text: "Hour", value: hours.value },
      { label: "Min", text: "Min", value: minutes.value },
    ];
  }
  if (props.format === "HH:MM:SS") {
    return [
      { label: "Hour", text: "Hour", value: hours.value },
      { label: "Min", text: "Min", value: minutes.value },
      { label: "Sec", text: "Sec", value: seconds.value },
    ];
  }
  return [
    { label: "Day", text: "Day", value: day.value },
    { label: "Hour", text: "Hour", value: hours.value },
    { label: "Min", text: "Min", value: minutes.value },
    { label: "Sec", text: "Sec", value: seconds.value },
  ];
});

function startCountdown() {
  if (timer) clearInterval(timer);
  // time 为剩余时长（ms/s）
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
    day.value = Math.floor(remainingTime / 86400);
    hours.value = String(Math.floor((remainingTime % 86400) / 3600)).padStart(2, "0");
    minutes.value = String(Math.floor((remainingTime % 3600) / 60)).padStart(2, "0");
    seconds.value = String(remainingTime % 60).padStart(2, "0");
    remainingTime--;
  };

  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
}

watch(
  () => props.time,
  (newVal) => {
    if (newVal > 0) startCountdown();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.celebrity-countdown {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  .cd-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 4px;
    .cd-num {
      min-width: 34px;
      height: 38px;
      padding: 0 4px;
      border-radius: 7px;
      border: 1px solid rgba(247, 210, 100, 0.75);
      background: linear-gradient(180deg, #4a0a10 0%, #230408 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 230, 160, 0.45),
        0 2px 6px rgba(0, 0, 0, 0.55);
      font-weight: bold;
      font-size: 20px;
      line-height: 36px;
      text-align: center;
      background-image: linear-gradient(180deg, #fff3c4 0%, #f3c54b 55%, #b07a1c 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .cd-label {
      margin-top: 4px;
      font-size: 10px;
      line-height: 14px;
      color: #e9c889;
    }
  }
}
</style>
