<!-- 纯CSS礼物盒占位图：接口有礼物图片时直接显示图片，无图时按 color 渲染礼物盒 -->
<template>
  <div class="gift-box" :style="{ width: size + 'px', height: size + 'px' }">
    <img v-if="giftUrl" :src="giftUrl" alt="" />
    <template v-else>
      <div class="lid" :style="lidStyle"></div>
      <div class="body" :style="bodyStyle">
        <div class="ribbon-v" :style="ribbonStyle"></div>
      </div>
      <div class="ribbon-h" :style="ribbonStyle"></div>
      <div class="bow" :style="ribbonStyle"></div>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { GIFT_THEMES } from "../mock.js";

const props = defineProps({
  // 主题色下标
  color: {
    type: Number,
    default: 0,
  },
  // 礼物真实图片地址
  giftUrl: {
    type: String,
    default: "",
  },
  size: {
    type: Number,
    default: 44,
  },
});

const theme = computed(() => GIFT_THEMES[props.color % GIFT_THEMES.length]);

const lidStyle = computed(() => ({
  background: `linear-gradient(180deg, ${theme.value.base} 0%, ${theme.value.deep} 100%)`,
  borderColor: theme.value.deep,
}));

const bodyStyle = computed(() => ({
  background: `linear-gradient(180deg, ${theme.value.base} 0%, ${theme.value.deep} 100%)`,
  borderColor: theme.value.deep,
}));

const ribbonStyle = computed(() => ({
  background: `linear-gradient(180deg, #ffffff 0%, ${theme.value.ribbon} 100%)`,
}));
</script>

<style lang="scss" scoped>
.gift-box {
  position: relative;
  flex-shrink: 0;
  > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .lid {
    position: absolute;
    top: 18%;
    left: 4%;
    width: 92%;
    height: 22%;
    border: 1px solid;
    border-radius: 3px;
    z-index: 2;
  }
  .body {
    position: absolute;
    top: 38%;
    left: 8%;
    width: 84%;
    height: 56%;
    border: 1px solid;
    border-radius: 3px 3px 5px 5px;
    overflow: hidden;
    .ribbon-v {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 18%;
      height: 100%;
    }
  }
  .ribbon-h {
    position: absolute;
    top: 47%;
    left: 8%;
    width: 84%;
    height: 10%;
    z-index: 3;
  }
  .bow {
    position: absolute;
    top: 4%;
    left: 50%;
    transform: translateX(-50%);
    width: 30%;
    height: 18%;
    z-index: 4;
    border-radius: 50% 50% 40% 40%;
    &::before,
    &::after {
      content: "";
      position: absolute;
      top: -20%;
      width: 55%;
      height: 80%;
      border-radius: 50%;
      background: inherit;
    }
    &::before {
      left: -45%;
      transform: rotate(-25deg);
    }
    &::after {
      right: -45%;
      transform: rotate(25deg);
    }
  }
}
</style>
