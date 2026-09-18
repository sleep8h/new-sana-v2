<template>
    <div class="home-container">
    </div>
</template>

<script setup>
</script>

<style scoped>
.home-container {
    /* 确保容器占满整个视口 */
    width: 100%;
    height: 100vh;
    /* 最小高度确保即使内容为空也有高度 */
    min-height: 100vh;
    /* 绝对定位确保完全占满父容器 */
    position: relative;
    /* 背景图片设置 */
    background: url('@/assets/p/home/sana-home-bg@2x.png') no-repeat center center;
    background-size: cover;
    /* 备用背景色 */
    background-color: #f0f2f5;
    /* 移除可能影响布局的样式 */
    margin: 0;
    padding: 0;
    /* 确保在父容器中正确显示 */
    flex-shrink: 0;
}

/* 如果你想添加内容，可以使用这个样式 */
.home-container::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
}
</style>