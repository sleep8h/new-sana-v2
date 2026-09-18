<template>
  <div class="management-record">
    <div class="title" :class="{ 'title-ar': store.language === 'ar' }">{{ $t("manageRecordReward.title") }}</div>
    <div class="select">
      <div class="select-show" @click="selectShow = !selectShow">
        <span>{{ kickTypeText }}</span>
        <img
          src="@/assets/p/managementRecord/icon.png"
          alt=""
          :class="{ 'arrow-icon': true, 'rotate-180': selectShow }"
        />
      </div>
      <div class="select-list" v-show="selectShow">
        <div
          v-for="(item, index) in typeList"
          :key="index"
          :class="[
            'select-item',
            { 'select-active': kickType === item.code, 'select-item-ar': store.language === 'ar' },
          ]"
          @click="selectChange(item)"
        >
          <span v-if="!item.code">{{ item.desc }}</span>
          <span v-else-if="store.language === 'ar'">{{ item.descAr }}</span>
          <span v-else-if="store.language === 'zh'">{{ item.desc }}</span>
          <span v-else>{{ item.descEn }}</span>
          <img v-if="kickType === item.code" src="@/assets/p/managementRecord/select.png" alt="" />
        </div>
      </div>
    </div>
    <div class="record-table">
      <div class="table" v-if="recordList.length > 0">
        <div class="table-header">
          <div class="table-tr" :class="{ 'table-tr-ar': store.language === 'ar' }">
            <div class="table-th">{{ $t("manageRecordReward.operator") }}</div>
            <div class="table-th">{{ $t("manageRecordReward.object") }}</div>
            <div class="table-th">{{ $t("manageRecordReward.type") }}</div>
            <div class="table-th">{{ $t("manageRecordReward.time") }}</div>
          </div>
        </div>
        <div class="table-tbody">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            :finished-text="finishedText"
            :loading-text="loadingText"
            @load="onLoad"
          >
            <div
              class="table-tr"
              :class="{ 'table-tr-ar': store.language === 'ar' }"
              v-for="(item, index) in recordList"
              :key="index"
            >
              <div class="table-td">{{ item.operatorErBanNo }}</div>
              <div class="table-td">{{ item.targetErBanNo }}</div>
              <div class="table-td">
                <span v-if="store.language === 'ar'">{{ item.kickTypeDescAr }}</span>
                <span v-else-if="store.language === 'zh'">{{ item.kickTypeDesc }}</span>
                <span v-else>{{ item.kickTypeDescEn }}</span>
              </div>
              <div class="table-td">{{ formatTimestamp(item.createTime) }}</div>
            </div>
          </van-list>
        </div>
      </div>
      <div class="empty" v-else>
        <img :src="emptyImg" alt="" />
        <span>{{ $t("manageRecordReward.noRecord") }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { formatTimestamp } from "@/utils/get-url-params.js";
import { useMainStore } from "@/pinia/index.js";
import navBar from "@/components/navBar/navBar.vue";

import emptyImg from "@/assets/p/managementRecord/empty.png";

const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const curTab = ref(2);
const tabList = ref([
  { text: t("task.day"), id: 2 },
  { text: t("task.week"), id: 3 },
  { text: t("task.month"), id: 4 },
]);
const typeList = ref([]);
const recordList = ref([]);
const selectShow = ref(false);
const kickType = ref(null);
const kickTypeText = ref(t("manageRecordReward.all"));
const lastId = ref(null);
const loading = ref(false);
const finished = ref(false);
const loadingText = ref(t("manageRecordReward.loadingText"));
const finishedText = ref(t("manageRecordReward.finishedText"));

const onLoad = async () => {
  loading.value = true;
  await getManagementList();
  loading.value = false;
};

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
 * 选择类型方法
 */
const selectChange = (item) => {
  kickType.value = item.code;
  if (store.language === "ar") {
    kickTypeText.value = item.descAr;
  } else if (store.language === "zh") {
    kickTypeText.value = item.desc;
  } else {
    kickTypeText.value = item.descEn;
  }
  selectShow.value = false;
  lastId.value = null;
  recordList.value = [];
  finished.value = false;
  getManagementList();
};

/**
 * 获取列表接口
 */
const getManagementList = async () => {
  console.log(store.roomId, "store");
  try {
    const res = await get("/room/blacklist/kickRecord/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      roomId: store.roomId || null,
      kickType: kickType.value || null,
      lastId: lastId.value || null,
      pageSize: 20,
    });
    if (res.code === 200) {
      console.log("获取管理记录列表:", res.data);
      let arr = res.data || [];
      if (arr.length < 20) {
        finished.value = true;
      } else {
        lastId.value = arr[arr.length - 1]?.id;
      }
      recordList.value = recordList.value.concat(arr) || [];
    } else {
      console.log("获取管理记录列表失败:", res.message);
    }
  } catch (e) {
    console.error(`获取管理记录列表时发生错误:`, e);
  }
};

