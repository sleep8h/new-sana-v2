<!-- 赠送弹窗 - 完整流程：搜索 -> 确认 -> 赠送 -> 成功/失败 -->
<template>
  <Teleport to="body">
    <div class="toast" v-if="isShow">
      <div class="toast-mask" @click="closeModal"></div>
      <div class="toast-content" :class="`toast-content-${innerType}`">

        <!-- ====== search 状态：搜索赠送对象 ====== -->
        <template v-if="innerType === 'search'">
          <div class="title">{{ t("birthday.sendToFriend") }}</div>

          <!-- 搜索输入框 -->
          <div class="search-box">
            <img class="search-icon" src="@/assets/activity/birthday/bg_give_search_icon.png" alt="" />
            <input
              type="tel"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="7"
              v-model="searchId"
              :placeholder="t('birthday.pleaseEnterId')"
              @input="onSearchInput"
              @keyup.enter="handleSearch"
            />
          </div>

          <!-- 搜索结果 -->
          <div class="search-result" v-if="searchResult">
            <div class="user-info">
              <div class="avatar">
                <img v-if="searchResult.avatar" :src="searchResult.avatar" alt="" />
              </div>
              <div class="user-detail">
                <div class="nickname">{{ searchResult.nickname || '' }}</div>
                <div class="user-id">ID: {{ searchResult.userId || '' }}</div>
              </div>
            </div>
          </div>

          <!-- 按钮区域 -->
          <div class="btn-group">
            <div class="btn btn-search" @click="handleSearch">{{ t("birthday.search") }}</div>
            <div class="btn btn-send" @click="goConfirm">{{ t("birthday.send") }}</div>
          </div>
        </template>

        <!-- ====== confirm 状态：二次确认赠送 ====== -->
        <template v-if="innerType === 'confirm'">
          <div class="confirm-text">
            <p class="text-main" v-html="t('birthday.confirmGiveMain', { username: searchResult?.nickname || '', level: `LV.${props.giftLevel}` })"></p>
            <p class="text-cost" v-html="t('birthday.confirmGiveCost', { price: props.giftPrice })"></p>
          </div>

          <div class="btn-group">
            <div class="btn btn-confirm" @click="doSendGift">{{ t("birthday.confirm") }}</div>
            <div class="btn btn-cancel" @click="backToSearch">{{ t("birthday.cancel") }}</div>
          </div>
        </template>
 
        <!-- ====== success 状态：赠送成功 ====== -->
        <template v-if="innerType === 'success'">
          <div class="title">{{ t("birthday.giftSuccess") }}</div>

          <div class="success-text">
            <p v-html="t('birthday.giftSuccessHtml', { username: searchResult?.nickname || '', level: `LV.${props.giftLevel}` })"></p>
          </div>

          <div class="btn-group btn-group-single">
            <div class="btn btn-cancel" @click="closeModal">{{ t("birthday.ok") }}</div>
          </div>
        </template>

        <!-- ====== error 状态：赠送失败/金币不足 ====== -->
        <template v-if="innerType === 'error'">
          <div class="error-icon">
          </div>

          <div class="error-text">
            <p>{{ t("birthday.notEnoughCoins") }}</p>
          </div>

          <div class="btn-group">
            <div class="btn btn-recharge" @click="handleRecharge">{{ t("birthday.recharge") }}</div>
            <div class="btn btn-cancel" @click="closeModal">{{ t("birthday.cancel") }}</div>
          </div>
        </template>

        <div class="toast-close" @click="closeModal"></div>
      </div>
    </div>
  </Teleport>
</template>

<!-- 使用示例 -->
<!-- 
  外面只需要控制 isShow：
  <GiveToast v-model:isShow="showGiveToast" :gift-level="'LV.1'" :gift-price="9999" @recharge="goRecharge" />
-->

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  // 礼包等级（如 LV.1）
  giftLevel: {
    type: String,
    default: "LV.1",
  },
  // 礼包价格
  giftPrice: {
    type: [String, Number],
    default: "",
  },
});

const emit = defineEmits(["update:isShow", "close", "recharge", "success"]);

const store = useMainStore();
const { t } = useI18n();

// 获取当前搜索结果的变量值
const getUsername = () => searchResult.value?.nickname || searchResult.value?.userId || "{username}";
const getLevel = () => props.giftLevel || "{level}";
const getPrice = () => props.giftPrice || "{0}";

// 内部状态：search -> confirm -> success/error
const innerType = ref("search");

