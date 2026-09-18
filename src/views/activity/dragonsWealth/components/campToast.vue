<!-- 名人堂弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="toast-close" @click="closeModal"></div>
      <img class="toast-type" :src="props.campType === 1 ? knight : dragon" alt="" />
      <div class="content" :class="props.campType === 1 ? 'content-knight' : 'content-dragon'">
        <div class="title">{{ props.campType === 1 ? $t("dragons.knight") : $t("dragons.dragon") }}</div>
        <div class="list">
          <div
            class="item"
            :class="props.campType === 1 ? 'item-knight' : 'item-dragon'"
            v-for="(item, index) in campList"
            :key="index"
          >
            <img v-if="index === 0" :src="top1" alt="" />
            <img v-if="index === 1" :src="top2" alt="" />
            <img v-if="index === 2" :src="top3" alt="" />
            <div class="avatar" :class="{ 'avatar-ar': store.language === 'ar' }">
              <img :src="item.avatar" alt="" />
            </div>
            <div class="name text-hide">{{ item.nick }}</div>
            <div class="number text-hide" :class="{ 'number-ar': store.language === 'ar' }">
              {{ item.contribution }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import top1 from "@/assets/activity/dragonsWealth/top1.png";
import top2 from "@/assets/activity/dragonsWealth/top2.png";
import top3 from "@/assets/activity/dragonsWealth/top3.png";
import knight from "@/assets/activity/dragonsWealth/knight.png";
import dragon from "@/assets/activity/dragonsWealth/dragon.png";
import { useMainStore } from "@/pinia/index.js";
const store = useMainStore();

const props = defineProps({
  isShow: {
    //是否显示
    type: Boolean,
    default: false,
  },
  campType: {
    //内容
    type: Number,
    default: 1,
  },
  campList: {
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
    width: 345px;
    height: 459px;
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
    .toast-type {
      position: absolute;
      top: -7px;
      left: -15px;
      width: 114px;
      height: 121px;
      z-index: 2;
    }
    .content-knight {
      background: url("@/assets/activity/dragonsWealth/bg-knight.png") no-repeat center center;
      background-size: cover;
    }
    .content-dragon {
      background: url("@/assets/activity/dragonsWealth/bg-dragon.png") no-repeat center center;
      background-size: cover;
    }
    .content {
      position: absolute;
      top: 40px;
      left: 0;
      width: 345px;
      height: 419px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .title {
        margin: 19px auto 46px;
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
      .list {
        width: 305px;
        height: 279px;
        .item-knight {
          width: 305px;
          height: 84px;
          background: url("@/assets/activity/dragonsWealth/item-knight.png") no-repeat center center;
          background-size: cover;
        }
        .item-dragon {
          width: 305px;
          height: 84px;
          background: url("@/assets/activity/dragonsWealth/item-dragon.png") no-repeat center center;
          background-size: cover;
        }
        .item {
          width: 305px;
          height: 84px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 9px;
          > img {
            width: 36px;
            height: 36px;
            margin: 0 7px 0 17px;
          }
          .avatar {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            border: 1px solid #eff4a9;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 11px;
            border-radius: 50%;
            overflow: hidden;
            > img {
              width: 44px;
              height: 44px;
            }
          }
          .avatar-ar {
            margin-left: 11px;
            margin-right: 0;
          }
          .name {
            width: 100px;
            height: 20px;
            font-weight: bold;
            font-size: 14px;
            color: #ffffff;
            line-height: 20px;
            text-align: left;
          }
          .number {
            width: 69px;
            font-weight: bold;
            font-size: 13px;
            color: #fcf860;
            line-height: 18px;
            text-align: right;
          }
          .number-ar {
            text-align: left;
          }
        }
      }
    }
  }
}
</style>
