<template>
  <div
    class="nav-comp-container"
    :style="{
      backgroundColor: bgColor,
      flexDirection: store.language != 'ar' ? 'row' : 'row-reverse',
    }"
  >
    <div class="left-comp-link" @click="$emit('onLeftClick')">
      <div v-if="themeType != 'black'">
        <img v-if="store.language != 'ar'" src="@/assets/common/left-icon@2x.png" alt="" />
        <img v-else src="@/assets/common/right-icon@2x.png" alt="" />
      </div>

      <div v-else>
        <img v-if="store.language != 'ar'" src="@/assets/common/left-black-icon@2x.png" alt="" />
        <img v-else src="@/assets/common/right-black-icon@2x.png" alt="" />
      </div>
    </div>
    <div
      class="center-comp-text"
      :style="{ color: themeType == 'black' ? '#000' : '#fff', fontSize: isText ? '13.6px' : '16px' }"
    >
      <!-- 中间内容插槽 - 默认展示 "myTitle" -->
      <slot name="center">myTitle</slot>
    </div>
    <div class="right-comp-link" v-show="rightLink">
      <!-- 空白区域 -->
      <text v-if="rightType == 'none'"></text>
      <!-- 文本&图片区域 -->
      <div class="" @click="$emit('onRightClick')">
        <text v-if="rightType == 'text'">
          <slot name="right-text"> </slot>
        </text>
        <img v-if="rightType == 'img'" :src="rightSrc" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from "@/pinia/index.js";
const store = useMainStore();

// 定义props
const props = defineProps({
  bgColor: {
    type: String,
    default: "none",
  },
  rightLink: {
    type: Boolean,
    default: false,
  },
  rightType: {
    type: String,
    default: "none",
  },
  isText: {
    type: Boolean,
    default: false,
  },
  rightSrc: {
    type: String,
    default: "",
  },
  themeType: {
    type: String,
    default: "white",
  },
});

// 定义emit
defineEmits(["onLeftClick", "onRightClick"]);
</script>

<style scoped>
.nav-comp-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 16px;
}

.left-comp-link {
  width: 32px; /* 触摸友好的最小尺寸44px */
  height: 32px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  /* 增加点击区域 */
  touch-action: manipulation;
}

.right-comp-link {
  width: 32px; /* 触摸友好的最小尺寸44px */
  height: 32px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  /* 增加点击区域 */
  touch-action: manipulation;
  padding: 0 16px;
  box-sizing: border-box;
}

.left-comp-link img,
.right-comp-link img {
  width: 32px;
  height: 32px;
  /* 防止图片被拖拽 */
  -webkit-user-drag: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.center-comp-text {
  width: calc(100% - 96px);
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: center;
  padding: 0 16px;
  box-sizing: border-box;
  line-height: 1.4;
}
</style>
