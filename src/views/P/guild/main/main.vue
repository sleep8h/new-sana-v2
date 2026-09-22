<template>
  <div class="main-container">
    <div class="main-topup-box"></div>
    <div class="main-contain-box">
      <div class="nav-div-home">
        <div :class="['left', store.language != 'ar' ? 'left-icon' : 'right-icon']"></div>
        <div class="center">{{ t("guild.main.title") }}</div>
        <div class="right" @click="goToAnchor"></div>
      </div>

      <div class="guild-content">
        <!-- 公会主信息 -->
        <div class="guild-mainInfo">
          <div class="guild-cover">
            <img :src="list.masterAvatar" alt="" />
          </div>
          <div class="guild-info">
            <div class="guild-id">{{ t("guild.main.agencyId") }}：{{ list.guildId || 0 }}</div>
            <div class="guild-name">
              {{ t("guild.main.guildName") }}：{{ list.guildName || "null" }}
              <div class="guild-eidt" @click="openGuildName"></div>
            </div>
          </div>
        </div>
        <!-- 公会副信息 -->
        <div class="guild-levelInfo">
          <div class="bean-box">
            <div class="bean-info">
              <p class="bean-num">{{ list.totalGemIncome || 0 }}</p>
              <p class="bean-text">{{ t("guild.main.beans") }}</p>
            </div>
            <div class="ratio-text">{{ t("guild.main.ratio") }}：</div>
            <div class="ratio-usd">{{ list.currentGearRatio * 100 || 0 }}% {{ list.currentIncomeDollar || 0 }}USD</div>
          </div>
          <div class="progress-div">
            <div class="data-div">
              <div class="data-text" v-html="highlightText"></div>
              <div class="away-text">{{ list?.nextLevelGearRatio * 100 || 0 }} %</div>
            </div>
            <div class="progressInfo-div">
              <div class="progress-active" :style="{ width: list?.nextLevelGearRatio * 100 || 0 + '%' }"></div>
            </div>
          </div>
          <div class="bottom-bean">
            <div class="count-down-label">{{ t("guild.main.pageItemName") }}：</div>
            <div class="count-down-text">
              <!-- <CountDown :time="list.guildContributionWeekTaskEndTime || 0" format="DD:HH:MM" color="#F4D688" /> -->
            </div>
          </div>
          <div class="decorate-box"></div>
        </div>
        <!-- total data -->
        <div class="total-box">
          <div class="total-label">Total data</div>
          <div class="pannel-content">
            <div class="panel-div total-v1">
              <p class="font-text">{{ list.totalGemIncome || 0 }} {{ t("guild.main.beans") }}</p>
              <p class="pannel-label">{{ t("guild.main.thisWeek") }}</p>
            </div>
            <div class="panel-div total-v2">
              <p class="font-text">{{ list.lastWeekMemberGemIncome || 0 }} {{ t("guild.main.beans") }}</p>
              <p class="pannel-label">{{ t("guild.main.lastWeek") }}</p>
            </div>
            <div class="panel-div total-v3" @click="getMemberListPage">
              <p class="font-text">{{ list.memberCount || 0 }}/{{ list.memberCountMax || 0 }}</p>
              <p class="pannel-label">{{ t("guild.main.member") }}</p>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="list-box">
          <div class="list-itemBox" v-for="(item, index) in listItems" :key="index" @click="item.action">
            <div class="list-icon">
              <img :src="item.icon" alt="" />
            </div>
            <div class="list-item-name">{{ item.text }}</div>
          </div>
        </div>
        <!--  -->
      </div>
    </div>

    <!-- 修改工会名称 -->
    <!-- <PopupView01 :showPopup="showGuildName" @close="closeGuildPop">
				<div class="popup-title">
					{{t('guild.main.addPopTitle1')}}
				</div>
				<div class="popup-text">
					<div class="label-name">
						{{t('guild.main.guildName')}}
					</div>
					<div class="popup-input">
						<input type="text" v-model="guildNameVal" auto-focus="true" />
					</div>
				</div>
				<div class="popup-actions">
					<button @click="updateGuildName">{{t('guild.main.update')}}</button>
				</div>
			</PopupView01> -->
    <!-- showPenaltyPopup -->
    <!-- <PopupView01 :showPopup="showPenalty" @close="closePenaltyPop">
				<div class="popup-title">
					{{t('guild.main.tips')}}
				</div>
				<div class="popup-text">
					<text class="popup-faqText">{{t('guild.main.outTip')}}</text>
					<view class="radio-list">
						<radio-group @change="radioChange">
							<label class="radio-color" v-for="(item, index) in penaltyList" :key="item.diamonds">
								<view>
									<radio color="#9469fe" :value="item.diamonds" :checked="item.check" :disabled="!this.list.needPayExitFee" />
								</view>
								<view>{{item.diamonds}}</view>
							</label>
						</radio-group>
					</view>
					<view class="alert-text" v-if="!this.list.needPayExitFee">
						<view class="alert-icon"></view>
						<view class="alert-faq">
							{{t('guild.main.alertGuild')}}
						</view>
					</view>
				</div>
				<div class="popup-buttonBox">
					<button class="cancelBtn" @click="closePenaltyPop">{{t('guild.main.cancelText')}}</button>
					<button class="confirmBtn" @click="getPenalty">{{t('guild.main.confirmText')}}</button>
				</div>
			</PopupView01> -->
    <!-- 添加成员弹窗  -->
    <!-- <div v-if="showPopup" class="popup-overlay" @click="closePopup">
				<div class="popup-content" @click.stop>
					<div class="pop-tips" @click="openPicPopup">
						<img src="@/assets/p/guild/main/yiwen.png" alt="" />
					</div>
					<div class="popup-title">
						{{t('guild.main.addPopTitle')}}
					</div>
					<div class="popup-text">
						<div class="label-name">
							{{t('guild.main.inviteCode')}}
						</div>
						<div class="popup-input">
							<input type="text" v-model="guildInviteCode" auto-focus="true" />
						</div>
					</div>
					<div class="popup-actions">
						<button @click="confrim">{{t('guild.main.confirm')}}</button>
					</div>
				</div>
			</div> -->
    <!-- 图片弹窗  -->
    <!-- <div v-if="picPopup" class="popup-overlay" @click="closePicPopup">
				<div class="popup-content-tip" @click.stop>
					<div class="popup-cancel" @click="closePicPopup">
						<div class="popup-cancel-icon">
							<img src="@/assets/p/guild/main/cancel@2x.png" alt="" />
						</div>
					</div>
		
					<div class="popup-img-list">
		
						<text class="img-list-title">{{t('guild.main.picTipTitle')}}</text>
						<text>{{t('guild.main.picTip1')}}</text>
						<text>{{t('guild.main.picTip2')}}</text>
						<text>{{t('guild.main.picTip3')}}</text>
						<text>{{t('guild.main.picTip4')}}</text>
						<text>{{t('guild.main.picTip5')}}</text>
		
						<text>{{t('guild.main.picTip6')}}</text>
						<div>
							<img src="@/assets/p/guild/main/id-tip.png" v-if="this.language != 'ar'" alt="" />
							<img src="@/assets/p/guild/main/ar-tip.png" v-else alt="" />
						</div>
						<text>{{t('guild.main.picTip7')}}</text>
						<div>
							<img src="@/assets/p/guild/main/code-tip.png" v-if="this.language != 'ar'" alt="" />
							<img src="@/assets/p/guild/main/code-tip-ar.png" v-else alt="" />
						</div>
					</div>
		
				</div>
			</div> -->
    <!-- 添加子公会 -->
    <!-- <div v-if="showSubInvite" class="popup-overlay" @click="cancelInviteSub">
				<div class="popup-content" @click.stop>
					<div class="popup-textBox">
						<div class="label-name">{{t('guild.main.subInviteText')}}</div>
						<div class="popup-input">
							<input type="text" v-model="subInviteCode" auto-focus="true" />
						</div>
					</div>
					<div class="popup-actionBox">
						<button class="cancel-btn" @click="cancelInviteSub">{{t('guild.main.cancel')}}</button>
						<button class="sure-btn" @click="inviteSubGuild">{{t('guild.main.confirm')}}</button>
					</div>
				</div>
			</div> -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
