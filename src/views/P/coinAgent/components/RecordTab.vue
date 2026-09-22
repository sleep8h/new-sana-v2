<template>
  <div class="record-content">
    <div class="list" v-if="recordList.length !== 0">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :loading-text="t('common.loadingText')"
          :finished-text="t('common.finishedText')"
          @load="onLoad"
          class="record-list"
        >
          <!-- 遍历显示充值记录列表 -->
          <div v-for="(item, index) in recordList" :key="index" class="record-item">
            <div class="record-info">
              <!-- 用户昵称 -->
              <div class="record-nickname">{{ item.nick }}</div>
              <!-- 目标用户ID与交易时间 -->
              <div class="record-meta">{{ t("coinAgent.idLabel", { number: item.erbanNo }) }}</div>
              <div class="record-meta">{{ t("coinAgent.timeLabel", { time: formatTimestamp(item.createTime, 'YYYY-MM-DD HH:mm:ss') }) }}</div>
            </div>
            <div class="record-right">
              <!-- 交易金额，正数为绿色，负数为红色 -->
              <div class="record-amount" dir="ltr" :class="item.purpleDiamondNum < 0 ? 'positive' : 'negative'">
                {{ item.purpleDiamondNum < 0 ? '-' : '+' }}{{ formatNumber(item.purpleDiamondNum) || 0 }}
              </div>
              <!-- 可撤销时显示撤销按钮，否则显示已撤销文字 -->
              <div v-if="item.recordType === 1 && item.status === 1" class="cancel-btn" @click="showCancelDialog(item)">
                {{ t("coinAgent.cancelTrade") }}
              </div>
              <div v-else class="text-btn">{{ t("coinAgent.cancelled") }}</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 无数据时显示空状态 -->
    <div v-if="recordList.length === 0 && !loading" class="empty-state">{{ t("common.noData") }}</div>

    <!-- 弹窗：撤销交易确认 -->
    <div v-if="dialogType === 'cancel'" class="dialog-mask" @click.self="closeDialog">
      <div class="dialog-box">
        <div class="dialog-text" v-html="t('coinAgent.cancelConfirm', { amount: formatNumber(currentItem.purpleDiamondNum) })"></div>
        <div class="dialog-btns">
          <button class="dialog-btn cancel" @click="closeDialog">{{ t("common.cancel") }}</button>
          <button class="dialog-btn confirm" @click="confirmCancel">{{ t("common.ok") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { postForm } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import { formatTimestamp } from "@/utils/common.js";
// ==================== 依赖注入 ====================
const store = useMainStore();
const { t } = useI18n();

// ==================== 变量声明 ====================
// 充值记录列表
const recordList = ref([]);


// 每页条数
const pageSize = 10;

// 加载状态
const loading = ref(false);

// 是否已加载完所有数据
const finished = ref(false);

// 下拉刷新状态
const refreshing = ref(false);

// 当前弹窗类型：cancel（撤销确认）
const dialogType = ref("");

// 当前选中的记录项
const currentItem = ref({});

// ==================== 方法 ====================
/**
 * 格式化数字为千分位字符串
 * @param {number|string} num - 待格式化的数字
 * @returns {string} 格式化后的字符串，如 "1,000"
 */
const formatNumber = (num) => {
  if (!num && num !== 0) return "";
  const n = Number(String(num).replace(/,/g, ""));
  if (isNaN(n)) return "";
  return n.toLocaleString("en-US");
};

/**
 * 显示撤销交易确认弹窗
 * @param {Object} item - 选中的记录项
 */
const showCancelDialog = (item) => {
  currentItem.value = item;
  dialogType.value = "cancel";
};

/**
 * 关闭弹窗并清空当前选中项
 */
const closeDialog = () => {
  dialogType.value = "";
  currentItem.value = {};
};

// ==================== 接口调用 ====================
/**
 * 获取充值记录列表
 * @param {boolean} isRefresh - 是否刷新
 */
const fetchRecords = async (isRefresh = false) => {
  if (isRefresh) {
    finished.value = false;
  }
  try {
    const res = await postForm("/agency/record/list", {
      uid: store.uid,
      ticket: store.ticket,
      lastRecordId: recordList.value[recordList.value.length - 1]?.recordId || '',
      pageSize: pageSize,
    });
    if (res.code === 200) {
      const list = res.data?.list || [];
      if (isRefresh) {
        recordList.value = list;
      } else {
        recordList.value = recordList.value.concat(list);
      }
      // 如果返回数据不足一页，标记为已加载完
      if (res.data.whetherLastPage) {
        finished.value = true;
      }
    } else {
      showToast(res.message || t("common.requestFail"));
      finished.value = true;
    }
  } catch (e) {
    console.error(e);
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

/**
 * van-list 加载事件
 */
const onLoad = () => {
  fetchRecords();
};

/**
 * 下拉刷新事件
 */
const onRefresh = () => {
  recordList.value = [];
  fetchRecords(true);
  refreshing.value = false;
};

/**
 * 确认撤销交易，调用撤销接口
 * 成功后刷新记录列表
 */
const confirmCancel = async () => {
  try {
    const res = await postForm("/agency/gold/recharge/revoke", {
      uid: store.uid,
      ticket: store.ticket,
      recordId: currentItem.value.recordId,
    });
    if (res.code === 200) {
      dialogType.value = "";
      fetchRecords(true);
      showToast(t("coinAgent.cancelSuccess"));
    } else {
      showToast(res.message || t("common.requestFail"));
    }
  } catch (e) {
    console.error(e);
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  fetchRecords(true);
});
</script>

<style scoped lang="scss">
.record-content {
  width: 100%;
  height: 100%;
  .list{
    width: 351px;
    height: calc(100% - 61px);
    background: #FFFFFF;
    border-radius: 12px;
    margin: 0 auto;
    padding: 16px;
    box-sizing: border-box;
    overflow-y: auto;
    &::v-deep(.van-pull-refresh){
      height: 100%;
    }
    .record-list {
      width: 100%;
      .record-item {
        width: 319px;
        height: 93px;
        background: #F9FBFC;
        border-radius: 6px 6px 6px 6px;
        border: 1px solid #E8EAF2;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        margin: 0 auto 8px;
        &:first-child {
          margin-top: 12px;
        }
        .record-info {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          .record-nickname {
            font-size: 16px;
            font-weight: bold;
            color: #333;
          }
  
          .record-meta {
            font-weight: bold;
            font-size: 12px;
            color: #828282;
            margin-top: 2px;
          }
        }
  
        .record-right {
          .record-amount {
            font-weight: bold;
            font-size: 24px;
            text-align: center;
            &.positive {
              color: #219653;
            }
  
            &.negative {
              color: #EB5757;
            }
          }
  
          .cancel-btn {
            margin-top: 12px;
            min-width: 67px;
            padding: 0 22px;
            height: 22px;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #F2994A;
            font-weight: bold;
            font-size: 12px;
            color: #F2994A;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .text-btn{
            font-weight: 500;
            font-size: 12px;
            color: #828282;
          }
        }
      }
    }
  }
  .empty-state {
    width: 351px;
    height: calc(100% - 61px);
    background: #FFFFFF;
    border-radius: 12px 12px 12px 12px;
    margin: 0 auto;
    padding: 20px 16px;
    box-sizing: border-box;
    text-align: center;
    font-size: 14px;
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}


.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

  .dialog-box {
    width: 280px;
    background: #fff;
    border-radius: 12px;
    padding: 24px 20px;
    text-align: center;

    .dialog-text {
      font-size: 14px;
      color: #333;
      line-height: 1.6;
      margin-bottom: 20px;
      // &::v-deep(.uid){
      //   color:#219653;
      // }
      &::v-deep(.amount){
        color:#EB5757;
      }
    }

    .dialog-btns {
      display: flex;
      justify-content: center;
      gap: 12px;

      .dialog-btn {
        flex: 1;
        height: 40px;
        border-radius: 20px;
        font-size: 14px;
        border: none;
        cursor: pointer;

        &.cancel {
          background: #f5f6fa;
          color: #666;
        }

        &.confirm {
          background: #208cff;
          color: #fff;
        }
      }
    }
  }
}
</style>