/**
 * 获取类型列表
 */
const getTypeList = async () => {
  try {
    const res = await get("/room/blacklist/kickType/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res.code === 200) {
      console.log("获取类型列表:", res.data);
      typeList.value = res.data || [];
      typeList.value.unshift({
        code: null,
        desc: t("manageRecordReward.all"),
        descEn: t("manageRecordReward.all"),
        descAr: t("manageRecordReward.all"),
      });
      console.log(typeList.value, "typeList");
    } else {
      console.log("获取类型列表失败:", res.message);
    }
  } catch (e) {
    console.error(`获取类型列表时发生错误:`, e);
  }
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".select")) {
    if (!selectShow.value) {
      goBack();
    }
    // 检查点击是否在 .select 元素内
    selectShow.value = false;
  }
};

/**
 * 返回方法
 */
onMounted(async () => {
  await getTypeList();
  await getManagementList();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.management-record {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.8);
  padding: 16px 15px;
  .title {
    min-width: 64px;
    height: 23px;
    font-family:
      Source Han Sans,
      Source Han Sans;
    font-weight: 500;
    font-size: 16px;
    color: #ffffff;
    line-height: 23px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  .title-ar {
    text-align: right;
  }
  .select {
    width: 128px;
    height: 22px;
    margin-top: 10px;
    position: relative;
    .select-show {
      width: 128px;
      height: 22px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px 6px 6px 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        height: 19px;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 400;
        font-size: 13px;
        color: #ffffff;
        line-height: 19px;
      }
      > img {
        width: 10px;
        height: 10px;
      }
      @keyframes arrowDown {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(-180deg);
        }
      }

      @keyframes arrowUp {
        0% {
          transform: rotate(-180deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }

      .arrow-icon {
        &.rotate-180 {
          animation: arrowDown 0.3s forwards;
        }
        &:not(.rotate-180) {
          animation: arrowUp 0.3s forwards;
        }
      }
    }
    .select-list {
      position: absolute;
      top: 26px;
      width: 128px;
      height: 106px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 12px 12px 12px 12px;
      box-sizing: border-box;
      padding: 8px 6px 8px 12px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow-y: auto;
      .select-item {
        width: 100%;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 400;
        font-size: 13px;
        color: #ffffff;
        line-height: 20px;
        text-align: left;
        > img {
          width: 20px;
          height: 20px;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      .select-item-ar {
        text-align: right;
      }
    }
  }
  .record-table {
    margin-top: 20px;
    height: calc(100% - 87px);
    .table {
      width: 345px;
      height: 100%;
      border-collapse: collapse;
      border-radius: 6px 6px 6px 6px;
      border: 1px solid #6c6a6a;
      .table-header {
        height: 42px;
        .table-tr {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 42px;
          border-bottom: 1px solid #6c6a6a;
          .table-th {
            width: 25%;
            height: 42px;
            font-family:
              Source Han Sans,
              Source Han Sans;
            font-weight: 400;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.55);
            line-height: 19px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 5px;
            border-left: 1px solid #6c6a6a;
            box-sizing: border-box;
            &:nth-child(1) {
              border-left: 0;
            }
          }
        }
        .table-tr-ar {
          .table-th {
            &:nth-child(1) {
              border-left: 1px solid #6c6a6a;
            }
            &:nth-child(4) {
              border-left: 0;
            }
          }
        }
      }
      .table-tbody {
        height: calc(100% - 42px);
        overflow-y: auto;
        .table-tr {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 42px;
          .table-td {
            width: 25%;
            height: 42px;
            font-family:
              Source Han Sans,
              Source Han Sans;
            font-weight: bold;
            font-size: 12px;
            color: #ffffff;
            line-height: 17px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            padding: 0 5px;
            word-wrap: break-word; /* 长单词或URL强制换行 */
            overflow-wrap: break-word; /* 更现代的替代属性 */
            white-space: normal; /* 默认值，合并空格并自动换行 */
            border-bottom: 1px solid #6c6a6a;
            border-left: 1px solid #6c6a6a;
            &:nth-child(1) {
              border-left: 0;
            }
          }
        }
        .table-tr-ar {
          .table-td {
            &:nth-child(1) {
              border-left: 1px solid #6c6a6a;
            }
            &:nth-child(4) {
              border-left: 0;
            }
          }
        }
      }
    }
    .empty {
      width: 100%;
      margin-top: 46px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > img {
        width: 217px;
        height: 145px;
      }
      > span {
        margin-top: -8px;
        height: 22px;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: bold;
        font-size: 15px;
        color: #ffffff;
        line-height: 22px;
      }
    }
  }
}
</style>
