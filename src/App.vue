<script setup>
import { onMounted } from "vue";
import { useMainStore } from "@/pinia/index.js";
const store = useMainStore();
import { getAllUrlParams, getUrlParam } from "@/utils/get-url-params.js";

import { setLanguage } from "./i18n";

onMounted(() => {
  const params = getAllUrlParams();

  // console.log('初始化参数:', params)

  store.setParams(params);

  store.os = detectPlatform();
  if (params.language) {
    setLanguage(params.language);
  }

  console.log("当前语言:", store.language);
});

function detectPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) {
    return "android";
  } else if (/iphone|ipad|ipod|ios/.test(ua)) {
    return "ios";
  } else {
    // 默认给一个，比如PC端也当作ios或android（建议给ios）
    return "ios";
  }
}
</script>

<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style scoped>
.app-container {
  /* 确保app容器适配移动端 */
  width: 100%;
  min-height: 100vh;
  position: relative;
  margin: 0;
  padding: 0;
  background: transparent;
  /* 移动端适配 */
  overflow-x: hidden;
  overflow-y: auto;
}

/* 确保router-view占满整个容器 */
.app-container > * {
  width: 100%;
  min-height: 100%;
}

/* 移动端适配媒体查询 */
@media screen and (max-width: 768px) {
  .app-container {
    width: 100vw;
    height: 100vh;
    /* overflow: hidden; */
  }
}

/* PC端显示为移动端大小 */
@media screen and (min-width: 769px) {
  .app-container {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
