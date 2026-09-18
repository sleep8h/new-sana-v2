<template>
  <div 
    class="live-streaming-task-container" 
    :class="{'live-streaming-task-container-ar': store.language === 'ar'}"
  >
    <div class="nav-container">
      <img class="return-btn" @click="goBack" src="@/assets/p/liveStreamingTask/return.png"></img>
      <div class="nav-title">{{ t("liveStreamingTask.title") }}</div>
    </div>
    <div class="tab-container">
      <div class="tab-item" :class="{ active: activeTab === 'task' }" @click="activeTab = 'task'">{{ t("liveStreamingTask.taskTab") }}</div>
      <div class="tab-item" :class="{ active: activeTab === 'dataDetail' }" @click="switchToDataDetail">{{ t("liveStreamingTask.dataDetailTab") }}</div>
    </div>
    <div class="content-container">
      <div class="task-content" v-show="activeTab === 'task'">
        <div class="anchor-info">
          <div class="info-list">
            <div class="info-item">
              <div class="title">{{ t("liveStreamingTask.thisWeekIncome") }}</div>
              <div class="value">{{ anchorInfo.currentWeekIncome }}</div>
            </div>
            <div class="info-item">
              <div class="title">{{ t("liveStreamingTask.lastWeekIncome") }}</div>
              <div class="value">{{ anchorInfo.lastWeekIncome }}</div>
            </div>
            <div class="info-item">
              <div class="title">{{ t("liveStreamingTask.thisWeekActiveDays") }}</div>
              <div class="value">{{ `${anchorInfo.currentWeekActiveDays}D` }}</div>
            </div>
            <div class="info-item">
              <div class="title">{{ t("liveStreamingTask.lastWeekActiveDays") }}</div>
              <div class="value">{{ `${anchorInfo.lastWeekActiveDays}D` }}</div>
            </div>
          </div>
          <div class="tip">{{ t("liveStreamingTask.tip") }}</div>
        </div>
        <div class="reward-list">
          <div class="reward-title">{{ t("liveStreamingTask.rewardTitle") }}</div>
          <div class="table">
            <div class="thead">
              <div class="tr">
                <div class="th"></div>
                <div class="th">{{ t("liveStreamingTask.liveIncome") }}</div>
                <div class="th">{{ t("liveStreamingTask.activeDays") }}</div>
                <div class="th">{{ t("liveStreamingTask.diamondReward") }}</div>
              </div>
            </div>
            <div class="tbody">
              <div class="tr" v-for="(item, index) in reversedRewardRules" :key="index">
                <div class="td">{{ index + 1 }}</div>
                <div class="td">{{ item.minIncome || "" }}</div>
                <div class="td">{{ item.activeDaysRequired || "" }}</div>
                <div class="td">{{ item.rewardDiamonds || "" }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-detail-content" v-show="activeTab === 'dataDetail'">
        <div class="reward-list data-detail-list">
          <div class="reward-title">{{ t("liveStreamingTask.dataDetailTitle") }}</div>
          <div class="table">
            <div class="thead">
              <div class="tr">
                <div class="th">{{ t("liveStreamingTask.date") }}</div>
                <div class="th">{{ t("liveStreamingTask.duration") }}</div>
                <div class="th">{{ t("liveStreamingTask.income") }}</div>
              </div>
            </div>
            <div class="tbody">
              <div class="tr" v-for="(item, index) in reversedDailyIncome" :key="index">
                <div class="td">{{ item.date ? item.date.slice(0, 10) : item.date }}</div>
                <div class="td">{{ formatDuration(item.durationMinutes) }}</div>
                <div class="td">{{ item.incomeDiamonds }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

const store = useMainStore();
const router = useRouter();
const { t } = useI18n();
const anchorInfo = ref({});
const activeTab = ref("task");
const dailyIncomeList = ref([]);
/**
 * 返回方法
 */
const goBack = () => {
  if (store.os === "android") {
    WebViewJavascriptBridge.backToFront(null, null);
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.backToFront.postMessage(null);
  } else {
    console.error("未知平台，无法返回");
  }
};

/**
 * 获取主播信息接口
 */
const getAnchorInfo = async () => {
   try {
    const res = await postFormData("/anchor/info", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res.code === 200) {
      console.log("获取主播信息:", res.data);
      anchorInfo.value = res.data || {};
    } else {
      console.log("获取主播信息失败:", res.message);
    }
  } catch (e) {
    console.error(`获取主播信息时发生错误:`, e);
  }
};

/**
 * 获取每日收入数据接口
 */
const getDailyIncome = async (startDate, endDate) => {
  try {
    const res = await postFormData("/anchor/daily/income", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      startDate,
      endDate,
    });
    if (res.code === 200) {
      console.log("获取每日收入数据:", res.data);
      dailyIncomeList.value = res.data || [];
    } else {
      console.log("获取每日收入数据失败:", res.message);
    }
  } catch (e) {
    console.error(`获取每日收入数据时发生错误:`, e);
  }
};

/**
 * 切换到数据详情Tab
 */
const switchToDataDetail = async () => {
  activeTab.value = "dataDetail";
  if (dailyIncomeList.value.length === 0) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    await getDailyIncome(formatDate(startDate), formatDate(endDate));
  }
};

