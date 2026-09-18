<template>
  <!-- 加载动画 -->
  <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner"></div>
    <div class="loading-text">{{ t("common.loading") }}</div>
  </div>
  <!-- 主界面 -->
  <transition name="fade">
    <div class="page-content">
      <div class="page-scroll-content">
        <div
          class="nav-container"
          :class="store.language != 'ar' ? 'nav-container-left' : 'nav-container-right'"
          @click="back"
        >
          <img v-if="store.language != 'ar'" src="@/assets/common/left-black-icon@2x.png" alt="" />
          <img v-else src="@/assets/common/right-black-icon@2x.png" alt="" />
        </div>
        <div class="theme-box"></div>
        <div class="size-box">
          <div class="size-contentBox ruleBox">
            <div class="size-title">
              <span class="liner-text">{{ t("inviteRecord.tab1") }}</span>
            </div>
            <div class="list-box">
              <div class="list-item" v-for="(item, index) in listData" :key="index">
                <div class="rd">{{ index + 1 }}</div>
                <div class="left-item">{{ item.taskName }}</div>
                <div class="right-item">
                  <div class="coin-item">
                    <div class="coin-img"></div>
                    {{ item.unit || "0" }}
                  </div>
                  <div class="next-item" @click="getShowModal(index)"></div>
                </div>
              </div>
              <div class="size-tip">{{ t("inviteRecord.ruleNotice") }}</div>
            </div>
          </div>
        </div>
        <!-- invite code -->
        <div class="size-box">
          <div class="size-contentBox inviteBox">
            <div class="size-title">
              <span class="liner-text">{{ t("inviteRecord.tab2") }}</span>
            </div>
            <div class="invite-box">
              <div class="invite-text">{{ t("inviteRecord.codeLabel") }}</div>
              <div class="invite-code">{{ userData.inviteCode || "xxxxxx" }}</div>
              <div class="invite-btnBox">
                <button
                  class="operation-btn"
                  :class="userData.inviteCode == '' ? 'no-btn' : 'copy-btn'"
                  :disabled="userData.inviteCode == ''"
                  @click="copyInviteCode"
                >
                  {{ t("inviteRecord.ytip1") }}
                </button>
                <button v-if="userData.validRegisterUser" class="operation-btn invite-btn" @click="getShowInvite">
                  {{ t("inviteRecord.ytip2") }}
                </button>
              </div>
              <div class="size-tip">{{ t("inviteRecord.yNotice") }}</div>
            </div>
          </div>
        </div>
        <!-- My points -->
        <div class="size-box record-popview">
          <div class="size-contentBox pointBox">
            <div class="size-title">
              <span class="liner-text">{{ t("inviteRecord.tab3") }}</span>
            </div>
            <div class="invite-box">
              <div class="red-bag">
                <div class="red-bag-top">
                  <div class="point-text">{{ t("inviteRecord.tab3") }}</div>
                  <div class="point-num">{{ userData.points || 0 }}</div>
                </div>
                <div class="red-bag-bottom">
                  <div class="invite-btnBox">
                    <button
                      class="operation-btn-v1"
                      :class="isRepeat1 ? 'no-btn' : 'normal-btn'"
                      :disabled="isRepeat1"
                      @click="getShowExchange(1)"
                    >
                      {{ isRepeat1 ? t("inviteRecord.ptip1") + " " + timer1 + "s" : t("inviteRecord.ptip1") }}
                    </button>
                    <button
                      class="operation-btn-v1"
                      :class="isRepeat2 ? 'no-btn' : 'normal-btn'"
                      :disabled="isRepeat2"
                      @click="getShowExchange(2)"
                    >
                      {{ isRepeat2 ? t("inviteRecord.ptip2") + " " + timer2 + "s" : t("inviteRecord.ptip2") }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="size-tipBox">
                <p>{{ t("inviteRecord.pNotice1") }}</p>
                <p>{{ t("inviteRecord.pNotice2") }}</p>
              </div>
            </div>

            <div :class="['record-box', store.language != 'ar' ? 'record-en' : 'record-ar']" @click="getShowRecord">
              {{ t("common.record") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- 规则弹窗-->
  <ModalBox
    :isShow="showModal"
    :width="80"
    :height="10"
    :cTop="1"
    :cRight="1"
    :tWidth="12"
    :tHeight="3.5"
    @close="getCloseModal"
  >
    <template #content>
      <div class="md-title">
        {{ t("inviteRecord.illustrate") }}
      </div>
      <div class="rule-box">
        <div class="rule-content" v-if="activeIndex == 0">
          <p>{{ t("inviteRecord.m1Text1") }}</p>
          <p>{{ t("inviteRecord.m1Text2") }}</p>
        </div>
        <div class="rule-content" v-if="activeIndex == 1 || activeIndex == 2">
          <p>{{ t("inviteRecord.m2Text1") }}</p>
          <p>{{ t("inviteRecord.m2Text2") }}</p>
        </div>
        <div class="rule-content" v-if="activeIndex == 3">
          <p>{{ t("inviteRecord.m3Text1") }}</p>
          <p>{{ t("inviteRecord.m3Text2") }}</p>
          <p>{{ t("inviteRecord.m3Text3") }}</p>
          <p>{{ t("inviteRecord.m3Text4") }}</p>
        </div>
      </div>
      <div class="md-center-box">
        <div class="md-btn know-btn" @click="getCloseModal">
          {{ t("inviteRecord.know") }}
        </div>
      </div>
    </template>
  </ModalBox>
  <!-- 邀请弹窗-->
  <ModalBox
    :isShow="showInvite"
    :width="80"
    :height="6"
    :cTop="1"
    :cRight="1"
    :tWidth="15"
    :tHeight="3.5"
    @close="getCloseInviteModal"
  >
    <template #content>
      <div class="md-title">{{ t("inviteRecord.tab2") }}</div>
      <div class="md-label">{{ t("inviteRecord.ytip2") }}</div>
      <div class="invite-inputBox">
        <input type="text" v-model="inviteCode" />
      </div>
      <div class="md-space-box">
        <div class="md-btn cancel-btn" @click="getCloseInviteModal">{{ t("inviteRecord.cancel") }}</div>
        <div class="md-btn know-btn" @click="getConfirm">{{ t("inviteRecord.confirm") }}</div>
      </div>
    </template>
  </ModalBox>
  <!-- 兑换弹窗-->
  <ModalBox
    :isShow="showExchange"
    :width="80"
    :height="0"
    :cTop="1"
    :cRight="1"
    :tWidth="15"
    :tHeight="3.5"
    @close="getCloseExchangeModal"
  >
    <template #content>
      <div class="md-title">{{ exchangeType == 1 ? t("inviteRecord.ptip1") : t("inviteRecord.ptip2") }}</div>
      <div class="exchange-text" v-html="highlightText"></div>
      <div class="md-space-box">
        <div class="md-btn cancel-btn" @click="getCloseExchangeModal">{{ t("inviteRecord.cancel") }}</div>
        <div class="md-btn know-btn" @click="getConfirmExchange">{{ t("inviteRecord.confirm") }}</div>
      </div>
    </template>
  </ModalBox>
</template>

<script setup>
// 工具
import { useMainStore } from "@/pinia/index.js";
import ModalBox from "./components/modal.vue";
import navBar from "@/components/navBar/navBar.vue";
import message from "@/utils/message";
const store = useMainStore();

import { postForm, get } from "@/utils/http";
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const { t } = useI18n();
const router = useRouter();

onMounted(async () => {
  // 并行加载数据和图片
  await Promise.allSettled([getListData(), getUserData()]);
  isLoading.value = false;
  // initIOS()
});

const isLoading = ref(true);

// 规则弹窗
const showModal = ref(false);
const getCloseModal = () => {
  showModal.value = false;
};

// 规则索引
const activeIndex = ref(0);
const getShowModal = (index) => {
  activeIndex.value = index;
  showModal.value = true;
};

// 邀请弹窗
const showInvite = ref(false);
const inviteCode = ref("");
const getShowInvite = () => {
  showInvite.value = true;
};

const getCloseInviteModal = () => {
  showInvite.value = false;
  inviteCode.value = "";
};

// 多语言文字高亮
const highlightText = computed(() => {
  if (!userData.value || !userData.value.points) return "";
  const n = `<span class="highlight-number">${userData.value.points}</span>`;
  const k = `<span class="highlight-number">${exchangeType.value === 1 ? userData.value.points : userData.value.points * 2}</span>`;
  return t(exchangeType.value === 1 ? "inviteRecord.m4Text2" : "inviteRecord.m4Text3", { n, k });
});

// 复制邀请码
const copyInviteCode = async () => {
  if (!userData.value.inviteCode) {
    message.error(t("inviteRecord.copyError"));
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(userData.value.inviteCode)
      .then(() => {
        message.success(t("inviteRecord.copyText"));
      })
      .catch((err) => {
        console.error("复制失败:", err);
        message.error(t("inviteRecord.copyError"));
      });
  } else {
    console.error("浏览器不支持剪贴板 API");
  }
};
// 确认邀请
const getConfirm = () => {
  if (!inviteCode.value) {
    message.error(t("inviteRecord.inviteText"));
    return;
  }

  if (inviteCode.value == userData.value.inviteCode) {
    message.error(t("inviteRecord.inviteSame"));
    return;
  }

  // 执行邀请绑定请求
  postForm("/point/bind", {
    inviteCode: inviteCode.value,
    uid: store.uid,
    ticket: store.ticket,
    appid: store.appid,
    appVersion: store.appVersion,
    os: store.os,
    deviceId: store.deviceId,
    language: store.language,
    simCountryCode: store.simCountryCode,
  })
    .then((res) => {
      if (res.code == 200) {
        message.success(res.message);
        getCloseInviteModal();
      } else {
        message.error(res.message);
      }
    })
    .catch((err) => {
      console.error("邀请绑定失败", err);
      message.error(err.message);
    });
};

// 返回
const back = () => {
  if (store.os === "android") {
    WebViewJavascriptBridge.backToFront(null, null);
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.backToFront.postMessage(null);
  } else {
    console.error("未知平台，无法返回");
  }
};

// 兑换弹窗
const showExchange = ref(false);
const exchangeType = ref(1);
const timer1 = ref(0);
const timer2 = ref(0);
const clickCount1 = ref(0);
const clickCount2 = ref(0);
const isRepeat1 = ref(false);
const isRepeat2 = ref(false);

const getShowExchange = (type) => {
  if (type === 1 && isRepeat1.value) return;
  if (type === 2 && isRepeat2.value) return;

  exchangeType.value = type;

  if (type === 1) {
    clickCount1.value++;
    if (clickCount1.value > 5) {
      isRepeat1.value = true;
      timer1.value = 60;
      const interval1 = setInterval(() => {
        timer1.value--;
        if (timer1.value <= 0) {
          isRepeat1.value = false;
          clickCount1.value = 0;
          clearInterval(interval1);
        }
      }, 1000);
      return;
    }
  } else if (type === 2) {
    clickCount2.value++;
    if (clickCount2.value > 5) {
      isRepeat2.value = true;
      timer2.value = 60;
      const interval2 = setInterval(() => {
        timer2.value--;
        if (timer2.value <= 0) {
          isRepeat2.value = false;
          clickCount2.value = 0;
          clearInterval(interval2);
        }
      }, 1000);
      return;
    }
  }

  if (userData.value.points > 0) {
    showExchange.value = true;
  } else {
    message.error(t("inviteRecord.m4Text6"));
  }
};

const getCloseExchangeModal = () => {
  showExchange.value = false;
};

// 确认兑换
const getConfirmExchange = () => {
  postForm("/point/exchange", {
    points: userData.value.points,
    uid: store.uid,
    type: exchangeType.value,
    ticket: store.ticket,
    appid: store.appid,
    appVersion: store.appVersion,
    deviceId: store.deviceId,
    language: store.language,
    os: store.os,
  }).then((res) => {
    if (res.code == 200) {
      message.success(t("inviteRecord.m4Text4") + ":" + res.data);
      userData.value.points = 0;
      getCloseExchangeModal();
    } else {
      message.error(t("inviteRecord.m4Text5"));
    }
  });
};

// 查看兑换记录
const getShowRecord = async () => {
  router.push({ path: "/single/invite-reward/record" });
};

// 获取首屏数据
const listData = ref([]);
const getListData = async () => {
  try {
    const res = await get("/point/task", {
      uid: store.uid,
    });
    if (res.code == 200) {
      listData.value = res.data || [];
    } else {
      console.log("获取任务数据失败", res.message);
      listData.value = defaultData.value;
    }
  } catch (err) {
    console.log("获取任务数据失败", err);
    listData.value = defaultData.value;
  }
};

// 默认数据
const defaultData = ref([
  {
    taskName: t("inviteRecord.tip1"),
    points: 500,
    rate: null,
    unit: "500",
  },
  {
    taskName: t("inviteRecord.tip2"),
    points: null,
    rate: 0.05,
    unit: "5%",
  },
  {
    taskName: t("inviteRecord.tip3"),
    unit: "3%",
  },
  {
    taskName: t("inviteRecord.tip4"),
    unit: "1%~%2",
  },
]);

// 获取首屏数据
const userData = ref([]);
const getUserData = async () => {
  try {
    const res = await get("/point/info", {
      uid: store.uid,
      ticket: store.ticket,
      appid: store.appid,
      appVersion: store.appVersion,
      deviceId: store.deviceId,
      language: store.language,
      os: store.os,
      simCountryCode: store.simCountryCode,
    });
    if (res.code == 200) {
      userData.value = res.data || [];
    } else {
      console.log("获取用户信息失败", res.message);
      userData.value = [];
    }
  } catch (err) {
    console.log("获取用户信息失败", err);
    userData.value = [];
  }
};

// 初始化ios回退
const initIOS = () => {
  if (store.platform === "ios") {
    console.log("ios回退预处理");
    window.webkit?.messageHandlers?.iOS_Native_InjectJavascript.postMessage(null);
  } else if (store.platform === "android") {
    console.log("android获取用户信息初始化");
  }
};
</script>

<style lang="scss" scoped>
#jsdata {
  color: #fff;
}

.page-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.page-scroll-content {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  background: #fe8330;
}

.nav-container {
  width: 48px;
  height: 48px;
  box-sizing: border-box;
  background: none;
  color: transparent;
  position: fixed;
  z-index: 999;
  /* 增加点击区域 */
  touch-action: manipulation;
  > img {
    width: 48px;
    height: 48px;
  }
}

.nav-container-left {
  top: 52px;
  left: 24px;
}
.nav-container-right {
  top: 52px;
  right: 24px;
}

.theme-box {
  width: 100%;
  height: 400px;
  background: url("https://file.sanalive.online/FnUX1f-hQDY6w9qi80dSCyj2FoC2?imageslim/zlevel/3%7CimageView2/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100% 100%;
}

.size-box {
  padding: 0 12.8px;
  box-sizing: border-box;
  margin-bottom: 48px;

  .ruleBox {
    min-height: 448px;
    padding: 48px 8px 16px;
    box-sizing: border-box;
  }

  .inviteBox {
    max-height: 384px;
    padding: 48px 16px 16px;
    box-sizing: border-box;
  }

  .pointBox {
    min-height: 448px;
    padding: 48px 16px 16px;
    box-sizing: border-box;
    position: relative;
  }

  .size-contentBox {
    width: 100%;
    background: url("https://file.sanalive.online/FnY4KBun01aiIlneipmvvJ3GkYOW?imageslim/zlevel/3%7CimageView2/1/format/webp/ignore-error/1");
    // background: url('@/assets/p/inviteRecord/second-bg.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .size-title {
      position: absolute;
      top: -32px;
      min-width: 240px;
      height: 72px;
      background: url("@/assets/p/inviteRecord/second.png") no-repeat;
      background-size: 100% 100%;
      padding: 16px 32px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;

      .liner-text {
        font-size: 19.2px;
        font-weight: 800;
        color: #fff;
      }
    }
  }

  .size-box:last-child {
    margin-bottom: 0;
  }

  .list-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    // background: #fff;
    gap: 16px;

    .list-item {
      width: 100%;
      padding: 16px 8px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fdebce;
      border-radius: 16px;
      border: 2px solid #f7db94;
      position: relative;
    }

    .rd {
      width: 24px;
      height: 16px;
      color: #fff;
      background: url("@/assets/p/inviteRecord/rd.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: -1.6px;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 12.8px;
    }

    .left-item {
      width: calc(100% - 112px);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #151515;
      font-weight: bold;
      font-size: 13.6px;
      box-sizing: border-box;
    }

    .right-item {
      width: 112px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .coin-item {
        width: calc(100% - 28.8px);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 5px;
        box-sizing: border-box;
        color: #fc3233;
        font-weight: 800;
        font-size: 12px;

        .coin-img {
          width: 19.2px;
          height: 19.2px;
          background: url("@/assets/p/inviteRecord/star@2x.png") no-repeat;
          background-size: 100% 100%;
        }
      }

      .next-item {
        width: 28.8px;
        height: 28.8px;
        background: url("@/assets/p/inviteRecord/next.png") no-repeat;
        background-size: 100% 100%;
        margin: 0 3.2px;
      }
    }
  }

  .size-tip {
    width: 100%;
    box-sizing: border-box;
    font-size: 13.6px;
    color: #151515;
    text-align: left;
    padding: 0 8px;
    text-align: center;
    font-weight: 400;
  }

  .size-tipBox {
    width: 100%;
    box-sizing: border-box;
    font-size: 13.6px;
    color: #151515;
    text-align: left;
    padding: 0 16px;

    p {
      margin: 0;
      padding: 0;
    }
  }

  .invite-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .invite-text {
      color: #151515;
      font-size: 13.6px;
    }

    .invite-code {
      font-size: 19.2px;
      color: #5a3603;
      font-weight: 600;
      text-align: center;
      width: 192px;
      height: 48px;
      background: #fbf0d6;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 8px 0 16px;
      border-radius: 16px;
    }
  }

  .invite-btnBox {
    display: flex;
    flex-direction: column;
    gap: 8px;

    button {
      border: 0;
      outline: none;
    }

    .operation-btn {
      min-width: 288px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      padding: 8px 16px 16px;
      box-sizing: border-box;
      margin-bottom: 8px;
    }

    .operation-btn-v1 {
      min-width: 240px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14.4px;
      font-weight: 600;
      color: #fff;
      padding: 8px 16px 16px;
      box-sizing: border-box;
      margin-bottom: 8px;
    }

    .copy-btn {
      background: url("@/assets/p/inviteRecord/diamond-exit.png") no-repeat;
      background-size: 100% 100%;
    }

    .invite-btn {
      background: url("@/assets/p/inviteRecord/gold-exit.png") no-repeat;
      background-size: 100% 100%;
    }

    .no-btn {
      background: #989898;
      color: #fff;
      background-size: 100% 100%;
    }

    .normal-btn {
      background: url("@/assets/p/inviteRecord/operate-btn@2x.png") no-repeat;
      background-size: 100% 100%;
      color: #76160e;
    }
  }

  .red-bag {
    width: 100%;
    height: 400px;
    // background: url('@/assets/p/inviteRecord/red-bag.png') no-repeat;
    background: url("https://file.sanalive.online/FnQxLWWGiTG5qvNzKxZK8VitrtOy?imageslim/zlevel/3%7CimageView2/1/format/webp/ignore-error/1")
      no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 32px 0 0;
    box-sizing: border-box;
  }

  .red-bag-bottom {
    position: absolute;
    bottom: 16px;
  }

  .red-bag-top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;

    .point-text {
      color: #974911;
      font-size: 16px;
    }

    .point-num {
      color: #fc3233;
      font-weight: 600;
      font-size: 24px;
      padding: 16px 0 0;
      text-align: center;
    }
  }
}

