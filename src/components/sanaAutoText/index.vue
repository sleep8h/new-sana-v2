<template>
  <div
    :class="[
      'auto-scroll-text-base',
      store.language === 'ar' ? 'auto-scroll-text-ar' : 'auto-scroll-text',
      $attrs.class,
    ]"
    ref="textContainer"
  >
    <span ref="textContent"><slot /></span>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { useMainStore } from "@/pinia/index.js";
const store = useMainStore();

const inheritAttrs = false;

const textContainer = ref<HTMLElement | null>(null);
const textContent = ref<HTMLElement | null>(null);
// 用于存储 setTimeout 的 ID，便于后续清理
let pendingTimeouts: number[] = [];

/**
 * 安全地设置 setTimeout 并记录其 ID
 */
function setSafeTimeout(callback: () => void, delay: number): number {
  const id = window.setTimeout(callback, delay);
  pendingTimeouts.push(id);
  return id;
}
const resetScrollAnimation = () => {
  if (!textContent.value) return;
  textContent.value.style.animationPlayState = "running";
  const containerWidth = textContainer.value?.offsetWidth || 0; // 容器宽度
  const textWidth = textContent.value?.scrollWidth || 0; // 文本实际宽度

  if (textWidth > containerWidth) {
    const scrollDuration = (textWidth / containerWidth) * 5; // 动态计算滚动时间
    textContent.value.dataset.scroll = "true"; // 设置滚动标志
    textContent.value.style.animationDuration = `${scrollDuration}s`; // 动态设置滚动时间

    const pauseTimer = setSafeTimeout(
      () => {
        // 动画结束后暂停
        if (textContent.value) {
          textContent.value.style.animationPlayState = "paused";
        }

        // 等待 1.5s 后重置并再次触发
        const restartTimer = setSafeTimeout(() => {
          let className = store.language === "ar" ? "auto-scroll-text-ar" : "auto-scroll-text";
          textContainer.value?.classList.remove(className); // 清除类以重置动画
          void textContainer.value?.offsetWidth; // 强制重排
          textContainer.value?.classList.add(className); // 重新添加类，触发动画
          resetScrollAnimation();
        }, 1500);
      },
      scrollDuration * 1000 - 300,
    );
  } else {
    textContent.value.dataset.scroll = "false"; // 禁用滚动标志
    textContent.value.style.animationDuration = "0s"; // 禁用动画时间
  }
};

onMounted(() => {
  nextTick(() => {
    resetScrollAnimation();
  });
});

watch(
  () => textContent.value?.innerHTML,
  () => {
    console.log("Content changed, resetting scroll animation");
    resetScrollAnimation();
  },
);
</script>

<style lang="scss" scoped>
.auto-scroll-text-base {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: clip;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.auto-scroll-text {
  span[data-scroll="true"] {
    animation: scrollText linear infinite; /* 动画时间由脚本动态设置 */
    text-align: left;
  }

  span[data-scroll="false"] {
    animation: none;
    text-align: center;
  }

  @keyframes scrollText {
    0% {
      transform: translateX(70%);
    }
    100% {
      transform: translateX(-35%);
    }
  }
}

.auto-scroll-text-ar {
  span[data-scroll="true"] {
    animation: scrollTextAr linear infinite; /* 动画时间由脚本动态设置 */
    text-align: left;
  }
  @keyframes scrollTextAr {
    0% {
      transform: translateX(-70%);
    }
    100% {
      transform: translateX(35%);
    }
  }
}
</style>
