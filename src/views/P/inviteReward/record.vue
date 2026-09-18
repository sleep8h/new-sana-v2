<template>
  <div class="record-container">
    <div class="nav-container">
      <navBar :isText="false" :rightLink="true" @onLeftClick="back" themeType="black">
        <template #center>{{ t("inviteRecord.inviteRecord") }}</template>
      </navBar>
    </div>
    <div class="scroll-container">
      <div class="record-modalbox" @scroll="getScrollRecord">
        <div class="record-list" v-if="recordList.length > 0" v-for="(item, index) in recordList" :key="index">
          <div class="record-item">
            <div class="record-left">
              <div class="list-taskname">{{ item.type || "Taskname" }}</div>
              <div class="list-info">
                <span class="list-info-sm">ID: {{ item.relatedId || 0 }}</span>
              </div>
            </div>
            <div class="record-right">
              <div class="record-right-top">
                <div class="icon-img"></div>
                <div class="point-num">{{ item.points || 0 }}</div>
              </div>
              <div class="record-right-bottom">
                {{ getTimeText(item.time || 0) }}
              </div>
            </div>
          </div>
        </div>
        <div class="record-empty" v-else>
          {{ t("inviteRecord.recordEmpty") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import navBar from "@/components/navBar/navBar.vue";
import { useRouter } from "vue-router";

import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { get } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

onMounted(() => {
  // 获取记录列表
  getRecordList();
});

const back = () => {
  router.back();
};

const recordList = ref([]);
const isLastpage = ref(false);
const pageNum = ref(1);
const getRecordList = async () => {
  try {
    const res = await get("/point/record", {
      uid: store.uid,
      ticket: store.ticket,
      appid: store.appid,
      appVersion: store.appVersion,
      deviceId: store.deviceId,
      language: store.language,
      os: store.os,
      page: pageNum.value,
      size: 20,
    });
    if (res.code == 200) {
      recordList.value = [...recordList.value, ...res.data.list] || [];
      isLastpage.value = res.data.whetherLastPage;
    } else {
      console.log("获取记录失败", res.message);
      recordList.value = [];
    }
  } catch (err) {
    console.log("获取记录失败", err);
    recordList.value = [];
  }
};

const getScrollRecord = (e) => {
  // console.log(e)
  // console.log(e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight)
  // 滚动到底部
  if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
    if (!isLastpage.value) {
      pageNum.value++;
      getRecordList();
    }
  }
};

const getTimeText = (time) => {
  // 显示日期格式为 yyyy-mm-dd
  const date = new Date(time);
  return date.toLocaleDateString();
};

// 随机数字工具：生成固定长度 n 的随机数字字符串（带前导0）
const randomDigits = (n = 2) => {
  const max = Math.pow(10, n);
  const num = Math.floor(Math.random() * max);
  return String(num).padStart(n, "0");
};

// 随机长度工具：生成 2~4 位随机数字字符串
const randomDigitsRandom = () => {
  const len = Math.floor(Math.random() * 3) + 2; // 2,3,4
  return randomDigits(len);
};
</script>

<style scoped lang="scss">
.record-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.nav-container {
  width: 100%;
  height: 56px;
  box-sizing: border-box;
  background: none;
  color: #fff;
}

.scroll-container {
  width: 100%;
  height: calc(100% - 56px);
}

.record-modalbox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #151515;
  padding: 0 24px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;

  .record-list {
    width: 100%;
    display: flex;
    border-bottom: 1px solid rgba(207, 208, 217, 0.3);

    .record-item {
      width: 100%;
      height: 64px;
      padding: 8px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .record-right {
      width: 35%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #151515;
      gap: 5px;

      .record-right-bottom {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }

      .record-right-top {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      .point-num {
        font-size: 16px;
        font-weight: 600;
      }

      .record-right-bottom {
        font-size: 12px;
        color: #9fa2b3;
      }

      .icon-img {
        width: 24px;
        height: 24px;
        background: url("@/assets/p/inviteRecord/star.png") no-repeat;
        background-size: 100% 100%;
        margin: 0 8px;
      }
    }

    .record-left {
      width: 65%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .list-taskname {
        width: 100%;
        font-size: 16px;
        font-weight: 600;
        color: #1e2531;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .list-info {
        width: 100%;
        display: flex;

        .list-info-sm {
          font-size: 12.8px;
          padding-top: 8px;
          color: #151515;
        }

        .list-info-sm:nth-child(1) {
          margin-right: 16px;
        }
      }
    }
  }

  .record-empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
