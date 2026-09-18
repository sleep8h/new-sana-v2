<!-- 规则弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="toast-close" @click="closeModal"></div>
      <div class="content">
        <div class="title">{{ $t("dragons.rewards") }}</div>
        <div class="reward-content">
          <div class="list">
            <div class="item" v-for="(item, index) in props.rewardList" :key="index">
              <div class="reward-img">
                <img :src="item.rewardUrl" alt="" />
              </div>
              <div class="gift-name-number">
                <sanaAutoText class="gift-name" :key="new Date().getTime()">
                  {{ `${store.language === "ar" ? item.rewardNameAr : item.rewardName} *${item.rewardValue}` }}
                </sanaAutoText>
              </div>
            </div>
          </div>
          <div class="rule-text" :class="{ 'rule-text-ar': store.language === 'ar' }">
            <p>{{ $t("dragons.rule1") }}</p>
            <p>{{ $t("dragons.rule2") }}</p>
            <p>{{ $t("dragons.rule3") }}</p>
            <p>{{ $t("dragons.rule4") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMainStore } from "@/pinia/index.js";
const store = useMainStore();

import avatar from "@/assets/activity/dragonsWealth/avatar.png";

const props = defineProps({
  isShow: {
    //是否显示
    type: Boolean,
    default: false,
  },
  rewardList: {
    //内容
    type: Array,
    default: [],
  },
});

const giftNameRef = ref([]);

const emit = defineEmits(["update:isShow", "close"]);

onMounted(async () => {
  setTimeout(() => {
    giftNameRef.value.forEach((el) => {
      if (el.scrollWidth > 79) {
        el.classList.add("scrollable"); // 溢出时启用滚动
      }
    });
  }, 1000);
});

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
    width: 345px;
    height: 576px;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    .toast-close {
      position: absolute;
      top: 0;
      right: 0;
      width: 34px;
      height: 34px;
      background: url("@/assets/activity/dragonsWealth/toast-close.png") no-repeat center center;
      background-size: cover;
    }
    .content {
      position: absolute;
      top: 40px;
      left: 0;
      width: 345px;
      height: 586px;
      background: url("@/assets/activity/dragonsWealth/toast-bg1.png") no-repeat center center;
      background-size: cover;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .title {
        margin: 19px auto 42px;
        height: 22px;
        font-weight: bold;
        box-sizing: border-box;
        padding-top: 3px;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        background: linear-gradient(90deg, #f4f998 0%, #ffe721 100%);
        -webkit-background-clip: text; /* Safari/Chrome 兼容 */
        background-clip: text; /* 现代浏览器标准属性 */
        color: transparent; /* 文字透明以显示背景渐变 */
        display: inline-block; /* 必须为块级或行内块元素 [1][3][6] */
      }
      .reward-content {
        height: 460px;
        overflow-y: auto;
        .list {
          width: 100%;
          box-sizing: border-box;
          padding: 0 12px 0 20px;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-wrap: wrap;
          .item {
            width: 96px;
            height: 124px;
            margin-right: 8px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 16px;
            .reward-img {
              width: 96px;
              height: 96px;
              background: url("@/assets/activity/dragonsWealth/reward-bg.png") no-repeat center center;
              background-size: cover;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 6px;
              > img {
                width: 68px;
                height: auto;
              }
            }
            .gift-name-number {
              width: 96px;
              height: 22px;
              font-size: 14px;
              line-height: 22px;
              .gift-name {
                color: #ffe343;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
          }
        }
        .rule-text {
          margin-top: 8px;
          width: 100%;
          box-sizing: border-box;
          padding: 0 20px;
          font-size: 13px;
          color: #fff099;
          line-height: 22px;
          text-align: left;
          > p {
            margin-bottom: 8px;
          }
        }
        .rule-text-ar {
          text-align: right;
        }
      }
    }
  }
}
</style>
