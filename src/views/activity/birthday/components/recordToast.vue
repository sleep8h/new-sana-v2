<!-- 记录弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title">{{ t("birthday.recordTitle") }}</div>

      <!-- Tab 切换 -->
      <div class="tab-list">
        <div
          :class="['tab-item', { 'tab-active': curTab === item.value }]"
          @click="tabChange(item.value)"
          v-for="(item, index) in tabList"
          :key="index"
        >
          {{ item.text }}
        </div>
      </div>

      <!-- 表格头部 -->
      <div class="table-header">
        <div class="th">{{ tableHeaders[0] }}</div>
        <div class="th">{{ tableHeaders[1] }}</div>
        <div class="th">{{ tableHeaders[2] }}</div>
      </div>

      <!-- 列表内容 -->
      <div class="list-content">
        <template v-if="recordList.length > 0">
          <div class="list-item" v-for="(item, index) in recordList" :key="index">
            <div class="td">
              <template v-if="curTab === 3">
                <div class="send-info">
                  <div class="send-label ellipsis" v-html="t('birthday.sentToHtml', { name: item.toNick })"></div>
                  <div class="send-product ellipsis" v-html="t('birthday.birthdayPrivilegeLevelHtml', { level: item.level })"></div>
                </div>
              </template>
              <template v-else-if="curTab === 1">
                <div class="receive-info">
                  <div class="receive-label ellipsis" v-html="t('birthday.giftedByHtml', { name: item.type === 4 ? item.toNick : t('birthday.official') })"></div>
                </div>
              </template>
              <template v-else>
                <span class="ellipsis" v-html="t('birthday.birthdayPrivilegeLevelHtml', { level: item.level })"></span>
              </template>
            </div>
            <div class="td">{{ formatTimestamp(item.timestamp, 'YYYY-MM-DD') }}</div>
            <div class="td coin">
              <template v-if="curTab === 1">
                <img src="@/assets/activity/birthday/record_coin.png" alt="" />
                <span>0</span>
              </template>
              <template v-else>
                <img src="@/assets/activity/birthday/record_coin.png" alt="" />
                <span>{{ spend(item.level) || 0 }}</span>
              </template>
            </div>
          </div>
        </template>

        <!-- 空状态 -->
        <div class="empty-state" v-else>
          <div class="empty-text">{{ emptyText }}</div>
        </div>
      </div>

      <div class="toast-close" @click="closeModal"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import { formatTimestamp } from "@/utils/common.js";
import { colProps } from "vant";
// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:isShow", "close"]);

/** 记录类型：1=领取，2=购买，3=分享 */
const curTab = ref(2);
const tabList = ref([
  { text: t("birthday.buy"), value: 2 },
  { text: t("birthday.send"), value: 3 },
  { text: t("birthday.receive"), value: 1 },
]);

// 表格头部（根据当前tab动态变化）
const tableHeaders = computed(() => {
  switch (curTab.value) {
    case 2: // 购买
      return [t("birthday.privilegeProductName"), t("birthday.purchaseTime"), t("birthday.spend")];
    case 3: // 赠送
      return [t("birthday.successfullyGifted"), t("birthday.sendTime"), t("birthday.spend")];
    case 1: // 领取
      return [t("birthday.giftedBy"), t("birthday.receiveTime"), t("birthday.spend")];
    default:
      return [t("birthday.privilegeProductName"), t("birthday.purchaseTime"), t("birthday.spend")];
  }
});

// 空状态文案（根据当前tab动态变化）
const emptyText = computed(() => {
  switch (curTab.value) {
    case 2:
      return t("birthday.noPurchaseRecords");
    case 3:
      return t("birthday.noSendRecords");
    case 1:
      return t("birthday.noReceiveRecords");
    default:
      return t("birthday.noPurchaseRecords");
  }
});

const spend = (level)=>{
  return -giftList.value.find(item=>item.level === level)?.price || 0;
}

const recordList = ref([]);
const giftList = ref([]);

const tabChange = (value) => {
  curTab.value = value;
  getBirthdayRecords();
};

const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};

