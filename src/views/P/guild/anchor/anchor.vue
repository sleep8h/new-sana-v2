<template>
  <div class="anchor-container">
    <div class="backup-agent"></div>
    <div class="anchor-scroll-box">
      <div class="nav-container">
        <navBar :isText="false" :rightLink="true" @onLeftClick="back">
          <template #center>{{ t("guild.main.title") }}</template>
        </navBar>
      </div>
      <div class="scroll-container">
        <div class="main-box">
          <!-- 公会长 -->
          <div class="guild-box">
            <div class="guild-cover">
              <img :src="agentData?.coverPicUrl || defaultPic" alt="" />
              <div class="guild-border"></div>
            </div>
            <div class="guild-name">{{ agentData?.guildName || "Sana GuildName" }}</div>
            <div class="guild-id">
              ID：{{ agentData?.guildId || "****" }}
              <div class="copy-id" @click="copyId(agentData?.guildId)"></div>
            </div>
          </div>
          <!--  -->
          <div class="guildInfo-box">
            <div class="agent-box">
              <div class="agent-cover"><img :src="agentData?.usersMin?.avatar || defaultPic" alt="" /></div>
              <div class="agent-introduce">
                <div class="agent-name">{{ agentData?.usersMin?.nick || t("guild.main.guildleader") }}</div>
                <div class="agent-tag">
                  <img
                    v-if="agentData?.usersMin?.experienceLevelUrl"
                    :src="agentData?.usersMin?.experienceLevelUrl"
                    alt="experienceLevelUrl"
                  />
                  <img
                    v-if="agentData?.usersMin?.charmLevelUrl"
                    :src="agentData?.usersMin?.charmLevelUrl"
                    alt="charmLevelUrl"
                  />
                  <img v-if="agentData?.usersMin?.vipIconUrl" :src="agentData?.usersMin?.vipIconUrl" alt="" />
                </div>
              </div>
            </div>
            <div class="agent-enter">
              <div class="agent-numbox">
                <div class="agent-numItem">
                  <span>{{ agentData?.memberCounts || "0" }}</span>
                  <span class="agent-num-lable">{{ t("guild.main.anchorNum") }}</span>
                </div>
                <div class="agent-numItem">
                  <span>{{ agentData?.rankTotal || "0" }}</span>
                  <span class="agent-num-lable">{{ t("guild.main.anchorMoney") }}</span>
                </div>
                <div class="agent-numItem">
                  <span>{{ agentData?.rankNo || "0" }}</span>
                  <span class="agent-num-lable">{{ t("guild.main.anchorRank") }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="anchor-box">
          <div class="anchor-content reward-box">
            <!-- 主播每周奖励 -->
            <div class="anchor-title reward-title-cirle"></div>
            <div class="reward-sumBox">
              <div class="agent-cover">
                <img :src="agentData?.memberAvatar || defaultPic" alt="" />
                <div class="agent-cover-border"></div>
              </div>
              <div class="anchor-info">
                <div class="anchor-info-name">{{ agentData?.memberNick || "sana name" }}</div>
                <div class="anchor-info-time">
                  {{ t("guild.main.lastweek") }}
                  <span class="time-line">({{ anchorData?.lastWeekTime || "2025.xx.xx-2025.xx.xx" }})</span>
                </div>
                <div class="anchor-info-time">
                  {{ t("guild.main.diamondSum") }}
                  <span class="time-line">{{ anchorData?.lastTotalIncomeValue || 0 }}</span>
                </div>
              </div>
            </div>
            <div class="reward-receiveBox">
              <div class="reward-diamond-box">
                <div class="diamond-label">{{ t("guild.main.lastweekText") }}:</div>
                <div class="diamond-text">
                  <div class="diamond-icon"></div>
                  <span class="diamond-num">{{ anchorData.lastRewardValue || "0" }}</span>
                </div>
              </div>
              <!-- :disabled="this.anchorData.lastRewardReceiveStatus != 1" -->
              <div
                class="reward-btn"
                :class="{
                  activeBtn: anchorData.lastRewardReceiveStatus == 1,
                  hasBtn: anchorData.lastRewardReceiveStatus != 1,
                }"
                @click="getReward(anchorData.lastRewardReceiveStatus)"
              >
                {{ getRewardText(anchorData.lastRewardReceiveStatus || 0) }}
              </div>
            </div>
          </div>

          <div class="anchor-content level-box">
            <!-- 主播奖励等级 -->
            <div class="anchor-title level-title-cirle"></div>
            <div class="level-notice">
              <text>{{ t("guild.main.in-tips1") }}</text>
              <text>{{ t("guild.main.in-tips2") }}</text>
              <text>{{ t("guild.main.in-tips3") }}</text>
            </div>
            <div class="level-table">
              <custom-table :columns="columns" :rows="getColumn(anchorData?.taskInfoList)" tableType="2"></custom-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

