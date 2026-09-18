<!-- 积分不足提示弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask"></div>
    <div class="toast-content">
      <div class="title">
        <div class="title-text">{{ $t("eidAlAdha.getRewardTitle", { level: level > 4 ? 4 : level + 1 }) }}</div>
        <div class="title-bg"></div>
      </div>
      <div class="reward-list" :class="{ 'reward-list-3': rewardList.length === 3 }">
        <div class="reward-item" v-for="(item, index) in rewardList" :key="index">
          <div class="gift">
            <img :src="item.url" alt="" />
          </div>
          <sanaAutoText class="name" :key="new Date().getTime()">
            {{ `${store.language === "ar" ? item.giftName : item.giftName} *${item.giftNum}` }}
          </sanaAutoText>
        </div>
      </div>
      <div class="toast-confirm" @click="closeModal">{{ $t("eidAlAdha.confirm") }}</div>
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
  level: {
    //等级
    type: String,
    default: "",
  },
  rewardList: {
    //循环奖励列表
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
    height: 421px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      width: 163px;
      height: 43px;
      position: relative;
      .title-text {
        height: 40px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: bold;
        font-size: 28px;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
        background: linear-gradient(90deg, #f4f998 0%, #ffe721 100%);
        -webkit-background-clip: text; /* 限定背景仅在文字区域显示 */
        -webkit-text-fill-color: transparent; /* 文字透明以显示渐变 */
        background-clip: text; /* 标准属性，兼容非Webkit内核 */
      }
      .title-bg {
        position: absolute;
        top: 21px;
        left: 50%;
        transform: translateX(-50%);
        width: 163px;
        height: 22px;
        background: url("@/assets/activity/eidAlAdha/getRewardTitleBg.png") no-repeat center center;
        background-size: cover;
      }
    }

    .reward-list {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .reward-item {
        width: 120px;
        height: 136px;
        margin-right: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .gift {
          width: 120px;
          height: 120px;
          background: url("@/assets/activity/eidAlAdha/getRewardGiftBg.png") no-repeat center center;
          background-size: cover;
          margin-bottom: -4px;
          > img {
            width: 68px;
          }
        }
        .name {
          width: 120px;
          height: 20px;
          text-align: center;
          font-weight: bold;
          font-size: 14px;
          color: #ffe343;
          line-height: 20px;
        }
      }
    }
    .reward-list-3 {
      .reward-item {
        margin-right: -8px;
      }
    }
    .toast-confirm {
      margin-top: 30px;
      width: 144px;
      height: 46px;
      font-weight: bold;
      font-size: 16px;
      color: #b1490b;
      line-height: 22px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/eidAlAdha/getRewaedconfirmBg.png") no-repeat center center;
      background-size: cover;
    }
  }
}
</style>
