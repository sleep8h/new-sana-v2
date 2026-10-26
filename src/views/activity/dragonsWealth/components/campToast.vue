<!-- 名人堂弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="toast-close" @click="closeModal"></div>
      <div class="content" :class="props.campType === 1 ? 'content-knight' : 'content-dragon'">
        <div class="list">
          <div
            class="item"
            :class="props.campType === 1 ? 'item-knight' : 'item-dragon'"
            v-for="(item, index) in 3"
            :key="index"
          >
            <!-- <div
            class="item"
            :class="props.campType === 1 ? 'item-knight' : 'item-dragon'"
            v-for="(item, index) in campList"
            :key="index"
          > -->
            <img v-if="index === 0" :src="top1" alt="" />
            <img v-if="index === 1" :src="top2" alt="" />
            <img v-if="index === 2" :src="top3" alt="" />
            <div class="avatar">
              <img :src="item.avatar" alt="" />
            </div>
            <div class="name text-hide">{{ item.nick }}</div>
            <div class="number text-hide">
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .toast-close {
      position: absolute;
      top: 43px;
      right: 32px;
      width: 33px;
      height: 33px;
      background: url("@/assets/activity/dragonsWealth/toast-close.png") no-repeat center center;
      background-size: cover;
      z-index: 1;
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
      top: 0;
      left: 0;
      width: 345px;
      height: 459px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .list {
        width: 319px;
        height: 281px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        margin-top: 100px;
        .item-knight {
          width: 319px;
          height: 87px;
          background: url("@/assets/activity/dragonsWealth/item-knight.png") no-repeat center center;
          background-size: cover;
        }
        .item-dragon {
          width: 319px;
          height: 87px;
          background: url("@/assets/activity/dragonsWealth/item-dragon.png") no-repeat center center;
          background-size: cover;
        }
        .item {
          width: 319px;
          height: 87px;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          > img {
            width: 54px;
            height: 50px;
            margin-inline-start: 3px;
            margin-inline-end: 7px;
          }
          .avatar {
            width: 49px;
            height: 49px;
            border-radius: 50%;
            border: 1px solid #eff4a9;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-inline-end: 11px;
            border-radius: 50%;
            overflow: hidden;
            > img {
              width: 47px;
              height: 47px;
            }
          }
          .name {
            width: 100px;
            height: 20px;
            font-weight: bold;
            font-size: 14px;
            color: #ffe1a2;
            line-height: 20px;
            text-align: start;
          }
          .number {
            width: 69px;
            font-weight: bold;
            font-size: 14px;
            color: #fff8f8;
            line-height: 18px;
            text-align: end;
          }
        }
      }
    }
  }
}
</style>