// import PopupView01 from '@/components/popupView01/popupView01.vue'
// import CountDown from '@/components/countDown/countDown.vue'

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

// 响应式数据
import cycleRewardIcon from "@/assets/p/guild/main/icon/Weekly-bonus@2x.png";
import memberIcomeIcon from "@/assets/p/guild/main/icon/Member-income@2x.png";
import inviteMemberIcon from "@/assets/p/guild/main/icon/Invite-members@2x.png";
import applyManageIcon from "@/assets/p/guild/main/icon/Apple-management@2x.png";
import penaltyIcon from "@/assets/p/guild/main/icon/Guild-quitting-penalty@2x.png";
import incomeRewardIcon from "@/assets/p/guild/main/icon/Income-rewards@2x.png";
import withdrawIcon from "@/assets/p/guild/main/icon/Agency-withdrawal@2x.png";
import subGuildIcon from "@/assets/p/guild/main/icon/Sub-guild-income@2x.png";
import subInviteIcon from "@/assets/p/guild/main/icon/Invite-sub-guild@2x.png";
const listItems = [
  {
    icon: cycleRewardIcon,
    text: t("guild.main.pageTitle1"),
    action: () => {
      // Handle item 1 action
    },
  },
  {
    icon: memberIcomeIcon,
    text: t("guild.main.memberIncome"),
    action: () => {
      // Handle item 1 action
    },
  },
  {
    icon: inviteMemberIcon,
    text: t("guild.main.inviteMember"),
    action: () => {
      router.push("/P/guild/invite");
    },
  },
  {
    icon: applyManageIcon,
    text: t("guild.main.Manger"),
    action: () => {
      router.push("/P/guild/apply");
    },
  },
  {
    icon: penaltyIcon,
    text: t("guild.main.pageTitle2"),
    action: () => {
      // openPenalty()
    },
  },
  {
    icon: incomeRewardIcon,
    text: t("guild.main.incomeReward"),
    action: () => {
      router.push("/P/guild/incomeReward");
    },
  },
  {
    icon: withdrawIcon,
    text: t("guild.main.withdraw"),
    action: () => {
      router.push("/P/guild/withdraw");
    },
  },
  {
    icon: subGuildIcon,
    text: t("guild.main.subIncome"),
    action: () => {
      router.push("/P/guild/subIncome");
    },
  },
  {
    icon: subInviteIcon,
    text: t("guild.main.subInvite"),
    action: () => {
      openInviteSub();
    },
  },
];

