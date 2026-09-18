<!-- 榜单 -->
<template>
  <div class="reward">
    <div
      class="top"
      :class="indexs < 1 ? 'top-banner' : ''"
      v-for="(items, indexs) in list"
      :key="indexs"
    >
      <div class="title" v-if="indexs === 0">TOP1</div>
      <div class="title" v-if="indexs === 1">TOP2</div>
      <div class="title" v-if="indexs === 2">TOP3</div>
      <div class="title" v-if="indexs === 3">TOP4~6</div>
      <div class="title" v-if="indexs === 4">TOP7~10</div>
      <div class="list">
        <div class="item" v-for="(item, index) in items" :key="index">
          <div class="img">
            <img :src="item.rewardUrl" alt="" />
          </div>
          <div class="gift-name-number">
            <div class="gift-name" ref="giftNameRef">
              {{ `${item.rewardName}*${item.rewardValue}` }}
            </div>
          </div>
        </div>
      </div>
      <div class="banner" v-if="indexs < 1"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import { useI18n } from "vue-i18n";

// 定义emit
const emit = defineEmits(["timeChange"]);

const { t } = useI18n();
const store = useMainStore();
const list = ref([]);
const curTab = ref(2);
const giftNameRef = ref([]);

// 计算属性
// const listFilter = computed(() => {
//   return list.value?.slice(3) || []
// })

// 方法定义
const getActivityCpRankRankRewards = async () => {
  try {
    const res = await get("/h5doings/activity/cpRank/rankRewards", {
      uid: store.uid,
      ticket: store.ticket,
      groupType: 2,
      language: store.language,
    });
    if (res && res.code === 200) {
      const arr = [];
      const obj = res.data;
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          arr.push(obj[key]);
        }
      }
      console.log(arr, " arr");
      list.value = arr;
    } else {
      console.error("code !== 200 error:", res.message);
    }
  } catch (error) {
    console.error("catch error:", error);
  }
};

onMounted(async () => {
  getActivityCpRankRankRewards();
  setTimeout(() => {
    giftNameRef.value.forEach((el) => {
      if (el.scrollWidth > 79) {
        el.classList.add("scrollable"); // 溢出时启用滚动
      }
    });
  }, 1000);
});
</script>

<style lang="scss" scoped>
.reward {
  width: 100%;
  height: 1275px;
  padding-top: 75px;
  background: #75008b;
  box-sizing: border-box;
  font-family: LogoSCUnboundedSans, system-ui, Avenir, Helvetica, Arial,
    sans-serif;
  .top {
    margin: 5px auto 0;
    width: 355px;
    height: 209px;
    background: url("@/assets/activity/cp/bg-rewards2.png") no-repeat center
      center;
    background-size: 100% 100%;
    position: relative;
    .title {
      position: absolute;
      top: 45px;
      left: 50%;
      transform: translateX(-50%);
      width: 99px;
      height: 32px;
      background: url("@/assets/activity/cp/bg-rewards-top.png") no-repeat
        center center;
      background-size: 100% 100%;
      box-sizing: border-box;
      padding-bottom: 8px;
      font-family: LogoSCUnboundedSans, LogoSCUnboundedSans;
      font-size: 11px;
      color: #ffffff;
      line-height: 24px;
      text-align: center;
    }
    .list {
      position: absolute;
      width: 297px;
      min-height: 99px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: flex-start;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      .item {
        width: 99px;
        height: 99px;
        margin-bottom: 2px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        > .img {
          width: 81px;
          height: 76px;
          background: url("@/assets/activity/cp/bg-rewards-item.png") no-repeat
            center center;
          background-size: 100% 100%;
          margin: 8px auto 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          > img {
            height: 60px;
          }
        }
        .gift-name-number {
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .gift-name {
            width: auto;
            height: 15px;
            font-family: DINAlternate, DINAlternate;
            font-weight: bold;
            font-size: 13px;
            color: #9d3f00;
            line-height: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            white-space: nowrap;
          }
          .gift-name.scrollable {
            animation: scrollText 7s linear infinite;
            overflow-x: auto; /* 启用横向滚动 */
            scrollbar-width: none; /* 隐藏滚动条（Firefox） */
            &::-webkit-scrollbar {
              display: none;
            } /* Chrome/Safari */
          }
          @keyframes scrollText {
            0% {
              transform: translateX(100%);
            }
            20% {
              transform: translateX(30%);
            }
            45% {
              transform: translateX(30%);
            }
            100% {
              transform: translateX(calc(-100%));
            } /* 滚动到末尾留白 */
          }
        }
      }
    }
  }
  .top-banner {
    width: 355px;
    height: 322px;
    background: url("@/assets/activity/cp/bg-rewards1.png") no-repeat center
      center;
    background-size: 100% 100%;
    position: relative;
    .banner {
      position: absolute;
      width: 309px;
      height: 96px;
      top: 183px;
      left: 23px;
      background: url("@/assets/activity/cp/bg-rewards-banner.png") no-repeat
        center center;
      background-size: 100% 100%;
    }
  }
}
</style>
