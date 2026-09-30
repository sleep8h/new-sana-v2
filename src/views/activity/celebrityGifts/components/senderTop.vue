<!-- 应援榜/贡献榜列表组件：可用于礼物页预览、应援榜详情页 -->
<template>
  <div class="sender-top" :class="{ 'sender-top-ar': store.language === 'ar' }">
    <div class="sender-item" v-for="(item, index) in list" :key="item.uid || index">
      <div class="sort" :class="{ 'sort-top': item.index <= 3 }">{{ item.index }}</div>
      <img class="avatar" :src="item.avatar" alt="" />
      <div class="name text-hide">{{ item.nick }}</div>
      <div class="country" v-if="item.country">{{ item.country }}</div>
      <div class="score">{{ formatNumber(item.integral ?? item.score) }}</div>
    </div>
    <div class="empty" v-if="list.length === 0">{{ $t("celebrityGifts.noRank") }}</div>
  </div>
</template>

<script setup>
import { useMainStore } from "@/pinia/index.js";

const store = useMainStore();

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const formatNumber = (num) => Number(num || 0).toLocaleString("en-US");
</script>

<style lang="scss" scoped>
.sender-top {
  width: 100%;
  display: flex;
  flex-direction: column;
  .sender-item {
    display: flex;
    align-items: center;
    height: 46px;
    margin-bottom: 8px;
    padding: 0 10px;
    border-radius: 10px;
    border: 1px solid rgba(231, 183, 64, 0.4);
    background: linear-gradient(90deg, rgba(74, 13, 19, 0.85) 0%, rgba(30, 5, 9, 0.85) 100%);
    &:last-child {
      margin-bottom: 0;
    }
    .sort {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      border-radius: 6px;
      background: rgba(242, 205, 99, 0.16);
      font-weight: bold;
      font-size: 12px;
      line-height: 24px;
      text-align: center;
      color: #e9c889;
      flex-shrink: 0;
    }
    .sort-top {
      background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
      color: #5c1503;
    }
    .avatar {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      border-radius: 50%;
      border: 1px solid #e7b740;
      object-fit: cover;
      flex-shrink: 0;
    }
    .name {
      flex: 1;
      font-size: 13px;
      color: #ffe9c7;
    }
    .country {
      margin-right: 8px;
      padding: 0 5px;
      height: 16px;
      border-radius: 3px;
      border: 1px solid rgba(242, 205, 99, 0.5);
      font-size: 9px;
      line-height: 14px;
      color: #e9c889;
      flex-shrink: 0;
    }
    .score {
      max-width: 96px;
      font-weight: bold;
      font-size: 13px;
      color: #f7d264;
      text-align: right;
      flex-shrink: 0;
    }
  }
  .empty {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    color: #e9c889;
  }
}
.sender-top-ar {
  .sender-item {
    .sort {
      margin-right: 0;
      margin-left: 8px;
    }
    .avatar {
      margin-right: 0;
      margin-left: 8px;
    }
    .name {
      text-align: right;
    }
    .country {
      margin-right: 0;
      margin-left: 8px;
    }
    .score {
      text-align: left;
    }
  }
}
</style>
