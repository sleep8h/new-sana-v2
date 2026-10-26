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
          <div class="rule-text">
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
    width: 354px;
    height: 628px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .toast-close {
      position: absolute;
      top: 15px;
      right: 22px;
      width: 33px;
      height: 33px;
      background: url("@/assets/activity/dragonsWealth/toast-close.png") no-repeat center center;
      background-size: cover;
      z-index: 1;
    }
    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 354px;
      height: 628px;
      background: url("@/assets/activity/dragonsWealth/toast-bg2.png") no-repeat center center;
      background-size: 354px 628px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .title {
        margin: 12px auto 28.5px;
        height: 26px;
        font-weight: bold;
        box-sizing: border-box;
        font-size: 18px;
        line-height: 26px;
        text-align: center;
        color: #ffce51;
        text-shadow:
          1px 1px 0px #2d0000,
          -1px -1px 0px #2d0000,
          -1px 1px 0px #2d0000,
          1px -1px 0px #2d0000;
      }
      .reward-content {
        width: 320px;
        height: 542px;
        .list {
          width: 100%;
          height: 384px;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0px 4px;
          overflow-y: auto;
          .item {
            width: 104px;
            height: 117px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            gap: 7px;
            .reward-img {
              width: 104px;
              height: 96px;
              background: url("@/assets/activity/dragonsWealth/reward-bg.png") no-repeat center center;
              background-size: cover;
              display: flex;
              justify-content: center;
              align-items: center;
              > img {
                width: 68px;
                height: auto;
              }
            }
            .gift-name-number {
              width: 104px;
              height: 14px;
              line-height: 14px;
              font-size: 11px;
              .gift-name {
                // color: #ffe343;
                display: flex;
                justify-content: center;
                align-items: center;
                background: linear-gradient(180deg, #ffffff 0%, #d8b26d 100%);
                -webkit-background-clip: text; /* Safari/Chrome 兼容 */
                background-clip: text; /* 现代浏览器标准属性 */
                color: transparent; /* 文字透明以显示背景渐变 */
                display: inline-block; /* 必须为块级或行内块元素 [1][3][6] */
              }
            }
          }
        }
        .rule-text {
          width: 314px;
          height: 147px;
          margin-top: 8px;
          box-sizing: border-box;
          font-size: 13px;
          color: #fff099;
          line-height: 21px;
          text-align: start;
          overflow-y: auto;
          > p {
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>
