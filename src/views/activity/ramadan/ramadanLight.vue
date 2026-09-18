<!-- 斋月灯 -->
<template>
  <div class="ramadan-light">
    <div class="lamp">
      <div class="title">
        <span>{{ $t("ramadan.ramadanLight") }}</span>
      </div>
      <div class="text">{{ $t("ramadan.lampText") }}</div>
      <div class="my-new-moon">{{ $t("ramadan.myNewMoon", { number: signModule.moonBalance }) }}</div>
      <div class="line" :class="{ 'line-ar': store.language === 'ar' }">
        <div class="line-bg">
          <div class="line-bg-cur" :style="`height: ${heightFn()}`">
            <div class="line-bg-show"></div>
          </div>
        </div>
        <div class="lv">
          <div class="item" v-for="(item, index) in lampList" :key="index">
            <div class="lv-img">
              <span>{{ `Lv${item.lampLevel}` }}</span>
            </div>
            <div class="lv-number">
              <img src="@/assets/activity/ramadan/light/bg_line_item.png" alt="" />
              <span>{{ item.moonNumber }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="lamp-gift-list" :class="{ 'lamp-gift-list-ar': store.language === 'ar' }">
        <div class="list" v-for="(item, index) in lampGiftList" :key="index">
          <div class="item" v-for="(items, indexs) in item" :key="indexs">
            <div class="gift-img">
              <img :src="items.rewardUrl" alt="" />
            </div>
            <!-- <div class="gift-name">{{ `${items.rewardName}*${items.rewardValue}` }}</div> -->
            <sanaAutoText class="gift-name" :key="new Date().getTime()" v-if="items.rewardName">
              {{ `${items.rewardName}*${items.rewardValue}` }}
            </sanaAutoText>
          </div>
        </div>
      </div>
      <div class="hall-of-fame" @click="hallOfFameFn">
        <div class="left">
          <div class="avatar-list">
            <div
              class="avatar"
              v-for="(item, index) in lampFullUsers.length === 0 ? 3 : lampFullUsers.slice(0, 3)"
              :key="index"
            >
              <img :src="item.avatar" alt="" />
            </div>
          </div>
          <div class="desc">{{ $t("ramadan.hallOfFame") }}</div>
        </div>
        <img src="@/assets/activity/ramadan/light/lamp-right.png" alt="" class="right-icon" />
      </div>
    </div>
    <div class="task">
      <div class="title">
        <span>{{ $t("ramadan.task") }}</span>
      </div>
      <div class="task-list">
        <div class="item" v-for="(item, index) in taskVOList" :key="index">
          <div class="sub-title-number">
            <div class="sub-title" :class="{ 'sub-title-ar': store.language === 'ar' }">
              {{ `${store.language === "ar" ? item.descAr : item.descEn}` }}
            </div>
            <div class="number">
              <img src="@/assets/activity/ramadan/light/bg_line_item.png" alt="" />
              <span>{{ item.exp }}</span>
            </div>
          </div>
          <div class="task-progress">{{ `${item.finishProcess}/${item.process}` }}</div>
        </div>
      </div>
    </div>
    <tipToast v-model:isShow="tipShow" :content="$t('ramadan.hallOfFameTip')" @close="tipShow = false" />
    <hallOfFame v-model:isShow="hallOfFameShow" @close="hallOfFameShow = false" :list="lampFullUsers" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import "swiper/swiper-bundle.css";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import tipToast from "@/views/activity/ramadan/components/tipToast.vue";
import hallOfFame from "@/views/activity/ramadan/components/hallOfFame.vue";
// 定义emit
const emit = defineEmits(["timeChange"]);

const { t } = useI18n();
const store = useMainStore();
const signModule = ref({});
const lampList = ref([
  { lampLevel: 8, moonNumber: 1500 },
  { lampLevel: 7, moonNumber: 1000 },
  { lampLevel: 6, moonNumber: 700 },
  { lampLevel: 5, moonNumber: 500 },
  { lampLevel: 4, moonNumber: 300 },
  { lampLevel: 3, moonNumber: 200 },
  { lampLevel: 2, moonNumber: 100 },
  { lampLevel: 1, moonNumber: 30 },
]);
const taskVOList = ref([]);
const lampGiftList = ref([]);
const curTab = ref(1);
const tipShow = ref(false);
const hallOfFameShow = ref(false);
const lampFullUsers = ref([]);

const hallOfFameFn = () => {
  if (lampFullUsers.value.length === 0) {
    tipShow.value = true;
  } else {
    hallOfFameShow.value = true;
  }
};

// 获取任务数据
const getTaskList = async () => {
  try {
    const res = await postFormData("/h5doings/activity/ramadan2026/list", {
      uid: store.uid,
      size: 20,
      type: curTab.value,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      console.log(res, "res");
      signModule.value = res.data.signModule;
      taskVOList.value = res.data.taskVOList;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取斋月灯奖励列表
const getRamadan2026rankRewards = async () => {
  try {
    const res = await get("/h5doings/activity/ramadan2026/rankRewards", {
      uid: store.uid,
      groupType: 2,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      console.log(res.data, "res");
      const obj = res.data;
      const keys = Object.keys(obj);
      const values = Object.values(obj);
      lampGiftList.value = values.reverse();
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取活动数据
const getActivityRamadan2026List = async () => {
  try {
    const res = await postFormData("/h5doings/activity/ramadan2026/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      lampFullUsers.value = res.data.lampFullUsers;
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

const heightFn = () => {
  // lv8 + = 98% 1205px   100% 1230
  if (signModule.value.moonBalance >= 1500) return "98%";
  if (signModule.value.moonBalance >= 1000) {
    return ((signModule.value.moonBalance - 1000) / (1500 - 1000)) * 149 + 71.5 + 149 * 6 + "px";
  }
  if (signModule.value.moonBalance >= 700) {
    return ((signModule.value.moonBalance - 700) / (1000 - 700)) * 149 + 71.5 + 149 * 5 + "px";
  }
  if (signModule.value.moonBalance >= 500) {
    return ((signModule.value.moonBalance - 500) / (700 - 500)) * 149 + 71.5 + 149 * 4 + "px";
  }
  if (signModule.value.moonBalance >= 300) {
    return ((signModule.value.moonBalance - 300) / (500 - 300)) * 149 + 71.5 + 149 * 3 + "px";
  }
  if (signModule.value.moonBalance >= 200) {
    return ((signModule.value.moonBalance - 200) / (300 - 200)) * 149 + 71.5 + 149 * 2 + "px";
  }
  if (signModule.value.moonBalance >= 100) {
    return ((signModule.value.moonBalance - 100) / (200 - 100)) * 149 + 71.5 + 149 * 1 + "px";
  }
  if (signModule.value.moonBalance >= 30) {
    return ((signModule.value.moonBalance - 30) / (100 - 30)) * 149 + 71.5 * 1 + "px";
  }
  if (signModule.value.moonBalance < 30) {
    return (signModule.value.moonBalance / 30) * 71.5 + "px";
  }
};

onMounted(() => {
  getTaskList();
  getRamadan2026rankRewards();
  getActivityRamadan2026List();
});
</script>

<style lang="scss" scoped>
.ramadan-light {
  width: 100%;
  height: 2263px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  .lamp {
    width: 100%;
    height: 1564px;
    box-sizing: border-box;
    padding-top: 40px;
    background: url("@/assets/activity/ramadan/light/bg_lamp.png") no-repeat bottom center;
    background-size: 100% 1542px;
    margin-bottom: 15px;
    position: relative;
    .title {
      margin-top: -22px;
    }
    .text {
      width: 298px;
      height: 120px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #fff099;
      line-height: 20px;
      text-align: center;
      margin-top: 5px;
    }
    .my-new-moon {
      position: absolute;
      top: 289px;
      left: 50%;
      transform: translateX(-50%);
      min-width: 185px;
      height: 34px;
      background: linear-gradient(180deg, #00461f 0%, #006729 100%);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
      border-radius: 13px;
      border: 1px solid #65b050;
      font-family:
        PingFangSC,
        PingFang SC;
      font-size: 14px;
      color: #ffef74;
      line-height: 20px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .line {
      width: 64px;
      height: 1230px;
      position: absolute;
      top: 291px;
      left: 15px;
      .line-bg {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 34px;
        height: 1230px;
        background: url("@/assets/activity/ramadan/light/bg_line.png") no-repeat center center;
        background-size: cover;
        .line-bg-cur {
          position: absolute;
          z-index: 2;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          overflow: hidden;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          .line-bg-show {
            width: 14px;
            height: 1200px;
            background: url("@/assets/activity/ramadan/light/bg_line_show.png") no-repeat bottom center;
            background-size: 100% 100%;
          }
        }
      }
      .lv {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
        width: 64px;
        height: 1230px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .item {
          width: 64px;
          height: 75px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 74px;
          flex-shrink: 0;
          &:nth-child(1) {
            margin-top: 68px;
          }
          .lv-img {
            width: 62px;
            height: 62px;
            background: url("@/assets/activity/ramadan/light/bg_line_lv.png") no-repeat center center;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            > span {
              font-weight: 600;
              font-size: 16px;
              color: #ffffff;
              line-height: 22px;
              text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
              font-family:
                PingFangSC,
                PingFang SC;
              text-align: center;
              text-shadow:
                1px 1px 0px #045f34,
                -1px -1px 0px #045f34,
                -1px 1px 0px #045f34,
                1px -1px 0px #045f34;
            }
          }
          .lv-number {
            margin-top: -9px;
            width: 64px;
            height: 22px;
            background: url("@/assets/activity/ramadan/light/bg_lamp_lv.png") no-repeat center center;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            > img {
              width: 16px;
              height: 16px;
              margin-right: 2px;
            }
            > span {
              width: 21px;
              height: 18px;
              font-family:
                PingFangSC,
                PingFang SC;
              font-weight: 500;
              font-size: 13px;
              text-align: center;
              color: #ffffff;
              line-height: 18px;
              text-shadow:
                1px 1px 0px #704405,
                -1px -1px 0px #704405,
                -1px 1px 0px #704405,
                1px -1px 0px #704405;
            }
          }
        }
      }
    }
    .line-ar {
      left: unset;
      right: 15px;
    }
    .lamp-gift-list {
      width: 250px;
      height: 1230px;
      position: absolute;
      top: 291px;
      left: 110px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 250px;
        height: 117px;
        margin-bottom: 32px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        &:nth-child(1) {
          margin-top: 51px;
        }
        &:last-child {
          margin-bottom: 0;
        }
        .item {
          margin-right: 17px;
          width: 95px;
          height: 117px;
          .gift-img {
            width: 95px;
            height: 95px;
            background: url("@/assets/activity/ramadan/light/bg_lamp_item.png") no-repeat bottom center;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            > img {
              width: 70px;
              height: 70px;
            }
          }
          .gift-name {
            margin-top: 4px;
            width: 95px;
            height: 18px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 500;
            font-size: 12px;
            color: #fff099;
            line-height: 18px;
            text-align: center;
            white-space: nowrap;
          }
        }
      }
    }
    .lamp-gift-list-ar {
      left: unset;
      right: 110px;
      .list {
        .item {
          margin-right: unset;
          margin-left: 17px;
        }
      }
    }
    .hall-of-fame {
      position: absolute;
      top: 214px;
      right: 14px;
      width: 130px;
      height: 64px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: url("@/assets/activity/ramadan/light/bg_lamp_rank.png") no-repeat bottom center;
      background-size: cover;
      .left {
        width: 102px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .avatar-list {
          width: 100%;
          height: 26px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding: 0 7px 0 23px;
          .avatar {
            position: relative;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            overflow: hidden;
            border: 1px solid #c7b957;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2;
            margin-left: -5px;
            background: #c7b957;
            > img {
              width: 26px;
            }
          }
        }
        > .desc {
          margin-top: 4px;
          height: 14px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 400;
          font-size: 12px;
          color: #ffec70;
          line-height: 14px;
          text-align: center;
          font-style: normal;
        }
      }
      .right-icon {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }
    }
  }
  .task {
    width: 100%;
    height: 682px;
    box-sizing: border-box;
    padding-top: 40px;
    background: url("@/assets/activity/ramadan/light/bg_task.png") no-repeat bottom center;
    background-size: 100% 642px;
    .task-list {
      width: 333px;
      height: 540px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      overflow-y: auto;
      margin-top: 8px;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 333px;
        height: 85px;
        background: url("@/assets/activity/ramadan/light/bg_task_item.png") no-repeat bottom center;
        background-size: cover;
        flex-shrink: 0;
        box-sizing: border-box;
        padding: 12px 14px 12px 20px;
        margin-bottom: 4px;
        .sub-title-number {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          .sub-title {
            width: 193px;
            height: 40px;
            font-family:
              PingFangSC,
              PingFang SC;
            font-weight: 600;
            font-size: 14px;
            color: #ffdd17;
            line-height: 20px;
            text-align: left;
            font-style: normal;
          }
          .sub-title-ar {
            text-align: right;
          }

          .number {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            > img {
              width: 16px;
              height: 16px;
            }
            > span {
              width: 23px;
              height: 18px;
              font-family:
                PingFangSC,
                PingFang SC;
              font-weight: 500;
              font-size: 14px;
              color: #ffffff;
              line-height: 18px;
              text-align: left;
              font-style: normal;
            }
          }
        }
        .task-progress {
          width: 51px;
          height: 20px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 600;
          font-size: 14px;
          color: #ffee8e;
          line-height: 20px;
          text-align: center;
          font-style: normal;
        }
      }
    }
  }
  // 标题
  .lamp,
  .task {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    > .title {
      width: 100%;
      height: 94px;
      margin-top: -40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("@/assets/activity/ramadan/sign_reward_title.png") no-repeat bottom center;
      background-size: cover;
      > span {
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 600;
        font-size: 16px;
        color: #ffe638;
        line-height: 22px;
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
        text-align: center;
      }
    }
  }
}
</style>
