<!-- 礼物页：两位名人礼物对战 + 奖励路线 + 贡献榜 -->
<template>
  <div class="gift-battle">
    <!-- 名人对战区 -->
    <div class="versus">
      <div
        v-for="(celebrity, side) in [info.celebrityA, info.celebrityB]"
        :key="side"
        class="celebrity"
        :class="{ 'celebrity-right': side === 1, 'celebrity-ar': store.language === 'ar' }"
      >
        <div class="supporters">
          <img v-for="(user, i) in celebrity.topUsers || []" :key="i" :src="user.avatar" alt="" />
        </div>
        <div class="portrait">
          <img :src="celebrity.avatar" alt="" />
          <div class="crown-badge" v-if="side === 0"></div>
        </div>
        <div class="name-plate text-hide">{{ celebrityName(celebrity) }}</div>
        <div class="support-btn" @click="support(side === 0 ? 1 : 2)">
          {{ $t("celebrityGifts.support") }}
        </div>
      </div>
      <div class="vs-badge">VS</div>
    </div>

    <!-- 双方比分条 -->
    <div class="score-bar" :class="{ 'score-bar-ar': store.language === 'ar' }">
      <div class="bar-side bar-a" :style="{ width: sideWidth(info.celebrityA.score, info.celebrityB.score) }">
        <span>{{ formatNumber(info.celebrityA.score) }}</span>
      </div>
      <div class="bar-side bar-b" :style="{ width: sideWidth(info.celebrityB.score, info.celebrityA.score) }">
        <span>{{ formatNumber(info.celebrityB.score) }}</span>
      </div>
    </div>

    <!-- 王座奖励 + 倒计时 -->
    <div class="panel stage-panel">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.richesRoad") }}</span>
      </div>
      <div class="throne">
        <div class="prize prize-side" v-for="(prize, i) in sidePrizes" :key="i">
          <div class="shield">
            <giftBox :color="prize.color" :gift-url="prize.rewardUrl" :size="34" />
          </div>
          <div class="prize-name text-hide">{{ prizeName(prize) }}</div>
          <div class="prize-lock"></div>
        </div>
        <div class="prize prize-center">
          <giftBox :color="centerPrize?.color ?? 0" :gift-url="centerPrize?.rewardUrl" :size="58" />
          <div class="throne-chair"></div>
          <div class="prize-name text-hide">{{ centerPrize ? prizeName(centerPrize) : "" }}</div>
        </div>
      </div>
    </div>

    <!-- 礼物目标奖励路线 -->
    <div class="panel reward-group" v-for="group in info.rewardGroups" :key="group.id">
      <div class="panel-title">
        <span>{{ groupTitle(group) }}</span>
      </div>
      <div class="gift-row">
        <div class="gift-item" v-for="gift in group.gifts" :key="gift.giftId">
          <giftBox :color="gift.color" :gift-url="gift.rewardUrl" :size="48" />
          <div class="gift-name text-hide">{{ giftName(gift) }}</div>
          <div class="gift-value">x{{ gift.rewardValue }}</div>
        </div>
      </div>
      <div class="target-line">
        <span>{{ $t("celebrityGifts.target") }}</span>
        <span class="target-num">{{ group.target }}</span>
      </div>
      <div class="roadmap-support" @click="support(info.userInfo?.selectedTeam || 0, group.gifts[0])">
        {{ $t("celebrityGifts.goSupport") }}
      </div>
    </div>

    <!-- 贡献榜预览 -->
    <div class="panel rank-preview">
      <div class="panel-title">
        <span>{{ $t("celebrityGifts.topSupporters") }}</span>
      </div>
      <div class="rank-item" v-for="item in rankList.slice(0, 5)" :key="item.uid">
        <div class="sort" :class="{ 'sort-top': item.index <= 3 }">{{ item.index }}</div>
        <img class="avatar" :src="item.avatar" alt="" />
        <div class="name text-hide">{{ item.nick }}</div>
        <div class="country">{{ item.country }}</div>
        <div class="score">{{ formatNumber(item.integral) }}</div>
      </div>
      <div class="empty" v-if="rankList.length === 0">{{ $t("celebrityGifts.noRank") }}</div>
    </div>

    <!-- 我的贡献（底部固定） -->
    <div class="my-bar" :class="{ 'my-bar-ar': store.language === 'ar' }">
      <img class="my-avatar" :src="info.userInfo?.avatar" alt="" />
      <div class="my-name text-hide">{{ info.userInfo?.nick }}</div>
      <div class="my-prop">
        <span>{{ $t("celebrityGifts.myItems") }}</span>
        <b>{{ info.userInfo?.availablePropCount ?? 0 }}</b>
      </div>
      <div class="my-contribution">
        <span>{{ $t("celebrityGifts.contribution") }}</span>
        <b>{{ formatNumber(info.userInfo?.contribution ?? 0) }}</b>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import "vant/es/toast/style";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import giftBox from "./components/giftBox.vue";
