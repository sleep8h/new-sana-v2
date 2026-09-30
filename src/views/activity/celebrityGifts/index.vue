<!-- Celebrity Gift Battle 活动主页 -->
<template>
  <div class="page">
    <div class="page-content">
      <!-- 头图区域 -->
      <div class="bg-top">
        <!-- 背景层 -->
        <div class="bg-media">
          <img
            v-if="bgImage"
            class="bg-img"
            src="@/assets/activity/celebrityGifts/top1_bg.png"
            alt=""
          />
          <video
            v-else
            class="bg-video"
            src="@/assets/activity/celebrityGifts/top1_bg.mp4"
            autoplay
            loop
            muted
            playsinline
          ></video>
        </div>

        <!-- 规则入口 -->
        <div class="rules" @click="rulesShow = true">
          <span class="rules-icon">?</span>
          <span>{{ $t("celebrityGifts.rule") }}</span>
        </div>

        <!-- 上周 TOP1 展示区 -->
        <div class="last-week-top">
          <!-- 左边：上周名人礼物 TOP1 -->
          <div class="top-card" @click="openUserPage(lastWeekCelebrity)">
            <div class="top-avatar-wrap">
              <img
                class="top-avatar"
                :src="lastWeekCelebrity?.avatar || defaultAvatar"
                alt=""
              />
              <img
                class="avatar-frame"
                src="@/assets/activity/celebrityGifts/avatarFrame1.png"
                alt=""
              />
            </div>
            <div class="top-info">
              <div class="top-name text-hide">{{ lastWeekCelebrity?.nick || "-" }}</div>
              <div class="top-score">{{ formatNumber(lastWeekCelebrity?.integral) }}</div>
            </div>
          </div>

          <!-- 右边：上周 Top Supporter TOP1 -->
          <div class="top-card top-card-right" @click="openUserPage(lastWeekSupporter)">
            <div class="top-avatar-wrap">
              <img
                class="top-avatar"
                :src="lastWeekSupporter?.avatar || defaultAvatar"
                alt=""
              />
              <img
                class="avatar-frame"
                src="@/assets/activity/celebrityGifts/avatarFrame2.png"
                alt=""
              />
            </div>
            <div class="top-info">
              <div class="top-name text-hide">{{ lastWeekSupporter?.nick || "-" }}</div>
              <div class="top-score">
                <span class="coin-icon"></span>
                {{ formatNumber(lastWeekSupporter?.integral) }}
              </div>
            </div>
          </div>
        </div>
  
        <!-- tab -->
        <div class="tab-list">
          <div
            v-for="item in tabList"
            :key="item.value"
            class="tab-wrapper"
          >
            <div
              class="tab-item"
              :class="{ 'tab-item-show': curTab === item.value }"
              @click="tabChange(item)"
            >
              <span>{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>


      <!-- 内容区 -->
      <div class="content">
        <celebrityGift v-if="curTab === 1" />
        <topCekebrityGift v-if="curTab === 2" />
        <topSupporter v-if="curTab === 3" />
      </div>

      <RuleToast
        v-model:isShow="rulesShow"
        :rewardGroups="rewardGroups"
        @close="rulesShow = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { get } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import defaultAvatar from "@/assets/common/user-avatar-default.png";
import CountDownCelebrity from "./components/CountDownCelebrity.vue";
import RuleToast from "./components/ruleToast.vue";
import celebrityGift from "./celebrityGift.vue";
import topCekebrityGift from "./topCekebrityGift.vue";
import topSupporter from "./topSupporter.vue";
import { withMock, mockInfo, mockLastWeekTop } from "./mock.js";

const store = useMainStore();
const { t } = useI18n();

const curTab = ref(1);
const countDownTime = ref(0);
const rulesShow = ref(false);
const rewardGroups = ref([]);
const bgImage = ref(false); // true=用背景图 false=用背景视频

// 上周 TOP1 数据
const lastWeekCelebrity = ref(null);
const lastWeekSupporter = ref(null);

const tabList = [
  { text: t("celebrityGifts.gifts"), value: 1 },
  { text: t("celebrityGifts.topCelebrityGift"), value: 2 },
  { text: t("celebrityGifts.topSupporter"), value: 3 },
];

const tabChange = (item) => {
  curTab.value = item.value;
};

const goTab = (val) => {
  curTab.value = val;
};

// 打开用户个人主页
const openUserPage = (user) => {
  if (!user || !user.uid) return;
  const params = { uid: user.uid };
  if (store.os === "android") {
    WebViewJavascriptBridge.openUserPage(JSON.stringify(params));
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.openUserPage.postMessage(params);
  } else {
    console.log("打开用户主页", params);
  }
};

const formatNumber = (num) => Number(num || 0).toLocaleString("en-US");

const getActivityInfo = async () => {
  const data = await withMock(
    () =>
      get("/h5doings/activity/celebrityGift2026/list", {
        uid: store.uid,
        ticket: store.ticket,
        language: store.language,
      }),
    mockInfo,
  );
  countDownTime.value = data.timeOut;
  rewardGroups.value = data.rewardGroups || [];
};

// 获取上周 TOP1 数据
const getLastWeekTop = async () => {
  const data = await withMock(
    () =>
      get("/h5doings/activity/celebrityGift2026/lastWeekTop", {
        uid: store.uid,
        ticket: store.ticket,
        language: store.language,
      }),
    mockLastWeekTop,
  );
  lastWeekCelebrity.value = data.celebrity || null;
  lastWeekSupporter.value = data.supporter || null;
};

onMounted(() => {
  getActivityInfo();
  getLastWeekTop();
});
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #000000;
  font-family: PingFangSC, PingFang SC, Avenir, Helvetica, Arial, sans-serif;

  .page-content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: auto;
    overflow-x: hidden;
    
    .bg-top {
      position: relative;
      width: 100%;
      height: 760px;
      margin: 0 auto;
      overflow: hidden;
      .bg-media {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 760px;
        z-index: 0;
        pointer-events: none;

        .bg-img,
        .bg-video {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      }
      // 规则
      .rules {
        position: absolute;
        top: 460px;
        right: 12px;
        height: 28px;
        padding: 0 10px;
        border-radius: 14px;
        border: 1px solid rgba(242, 205, 99, 0.7);
        background: rgba(40, 6, 10, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 12px;
        color: #f7d264;
        cursor: pointer;
        .rules-icon {
          width: 16px;
          height: 16px;
          margin-right: 3px;
          border-radius: 50%;
          border: 1px solid #f7d264;
          font-size: 11px;
          line-height: 14px;
          text-align: center;
        }
      }


      // 上周 TOP1 展示区
      .last-week-top {
        position: absolute;
        top: 517px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        box-sizing: border-box;
        padding: 0 11px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        z-index: 2;
        
        .top-card {
          position: relative;
          width: 117px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
    
          .top-avatar-wrap {
            position: relative;
            width: 78px;
            height: 110px;
            z-index: 1;

            .top-avatar {
              position: relative;
              width: 100%;
              height: 100%;
              object-fit: cover;
              z-index: 1;
            }

            .avatar-frame {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 78px;
              height: 110px;
              z-index: 2;
              pointer-events: none;
            }
          }
    
          .top-info {
            margin-top: 5px;
            width: 117px;
            height: 41px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: url("@/assets/activity/celebrityGifts/topTextBg.png") no-repeat center center;
            background-size: cover;
            .top-name {
              background: linear-gradient(180deg, #E4BE6E 19.05%, #ECB25F 85.71%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              font-weight: bold;
              font-size: 14px; 
              line-height: 22px;
              margin-bottom: -5px;
            }
            .top-score {
              font-weight: bold;
              font-size: 11px;
              line-height: 18px;
              background: linear-gradient(180deg, #E4BE6E 19.05%, #ECB25F 85.71%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
              .coin-icon {
                background: url("@/assets/activity/celebrityGifts/goldLeafIcon.png") no-repeat center center;
                background-size: cover;
                display: inline-block;
                width: 13px;
                height: 11px;
                margin-inline-end: 4px;
              }
            }
          }
        }

        .top-card-right {
          .top-avatar-wrap{
            width: 114px;
            height: 110px;
            .top-avatar{
              width: 80px;
              height: 80px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            .avatar-frame{
              width: 114px;
              height: 110px;
            }
          }
        }
      }
    
      // tab
      .tab-list {
        position: absolute;
        width: 100%;
        height: 70px;
        top: 676px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        .tab-wrapper {
          width: 125px;
          height: 70px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .tab-item {
          width: 124px;
          height: 67px;
          background: url("@/assets/activity/celebrityGifts/tabHide.png") no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          box-sizing: border-box;
          padding: 5px 20px 0;
          margin-top: 1px;
          > span {
            font-weight: bold;
            font-size: 11px;
            line-height: 14px;
            color: #FFF09D;
            text-align: center;
          }
        }

        .tab-item-show {
          width: 128px;
          height: 70px;
          padding-top: 6px;
          background: url("@/assets/activity/celebrityGifts/tabShow.png") no-repeat center center;
          background-size: cover;
          margin-top: 0;
          > span {
            font-size: 12px;
            color: #470000;
          }
        }
      }
    }
    .content {
      position: relative;
      width: 100%;
      background: #000000;
      z-index: 2;
    }
  }
}

.text-hide {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>