// search 状态相关
const searchId = ref("");
const searchResult = ref(null);
const isSearching = ref(false);
const isSending = ref(false);

// 监听 isShow，打开时重置状态
watch(() => props.isShow, (val) => {
  if (val) {
    innerType.value = "search";
    searchId.value = "";
    searchResult.value = null;
    isSearching.value = false;
    isSending.value = false;
  }
});

// 输入框输入处理：只允许数字，满7位自动搜索
const onSearchInput = (e) => {
  // 过滤非数字字符
  const val = e.target.value.replace(/\D/g, "");
  searchId.value = val;
  // 满7位自动搜索
  if (val.length === 7) {
    handleSearch();
  }
};

// 搜索用户
const handleSearch = async () => {
  // 未输入任何字符
  if (!searchId.value.trim()) {
    showToast(t("birthday.enterFriendId"));
    return;
  }
  // 输入不足7位
  if (searchId.value.trim().length !== 7) {
    showToast(t("birthday.idError"));
    return;
  }
  if (isSearching.value) return;
  isSearching.value = true;
  try {
    const res = await postFormData("/h5doings/activity/birthday/search", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      erbanNo: searchId.value.trim(),
    });
    if (res && res.code === 200 && res.data) {
      // 不能输入自己的ID
      if (res.data.uid === store.uid) {
        showToast(t("birthday.cannotEnterOwnId"));
        searchResult.value = null;
        return;
      }
      searchResult.value = {
        avatar: res.data.avatar || "",
        nickname: res.data.nick || res.data.nickname || "",
        userId: res.data.erbanNo || searchId.value,
        uid: res.data.uid,
      };
      showToast(t("birthday.idValid"));
    } else {
      showToast(t("birthday.idError"));
      searchResult.value = null;
    }
  } catch (error) {
    console.error("Error searching user:", error);
    showToast(t("birthday.idError"));
    searchResult.value = null;
  } finally {
    isSearching.value = false;
  }
};

// 从搜索页进入确认页
const goConfirm = () => {
  if (!searchId.value.trim()) {
    showToast(t("birthday.enterFriendId"));
    return;
  }
  if (searchId.value.trim().length !== 7) {
    showToast(t("birthday.idError"));
    return;
  }
  if (!searchResult.value) {
    showToast(t("birthday.idError"));
    return;
  }
  innerType.value = "confirm";
};

// 返回搜索页
const backToSearch = () => {
  innerType.value = "search";
};

// 执行赠送
const doSendGift = async () => {
  if (!searchResult.value || isSending.value) return;
  isSending.value = true;
  try {
    const res = await postFormData("/h5doings/activity/birthday/pay", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      type: 3, // 赠送
      index: props.giftLevel,
      orderUid: searchResult.value.uid,
    });
    if (res && res.code === 200) {
      innerType.value = "success";
      showToast(t("birthday.giftSentSuccess"));
      // emit("success", searchResult.value);
    } else {
      // 金币不足等失败情况
      innerType.value = "error";
    }
  } catch (error) {
    console.error("Error sending gift:", error);
    innerType.value = "error";
  } finally {
    isSending.value = false;
  }
};

const handleRecharge = () => {
  emit("recharge");
  emit("update:isShow", false);
  emit("close");
};

