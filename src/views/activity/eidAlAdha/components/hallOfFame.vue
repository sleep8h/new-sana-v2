<!-- 日榜奖励弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title">{{ $t("eidAlAdha.hallOfFameTitle", { level: level + 1 }) }}</div>
      <div class="tip">{{ $t("eidAlAdha.hallOfFameTip") }}</div>
      <div class="list">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="avatar">
            <img :src="item.avatar" alt="" />
          </div>
          <!-- <sanaAutoText class="name" :key="new Date().getTime()">{{ item.nick }}</sanaAutoText> -->
          <div class="name">{{ item.nick }}</div>
        </div>
      </div>
      <div class="toast-close" @click="closeModal"></div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from "@/pinia/index.js";
const store = useMainStore();
const props = defineProps({
  isShow: {
    //是否显示
    type: Boolean,
    default: false,
  },
  content: {
    //内容
    type: String,
    default: "",
  },
  level: {
    //等级
    type: String,
    default: "",
  },
  list: {
    //列表
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:isShow", "close"]);
const topFn = (idx) => {
  console.log(idx, "console idx");
  if (idx === "1") return "top1";
  if (idx === "2") return "top2";
  if (idx === "3") return "top3";
  if (idx === "4") return "top4-10";
};
const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};
</script>

<style scoped lang="scss">
.toast {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .toast-mask {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }
  .toast-content {
    position: fixed;
    z-index: 10000;
    width: 348px;
    height: 580px;
    background: url("@/assets/activity/eidAlAdha/hallOfFameBg.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      position: absolute;
      top: 29px;
      left: 50%;
      transform: translateX(-50%);
      width: 246px;
      height: 45px;
      background: url("@/assets/activity/eidAlAdha/dailyRankRewardTitleBg.png") no-repeat center center;
      background-size: cover;
      font-weight: bold;
      font-size: 18px;
      color: #f5febe;
      line-height: 45px;
      text-stroke: 1px #8c2c05;
      -webkit-text-stroke: 1px #8c2c05;
      text-align: center;
    }
    .tip {
      position: absolute;
      top: 86px;
      left: 50%;
      transform: translateX(-50%);
      width: 277px;
      height: 40px;
      font-size: 14px;
      color: #2d5301;
      line-height: 20px;
      text-align: center;
      font-style: normal;
    }
    .list {
      width: 100%;
      height: 396px;
      position: absolute;
      top: 140px;
      left: 50%;
      transform: translateX(-50%);
      overflow-y: auto;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding: 0 40px 0 48px;
      .item {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
        width: 64px;
        min-height: 84px;
        margin-bottom: 18px;
        margin-right: 30px;
        &:nth-child(3n) {
          margin-right: 0;
        }
        .avatar {
          width: 60px;
          height: 60px;
          overflow: hidden;
          border: 2px solid #f9b650;
          border-radius: 50%;
          > img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
          }
        }
        .name {
          width: 64px;
          min-height: 18px;
          margin-top: 1px;
          text-align: center;
          font-weight: bold;
          font-size: 13px;
          color: #bb770f;
          line-height: 18px;
        }
      }
    }
    .toast-close {
      position: absolute;
      bottom: -43px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 30px;
      background: url("@/assets/activity/eidAlAdha/toastClose.png") no-repeat center center;
      background-size: cover;
    }
  }
}
</style>