import { withMock, mockInfo, mockRank, USE_MOCK } from "./mock.js";

const store = useMainStore();
const { t } = useI18n();

const info = ref({
  timeOut: 0,
  celebrityA: { score: 0, topUsers: [] },
  celebrityB: { score: 0, topUsers: [] },
  rewardGroups: [],
  thronePrizes: [],
  userInfo: { nick: "", avatar: "", contribution: 0, availablePropCount: 0, selectedTeam: 0 },
});
const rankList = ref([]);

const sidePrizes = computed(() => (info.value.thronePrizes || []).filter((item) => !item.center));
const centerPrize = computed(() => (info.value.thronePrizes || []).find((item) => item.center));

const celebrityName = (c) => (store.language === "ar" ? c.nickAr || c.nick : c.nick);
const giftName = (g) => (store.language === "ar" ? g.rewardNameAr || g.rewardName : g.rewardName);
const prizeName = (p) => (store.language === "ar" ? p.rewardNameAr || p.rewardName : p.rewardName);
const groupTitle = (g) => (store.language === "ar" ? g.titleAr || g.title : g.title);

const sideWidth = (a, b) => {
  const total = Number(a || 0) + Number(b || 0);
  if (total === 0) return "50%";
  return (Number(a) / total) * 100 + "%";
};

const formatNumber = (num) => Number(num || 0).toLocaleString("en-US");

// 活动信息
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
  info.value = data;
};

// 贡献榜
const getRank = async () => {
  const data = await withMock(
    () =>
      get("/h5doings/activity/celebrityGift2026/rank", {
        uid: store.uid,
        size: 100,
        type: 1,
        ticket: store.ticket,
        language: store.language,
      }),
    mockRank,
  );
  rankList.value = data.list || [];
};