.record-box {
  min-width: 80px;
  height: 28.8px;
  position: absolute;
  top: 28.8px;
  box-sizing: border-box;
  color: #76160e;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
}

.record-en {
  right: 0;
  background: url("@/assets/p/inviteRecord/record.png") no-repeat;
  background-size: 100% 100%;
}

.record-ar {
  left: 0;
  background: url("@/assets/p/inviteRecord/record-rt.png") no-repeat;
  background-size: 100% 100%;
}

.md-title {
  font-size: 16px;
  font-weight: 800;
  color: #151515;
  text-align: center;
  margin-bottom: 16px;
}

.md-center-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}

.md-space-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  gap: 16px;
}

.md-btn {
  width: 60%;
  height: 38.4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  font-size: 16px;
}

.md-label {
  margin-bottom: 16px;
  font-size: 16px;
  text-align: center;
}

.know-btn {
  background: #00dbb3;
  color: #fff;
}

.cancel-btn {
  background: #e6e7eb;
  color: #878e9a;
}

.rule-box {
  color: #151515;

  .rule-content {
    font-size: 13.6px;
    text-align: left;

    p {
      margin-bottom: 3.2px;
      padding: 0;
    }
  }
}

.invite-inputBox {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  input {
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    border: none;
    outline: none;
    color: #151515;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1.6px;
    padding: 0 24px;
    box-sizing: border-box;
    text-align: left;
    border-radius: 8px;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
  }
}

.exchange-modalbox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .exchange-btn {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .operate-btn {
      min-width: 128px;
      height: 48px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px 8px;
      box-sizing: border-box;
    }
  }
}

.exchange-text {
  font-size: 16px;
  color: #151515;
  text-align: left;
  padding: 16px 0;

  ::v-deep(.highlight-number) {
    color: #151515;
    font-weight: 600;
    font-size: 17.6px;
  }
}

.record-modalbox {
  width: 100%;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #151515;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 16px;

  .record-list {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .record-right {
      width: 96px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #ffea00;
      font-weight: 600;
      font-size: 13.6px;

      .icon-img {
        width: 24px;
        height: 24px;
        background: url("@/assets/p/inviteRecord/star.png") no-repeat;
        background-size: 100% 100%;
        margin: 0 8px;
      }
    }

    .record-left {
      width: calc(100% - 96px);
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .list-taskname {
        width: 100%;
        font-size: 13.6px;
        font-weight: 600;
        color: #ffecba;
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
          color: #ffecba;
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

/* 加载动画样式 */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #201b29;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 5px solid #fff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    font-size: 12.8px;
    color: #fff;
    margin-top: 16px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  /* 添加过渡效果样式 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
