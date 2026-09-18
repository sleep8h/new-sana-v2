<template>
  <div class="task-container">
    <div class="nav-container">
      <!-- <navBar :isText="false" :rightLink="true" :themeType="'black'" @onLeftClick="goBack">
        <template #center>{{ t("task.title") }}</template>
      </navBar> -->
      <img class="return-btn" @click="goBack" src="@/assets/p/task/return.png"></img>
      <div class="nav-title">{{ t("task.title") }}</div>
    </div>
    <div class="tabs">
      <div class="tab-list">
        <div 
          :class="['tab-item', { 'tab-item-show': curTab === item.id }]" 
          @click="changeTab(item.id)"
          v-for="(item, index) in tabList"
          :key="index">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list-item" v-for="(item, index) in list" :key="index">
          <div class="item-left">
            <img :src="iconMap(item.id)" alt="">
          </div>
          <div class="item-info">
            <div class="item-title" v-if="store.language === 'ar'">{{ item.descAr }}</div>
            <div class="item-title" v-else>{{ item.descEn }}</div>
            <div class="item-desc">
              <img class="gold-icon" src="@/assets/p/task/gold-icon.png"></img>
              <div class="desc">{{ item.exp }}</div>
            </div>
          </div>
          <div class="item-right">
            <div class="task-desc" v-if="item.process > 1">{{ `(${item.finishProcess}/${item.process})` }}</div>
            <div 
              v-if="item.id === 201 && (item.buttonState === 0 || item.buttonState === 1)"
              class="pay-btn" 
              @click="debouncedGetTaskPay(item.id, item.buttonState)">
              {{ item.buttonState === 0 ? t("task.signIn") : t("task.getReward") }}
            </div>
            <div 
              v-else
              :class="['pay-btn', { 'pay-btn-disabled': item.buttonState !== 1 }]" 
              @click="debouncedGetTaskPay(item.id, item.buttonState)">
              {{ item.buttonState === 1 ? t("task.getReward") : item.buttonState === 0 ? t("task.notCompleted") : t("task.alreadyClaimed") }}
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { debounce } from "@/utils/get-url-params.js";
import { useMainStore } from "@/pinia/index.js";
import navBar from "@/components/navBar/navBar.vue";

import calendar from "@/assets/p/task/calendar.png";
import game from "@/assets/p/task/game.png";
import wallet from "@/assets/p/task/wallet.png";
import gold from "@/assets/p/task/gold.png";
import gift from "@/assets/p/task/gift.png";
import multiple50 from "@/assets/p/task/multiple50.png";
import multiple100 from "@/assets/p/task/multiple100.png";
import multiple200 from "@/assets/p/task/multiple200.png";
import multiple250 from "@/assets/p/task/multiple250.png";
import cp from "@/assets/p/task/cp.png";
import handshake from "@/assets/p/task/handshake.png";
import diamond from "@/assets/p/task/diamond.png";
import user from "@/assets/p/task/user.png";

const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const curTab = ref(2);
const tabList = ref([
  { text: t("task.day"), id:2  },
  { text: t("task.week"), id:3 },
  { text: t("task.month"), id:4 },
]);
const taskList = ref([]);
const list = computed(() => {
  return taskList.value.filter(item => item.type === curTab.value).sort((a, b) => {
    if (a.buttonState === 2 && b.buttonState !== 2) return 1;  // 2 排在后面
    if (a.buttonState !== 2 && b.buttonState === 2) return -1; // 非2 排在前面
    return 0; // 0和1 保持原顺序
  });
});

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
 * 切换tab
 */
const changeTab = (id) => {
  curTab.value = id;
};

/**
 * 获取图标
 */
const iconMap = (id) => {
  const map = {
    201: calendar,
    202: game,
    203: wallet,
    204: gold,
    205: gift,
    206: gift,

    301: game,
    302: gift,
    303: multiple50,
    304: multiple100,
    305: multiple200,
    306: multiple250,
    307: gold,

    401: cp,
    402: handshake,
    403: diamond,
    404: game,
    405: game,
    406: game,
    407: gift,
    408: user,
    409: gold,
  };
  return map[id] || "";
};


/**
 * 获取列表接口
 */
const getTaskList = async () => {
   try {
    const res = await postFormData("/h5doings/activity/task/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res.code === 200) {
      console.log("获取任务列表:", res.data);
      taskList.value = res.data.taskVOList || [];
    } else {
      console.log("获取任务列表失败:", res.message);
    }
  } catch (e) {
    console.error(`获取任务列表时发生错误:`, e);
  }
};

/**
 * 领取接口
 */
