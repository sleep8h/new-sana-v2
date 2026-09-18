<template>
  <div class="nav-container">
    <div class="nav-header">
      <h2>路由导航</h2>
      <p>开发调试用 - 路由跳转测试</p>
    </div>

    <!-- Tab导航 -->
    <div class="tab-nav">
      <div class="tab-item" :class="{ active: activeTab === 'pages' }" @click="activeTab = 'pages'">
        <span class="tab-icon">📄</span>
        页面路由
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'activities' }" @click="activeTab = 'activities'">
        <span class="tab-icon">🎪</span>
        活动路由
      </div>
    </div>

    <!-- Tab内容 -->
    <div class="tab-content">
      <!-- 页面路由 -->
      <div v-show="activeTab === 'pages'" class="tab-panel">
        <div class="route-section">
          <div class="section-title">
            <span class="icon">🏠</span>
            基础页面
          </div>
          <div class="route-links">
            <router-link to="/" class="route-link">
              <span class="link-icon">🏡</span>
              <div class="link-info">
                <span class="link-title">首页</span>
                <span class="link-path">/</span>
              </div>
            </router-link>
            <router-link to="/about" class="route-link">
              <span class="link-icon">ℹ️</span>
              <div class="link-info">
                <span class="link-title">关于页面</span>
                <span class="link-path">/about</span>
              </div>
            </router-link>
          </div>
        </div>

        <div class="route-section">
          <div class="section-title">
            <span class="icon">⚔️</span>
            公会模块
          </div>
          <div class="route-links">
            <router-link to="/guild" class="route-link">
              <span class="link-icon">🏰</span>
              <div class="link-info">
                <span class="link-title">公会主页</span>
                <span class="link-path">/guild</span>
              </div>
            </router-link>
            <router-link to="/guild/search" class="route-link">
              <span class="link-icon">🔍</span>
              <div class="link-info">
                <span class="link-title">公会搜索</span>
                <span class="link-path">/guild/search</span>
              </div>
            </router-link>
            <router-link to="/guild/anchor" class="route-link">
              <span class="link-icon">🎯</span>
              <div class="link-info">
                <span class="link-title">主播页面</span>
                <span class="link-path">/guild/anchor</span>
              </div>
            </router-link>
          </div>
        </div>

        <div class="route-section">
          <div class="section-title">
            <span class="icon">🔧</span>
            测试页面
          </div>
          <div class="route-links">
            <router-link to="/test-404" class="route-link">
              <span class="link-icon">❌</span>
              <div class="link-info">
                <span class="link-title">404测试</span>
                <span class="link-path">/test-404</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 活动路由 -->
      <div v-show="activeTab === 'activities'" class="tab-panel">
        <div class="route-section">
          <div class="section-title">
            <span class="icon">🎉</span>
            营销活动
          </div>
          <div class="route-links">
            <router-link to="/contact" class="route-link">
              <span class="link-icon">📞</span>
              <div class="link-info">
                <span class="link-title">联系我们</span>
                <span class="link-path">/contact</span>
              </div>
            </router-link>
            <router-link to="/activity/promotion" class="route-link">
              <span class="link-icon">🎁</span>
              <div class="link-info">
                <span class="link-title">推广活动</span>
                <span class="link-path">/activity/promotion</span>
              </div>
            </router-link>
          </div>
        </div>

        <div class="route-section">
          <div class="section-title">
            <span class="icon">🏆</span>
            赛事活动
          </div>
          <div class="route-links">
            <router-link to="/activity/tournament" class="route-link">
              <span class="link-icon">🏅</span>
              <div class="link-info">
                <span class="link-title">锦标赛</span>
                <span class="link-path">/activity/tournament</span>
              </div>
            </router-link>
            <router-link to="/activity/ranking" class="route-link">
              <span class="link-icon">📊</span>
              <div class="link-info">
                <span class="link-title">排行榜</span>
                <span class="link-path">/activity/ranking</span>
              </div>
            </router-link>
          </div>
        </div>

        <div class="route-section">
          <div class="section-title">
            <span class="icon">🎮</span>
            娱乐活动
          </div>
          <div class="route-links">
            <router-link to="/activity/game" class="route-link">
              <span class="link-icon">🎲</span>
              <div class="link-info">
                <span class="link-title">小游戏</span>
                <span class="link-path">/activity/game</span>
              </div>
            </router-link>
            <router-link to="/activity/lucky" class="route-link">
              <span class="link-icon">🍀</span>
              <div class="link-info">
                <span class="link-title">幸运抽奖</span>
                <span class="link-path">/activity/lucky</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 当前激活的tab
const activeTab = ref("pages");
</script>

<style scoped>
.nav-container {
  padding: 16px;
  max-width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.nav-header {
  text-align: center;
  margin-bottom: 24px;
  color: white;
}

.nav-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.nav-header p {
  margin: 0;
  opacity: 0.8;
  font-size: 14.4px;
}

/* Tab导航样式 */
.tab-nav {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 14.4px;
}

.tab-item.active {
  background: white;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tab-item:hover:not(.active) {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.tab-icon {
  font-size: 16px;
}

/* Tab内容样式 */
.tab-content {
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.route-section {
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 600;
  margin-bottom: 16px;
  font-size: 17.6px;
}

.icon {
  font-size: 19.2px;
}

.route-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.route-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.route-link:hover {
  background: white;
  transform: translateX(4px);
  border-left-color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.route-link.router-link-active {
  background: white;
  border-left-color: #764ba2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.link-icon {
  font-size: 19.2px;
  width: 24px;
  text-align: center;
}

.link-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.link-title {
  font-weight: 500;
  font-size: 15.2px;
  color: #333;
}

.link-path {
  font-size: 12.8px;
  color: #666;
  font-family: "Courier New", monospace;
  margin-top: 1.6px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .nav-container {
    padding: 12px;
  }

  .tab-item {
    padding: 9.6px 8px;
    font-size: 13.6px;
  }

  .route-section {
    padding: 12px;
  }

  .route-link {
    padding: 9.6px 12.8px;
  }

  .link-title {
    font-size: 14.4px;
  }

  .link-path {
    font-size: 12px;
  }
}

/* 大屏幕优化 */
@media (min-width: 768px) {
  .nav-container {
    max-width: 450px;
    margin: 0 auto;
    border-radius: 12px;
    margin-top: 16px;
    min-height: calc(100vh - 64px);
  }
}

/* 滚动条美化 */
.nav-container::-webkit-scrollbar {
  width: 6px;
}

.nav-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.nav-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.nav-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