// 生命周期
onMounted(async () => {
  await getCheckGuild();
});

// 高亮文本
const highlightText = computed(() => {
  // 检查数据是否存在
  if (!list || list.nextLevelValue === undefined || list.nextLevelValue === null) {
    return t("guild.main.levelText", { gold: "0" }); // 提供默认值
  }

  const gold = `<span class="highlight-number" style="color:#F4D688">${this.list.nextLevelValue || 0}K</span>`;
  const result = t("guild.main.levelText", { gold });
  return result;
});

// 获取公会信息
const list = reactive({});
const getCheckGuild = async () => {
  try {
    const response = await get("/guild/getMyGuildDetail", {
      uid: store.uid,
      ticket: store.ticket,
    });
    if (response && response.code === 200) {
      list.value = response.data;
    } else {
      console.error("Failed to fetch guild data:", response.message);
    }
  } catch (error) {
    console.error("Error fetching guild data:", error);
  }
};

// 子公会邀请码大写
const subInviteCode = ref("");
const handleSubInviteInput = (event) => {
  subInviteCode.value = event.target.value.toUpperCase();
};

// 跳转主播页面
const goToAnchor = () => {
  router.push("/guild/anchor");
};
</script>

<style scoped>
.main-container {
  width: 100%;
  height: 100%;
  background: #f6f7f9;
  position: relative;
}

.main-topup-box {
  width: 100%;
  height: 376px;
  background: url("@/assets/p/guild/main/guild-cardBg@2x.png") no-repeat;
  background-size: 100% 100%;
}

