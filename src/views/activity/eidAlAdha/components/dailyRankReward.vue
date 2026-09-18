<!-- 日榜奖励弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title">{{ $t("eidAlAdha.dailyRankingReward") }}</div>
      <div class="top-list">
        <div class="top-item" v-for="(item, index) in list" :key="index">
          <div class="top">{{ topFn(index) }}</div>
          <div class="list">
            <div class="item" v-for="(items, indexs) in item" :key="indexs">
              <div class="gift-img">
                <img :src="items.rewardUrl" alt="" />
              </div>
              <sanaAutoText class="gift-info" :key="new Date().getTime()">
                {{ `${store.language === "ar" ? items.rewardNameAr : items.rewardName} x${items.rewardValue}` }}
              </sanaAutoText>
            </div>
          </div>
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
    height: 651px;
    background: url("@/assets/activity/eidAlAdha/dailyRankRewardBg.png") no-repeat center center;
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
    .top-list {
      width: 100%;
      height: 520px;
      position: absolute;
      top: 82px;
      left: 50%;
      transform: translateX(-50%);
      overflow-y: auto;
      .top-item {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
        .top {
          width: 74px;
          height: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url("@/assets/activity/eidAlAdha/dailyRankRewardTopBg.png") no-repeat center center;
          background-size: cover;
          font-weight: bold;
          font-size: 15px;
          color: #ffffff;
          line-height: 21px;
          text-align: center;
          margin-bottom: 12px;
        }
        .list {
          width: 266px;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-wrap: wrap;
          box-sizing: border-box;
          .item {
            width: 82px;
            height: 121px;
            &:nth-child(3n-1) {
              margin: 0 10px;
            }
            .gift-img {
              width: 82px;
              height: 82px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: url("@/assets/activity/eidAlAdha/dailyRankRewardGiftBg.png") no-repeat center center;
              background-size: cover;
              > img {
                width: 58px;
              }
            }
            .gift-info {
              width: 82px;
              height: 18px;
              margin-top: 6px;
              text-align: center;
              font-weight: bold;
              font-size: 13px;
              color: #bb770f;
              line-height: 18px;
            }
          }
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
