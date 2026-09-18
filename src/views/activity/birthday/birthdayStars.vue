<template>
  <div class="stars">
    <!-- 搜索框 -->
    <div class="search-box">
      <div class="search-input-wrap">
        <img class="search-icon" src="@/assets/activity/birthday/birthdayStars/search.png" alt="" />
        <input
          class="search-input"
          v-model="searchValue"
          type="tel"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="7"
          :placeholder="t('birthday.pleaseEnterId')"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
          @keyup.enter="onSearchBtnClick"
        />
        <div v-if="searchValue.length > 0 && searchValue.length < 7" class="search-btn" @click="onSearchBtnClick">
          <span>{{ t('birthday.confirm') }}</span>
        </div>
        <div v-else class="search-btn" @click="onSearchBtnClickCancel">
          <span>{{ t('birthday.cancel') }}</span>
        </div>
      </div>
    </div>
    <!-- 生日好友列表 -->
    <div class="friend-box">
      <div class="friend-title">{{ currentMonthAbbr }}.Birthday Friends</div>
      <div class="friend-swiper-wrap">
        <template v-if="friendList.length === 0">
          <div class="friend-empty">
             {{ isSearching ? t('birthday.userNotInBirthdayList') : t('birthday.noBirthdayFriends') }}
          </div>

        </template>
        <Swiper
          v-else
          :initial-slide="swiperIndex"
          :slides-per-view="1"
          ref="mySwiper"
          :space-between="0"
          @slideChange="onSwiperChange"
          style="height: 100%"
        >
          <SwiperSlide v-for="(page, pageIndex) in friendPages" :key="pageIndex">
            <div class="list">
              <div class="item" v-for="(item, index) in page" :key="index">
                <div class="avatar-wrap">
                  <img class="avatar" :src="item.avatar" alt="" />
                  <div class="level">
                    <span>LV {{ item.wealthLevel }}</span>
                  </div>
                </div>
                <div class="like" @click="handleLike(item)">
                  <img :src="item.likeFlag ? like : unlike" alt="">
                  <span>{{ formatLikeCount(item.likeCount) }}</span>
                </div>
                <sanaAutoText class="name">{{ item.nick }}</sanaAutoText>
                <div class="id">ID: {{ item.erbanNo }}</div>
                <div class="bless">{{ t('birthday.bless') }}: {{ formatBless(item.blessingValue) }}</div>
                <div class="btn-send" @click="goSendGift(item)">{{ t('birthday.sendGiftBless') }}</div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
    <!-- 本月寿星 -->
    <div class="star-box" v-if="!isSearching">
      <div class="star-title">{{ currentMonthAbbr }}.Birthday Star</div>
      <div class="star-list" :class="{'start-list-more': isMore}">
        <div class="item" v-for="(item, index) in isMore ? starList : starList.slice(0, 12)" :key="index">
          <div class="avatar-wrap">
            <img class="avatar" :src="item.avatar" alt="" />
            <div class="level">
              <span>LV {{ item.wealthLevel }}</span>
            </div>
          </div>
          <div class="like" @click="handleLike(item)">
            <img :src="item.likeFlag ? like : unlike" alt="">
            <span>{{ formatLikeCount(item.likeCount) }}</span>
          </div>
          <sanaAutoText class="name">{{ item.nick }}</sanaAutoText>
          <div class="id">ID: {{ item.erbanNo }}</div>
          <div class="bless">{{ t('birthday.bless') }}: {{ formatBless(item.blessingValue) }}</div>
          <div class="btn-send" @click="goSendGift(item)">{{ t('birthday.sendGiftBless') }}</div>
        </div>
      </div>
      <!-- More按钮 -->
      <div class="more-btn" v-if="!isMore && starList.length > 12" @click="isMore = !isMore">
        <span>{{ t('birthday.more') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import { postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";
import { useI18n } from "vue-i18n";
import like from "@/assets/activity/birthday/birthdayStars/like.png";
import unlike from "@/assets/activity/birthday/birthdayStars/unlike.png";

const store = useMainStore();
const { t } = useI18n();

// Swiper 相关
const mySwiper = ref(null);
const swiperIndex = ref(0);
const searchValue = ref("");
const isFocused = ref(false);
const isMore = ref(false);

// 数据
const friendList = ref([]);
const starList = ref([]);
const isSearching = ref(false);

// 当前月份缩写
const currentMonthAbbr = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[new Date().getMonth()];
});

// 判断用户是否今天生日
const isBirthdayToday = (birthday) => {
  if (!birthday) return false;
  const today = new Date();
  const birthDate = new Date(birthday);
  return (
    today.getMonth() === birthDate.getMonth() &&
    today.getDate() === birthDate.getDate()
  );
};

// 好友分页（每页3个）
const friendPages = computed(() => {
  const pages = [];
  for (let i = 0; i < friendList.value.length; i += 3) {
    pages.push(friendList.value.slice(i, i + 3));
  }
  return pages;
});

// 格式化点赞数（x10 并 K/M 格式化）
const formatLikeCount = (count) => {
  if (!count && count !== 0) return '0';
  const realCount = count * 10;
  if (realCount >= 1000000) {
    return (realCount / 1000000).toFixed(1) + 'M';
  }
  if (realCount >= 1000) {
    return (realCount / 1000).toFixed(1) + 'K';
  }
  return String(realCount);
};

// 格式化祝福值
const formatBless = (value) => {
  if (!value && value !== 0) return '0';
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return String(value);
};

const onSwiperChange = (swiper) => {
  swiperIndex.value = swiper.activeIndex;
};

const onFocus = () => {
  isFocused.value = true;
};

const onBlur = () => {
  if (searchValue.value.length === 0) {
    isFocused.value = false;
  }
};

const onInput = () => {
  // 过滤非数字字符，只保留数字
  searchValue.value = searchValue.value.replace(/\D/g, '');
  // 最多7位
  if (searchValue.value.length > 7) {
    searchValue.value = searchValue.value.slice(0, 7);
  }
  // 输入满7位自动搜索
  if (searchValue.value.length === 7) {
    onSearchBtnClick();
  }
};

const onSearchBtnClickCancel = () => {
  searchValue.value = "";
  isFocused.value = false;
  isSearching.value = false; // 重置搜索状态
  getFriendsList();
  getStarsList();
}

// 搜索按钮点击
const onSearchBtnClick = async () => {
  if (searchValue.value.length === 0) {
    onSearchBtnClickCancel();
    return;
  }
  // 未输入任何字符
  const trimmed = searchValue.value.trim();

  // 输入不完整（不满7位），提示 ID error
  if (trimmed.length !== 7) {
    showToast(t('birthday.idError'));
    return;
  }
  // 调用搜索接口 
   await searchUser(trimmed);
};

// 获取本月生日好友列表
const getFriendsList = async () => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/friends", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      friendList.value = res.data || []
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching friends list:", error);
  }
};