.main-contain-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}

.nav-div-home {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 12.8px;
  color: #fff;
  font-weight: 600;
  margin-top: 16px;
}

.left {
  width: 16px;
  height: 16px;
}

.left-icon {
  background: url("@/assets/common/left-icon@2x.png") no-repeat;
  background-size: 100% 100%;
}

.right-icon {
  background: url("@/assets/common/right-icon@2x.png") no-repeat;
  background-size: 100% 100%;
}

.center {
  width: calc(100% - 64px);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right {
  width: 24px;
  height: 24px;
  margin: 0 4px;
  box-sizing: border-box;
  background: url("@/assets/common/exchange-icon@2x.png") no-repeat;
  background-size: 100% 100%;
}

.guild-content {
  width: 100%;
  height: calc(100% - 64px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 16px;
  box-sizing: border-box;
}

.guild-mainInfo {
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
}

.guild-cover {
  width: 48px;
  height: 48px;
  background: #fff;
  border-radius: 50%;
}

.guild-cover img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.guild-info {
  width: calc(100% - 48px);
  height: 100%;
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.guild-name {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.guild-eidt {
  width: 19.2px;
  height: 19.2px;
  background: url("@/assets/common/edit-icon@2x.png") no-repeat;
  background-size: 100% 100%;
  margin: 0 8px;
}

/*  */
.guild-levelInfo {
  width: 100%;
  height: 176px;
  background: url("@/assets/p/guild/main/card-bg@2x.png") no-repeat;
  background-size: 100% 100%;
  margin: 16px 0;
  padding: 16px;
  box-sizing: border-box;
  position: relative;
}

.bean-box {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 5px;
  margin-bottom: 16px;
}

.bean-info {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 16px;
}

.bean-num {
  height: 100%;
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(179deg, #f4da93 0%, #f2cc6a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bean-text {
  font-size: 12px;
  color: #f4d688;
}

.ratio-text {
  font-size: 12px;
  color: rgba(244, 214, 136, 0.5);
}

.ratio-usd {
  font-size: 12px;
  color: #f4d688;
}

/* 进度条 */
.progress-div {
  width: 100%;
  margin-bottom: 8px;
  font-size: 12px;
  color: rgba(244, 214, 136, 0.5);
}

.data-div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-text {
  color: rgba(244, 214, 136, 0.5);
}

.data-text .highlight-number {
  color: #f4d688 !important;
  font-weight: 600;
}

.progressInfo-div {
  width: 100%;
  height: 4px;
  background: #fff;
  border-radius: 20px;
  position: relative;
  margin: 8px 0;
}

.progress-active {
  position: absolute;
  height: 4px;
  background: #e78d07;
  border-radius: 20px;
}

.bottom-bean {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.count-down-label {
  color: rgba(244, 214, 136, 0.5);
}

.count-down-text {
  color: #f4d688;
}

.decorate-box {
  width: 104px;
  height: 80px;
  background: url("@/assets/p/guild/main/decorate@2x.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  right: 24px;
  top: -8px;
}

/*  */
.total-box {
  width: 100%;
  min-height: 144px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 16px 12.8px;
  box-sizing: border-box;
}

.total-label {
  width: 100%;
  height: 16px;
  font-size: 16px;
  font-weight: 600;
}

.pannel-content {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  gap: 10px;
}

.panel-div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 5px 8px;
  box-sizing: border-box;
}

.font-text {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14.4px;
  height: 40%;
}

.pannel-label {
  font-size: 12px;
  text-align: center;
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #878e9a;
}

.total-v1 {
  background: #e8fffb;
}

.total-v2 {
  background: #fff7e5;
}

.total-v3 {
  background: #e8f5ff;
}

/* list-box */
.list-box {
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  background: #fff;
  margin: 16px 0;
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  /* 确保所有行高度相等 */
  gap: 10px;
  align-items: stretch;
  /* 拉伸所有项目到相同高度 */
}

.list-itemBox {
  width: 100%;
  min-height: 80px;
  /* 设置最小高度 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* 图标在顶部，文字在底部 */
  align-items: center;
  padding: 8px 3.2px;
  /* 添加内边距 */
  box-sizing: border-box;
}

.list-item-name {
  width: 100%;
  text-align: center;
  font-size: 12.8px;
  padding: 4.8px 5px;
  box-sizing: border-box;
  /* 文本换行和超出处理 */
  white-space: normal;
  /* 允许换行 */
  word-wrap: break-word;
  /* 长单词换行 */
  word-break: keep-all;
  /* 强制换行 */
  line-height: 1.2;
  /* 设置行高 */
  /* 限制最多显示2行，超出显示省略号 */
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  /* 防止图标被压缩 */
}

.list-icon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

/*  */
/*遮罩层*/
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* 弹出框 */
.popup-content {
  width: 80%;
  max-width: 480px;
  height: auto;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 0 9.6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.pop-tips {
  display: inline;
  position: absolute;
  right: 16px;
  width: 16px;
  height: 16px;
}

.pop-tips-img {
  width: 100%;
  height: 100%;
}

.popup-content-tip {
  width: 80%;
  max-width: 480px;
  height: 80vh;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 0 9.6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.popup-cancel {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.popup-cancel-icon {
  width: 16px;
  height: 16px;
}

.popup-cancel-icon img {
  width: 100%;
  height: 100%;
}

.popup-img-list {
  width: 100%;
  height: calc(100% - 40px);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.popup-img-list text {
  text-align: left;
  padding: 6.4px 0;
}

.img-list-title {
  font-weight: 600;
}

.pic-tip-img {
  width: 100%;
}

.pic-tip-img img {
  width: 100%;
  height: 100%;
}

.popup-text {
  width: 100%;
  height: auto;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.popup-textBox {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}

.popup-textBox input {
  text-align: left;
  height: 16px;
  padding: 8px 16px;
  background: #f3f3f3;
  border-radius: 10px;
}

.popup-input {
  width: 100%;
}

.popup-text input {
  text-align: left;
  padding: 8px 16px;
  background: #f3f3f3;
  border-radius: 50px;
}

.popup-text .label-name {
  margin: 8px 0;
  font-size: 12.8px;
  font-weight: 600;
}

.popup-content text {
  padding: 9.6px 0;
}

.popup-actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 8px;
}

.popup-actions button {
  width: 100%;
  height: 16px;
  line-height: 16px;
  font-size: 16px;
  color: #333;
  background: #9469fe;
  border-radius: 18px;
  color: #fff;
}

.popup-actionBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  gap: 25px;
}

.popup-actionBox button {
  width: 100%;
  height: 44.8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  border-radius: 25px;
}

.sure-btn {
  background: #00dbb3;
  color: #fff;
}

.cancel-btn {
  background: #e6e7eb !important;
  color: #878e9a;
}

.popup-title {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}

.close-div {
  width: 100%;
  text-align: right;
}

.close-div text {
  padding: 10px;
  font-size: 24px;
}

.radio-color {
  display: flex;
  margin-bottom: 16px;
}

.radio-color radio {
  transform: scale(0.7);
}

.popup-faqText {
  text-align: left;
  word-break: break-word;
  font-size: 16px;
  font-weight: 600;
}

.alert-text {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.alert-icon {
  width: 19.2px;
  height: 19.2px;
  background: url("@/assets/common/alert.png") no-repeat;
  background-size: 100% 100%;
}

.alert-faq {
  width: calc(100% - 24px);
  padding: 0 8px;
  box-sizing: border-box;
  text-align: left;
}

.popup-buttonBox {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
}

.popup-buttonBox uni-button:after {
  border: none;
}

.popup-actionBox uni-button:after {
  border: none;
}

.cancelBtn {
  width: 104px;
  height: 40px;
  line-height: 40px;
  background: #e6e7eb;
  color: #9fa2b3;
  border-radius: 20px;
}

.confirmBtn {
  width: 104px;
  height: 40px;
  line-height: 40px;
  background: #9469fe;
  color: #fff;
  border-radius: 20px;
  border-radius: 20px;
}
</style>