// 应援送礼：team 1=名人A 2=名人B
const support = async (team, gift) => {
  if (!team) {
    showToast(t("celebrityGifts.chooseTip"));
    return;
  }
  // 接口未上线：本地模拟应援加分
  if (USE_MOCK) {
    showToast(t("celebrityGifts.supportSuccess"));
    if (team === 1) info.value.celebrityA.score += 100;
    if (team === 2) info.value.celebrityB.score += 100;
    if (info.value.userInfo) info.value.userInfo.contribution += 100;
    return;
  }
  try {
    const res = await postFormData("/h5doings/activity/celebrityGift2026/pay", {
      type: 1,
      team,
      giftId: gift?.giftId || 0,
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      showToast(res.message || t("celebrityGifts.supportSuccess"));
      await getActivityInfo();
    } else {
      showToast(res?.message || t("celebrityGifts.supportSuccess"));
    }
  } catch (e) {
    // 本地演示：直接模拟加分
    showToast(t("celebrityGifts.supportSuccess"));
    if (team === 1) info.value.celebrityA.score += 100;
    if (team === 2) info.value.celebrityB.score += 100;
    if (info.value.userInfo) info.value.userInfo.contribution += 100;
  }
};

onMounted(async () => {
  await getActivityInfo();
  await getRank();
});
</script>

<style lang="scss" scoped>
.gift-battle {
  width: 100%;
  padding: 0 12px 86px;
  color: #ffe9c7;

  .versus {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 6px 6px 0;

    .celebrity {
      width: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .supporters {
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 4px;
        > img {
          width: 24px;
          height: 24px;
          margin: 0 -3px;
          border-radius: 50%;
          border: 1px solid #f2cd63;
          object-fit: cover;
          background: #2a060a;
        }
      }
      .portrait {
        position: relative;
        width: 92px;
        height: 92px;
        padding: 3px;
        border-radius: 50%;
        background: linear-gradient(135deg, #fff0b8 0%, #d69f2e 45%, #7c4f10 100%);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          background: #3a0d12;
        }
        .crown-badge {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          width: 26px;
          height: 16px;
          background: linear-gradient(180deg, #fff0b8 0%, #e0a92f 100%);
          clip-path: polygon(0 100%, 0 35%, 18% 65%, 34% 15%, 50% 65%, 66% 15%, 82% 65%, 100% 35%, 100% 100%);
        }
      }
      .name-plate {
        max-width: 132px;
        margin-top: 7px;
        height: 20px;
        padding: 0 10px;
        border-radius: 10px;
        border: 1px solid rgba(242, 205, 99, 0.7);
        background: linear-gradient(180deg, rgba(90, 18, 24, 0.95), rgba(45, 6, 10, 0.95));
        font-weight: bold;
        font-size: 12px;
        line-height: 18px;
        color: #ffdf9a;
        text-align: center;
      }
      .support-btn {
        margin-top: 8px;
        width: 110px;
        height: 32px;
        border-radius: 16px;
        border: 1px solid #f7d264;
        background: linear-gradient(180deg, #f4423f 0%, #b0121b 55%, #8a0b12 100%);
        box-shadow:
          inset 0 1px 0 rgba(255, 220, 160, 0.5),
          0 3px 8px rgba(0, 0, 0, 0.45);
        font-weight: bold;
        font-size: 14px;
        line-height: 30px;
        text-align: center;
        color: #ffe9b0;
        text-shadow: 0 1px 2px rgba(60, 0, 0, 0.6);
        &:active {
          transform: scale(0.96);
        }
      }
    }
    .celebrity-right {
      .portrait {
        background: linear-gradient(135deg, #ffe2d2 0%, #d8732e 45%, #7c2a10 100%);
      }
    }
    .vs-badge {
      position: absolute;
      top: 46px;
      left: 50%;
      transform: translateX(-50%);
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 2px solid #f2cd63;
      background: radial-gradient(circle at 35% 30%, #7a1420 0%, #35050a 75%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      font-family: LogoSCUnboundedSans, sans-serif;
      font-weight: bold;
      font-size: 16px;
      line-height: 38px;
      text-align: center;
      background-image: radial-gradient(circle at 35% 30%, #7a1420 0%, #35050a 75%);
      color: #f7d264;
    }
  }

  .score-bar {
    display: flex;
    margin: 12px 4px 14px;
    height: 22px;
    border-radius: 11px;
    overflow: hidden;
    border: 1px solid rgba(242, 205, 99, 0.6);
    background: #2a060a;
    .bar-side {
      height: 100%;
      min-width: 36px;
      display: flex;
      align-items: center;
      padding: 0 8px;
      font-weight: bold;
      font-size: 11px;
      color: #4a1500;
      white-space: nowrap;
    }
    .bar-a {
      justify-content: flex-start;
      background: linear-gradient(90deg, #c98a1c 0%, #f7d264 100%);
    }
    .bar-b {
      justify-content: flex-end;
      background: linear-gradient(90deg, #ff7a6a 0%, #d81f2a 100%);
      color: #fff;
      text-shadow: 0 1px 2px rgba(80, 0, 0, 0.6);
    }
  }
  .score-bar-ar {
    .bar-a {
      justify-content: flex-end;
    }
    .bar-b {
      justify-content: flex-start;
    }
  }

  .panel {
    position: relative;
    margin-bottom: 14px;
    padding: 34px 12px 14px;
    border-radius: 14px;
    border: 1px solid rgba(231, 183, 64, 0.55);
    background:
      linear-gradient(180deg, rgba(103, 16, 24, 0.92) 0%, rgba(43, 6, 10, 0.95) 100%);
    box-shadow:
      inset 0 0 18px rgba(0, 0, 0, 0.35),
      0 4px 14px rgba(0, 0, 0, 0.35);

    .panel-title {
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      height: 28px;
      min-width: 168px;
      padding: 0 22px;
      border-radius: 0 0 12px 12px;
      background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        font-weight: bold;
        font-size: 14px;
        line-height: 16px;
        color: #5c1503;
        white-space: nowrap;
      }
    }
  }

  .stage-panel {
    padding-top: 40px;
    .throne {
      position: relative;
      margin-top: 16px;
      height: 150px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .prize {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .prize-side {
        width: 92px;
        .shield {
          width: 72px;
          height: 82px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-bottom: 8px;
          background: linear-gradient(180deg, #fff0b8 0%, #d69f2e 50%, #8a5a14 100%);
          clip-path: polygon(0 0, 100% 0, 100% 68%, 50% 100%, 0 68%);
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
        }
        .prize-name {
          max-width: 88px;
          margin-top: 4px;
          font-size: 11px;
          line-height: 15px;
          color: #ffdf9a;
          text-align: center;
        }
        .prize-lock {
          width: 10px;
          height: 8px;
          margin-top: 2px;
          border: 1px solid #f2cd63;
          border-radius: 2px;
          position: relative;
          &::before {
            content: "";
            position: absolute;
            top: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 7px;
            height: 6px;
            border: 1px solid #f2cd63;
            border-bottom: none;
            border-radius: 7px 7px 0 0;
          }
        }
      }
      .prize-center {
        position: absolute;
        bottom: 26px;
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
        z-index: 2;
        .throne-chair {
          width: 96px;
          height: 64px;
          margin-top: -4px;
          background:
            radial-gradient(circle at 50% 0, rgba(255, 220, 150, 0.35) 0%, transparent 60%),
            linear-gradient(180deg, #9e1b26 0%, #5e0d14 100%);
          border: 2px solid #e7b740;
          border-radius: 46px 46px 8px 8px;
          box-shadow: inset 0 0 14px rgba(0, 0, 0, 0.45);
          position: relative;
          &::before {
            content: "";
            position: absolute;
            top: -9px;
            left: -6px;
            right: -6px;
            height: 10px;
            border: 2px solid #e7b740;
            border-bottom: none;
            border-radius: 10px 10px 0 0;
          }
          &::after {
            content: "";
            position: absolute;
            bottom: -12px;
            left: -14px;
            width: calc(100% + 28px);
            height: 12px;
            border-radius: 4px;
            background: linear-gradient(180deg, #f2cd63 0%, #a8741c 100%);
            border: 1px solid #8a5a14;
          }
        }
        .prize-name {
          margin-top: 16px;
          max-width: 120px;
          font-weight: bold;
          font-size: 12px;
          line-height: 16px;
          color: #ffe0a0;
          text-align: center;
        }
      }
    }
  }

  .reward-group {
    .gift-row {
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      .gift-item {
        width: 86px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .gift-name {
          max-width: 86px;
          margin-top: 6px;
          font-size: 11px;
          line-height: 15px;
          color: #ffdf9a;
          text-align: center;
        }
        .gift-value {
          font-size: 10px;
          line-height: 14px;
          color: #f2cd63;
        }
      }
    }
    .target-line {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 11px;
      color: #e9c889;
      .target-num {
        margin-left: 6px;
        font-weight: bold;
        color: #f7d264;
      }
    }
    .roadmap-support {
      margin: 10px auto 0;
      width: 168px;
      height: 34px;
      border-radius: 17px;
      border: 1px solid #f7d264;
      background: linear-gradient(180deg, #f4423f 0%, #a30d14 100%);
      box-shadow: inset 0 1px 0 rgba(255, 220, 160, 0.45);
      font-weight: bold;
      font-size: 14px;
      line-height: 32px;
      text-align: center;
      color: #ffe9b0;
      &:active {
        transform: scale(0.96);
      }
    }
  }

  .rank-preview {
    .rank-item {
      display: flex;
      align-items: center;
      height: 46px;
      margin-bottom: 8px;
      padding: 0 10px;
      border-radius: 10px;
      border: 1px solid rgba(231, 183, 64, 0.4);
      background: linear-gradient(90deg, rgba(74, 13, 19, 0.85) 0%, rgba(30, 5, 9, 0.85) 100%);
      .sort {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        border-radius: 6px;
        background: rgba(242, 205, 99, 0.16);
        font-weight: bold;
        font-size: 12px;
        line-height: 24px;
        text-align: center;
        color: #e9c889;
      }
      .sort-top {
        background: linear-gradient(180deg, #f2cd63 0%, #c1892b 100%);
        color: #5c1503;
      }
      .avatar {
        width: 32px;
        height: 32px;
        margin-right: 8px;
        border-radius: 50%;
        border: 1px solid #e7b740;
        object-fit: cover;
      }
      .name {
        flex: 1;
        font-size: 13px;
        color: #ffe9c7;
      }
      .country {
        margin-right: 8px;
        padding: 0 5px;
        height: 16px;
        border-radius: 3px;
        border: 1px solid rgba(242, 205, 99, 0.5);
        font-size: 9px;
        line-height: 14px;
        color: #e9c889;
      }
      .score {
        max-width: 96px;
        font-weight: bold;
        font-size: 13px;
        color: #f7d264;
        text-align: right;
      }
    }
    .empty {
      height: 90px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      color: #e9c889;
    }
  }

  .my-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 20;
    width: 100%;
    height: 62px;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    border-top: 1px solid rgba(242, 205, 99, 0.55);
    background: linear-gradient(180deg, #5a1018 0%, #2a060a 100%);
    .my-avatar {
      width: 40px;
      height: 40px;
      margin-right: 8px;
      border-radius: 50%;
      border: 1px solid #f2cd63;
      object-fit: cover;
    }
    .my-name {
      max-width: 100px;
      font-weight: bold;
      font-size: 13px;
      color: #ffffff;
    }
    .my-prop,
    .my-contribution {
      margin-left: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 10px;
      line-height: 14px;
      color: #e9c889;
      > b {
        font-size: 15px;
        line-height: 20px;
        color: #f7d264;
      }
    }
    .my-prop {
      margin-left: 12px;
    }
  }
  .my-bar-ar {
    direction: rtl;
    .my-avatar {
      margin-right: 0;
      margin-left: 8px;
    }
    .my-name {
      text-align: right;
    }
    .my-prop {
      margin-left: 0;
      margin-right: 12px;
    }
    .my-prop,
    .my-contribution {
      margin-left: 0;
      align-items: flex-start;
    }
  }
}
</style>