const closeModal = () => {
  searchId.value = "";
  searchResult.value = null;
  emit("update:isShow", false);
  emit("close");
};
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
    background: url("@/assets/activity/birthday/bg_give.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .title {
      position: absolute;
      top: 24px;
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
      white-space: nowrap;
    }

    // ====== 按钮区域（通用） ======
    .btn-group {
      position: absolute;
      bottom: 48px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 16px;
      justify-content: center;
      width: 100%;

      .btn {
        width: 116px;
        height: 37px;
        line-height: 37px;
        text-align: center;
        font-size: 12px;
        font-weight: bold;
        border-radius: 18px;
        cursor: pointer;
        position: relative;

        &-search,
        &-confirm,
        &-recharge {
          background: url("@/assets/activity/birthday/btn_confirm.png") no-repeat center center;
          background-size: cover;
          color: #200B1F;
        }

        &-send,
        &-cancel {
          background: url("@/assets/activity/birthday/btn_cancel.png") no-repeat center center;
          background-size: cover;
          color: #FFFFFF;
        }
      }
    }

    .toast-close {
      position: absolute;
      bottom: -55px;
      left: 50%;
      transform: translateX(-50%);
      width: 36px;
      height: 36px;
      background: url("@/assets/activity/birthday/close.png") no-repeat center center;
      background-size: cover;
      cursor: pointer;
    }
    
    // ====== search 状态样式 ======
    &-search {
      width: 337px;
      height: 342px;
      background: url("@/assets/activity/birthday/toast-search.png") no-repeat center center;
      background-size: cover;
      .title {
        position: absolute;
        top: 48px;
        left: 50%;
        transform: translateX(-50%);
        font-weight: bold;
        font-size: 15px;
        color: #F0D863;
        line-height: 15px;
        background: linear-gradient(355deg, #FFFFCC 0%, #FFDC34 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        white-space: nowrap;
      }
      
      .search-box {
        position: absolute;
        top: 81px;
        left: 50%;
        transform: translateX(-50%);
        width: 274px;
        height: 45px;
        background: url("@/assets/activity/birthday/bg_give_search.png") no-repeat center center;
        background-size: cover;
        display: flex;
        align-items: center;
        padding: 0 13px;
        box-sizing: border-box;

        .search-icon {
          width: 18px;
          height: 18px;
          margin-right: 12px;
          flex-shrink: 0;
        }

        input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #FFFFFF;
          font-size: 12px;

          &::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }

      .search-result {
        position: absolute;
        top: 137px;
        left: 50%;
        transform: translateX(-50%);
        width: 268px;
        height: 56px;
        background: url("@/assets/activity/birthday/bg_give_user.png") no-repeat center center;
        background-size: cover;
        .user-info {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;

          .avatar {
            width: 37px;
            height: 37px;
            border-radius: 50%;
            margin-top: 1px;
            margin-left: 21px;
            margin-right: 9px;
            object-fit: cover;
            background: linear-gradient(175deg, #FFFFCC, #FFDC34);
            border-radius: 50%;
            border: 1px solid #FFEEB7;
            display: flex;
            justify-content: center;
            align-items: center;
            >img{
              width: 37px;
              height: 37px;
              border-radius: 50%;
            }
          }

          .user-detail {
            .nickname {
              font-weight: bold;
              font-size: 10px;
              line-height: 10px;
              color: #FFFFFF;
              margin-bottom: 5px;
            }

            .user-id {
              font-size: 9px;
              line-height: 9px;
              font-weight: bold;
              color: #FFC6DC;
              opacity: 0.8;
            }
          }
        }
      }
    }

    &-confirm,
    &-error {
      // ====== confirm 状态样式 ======
      width: 337px;
      height: 257px;
      background: url("@/assets/activity/birthday/bg_give.png") no-repeat center center;
      background-size: cover;
      .confirm-text {
        position: absolute;
        top: 51px;
        left: 50%;
        transform: translateX(-50%);
        width: 260px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        .text-main, .text-cost {
          width: 213px;
          font-size: 15px;
          color: #FFFFFF;
          line-height: 20px;
          ::v-deep(.highlight) {
            color: #FFD700;
            font-weight: bold;
          }
        }
        .text-main {
          margin-bottom: 20px;
        }
      }
      // ====== error 状态样式 ======
      .error-icon {
        position: absolute;
        top: 51px;
        left: 50%;
        transform: translateX(-50%);
        width: 27px;
        height: 27px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url("@/assets/activity/birthday/icon_fail.png") no-repeat center center;
        background-size: cover;
      }
  
      .error-text {
        position: absolute;
        top: 95px;
        left: 50%;
        transform: translateX(-50%);
        width: 265px;
        text-align: center;
  
        p {
          font-weight: bold;
          font-size: 15px;
          color: #FFFFFF;
          line-height: 20px;
        }
      }
    }
    
    // ====== success 状态样式 ======
    &-success {
      width: 337px;
      height: 294px;
      background: url("@/assets/activity/birthday/bg_give_success.png") no-repeat center center;
      background-size: cover;
      .title {
        position: absolute;
        top: 96px;
        left: 50%;
        transform: translateX(-50%);
        font-weight: bold;
        font-size: 15px;
        line-height: 15px;
        color: #F0D863;
        background: linear-gradient(355deg, #FFFFCC 0%, #FFDC34 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        white-space: nowrap;
      }
      .success-text {
        position: absolute;
        top: 131px;
        left: 50%;
        transform: translateX(-50%);
        width: 252px;
        text-align: center;
  
        p {
          font-size: 15px;
          color: #FFFFFF;
          line-height: 20px;
  
          ::v-deep(.highlight) {
            color: #FFD700;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>