import navBar from "@/components/navBar/navBar.vue";
import customTable from "@/components/customTable/customTable.vue";

const agentData = ref({});
const anchorData = ref({});
const defaultPic = ref("http://apitest.sanalive.online/asset/image/sana_icon.png");
const columns = [t("guild.main.in-column1"), t("guild.main.in-column2"), t("guild.main.in-column3")];

onMounted(() => {
  getAnchorInfo();
  getAnchorReward();
});

// 获取主播信息
const getAnchorInfo = async () => {
  try {
    const res = await get("/guild/home/detail", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      agentData.value = res.data || {};
    } else {
      console.error("Failed to fetch anchor info:", res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor info:", error);
  }
};

// 获取主播奖励信息
const getAnchorReward = async () => {
  try {
    const res = await postFormData("/anchorIncomeTask/getTaskInfo", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      taskType: "week",
    });
    if (res && res.code === 200) {
      anchorData.value = res.data || {};
    } else {
      console.error("Failed to fetch anchor reward:", res.message);
    }
  } catch (error) {
    console.error("Error fetching anchor reward:", error);
  }
};

//
const getRewardText = (val) => {
  if (val == 0) {
    return t("guild.main.nodraw");
  } else if (val == 1) {
    return t("guild.main.draw");
  } else if (val == 2) {
    return t("guild.main.hasdraw");
  } else {
    return t("guild.main.nodraw");
  }
};

const getColumn = (data) => {
  // 确保data是一个数组
  const rowData = Array.isArray(data) ? data : [];
  // 使用 map 方法对数组进行处理
  const output = rowData.map((item, index) => [
    index + 1 || "0", // 默认值处理
    item.incomeValue || "0",
    item.rewardValue || "0", // 默认值处理
  ]);

  return output;
};

const getReward = async (val) => {
  if (val != 1) {
    return;
  }
  try {
    const res = await postFormData("/anchorIncomeTask/receiveReward", {
      uid: store.uid,
      ticket: store.ticket,
      taskType: "week",
    });
    if (res && res.code === 200) {
      alert(t("drawSuccess"));
      getAnchorReward(); // 重新获取奖励信息以更新状态
    } else {
      console.error("Failed to receive reward:", res.message);
    }
  } catch (error) {
    console.error("Error receiving reward:", error);
  }
};

const back = () => {
  router.back();
};

// 离开公会
const leaveGuild = async () => {
  try {
    const res = await postFormData("/guild/sub/v2/relieve", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      alert(t("leaveSuccess"));
      router.push("/guild");
    } else {
      console.error("Failed to leave guild:", res.message);
    }
  } catch (error) {
    console.error("Error leaving guild:", error);
  }
};

// 复制公会ID
const copyId = (id) => {
  if (!id) return;
  navigator.clipboard
    .writeText(id)
    .then(() => {
      alert(t("copySuccess"));
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
};
</script>

<style scoped>
.anchor-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #312107;
}

.backup-agent {
  width: 100%;
  height: 400px;
  background: url("@/assets/p/guild/detail/backup-bg@2x.png") no-repeat;
  background-size: 100% 100%;
}

.anchor-scroll-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
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
  overflow-x: hidden;
  overflow-y: scroll;
}

.main-box {
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0 8px;
  box-sizing: border-box;
}

/*  */
.guild-box {
  width: 100%;
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.guild-cover {
  width: 80px;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guild-cover img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #333;
}

.guild-border {
  width: 176px;
  height: 112px;
  background: url("@/assets/p/guild/detail/subcover@2x.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: -24px;
}

.guild-name {
  font-size: 16px;
  font-weight: 600;
}

.guild-id {
  display: flex;
  gap: 10px;
  font-size: 13.6px;
}

.copy-id {
  width: 16px;
  height: 16px;
  background: url("@/assets/p/guild/detail/copy-icon@2x.png") no-repeat;
  background-size: 100% 100%;
}

.guildInfo-box {
  width: 100%;
  height: 160px;
  border-radius: 25px 25px 0 0;
  position: absolute;
  bottom: 0;
  padding: 8px 24px;
  box-sizing: border-box;
  position: relative;
  background: url("@/assets/p/guild/detail/card@2x.png") no-repeat;
  background-size: 100% 100%;
  color: #fff;
}

.agent-box {
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 8px;
  box-sizing: border-box;
  gap: 10px;
}

.agent-name {
  font-size: 13.6px;
  font-weight: 600;
}

.agent-cover {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.agent-cover img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.agent-cover-border {
  width: 56px;
  height: 56px;
  background: url("@/assets/p/guild/detail/cover-border@2x.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
}

.agent-introduce {
  width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.agent-tag {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
}

.agent-tag img {
  width: 38.4px;
  height: 17.6px;
  border-radius: 50%;
}

.agent-enter {
  width: 100%;
  height: 80px;
  border-radius: 10px 10px 0 0;
  box-sizing: border-box;
}

.agent-numbox {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  gap: 15px;
}

.agent-numItem {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
}

.agent-num-lable {
  text-align: center;
  font-size: 12.8px;
}

/*  */
.anchor-box {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.anchor-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: #efefef;
  border-radius: 20px;
  margin-bottom: 16px;
}

.anchor-content:last-child {
  margin-bottom: 0;
}

.reward-box {
  height: 480px;
  padding: 128px 16px 16px;
  box-sizing: border-box;
  background: url("@/assets/p/guild/detail/reward-backup.png") no-repeat;
  background-size: 100% 100%;
}

.level-box {
  min-height: 832px;
  padding: 128px 32px 16px;
  box-sizing: border-box;
  background: url("@/assets/p/guild/detail/level-backup.png") no-repeat;
  background-size: 100% 100%;
}

.anchor-title {
  width: 256px;
  background: #fff;
  height: 35.2px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;

  border-radius: 10px;
}

.reward-title-cirle {
  background: url("@/assets/p/guild/detail/StreamerWeekly-Rewards@2x.png") no-repeat;
  background-size: 100% 100%;
  transform: scale(0.8);
  top: 64px;
}

.level-title-cirle {
  background: url("@/assets/p/guild/detail/Anchor-Reward-Level@2x.png") no-repeat;
  background-size: 100% 100%;
  transform: scale(0.7);
  top: 60.8px;
}

.reward-sumBox {
  width: 90%;
  padding: 8px 32px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 0 20px 20px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: url("@/assets/p/guild/detail/info-card@2x.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 16px;
}

.anchor-info {
  width: calc(100% - 48px);
  padding: 0 8px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  font-size: 12.8px;
}

.anchor-info-name {
  min-width: 80px;
  height: 25.6px;
  background: url("@/assets/p/guild/detail/reward-name@2x.png") no-repeat;
  background-size: 100% 100%;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f9e595;
  font-weight: 600;
}

.anchor-info-time {
  display: inline-block;
  white-space: wrap;
  word-break: keep-all;
  color: #36150f;
  font-weight: 600;
}

.time-line {
  color: #fff;
}

.reward-receiveBox {
  width: 90%;
  height: 128px;
  background: #fff;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 25px;
  background: url("@/assets/p/guild/detail/text-box@2x.png") no-repeat;
  background-size: 100% 100%;
  font-weight: 600;
}

.diamond-label {
  color: #36150f;
  font-size: 13.6px;
}

.diamond-text {
  display: flex;
  gap: 5px;
  color: #fff;
  font-size: 14.4px;
}

.diamond-icon {
  width: 17.6px;
  height: 20.8px;
  background: url("@/assets/common/diamonds@2x.png") no-repeat;
  background-size: 100% 100%;
}

.diamond-num {
  font-size: 16px;
}

.reward-diamond-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.level-notice {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
  color: #fff;
  font-size: 12.8px;
}

.level-table {
  width: 100%;
  margin: 16px 0;
}

.reward-btn {
  min-width: 128px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13.6px;
  border-radius: 16px;
  border: 0;
  letter-spacing: 1px;
  padding: 0 16px;
}

.reward-receiveBox button:disabled {
  background: none;
  color: #fff;
}

uni-button[disabled]:not([type]) {
  color: rgba(0, 0, 0, 0.3);
  background-color: none;
}

.activeBtn {
  background: url("@/assets/p/guild/detail/recevie-btn@2x.png") no-repeat;
  background-size: 100% 100%;
  color: #ffeb99;
}

.hasBtn {
  color: #fff;
  font-weight: 600;
  background: url("@/assets/p/guild/detail/cancel-btn@2x.png") no-repeat;
  background-size: 100% 100%;
}
</style>
