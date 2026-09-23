<template>
  <div class="coin-agent-container">
    <!-- 顶部横幅：返回按钮、标题、金币余额 -->
    <div class="header-banner">
      <img class="return-btn" @click="goBack" src="@/assets/p/coinAgent/icon-back.png" />
      <div class="banner-subtitle">Gold Coins Recharge</div>
      <div class="banner-coins">
        <span class="coin-amount">{{ formatNumber(userInfo.purpleDiamondNum) }}</span>
      </div>
    </div>

    <!-- Tab 切换栏：充值 / 记录 / 子代理或上级代理 -->
    <div class="tab-container">
      <div class="tab-item" :class="{ active: activeTab === 'recharge' }" @click="activeTab = 'recharge'">
        {{ t("coinAgent.recharge") }}
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'record' }" @click="activeTab = 'record'">
        {{ t("coinAgent.record") }}
      </div>
      <div v-if="hasParent" class="tab-item" :class="{ active: activeTab === 'subAgent' }" @click="activeTab = 'subAgent'">
        {{ hasParent === 'parent' ? t("coinAgent.superiorAgent") : t("coinAgent.subAgent") }}
      </div>
    </div>

    <!-- 内容区：根据当前 Tab 和代理角色显示对应组件 -->
    <div class="content-container">
      <RechargeTab v-if="activeTab === 'recharge'" @updateBalance="onUpdateBalance" />
      <RecordTab v-if="activeTab === 'record'" />
      <SubAgentTab v-if="activeTab === 'subAgent' && hasParent === 'sub'" />
      <SuperiorAgentTab v-if="activeTab === 'subAgent' && hasParent === 'parent'" />
    </div>

    <div class="bottom-bg"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/pinia/index.js";
import { postForm } from "@/utils/http.js";
import RechargeTab from "./components/RechargeTab.vue";
import RecordTab from "./components/RecordTab.vue";
import SubAgentTab from "./components/SubAgentTab.vue";
import SuperiorAgentTab from "./components/SuperiorAgentTab.vue";

// ==================== 依赖注入 ====================
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();
// ==================== 变量声明 ====================
// 当前激活的 Tab：recharge / record / subAgent
const activeTab = ref("recharge");

// 用户信息
const userInfo = ref({});

// 是否有上级代理 上级代理parent
const hasParent = ref('');

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
 * 充值成功后直接扣除余额
 * @param {number} amount - 充值金额
 */
const onUpdateBalance = (amount) => {
  if (userInfo.value.purpleDiamondNum) {
    userInfo.value.purpleDiamondNum -= amount;
  }
};

/**
 * 返回上一页
 * 根据操作系统调用不同的原生方法或路由返回
 */
const goBack = () => {
  if (store.os === "android") {
    WebViewJavascriptBridge.backToFront(null, null);
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.backToFront.postMessage(null);
  } else {
    router.back();
  }
};

// ==================== 接口调用 ====================
/**
 * 获取代理角色
 * 通过查询是否有上级代理来判断角色
 */
const fetchAgentRole = async () => {
  try {
    const res = await postForm("/agency/getPermission", {
    // const res = await postForm("/agency/subAgent/parent", {
      uid: store.uid,
      ticket: store.ticket,
    });
    if (res.code === 200) {
      // data 有值说明有上级，是子代理；无值说明没上级，是主代理（或普通代理）
      userInfo.value = res.data
    } else {
      showToast(res.message);
      goBack();
    }
  } catch (e) {
    console.error(e);
  }
};

const fetchParent = async () => {
  try {
    const res = await postForm("/agency/subAgent/parent", {
      uid: store.uid,
      ticket: store.ticket,
    });
    if (res.code === 200) {
      hasParent.value = res.data?.uid > 0 ? 'parent' : 'sub';
    } else {
      showToast(res.message || t("common.requestFail"));
    }
  } catch (e) {
    console.error(e);
  }
};

// ==================== 生命周期 ====================
onMounted(() => {
  fetchAgentRole();
  fetchParent();
});
</script>

<style scoped lang="scss">
.coin-agent-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
  overflow-y: auto;
  box-sizing: border-box;
  background: #F9F9F9;
  position: relative;
  font-family: Source Han Sans SC, Source Han Sans SC;

  .header-banner {
    position: relative;
    width: 100%;
    height: 262px;
    background: url("@/assets/p/coinAgent/top-bg.png") no-repeat top center;
    background-size: 375px 238px;
    flex-shrink: 0;

    .return-btn {
      position: absolute;
      top: 50px;
      left: 16px;
      width: 32px;
      height: 32px;
      z-index: 10;
    }

    .banner-subtitle {
      position: absolute;
      top: 94px;
      left: 22px;
      font-weight: bold;
      font-size: 18px;
      color: #333333;
    }

    .banner-coins {
      width: 351px;
      height: 77px;
      position: absolute;
      top: 185px;
      left: 50%;
      transform: translateX(-50%);
      background: url("@/assets/p/coinAgent/gold-bg.png") no-repeat top center;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;

      .coin-amount {
        font-size: 28px;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .tab-container {
    width: 100%;
    height: 59px;
    box-sizing: border-box;
    padding-top: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 12px;
    flex-shrink: 0;

    .tab-item {
      width: 114px;
      font-size: 12px;
      color: #828282;
      text-align: center;
      font-weight: bold;
      position: relative;

      &.active {
        font-size: 16px;
        color: #333333;
      }

      &.active::after {
        content: "";
        width: 41px;
        height: 8px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background: url("@/assets/p/coinAgent/divider-line.png") no-repeat top center;
        background-size: cover;
      }
    }
  }

  .content-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }

  .bottom-bg {
    width: 375px;
    height: 105px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 0;
    background: url("@/assets/p/coinAgent/bottom-bg.png") no-repeat bottom center;
    background-size: 375px 105px;
  }
}
</style>