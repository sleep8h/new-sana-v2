<!-- 排行榜奖励弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title">{{ $t("ramadan.rankingReward") }}</div>
      <div class="top-list">
        <div class="top-item" v-for="(item, index) in list" :key="index">
          <!-- <div class="top">{{ $t("ramadan.top1") }}</div> -->
          <div class="top">{{ `Top${index + 1}` }}</div>
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
    width: 100%;
    height: 469px;
    background: url("@/assets/activity/ramadan/components/bg_rule.png") no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      width: 163px;
      height: 28px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-size: 20px;
      line-height: 28px;
      color: #fef188;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 600;
      text-shadow:
        1px 1px 0px #8a5e02,
        -1px -1px 0px #8a5e02,
        -1px 1px 0px #8a5e02,
        1px -1px 0px #8a5e02;
      margin: 102px auto 18px;
    }
    .top-list {
      width: 100%;
      height: 280px;
      overflow-y: auto;
      .top-item {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
        .top {
          width: 62px;
          height: 18px;
          background: linear-gradient(180deg, #ffbb3e 0%, #ffef8d 100%);
          box-shadow: inset 0px -2px 4px 0px #b06c06;
          border-radius: 12px;
          border: 1px solid #fedf99;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 14px;
          color: #594100;
          line-height: 20px;
          text-align: center;
          margin-bottom: 10px;
        }
        .list {
          width: 264px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          box-sizing: border-box;
          .item {
            width: 80px;
            height: 102px;
            &:nth-child(3n-1) {
              margin: 0 12px;
            }
            .gift-img {
              width: 80px;
              height: 80px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: url("@/assets/activity/ramadan/bg_sign2.png") no-repeat center center;
              background-size: cover;
              > img {
                width: 56px;
              }
            }
            .gift-info {
              width: 80px;
              height: 18px;
              margin-top: 4px;
              text-align: center;
              font-family:
                PingFangSC,
                PingFang SC;
              font-weight: 500;
              font-size: 12px;
              color: #ffffff;
              line-height: 18px;
            }
          }
        }
      }
    }
    .toast-close {
      position: absolute;
      top: 48px;
      right: 25px;
      width: 34px;
      height: 34px;
      background: url("@/assets/activity/ramadan/components/toast_close.png") no-repeat center center;
      background-size: cover;
    }
  }
}
</style>