// 获取本月寿星列表
const getStarsList = async () => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/stars", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
    });
    if (res && res.code === 200) {
      starList.value = res.data || []
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error fetching stars list:", error);
  }
};

// 搜索生日用户
const searchUser = async (erbanNo) => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/search", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      erbanNo: erbanNo,
    });
    if (res && res.code === 200) {
      isSearching.value = true; // 标记为搜索状态
      if (res.data) {
        // 判断搜索到的用户是否本月生日
        const userBirthMonth = new Date(res.data.birthday).getMonth();
        const currentMonth = new Date().getMonth();
        if (userBirthMonth === currentMonth) {
          // 本月生日，显示在好友列表
          friendList.value = [res.data];
        } else {
          // 不是本月生日，显示空文案
          friendList.value = [];
        }
        starList.value = []; // 清空寿星列表
      } else {
        friendList.value = [];
        starList.value = [];
        showToast(t('birthday.idError'));
      }
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error searching user:", error);
  }
};

// 点赞
const handleLike = async (item) => {
  try {
    const res = await postFormData("/h5doings/activity/birthday/like", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      likedUid: item.uid,
    });
    if (res && res.code === 200) {
      // 同步更新两个列表中相同 uid 的用户
      const targetUid = item.uid;
      const newLikeCount = res.data;
      
      // 更新好友列表
      friendList.value.forEach(friend => {
        if (friend.uid === targetUid) {
          friend.likeCount = newLikeCount;
          friend.likeFlag = true;
        }
      });
      
      // 更新寿星列表
      starList.value.forEach(star => {
        if (star.uid === targetUid) {
          star.likeCount = newLikeCount;
          star.likeFlag = true;
        }
      });
      showToast(t('birthday.thankYouBlessings'));
    } else {
      showToast(res.message);
    }
  } catch (error) {
    console.error("Error liking user:", error);
  }
};

