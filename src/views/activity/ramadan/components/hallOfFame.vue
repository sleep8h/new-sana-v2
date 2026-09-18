<!-- 名人堂弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title">{{ $t("ramadan.reSignRewardTitle") }}</div>
      <div class="content">
        <div class="list">
          <div class="item" v-for="(item, index) in list" :key="index">
            <img :src="item.avatar" alt="" />
            <div class="text">{{ item.nick }}</div>
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
  title: {
    //标题
    type: String,
    default: "",
  },
  list: {
    //列表
    type: Array,
    default: () => [],
  },
  content: {
    //内容
    type: String,
    default: "",
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
      width: 300px;
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
      margin: 97px auto 16px;
    }
    .content {
      .list {
        width: 265px;
        height: 303px;
        overflow-y: auto;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        .item {
          width: 80px;
          height: 81px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 20px;
          &:nth-child(3n - 1) {
            margin-left: 10px;
            margin-right: 10px;
          }
          > img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-bottom: 3px;
          }
          > .text {
            width: 80px;
            height: 18px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 13px;
            color: #fff099;
            line-height: 18px;
            text-align: center;
            font-style: normal;
            white-space: nowrap; /* 强制文本不换行 */
            overflow: hidden; /* 隐藏溢出内容 */
            text-overflow: ellipsis; /* 溢出部分显示省略号 */
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
