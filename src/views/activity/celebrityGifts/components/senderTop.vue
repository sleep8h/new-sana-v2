<!-- 礼物发送者 TOP10 弹窗 -->
<template>
  <div class="sender-top-modal" v-if="isShow">
    <div class="modal-mask" @click="closeModal"></div>
    <div class="modal-content" @click="closeModal">
      <div class="modal-body" @click.stop>
        <!-- 关闭按钮 -->
        <div class="close-btn" @click="closeModal"></div>
        <!-- 标题 -->
        <div class="modal-title">
          <div class="gift-name">{{ giftName }}</div>
          <div class="top-label">{{ $t("celebrityGifts.top10Sender") }}</div>
        </div>
        <!-- 列表 -->
        <div class="sender-list">
          <div
            class="sender-item"
            v-for="(item, index) in displayList"
            :key="item.uid || index"
            :class="{ 'sender-item-ar': store.language === 'ar' }"
          >
            <div class="rank-num">{{ padZero(item.index || index + 1) }}</div>
            <img class="avatar" :src="item.giftPicUrl" alt="" />
            <div class="name text-hide">{{ item.giftName }}</div>
            <div class="score">X{{ formatNumber(item.giftCount ?? 0) }}</div>
          </div>
        </div>
        <div class="empty" v-if="displayList.length === 0">{{ $t("celebrityGifts.noRank") }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMainStore } from "@/pinia/index.js";
import defaultAvatar from "@/assets/common/user-avatar-default.png";

const store = useMainStore();

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array,
    default: () => [],
  },
  giftName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:isShow", "close"]);

const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};

const formatNumber = (num) => Number(num || 0).toLocaleString("en-US");
const padZero = (num) => String(num).padStart(2, "0");

const getCountryFlag = (country) => {
  return `https://flagcdn.com/w40/${country.toLowerCase()}.png`;
};

// 假数据：当传入的 list 为空时，展示 10 条演示数据
const mockSenderList = [
  { uid: 8000000, nick: "UESRNAME123...", avatar: defaultAvatar, integral: 6666, country: "US", index: 1 },
  { uid: 8000001, nick: "UESRNAME123...", avatar: defaultAvatar, integral: 5555, country: "BR", index: 2 },
  { uid: 8000002, nick: "UESRNAME123...", avatar: defaultAvatar, integral: 4444, country: "TR", index: 3 },
  { uid: 8000003, nick: "UESRNAME123...", avatar: defaultAvatar, integral: 3333, country: "EG", index: 4 },
  { uid: 8000004, nick: "UESRNAME123...", avatar: defaultAvatar, integral: 2222, country: "SA", index: 5 },
  { uid: 8000005, nick: "UESRNAME123...", avatar: defaultAvatar, integral: 1111, country: "IN", index: 6 },
  { uid: 8000006, nick: "UESRNAME123...", avatar: defaultAvatar, integral: 999, country: "ID", index: 7 },
  { uid: 8000007, nick: "UESRNAME123...", avatar: defaultAvatar, integral: 888, country: "PK", index: 8 },
  { uid: 8000008, nick: "UESRNAME123...", avatar: defaultAvatar, integral: 777, country: "US", index: 9 },
  { uid: 8000009, nick: "UESRNAME123...", avatar: defaultAvatar, integral: 666, country: "BR", index: 10 },
];

const displayList = computed(() => {
  if (props.list && props.list.length > 0) return props.list;
  return mockSenderList;
});
</script>

<style lang="scss" scoped>
.sender-top-modal {
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

  .modal-mask {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    position: fixed;
    top: 0;
    left: 0;
  }

  .modal-content {
    position: relative;
    z-index: 10000;
    width: 368px;
    max-height: 460px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .modal-body {
      width: 100%;
      height: 460px;
      background: url("@/assets/activity/celebrityGifts/senderTopBg.png") no-repeat center center;
      background-size: 100% 100%;
      padding: 18px 15px 26px 11px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .close-btn {
        position: absolute;
        top: 6px;
        right: 15px;
        width: 35px;
        height: 35px;
        background: url("@/assets/activity/celebrityGifts/senderTopClose.png") no-repeat center center;
        background-size: cover;
        cursor: pointer;
        z-index: 2;
      }

      .modal-title {
        width: 300px;
        height: 64px;
        flex-shrink: 0;
        box-sizing: border-box;
        padding-bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-start;
        .gift-name {
          font-size: 18px;
          font-weight: bold;
          color: #fff0c0;
          line-height: 20px;
        }

        .top-label {
          font-size: 15px;
          color: #fff0c0;
          line-height: 15px;
        }
      }

      .sender-list {
        flex: 1;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }

        .sender-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 342px;
          height: 60px;
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
          .rank-num {
            width: 20px;
            height: 21px;
            font-weight: bold;
            font-size: 18px;
            line-height: 20px;
            text-align: center;
            background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
          }
          .avatar {
            margin-inline-start: 8px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 1px solid linear-gradient(180deg, #fbdb9b 4.97%, #fffdf2 40.31%, #ffecbb 92.76%, #ffd686 147.83%);
            object-fit: cover;
          }
          .name {
            width: 90px;
            margin-inline-start: 7px;
            font-weight: 400;
            line-height: 21px;
            background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
            font-size: 12px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .score {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            font-size: 18px;
            background: linear-gradient(180deg, #e4be6e 19.05%, #ecb25f 85.71%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
          }
        }

        .sender-item-ar {
          .item-left {
            order: 3;
          }
          .item-center {
            order: 2;
            .name {
              text-align: center;
            }
          }
          .item-right {
            order: 1;
          }
        }
      }

      .empty {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        color: #e9c889;
      }
    }
  }
}
</style>
