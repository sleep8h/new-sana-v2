<!-- 榜单奖励详情弹窗：点击「更多」展开，展示各档位（TOP1/2/3）奖励明细 -->
<template>
  <div class="rank-reward-modal" v-if="show" @click="onMaskClick">
    <div class="mask" @click="onBackClick"></div>
    <div class="reward-box" @click.stop>
      <div class="reward-title">{{ t("recharge.Award") }}</div>
      <div class="reward-box-content">
        <div class="reward-box-banner"></div>
        <div class="reward-box-list">
          <div class="reward-box-item" v-for="(item, index) in rankRewardList" :key="index">
            <div class="item-title" v-if="index === 0">
              <span>{{ t("recharge.top1") }}</span>
            </div>
            <div class="item-title" v-if="index === 1">
              <span>{{ t("recharge.top2") }}</span>
            </div>
            <div class="item-title" v-if="index === 2">
              <span>{{ t("recharge.top3") }}</span>
            </div>
            <div class="list">
              <div class="item" v-for="(items, indexs) in item" :key="indexs">
                <div class="reward-img">
                  <div class="reward-img-box">
                    <img :src="items.rewardUrl" alt="" />
                  </div>
                </div>
                <sanaAutoText class="reward-text" v-if="items.rewardName">
                  {{
                    `${store.language === "ar" ? items.rewardNameAr : items.rewardName} ${items.rewardValue ? " * " + items.rewardValue : ""}`
                  }}
                </sanaAutoText>
                <sanaAutoText class="reward-text" v-else>
                  {{ `${items.rewardValue}` }}
                </sanaAutoText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/pinia/index.js";

const props = defineProps({
  // 弹窗显隐
  show: { type: Boolean, default: false },
  // 各档位奖励数据：[[item,...], ...]
  rankRewardList: { type: Array, default: () => [] },
  // 当前榜单 tab：2=周榜，3=月榜，用于切换标题文案
  curTab: { type: Number, default: 2 },
});
const emit = defineEmits(["close"]);

const { t } = useI18n();
const store = useMainStore();

// 点击返回关闭弹窗
const onBackClick = () => emit("close");
// 点击遮罩关闭弹窗
const onMaskClick = () => emit("close");
</script>

<style scoped lang="scss">
.rank-reward-modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1001;
  }
  .reward-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    width: 375px;
    height: 635px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1002;
    box-sizing: border-box;
    // 顶层背景（上半部分 + 顶部皇冠框）：751×892，left 1
    &::before {
      content: "";
      position: absolute;
      top: 0;
      inset-inline-start: 0px;
      width: 375px;
      height: 446px;
      background: url("@/assets/activity/recharge/reward/ruleBgTop.png") no-repeat center center;
      background-size: 100% 100%;
      z-index: -2;
      pointer-events: none;
    }
    // 底层背景（下半部分 + 底部宝石框，与顶层重叠融合）：767×754，top 515 / left -15
    &::after {
      content: "";
      position: absolute;
      top: 288px;
      inset-inline-start: -0.5px;
      width: 376px;
      height: 377px;
      background: url("@/assets/activity/recharge/reward/ruleBgBottom.png") no-repeat center center;
      background-size: 100% 100%;
      z-index: -2;
      pointer-events: none;
    }
    .reward-title {
      position: absolute;
      top: 22px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 27px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      line-height: 27px;
      text-align: center;
      background: linear-gradient(89.97deg, #ffd663 2.43%, #fffba2 50.3%, #ffc01e 98.17%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      filter: drop-shadow(0 2px 2px #320000fc);
    }
    .reward-box-content {
      width: 332px;
      height: 515px;
      position: absolute;
      top: 66px;
      left: 50%;
      transform: translateX(-50%);
      overflow-y: auto;
      overflow-x: hidden;
      &::-webkit-scrollbar {
        display: none;
      }
      .reward-box-banner {
        width: 305px;
        height: 100px;
        background: url("@/assets/activity/recharge/rank/banner.png") no-repeat top center;
        background-size: 100% 100%;
        margin: 0 auto 16px;
      }
      .reward-box-list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .reward-box-item {
          width: 100%;
          height: auto;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          &:last-child {
            margin-bottom: 0;
          }
          .item-title {
            width: 174px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family:
              DINAlternate, DINAlternate, PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
            font-weight: bold;
            font-size: 12px;
            line-height: 14px;
            text-align: center;
            background: url("@/assets/activity/recharge/topBg.png") no-repeat top center;
            background-size: 100% 100%;
            > span {
              background: linear-gradient(90deg, #ffe197 0%, #ffc636 100%);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
            }
          }
          .list {
            width: 100%;
            min-height: 109px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-wrap: wrap;
            margin-top: 16px;
            margin-bottom: 7px;
            gap: 4px;
            .item {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              width: 80px;
              min-height: 101px;
              .reward-img {
                width: 81px;
                height: 77px;
                margin-bottom: 2px;
                background: url("@/assets/activity/recharge/rewardBg.png") no-repeat top center;
                background-size: 100% 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                > .reward-img-box {
                  width: 60px;
                  height: 60px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  > img {
                    width: auto;
                    height: auto;
                    max-width: 100%;
                    max-height: 100%;
                  }
                }
              }
              .reward-text {
                width: 100%;
                min-height: 22px;
                text-align: center;
                font-family:
                  DINAlternate, DINAlternate, PingFang-SC, PingFang-SC, system-ui, Avenir, Helvetica, Arial, sans-serif;
                font-weight: bold;
                font-size: 11px;
                color: #fff0c0;
                line-height: 11px;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                overflow: hidden;
                // 覆盖 sanaAutoText 内置的 nowrap，允许换行（22px = 2 × 11px，最多两行）
                white-space: normal;
              }
            }
          }
        }
      }
    }
  }
}
</style>
