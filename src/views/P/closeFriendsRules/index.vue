<template>
  <div class="close-friends-container">
    <div class="nav-container">
      <navBar :isText="false" :rightLink="true" @onLeftClick="goBack">
        <template #center>{{ t("closeFriends.title") }}</template>
      </navBar>
    </div>
    <img class="bg-top" src="@/assets/p/closeFriendsRules/bg-top.png" alt="bg-top" />

    <div class="scroll-container">
      <div class="desc1">{{ t("closeFriends.desc1") }}</div>
      <div class="desc2">{{ t("closeFriends.desc2") }}</div>

      <div class="gift-bar">
        <div class="gift-bar-text">{{ t("closeFriends.rules4") }}</div>
        <img class="gift-bar-icon" src="@/assets/p/closeFriendsRules/handshake.png" alt="gift" />
      </div>

      <div class="desc3" v-html="t('closeFriends.desc3')"></div>

      <div class="close-friends-level-title">
        <div class="line-left"></div>
        <div class="title-text">{{ t("closeFriends.friendsLevel") }}</div>
        <div class="line-right"></div>
      </div>

      <!-- 会员等级Section -->
      <div class="level-section">
        <div class="level-table-wrapper">
          <table class="level-table">
            <thead>
              <tr>
                <th>{{ t("closeFriends.level") }}</th>
                <th>{{ t("closeFriends.trustValue") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in memberLevels" :key="index">
                <td class="level-num">
                  <div>{{ index + 1 }}</div>
                </td>
                <td class="reward-amount">{{ item.reward }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 挚友特权 -->
      <div class="close-friends-level-title">
        <div class="line-left"></div>
        <div class="title-text">{{ t("closeFriends.friendsPrivilege") }}</div>
        <div class="line-right"></div>
      </div>

      <div class="desc4">{{ t("closeFriends.rules1") }}</div>
      <div class="desc5">{{ t("closeFriends.rules2") }}</div>
      <div class="desc6">{{ t("closeFriends.rules3") }}</div>

      <div class="close-friends-level-img">
        <img src="@/assets/p/closeFriendsRules/bg-bottom.png" alt="" />
      </div>

      <!-- 底部间距 -->
      <div class="bottom-space"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import navBar from "@/components/navBar/navBar.vue";

const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

const userAvatar = ref("");
const userName = ref("");

const memberLevels = ref([
  { recharge: "1", reward: "0" },
  { recharge: "2", reward: "2,500,000" },
  { recharge: "3", reward: "20,000,000" },
  { recharge: "4", reward: "60,000,000" },
  { recharge: "5", reward: "180,000,000" },
  { recharge: "6", reward: "490,000,000" },
  { recharge: "7", reward: "1,000,000,000" },
]);

onMounted(() => {});

// 返回
const goBack = () => {
  if (store.os === "android") {
    WebViewJavascriptBridge.backToFront(null, null);
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.backToFront.postMessage(null);
  } else {
    console.error("未知平台，无法返回");
  }
};
</script>

<style scoped>
.close-friends-container {
  width: 100%;
  height: 100vh;
  background: #220b47;
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
    background: #220b47;
    background-image: url("@/assets/p/closeFriendsRules/bg-top.png");
    background-size: cover;
  }
  .bg-top {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 998;
    width: 100%;
    height: 248px;
  }
  .desc1,
  .desc2,
  .desc3,
  .desc4,
  .desc5,
  .desc6 {
    width: 345px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-size: 13px;
    color: #ffffff;
    line-height: 20px;
    text-align: left;
    margin: 0 auto;
  }
  .desc1 {
    margin-top: 15px;
    margin-bottom: 14px;
  }
  .desc2 {
    margin-top: 14px;
    margin-bottom: 14px;
  }
  .desc3 {
    margin-top: 14px;
    margin-bottom: 34px;
  }
  .desc4,
  .desc5,
  .desc6 {
    margin-bottom: 14px;
  }
  .gift-bar {
    width: 345px;
    height: 114px;
    background: #250558;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.45);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 14px;
    margin-bottom: 14px;
    margin: 0 auto;
    .gift-bar-text {
      font-size: 14px;
      margin-right: 8px;
    }
    .gift-bar-icon {
      width: 58px;
      height: 58px;
      margin-top: 10px;
    }
  }
  .close-friends-level-title {
    width: 345px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 34px auto 14px;
    .line-left,
    .line-right {
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.31);
    }
    .title-text {
      margin: 0 10px;
      height: 22px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: bold;
      font-size: 16px;
      color: #ffffff;
      line-height: 22px;
      text-align: left;
    }
  }

  .level-section {
    width: 345px;
    margin: 0 auto;
    .level-table-wrapper {
      .level-table {
        table-layout: fixed;
        width: 345px;
        height: 349px;
        overflow: hidden;
        text-align: center;
        border-radius: 12px;
        border-collapse: separate;
        border-spacing: 0;
        thead {
          tr {
            th {
              height: 34px;
              font-family:
                PingFangSC,
                PingFang SC;
              font-size: 13px;
              color: #ffffff;
              line-height: 20px;
              background-color: #553489;
              border: 1px solid #4e4564;
              &:first-child {
                width: calc(100% * 1 / 3);
                border-top-left-radius: 12px;
                border-right: none;
              }
              &:last-child {
                width: calc(100% * 2 / 3);
                border-top-right-radius: 12px;
              }
            }
          }
        }
        tbody {
          background: #150832;
          tr {
            &:last-child {
              td:first-child {
                border-bottom-left-radius: 12px;
              }
              td:last-child {
                border-bottom-right-radius: 12px;
              }
            }
            td {
              height: 46px;
              font-family:
                PingFangSC,
                PingFang SC;
              font-size: 13px;
              color: #ffffff;
              line-height: 20px;
              border: 1px solid #4e4564;
              &:first-child {
                width: calc(100% * 1 / 3);
                border-right: none;
                border-top: none;
              }
              &:last-child {
                width: calc(100% * 2 / 3);
                border-top: none;
              }
            }
            .level-num {
              width: 50px;
              > div {
                width: 24px;
                height: 24px;
                background: url("@/assets/p/closeFriendsRules/sort.png") no-repeat center center;
                background-size: cover;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
            .level-value {
              color: rgba(255, 255, 255, 0.75);
            }
          }
        }
      }
    }
  }

  .close-friends-level-img {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-bottom: 84px;
    > img {
      width: 345px;
      height: auto;
      margin: 0 auto;
    }
  }
}
</style>