// 送礼祝福 - 跳转消息页
const goSendGift = (item) => {
  // 跳转至对方 Message 入口并自动调起礼物栏 Birthday
  // console.log('跳转消息页，调起礼物栏', item.uid);
  // TODO: 调用客户端方法跳转消息页
  const params = {
    uid: item.uid,
    nick: item.nick
  };
  console.log(params, 'params')
  if (store.os === "android") {
    WebViewJavascriptBridge.openChatGift(JSON.stringify(params));
  } else if (store.os === "ios") {
    window.webkit.messageHandlers.openChatGift.postMessage(params);
  } else {
    console.error("未知平台，无法返回");
  }
};

onMounted(async () => {
  await getFriendsList();
  await getStarsList();
});
</script>

<style lang="scss" scoped>
.stars {
  min-height: 1400px;
  margin-top: -190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: PingFang SC;
  .search-box {
    position: absolute;
    top: 0;
    width: 354px;
    height: 45px;
    .search-input-wrap {
      width: 100%;
      height: 100%;
      background: url("@/assets/activity/birthday/birthdayStars/bg_search.png") no-repeat center center;
      background-size: cover;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      box-sizing: border-box;
      .search-icon {
        width: 18px;
        height: 18px;
        margin-inline-start: 13px;
      }
      .search-input {
        flex: 1;
        height: 100%;
        background: transparent;
        border: none;
        outline: none;
        font-size: 12px;
        color: #FFFFFF;
        margin-inline-start: 11px;
        &::placeholder {
          font-size: 12px;
          color: #FFFFFF;
          opacity: 0.7;
          text-align: center;
        }
      }
      .search-btn {
        width: 81px;
        height: 39px;
        margin-inline-end: 5px;
        background: linear-gradient(-4deg, #7023E3, #B134E4);
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        span {
          font-weight: bold;
          font-size: 14px;
          color: #FFFFFF;
        }
      }
    }
  }

  /* 生日好友列表 */
  .friend-box {
    position: absolute;
    width: 357px;
    height: 287px;
    top: 63px;
    background: url("@/assets/activity/birthday/birthdayStars/bg_friends.png") no-repeat center center;
    background-size: cover;
    .friend-title{
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 180px;
      height: 40px;
      line-height: 14px;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      color: #EBD975;
      font-size: 14px;
      line-height: 14px;
      background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .friend-swiper-wrap {
      position: absolute;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
      width: 315px;
      min-height: 171px;
      .friend-empty {
        position: absolute;
        top: 51px;
        left: 50%;
        transform: translateX(-50%);
        width: 236px;
        min-height: 32px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        font-size: 13px;
        line-height: 18px;
        color: #FFFFFF;
        text-align: center;
      }
      .list {
        width: 100%;
        min-height: 171px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        .item {
          width: 102px;
          min-height: 171px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-inline-end: 3px;
          position: relative;
          &:nth-child(3){
            margin-inline-end: 0;
          }

          .avatar-wrap {
            width: 102px;
            height: 107px;
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            background: url("@/assets/activity/birthday/birthdayStars/avatar.png") no-repeat center center;
            background-size: cover;

            .avatar {
              position: absolute;
              top: 14px;
              left: 16px;
              width: 68px;
              height: 68px;
              border-radius: 50%;
              overflow: hidden;
            }
            .level{
              position: absolute;
              top: 75px;
              left: 18px;
              width: 61px;
              height: 24px;
              background: url("@/assets/activity/birthday/birthdayStars/bg_level.png") no-repeat center center;
              background-size: cover;
              display: flex;
              justify-content: center;
              align-items: center;
              >span{
                font-weight: bold;
                font-size: 12px;
                color: #EBD975;
                line-height: 12px;
                background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
          }
          .like{
            position: absolute;
            top: 8px;
            right: 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            z-index: 2;
            img{
              width: 20px;
              height: 20px;
            }
            span{
              font-size: 9px;
              color: #FFFFFF;
              margin-top: 2px;
            }
          }
          .name{
            position: absolute;
            top: 102px;
            left: 0;
            width: 102px;
            font-size: 12px;
            color: #FFFFFF;
            line-height: 14px;
            text-align: center;
          }
          .id, .bless{
            position: absolute;
            top: 119px;
            left: 0;
            width: 102px;
            height: 10px;
            font-size: 10px;
            color: #F8C8DB;
            line-height: 10px;
            text-align: center;
          }
          .bless{
            position: absolute;
            top: 132px;
            left: 0;
          }
          .btn-send {
            width: 95px;
            height: 25px;
            position: absolute;
            top: 146px;
            left: 50%;
            transform: translateX(-50%);
            background: url("@/assets/activity/birthday/birthdayStars/btn_send.png") no-repeat center center;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 10px;
            color: #1D0C1E;
            line-height: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }

  /* 本月寿星 */
  .star-box {
    position: absolute;
    width: 357px;
    height: 992px;
    top: 355px;
    background: url("@/assets/activity/birthday/birthdayStars/bg_start.png") no-repeat center center;
    background-size: cover;
    .star-title{
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 180px;
      height: 40px;
      line-height: 14px;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      color: #EBD975;
      font-size: 14px;
      line-height: 14px;
      background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .star-list {
      position: absolute;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
      width: 315px;
      max-height: 806px;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-start;
      overflow-y: auto;
      .item {
        width: 102px;
        min-height: 171px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-inline-end: 3px;
        margin-bottom: 30px;
        position: relative;
        &:nth-child(3){
          margin-inline-end: 0;
        }

        .avatar-wrap {
          width: 102px;
          height: 107px;
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: url("@/assets/activity/birthday/birthdayStars/avatar.png") no-repeat center center;
          background-size: cover;

          .avatar {
            position: absolute;
            top: 14px;
            left: 16px;
            width: 68px;
            height: 68px;
            border-radius: 50%;
            overflow: hidden;
          }
          .level{
            position: absolute;
            top: 75px;
            left: 18px;
            width: 61px;
            height: 24px;
            background: url("@/assets/activity/birthday/birthdayStars/bg_level.png") no-repeat center center;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            >span{
              font-weight: bold;
              font-size: 12px;
              color: #EBD975;
              line-height: 12px;
              background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
        }
        .like{
          position: absolute;
          top: 8px;
          right: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          z-index: 2;
          img{
            width: 20px;
            height: 20px;
          }
          span{
            font-size: 9px;
            color: #FFFFFF;
            margin-top: 2px;
          }
        }
        .name{
          position: absolute;
          top: 102px;
          left: 0;
          width: 102px;
          font-size: 12px;
          color: #FFFFFF;
          line-height: 14px;
          text-align: center;
        }
        .id, .bless{
          position: absolute;
          top: 119px;
          left: 0;
          width: 102px;
          height: 10px;
          font-size: 10px;
          color: #F8C8DB;
          line-height: 10px;
          text-align: center;
        }
        .bless{
          position: absolute;
          top: 132px;
          left: 0;
        }
        .btn-send {
          width: 95px;
          height: 25px;
          position: absolute;
          top: 146px;
          left: 50%;
          transform: translateX(-50%);
          background: url("@/assets/activity/birthday/birthdayStars/btn_send.png") no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 10px;
          color: #1D0C1E;
          line-height: 10px;
          cursor: pointer;
        }
      }
    }
    .start-list-more{
      height: 854px;
    }

    /* More按钮 */
    .more-btn {
      position: absolute;
      top: 869px;
      left: 50%;
      transform: translateX(-50%);
      width: 91px;
      height: 37px;
      background: linear-gradient(-4deg, #7023E3, #B134E4);
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      margin: 0 auto;
      >span{
        font-weight: bold;
        color: #EBD975;
        font-size: 14px;
        line-height: 14px;
        background: linear-gradient(360deg, #FFFFD1 0%, #F9DD59 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

}
</style>