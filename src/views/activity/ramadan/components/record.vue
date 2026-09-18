<!-- 积分不足提示弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title">{{ $t("ramadan.record") }}</div>
      <div class="list">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="time">{{ formatDate(item.time) }}</div>
          <img class="gift-img" :src="item.rewardUrl" alt="" />
          <div class="num">
            <span>{{ store.language === "ar" ? item.rewardNameAr : item.rewardName }}</span>
            <span>{{ `*${item.giftNum}` }}</span>
          </div>
          <!-- <sanaAutoText class="num" :key="new Date().getTime()">
            {{ `${item.rewardName}*${item.giftNum}` }}
          </sanaAutoText> -->
        </div>
      </div>
      <div class="content">
        <p>{{ content }}</p>
      </div>
      <div class="toast-close" @click="closeModal"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
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
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:isShow", "close"]);

const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};

const formatDate = (time) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
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
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      height: 28px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
      text-align: center;
      color: #fef188;
      text-shadow:
        1px 1px 0px #8a5e02,
        -1px -1px 0px #8a5e02,
        -1px 1px 0px #8a5e02,
        1px -1px 0px #8a5e02;
      margin: 90px auto 9px;
    }
    .list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: 300px;
      overflow-y: auto;
      .item {
        width: 257px;
        height: 46px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        flex-shrink: 0;
        border-bottom: 1px solid rgba(#fff099, 0.23);
        .time {
          width: 57px;
          height: 20px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 16px;
          color: #fff099;
          line-height: 20px;
          text-align: left;
          margin-right: 5px;
        }
        .gift-img {
          width: 34px;
          height: 34px;
          margin-right: 6px;
        }
        .num {
          width: 150px;
          height: 20px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 500;
          font-size: 16px;
          color: #fff099;
          line-height: 20px;
          text-align: right;
          > span {
            &:nth-child(1) {
              display: inline-block;
              overflow: hidden; /* 隐藏溢出内容 */
              white-space: nowrap; /* 强制文本不换行 */
              text-overflow: ellipsis; /* 溢出部分显示省略号 */
              width: 120px;
              text-align: center;
            }
            &:nth-child(2) {
              display: inline-block;
              width: 30px;
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