const getTaskPay = async (id, buttonState) => {
  if (id === 201 && (buttonState === 0 || buttonState === 1)) {
    await openSign();
    return;
  }
  if (buttonState !== 1) {
    return;
  }
   try {
    const res = await postFormData("/h5doings/activity/task/pay", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      type: '1',
      id: id,
    });
    if (res.code === 200) {
      await getTaskList();
    } else {
      console.log("领取任务失败:", res.message);
    }
  } catch (e) {
    console.error(`领取任务时发生错误:`, e);
  }
};

const debouncedGetTaskPay = debounce(getTaskPay, 500, true);

/**
 * 打开签到（调用客户端）
 */
const openSign = async () => {
  console.log("尝试打开签到界面");
  if (store.os === "android") {
    // window.WebViewJavascriptBridge.callHandler("showSignInDialog", null, function(response){
    //   console.log(response, '回调结果');
    //   openSignCallBack(response);
    // });
    WebViewJavascriptBridge.showSignInDialog(null, function(response){
      console.log(response, '回调结果');
      openSignCallBack(response);
    });
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.showSignInDialog.postMessage(function(response){
      console.log(response, '回调结果');
      openSignCallBack(response);
    });
  } else {
    console.error("未知平台，无法打开签到");
  }
};

const openSignCallBack = async (response) => {
  console.log('客户端返回数据:', response);
  await getTaskList();
  console.log('重新调用列表接口结束')
  // console.log('Native 的返回数据:', response);
  // let data = JSON.parse(JSON.stringify(response));
  // if (data.code === 200) {
  //   await getTaskList();
  // } else {
  //   console.log("签到失败:", data.message);
  // }
};

window.openSignCallBack = openSignCallBack;

/**
 * 返回方法
 */
onMounted(async () => {
  await getTaskList();
  const sign = taskList.value.find(item => item.id === 201 && item.buttonState === 0);
  if(sign){
    await openSign();
  }
});


</script>

<style scoped lang="scss">
.task-container {
  width: 100%;
  height: 100vh;
  background: #f6f7f9;
  display: flex;
  flex-direction: column;
  color: #fff;
  overflow-y: auto;
  box-sizing: border-box;
  padding-top: 88px;
  .nav-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 88px;
    boxsizing: border-box;
    padding-top: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    /* background-image: url("@/assets/p/closeFriendsRules/bg-top.png");
    background-size: cover; */
    .return-btn{
      position: absolute;
      left: 12px;
      width: 20px;
      height: 20px;
    }
    .nav-title{
      font-size: 18px;
      font-weight: bold;
      color: #333333;
    }
  }
  .tabs{
    width: 100%;
    height: 68px;
    box-sizing: border-box;
    padding: 18px 15px 17px 15px;
    .tab-list {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
      height: 33px;
      .tab-item{
        width: 33.3%;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        color: rgba(51, 51, 51, 0.50);
      }
      .tab-item-show{
        color: #222222;
      }
    }
  }
  .list{
    width: 100%;
    height: calc(100% - 68px);
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    padding: 0 15px;
    .list-item{
      width: 345px;
      height: 78px;
      background: #FFFFFF;
      border-radius: 14px;
      box-sizing: border-box;
      padding: 17px 14px;
      margin-bottom: 12px;
      display: flex;
      jcustify-content: flex-start;
      align-items: center;
      .item-left{
        width: 44px;
        height: 44px;
        border-radius: 50%;
        overflow: hidden;
        >img{
          width: 44px;
        }
      }
      .item-info{
        width: 195px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin-left: 10px;
        .item-title{
          font-size: 14px;
          font-weight: bold;
          color: #333333;
          width: 195px;
          min-height: 20px;
          line-height: 20px;
          text-align: left;
        }
        .item-desc{
          margin-top: 3px;
          height: 18px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .gold-icon{
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }
          .desc{
            font-weight: 400;
            font-size: 12px;
            color: #999999;
            line-height: 18px;
            text-align: left;
          }
        }
      }
      .item-right{
        display: flex;
        flex-direction: column;
        .task-desc{
          width: 68px;
          min-height: 16px;
          font-size: 11px;
          color: #666666;
          line-height: 16px;
          text-align: center;
          word-wrap: break-word;  /* 长单词或URL强制换行 */
          overflow-wrap: break-word; /* 更现代的替代属性 */
          white-space: normal;    /* 默认值，合并空格并自动换行 */
          margin-bottom: 4px;
        }
        .pay-btn{
          width: 68px;
          height: 26px;
          background: #00DBB3;
          border-radius: 16px;
          font-weight: bold;
          font-size: 12px;
          color: #FFFFFF;
          line-height: 12px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .pay-btn-disabled{
          width: 68px;
          height: 26px;
          background: #F4F4F6;
          border-radius: 16px;
          color: #999999;
        }
      }
    }
  }
}
</style>