// 获取活动列表接口
const getBirthdayRecords = async () => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/records", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      page: 1,
      pageSize: 100,
      type: curTab.value,
    });
    if (res && res.code === 200) {
      recordList.value = res.data || [];
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取活动列表接口
const getBirthdayList = async () => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/list", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      giftList.value = res.data.giftList.map(item=>{
        return {
          level: item.level,
          price: item.price,
        }
      }) || [];
      console.log(giftList.value, 'giftList')
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

watch(() => props.isShow, (newVal) => {
  if (newVal) {
    getBirthdayRecords();
    getBirthdayList();
  }
});
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
  font-family: PingFang SC;

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
    width: 337px;
    height: 450px;
    background: url("@/assets/activity/birthday/bg_record.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .title {
      position: absolute;
      top: 27px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
      font-size: 14px;
      color: #F0D863;
      line-height: 14px;
      background: linear-gradient(355deg, #FFFFCC 0%, #FFDC34 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
    }

    // Tab 切换
    .tab-list {
      position: absolute;
      top: 65px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 2;

      .tab-item {
        width: 80px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        font-size: 12px;
        color: #FFFFFF;
        background: url("@/assets/activity/birthday/record_tab_hide.png") no-repeat center center;
        background-size: cover;
        cursor: pointer;

        &.tab-active {
          background: url("@/assets/activity/birthday/record_tab_show.png") no-repeat center center;
          background-size: cover;
          color: #8B4513;
          font-weight: bold;
        }
      }
    }

    // 表格头部
    .table-header {
      position: absolute;
      top: 105px;
      left: 50%;
      transform: translateX(-50%);
      width: 290px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      box-sizing: border-box;
      background: url("@/assets/activity/birthday/record_line.png") no-repeat center top;
      background-size: 100% 1px;

      .th {
        font-size: 10px;
        color: #D4A5FF;
        text-align: center;
        flex: 1;

        &:first-child {
          flex: 1.5;
          text-align: start;
        }

        &:last-child {
          flex: 0.8;
        }
      }
    }

    // 列表内容
    .list-content {
      position: absolute;
      top: 140px;
      left: 50%;
      transform: translateX(-50%);
      width: 296px;
      height: 290px;
      overflow-y: auto;

      .list-item {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        box-sizing: border-box;
        margin-bottom: 6px;
        background: url("@/assets/activity/birthday/record_item.png") no-repeat center top;
        background-size: cover;
        border-radius: 6px;
        border: 1px solid rgba(212, 165, 255, 0.3);

        .td {
          font-size: 11px;
          color: #FFFFFF;
          text-align: center;
          flex: 1;

          ::v-deep(.highlight-level) {
            color: #FFEA65 !important;
          }

          &:first-child {
            flex: 1.5;
            font-size: 10px;
            color: #FFFFFF;
            line-height: 12px;
            text-align: start;
            font-weight: bold;
          }

          &:last-child {
            flex: 0.8;
          }

          &.coin {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;

            img {
              width: 13px;
              height: 18px;
            }

            span {
              color: #FFD700;
              font-weight: bold;
            }
          }

          .send-info,
          .receive-info {
            display: flex;
            flex-direction: column;
            gap: 2px;

            .send-label,
            .receive-label {
              font-size: 10px;
              color: #D4A5FF;
              font-size: 10px;
              color: #FFFFFF;
              line-height: 10px;
              text-align: start;
              font-weight: bold;

              ::v-deep(.highlight-name) {
                color: #FFD700;
                font-weight: bold;
              }
              ::v-deep(.highlight-level) {
                color: #FFEA65;
              }
            }

            .send-product,
            .receive-product {
              font-size: 10px;
              color: #FFFFFF;
              line-height: 12px;
              text-align: start;
              font-weight: bold;

              ::v-deep(.highlight-level) {
                color: #FFEA65 !important;
              }
            }
          }
        }
      }

      // 空状态
      .empty-state {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .empty-text {
          font-weight: bold;
          font-size: 15px;
          color: #FFFFFF;
          text-align: center;
          line-height: 20px;
          margin-bottom: 20px;
        }
      }
    }

    .toast-close {
      position: absolute;
      bottom: -43px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 30px;
      background: url("@/assets/activity/birthday/close.png") no-repeat center center;
      background-size: cover;
      cursor: pointer;
    }
  }
}
/* 省略号处理 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>