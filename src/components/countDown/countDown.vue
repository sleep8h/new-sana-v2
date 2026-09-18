<template>
  <div class="count-down" :style="{ color: color }">
    {{ formattedTime }}
  </div>
</template>

<script>
export default {
  name: "CountDown",
  props: {
    // 传入的时间戳或秒数
    time: {
      type: [Number, String],
      required: true,
    },
    // 倒计时格式，默认为 xx:xx:xx
    format: {
      type: String,
      default: "HH:MM:SS",
    },
    color: {
      type: String,
      default: "#fff",
    },
  },
  data() {
    return {
      remainingTime: 0, // 剩余时间（秒）
      timer: null, // 定时器
    };
  },
  computed: {
    // 根据格式返回格式化后的时间
    formattedTime() {
      const days = Math.floor(this.remainingTime / 86400);
      const hours = Math.floor((this.remainingTime % 86400) / 3600);
      const minutes = Math.floor((this.remainingTime % 3600) / 60);
      const seconds = this.remainingTime % 60;

      switch (this.format) {
        case "DD:HH:MM":
          return `${this.pad(days)}D:${this.pad(hours)}H:${this.pad(minutes)}M`;
        case "HH:MM:SS":
          return `${this.pad(hours)}H:${this.pad(minutes)}M:${this.pad(seconds)}S`;
        case "HH:MM:DS":
          return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
        default:
          return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
      }
    },
  },
  watch: {
    // 监听 time 变化，重新设置倒计时
    time: {
      immediate: true,
      handler(newVal) {
        this.setRemainingTime(newVal);
      },
    },
  },
  methods: {
    // 设置剩余时间
    setRemainingTime(time) {
      if (this.timer) {
        clearInterval(this.timer);
      }

      // 如果传入的是时间戳，计算与当前时间的差值
      if (time > 1000000000000) {
        this.remainingTime = Math.floor((time - Date.now()) / 1000);
      } else {
        this.remainingTime = parseInt(time, 10);
      }

      // 开始倒计时
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          clearInterval(this.timer);
          this.$emit("countdown-end");
        }
      }, 1000);
    },
    // 补零函数
    pad(num) {
      return num < 10 ? `0${num}` : num;
    },
  },
  beforeDestroy() {
    console.log("销毁");
    // 组件销毁时清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style scoped>
.count-down {
  color: #333;
}
</style>
