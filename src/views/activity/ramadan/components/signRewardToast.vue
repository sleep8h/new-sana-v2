<!-- 累计签到奖励弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title">{{ title }}</div>
      <div class="content">
        <div class="list">
          <div class="item" v-for="(item, index) in list" :key="index">
            <img :src="item.url" alt="" />
            <sanaAutoText class="text" :key="new Date().getTime()">
              {{ `${item.rewardName}*${item.giftNum}` }}
            </sanaAutoText>
          </div>
        </div>
      </div>
      <div class="toast-close" @click="closeModal"></div>
    </div>
  </div>
</template>

<script setup>
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
    height: 358px;
    background: url("@/assets/activity/ramadan/components/tip.png") no-repeat center center;
    background-size: 375px 358px;
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
      margin: 125px auto 22px;
    }
    .content {
      .list {
        width: 225px;
        height: 133px;
        overflow-y: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .item {
          width: 101px;
          height: 133px;
          background: url("@/assets/activity/ramadan/components/bg_sign_reward_item.png") no-repeat center center;
          background-size: cover;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          margin-right: 10px;
          > img {
            width: 70px;
            height: 70px;
            margin: 16px auto 14px;
          }
          > .text {
            width: 101px;
            height: 18px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 14px;
            color: #493300;
            line-height: 18px;
            text-align: center;
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