const reversedRewardRules = computed(() => {
  const rules = anchorInfo.value?.rewardRules || [];
  return Array.isArray(rules) ? rules.slice().reverse() : [];
});

const reversedDailyIncome = computed(() => {
  return Array.isArray(dailyIncomeList.value) ? dailyIncomeList.value.slice().reverse() : [];
});

const formatDuration = (minutes) => {
  if (!minutes || minutes === 0) return t("liveStreamingTask.hourMin", { hour: 0, min: 0 });
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return t("liveStreamingTask.hourMin", { hour: h, min: m });
};

onMounted(async () => {
  await getAnchorInfo();
});


</script>

<style scoped lang="scss">
.live-streaming-task-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: #fff;
  overflow-y: auto;
  box-sizing: border-box;
  padding-block-start: 44px;
  background: #151822;
  font-family: Source Han Sans, Source Han Sans;
  .nav-container {
    position: fixed;
    top: 0;
    inset-inline-start: 0;
    z-index: 999;
    width: 100%;
    height: 44px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #151822;
    .return-btn{
      position: absolute;
      left: 12px;
      width: 20px;
      height: 20px;
    }
    .nav-title{
      font-family: Source Han Sans, Source Han Sans;
      font-size: 18px;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 26px;
      text-align: center;
    }
  }
  .tab-container {
    width: 345px;
    margin: 16px auto 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .tab-item {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.5);
      line-height: 22px;
      text-align: center;
      margin-inline-end: 24px;
      padding-block-end: 8px;
      cursor: pointer;
      &.active {
        color: #FFFFFF;
        font-weight: bold;
        border-block-end: 2px solid #208CFF;
      }
    }
  }
  .content-container {
    width: 100%;
    flex: 1;
    overflow-y: auto;
  }
  .task-content {
    width: 100%;
  }
  .data-detail-content {
    width: 100%;
    margin-block-start: 16px;
    .data-detail-list {
      .table {
        .thead {
          .tr {
            .th {
              width: 33.33% !important;
              &:last-child {
                border-inline-end: none;
              }
            }
          }
        }
        .tbody {
          .tr {
            .td {
              width: 33.33% !important;
              color: #FFFFFF !important;
              &:last-child {
                border-inline-end: none;
              }
            }
          }
        }
      }
    }
  }
  .anchor-info{
    width: 345px;
    background: #24252F;
    border-radius: 14px 14px 14px 14px;
    padding: 18px 12px 16px 12px;
    margin: 16px auto 14px;
    .info-list{
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      .info-item{
        margin-block-end: 12px;
        &:nth-child(1),
        &:nth-child(3){
          width: 165px;
          margin-inline-end: 12px;
          margin-block-end: 0;
          box-sizing: border-box;
          padding-inline-start: 12px;
        }
        &:nth-child(2),
        &:nth-child(4){
          width: 140px;
          margin-block-end: 0;
          box-sizing: border-box;
          padding-inline-start: 12px;
        }
        &:nth-child(3),
        &:nth-child(4){
          margin-block-start: 18px;
          margin-block-end: 12px;
        }
        .title{
          min-height: 17px;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          line-height: 17px;
          text-align: start;
          font-style: normal;
          text-transform: none;
        }
        .value{
          min-height: 29px;
          font-weight: bold;
          font-size: 20px;
          color: #FFFFFF;
          line-height: 29px;
          text-align: start;
        }
      }
    }
    .tip{
      width: 100%;
      min-height: 17px;
      font-size: 12px;
      color: #E2AD32;
      line-height: 17px;
      text-align: start;
    }
  }
  .reward-list{
    width: 345px;
    background: #24252F;
    border-radius: 14px 14px 14px 14px;
    box-sizing: border-box;
    padding: 14px 12px 20px 12px;
    margin: 0 auto 40px;
    .reward-title{
      width: 100%;
      min-height: 22px;
      font-weight: bold;
      font-size: 15px;
      color: #FFFFFF;
      line-height: 22px;
      text-align: start;
      margin-block-end: 18px;
    }
    .table{
      width: 100%;
      min-height: 42px;
      border-radius: 6px;
      border: 1px solid #3D3E47;
      .thead{
        height: 42px;
        .tr{
          width: 100%;
          height: 42px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .th{
            font-size: 12px;
            color: rgba(255,255,255,0.55);
            line-height: 17px;
            text-align: center;
            border-inline-end: 1px solid #3D3E47;
            border-block-end: 1px solid #3D3E47;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            &:nth-child(1){
              width: 47px;
            }
            &:nth-child(2){
              width: 91px;
            }
            &:nth-child(3){
              width: 90px;
            }
            &:nth-child(4){
              width: 117px;
              border-inline-end: none;
            }
          }
        }
      }
      .tbody{
        min-height: 42px;
        .tr{
          width: 100%;
          height: 42px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          border-block-end: 1px solid #3D3E47;
          &:last-child{
            border-block-end: none;
          }
          .td{
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 13px;
            color: #FFFFFF;
            line-height: 19px;
            text-align: center;
            border-inline-end: 1px solid #3D3E47;
            &:nth-child(1){
              width: 47px;
            }
            &:nth-child(2){
              width: 91px;
            }
            &:nth-child(3){
              width: 90px;
            }
            &:nth-child(4){
              width: 117px;
              border-inline-end: none;
              color: #208CFF;
            }
          }
        }
      }

    }
  }
}
</style>