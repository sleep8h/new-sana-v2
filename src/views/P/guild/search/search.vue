<template>
  <div class="guild-search-container">
    <div class="backup-box"></div>
    <div class="safe-mainBox" v-if="isJoind">
      <div class="nav-container-home">
        <navBar
          :isText="true"
          themeType="black"
          :rightLink="true"
          :rightType="'text'"
          @onLeftClick="back"
          @onRightClick="goToNextPage"
        >
          <template #center>{{ t("guild.search.title") }}</template>
          <template #right-text>
            <text class="nav-rightText">{{ t("guild.search.create") }}</text>
          </template>
        </navBar>
      </div>
      <!-- 搜索框 -->
      <div class="searchbox-container">
        <div class="search-container">
          <div class="cancle-icon">
            <img src="@/assets/p/guild/search/search@2x.png" alt="" />
          </div>
          <input
            class="search-input"
            type="text"
            :placeholder="t('guild.search.placeText')"
            v-model="inputValue"
            @confirm="getSearch"
          />
          <div class="cancle-icon" v-if="inputValue != '' ? isShow : ''" @click="clearVal">
            <img src="@/assets/p/guild/search/cancel@2x.png" alt="" />
          </div>
        </div>
      </div>
      <!-- 工会信息 -->
      <div class="searchDetail-container" v-if="isLoading">
        <!-- 正式数据 -->
        <div class="scroll-container" v-show="isSearch" @scroll="handleScroll">
          <!-- 选择加入 -->
          <div class="list-detail">
            <div
              :class="['list-item', index + 1 > 3 ? 'top-normal' : 'top-v' + (index + 1)]"
              v-for="(item, index) in guildList"
              :key="index"
            >
              <div class="left-list-detail">
                <div class="list-img">
                  <img :src="item.coverPicUrl" alt="" />
                </div>
                <!--  -->
                <div class="list-info">
                  <div class="list-lable">{{ item.guildName }}</div>
                  <div class="list-info-v2">
                    <div class="member-count">
                      <div class="member-icon"></div>
                      {{ item.memberCount }}
                    </div>
                    <div class="id-info">ID:{{ item.guildId }}</div>
                  </div>
                </div>
              </div>
              <div class="right-list-detail" :class="store.language == 'ar' ? 'left-op-btn' : 'right-op-btn'">
                <div
                  class="operate-btn"
                  :class="[item.joinStatus != 0 ? 'withdraw-btn' : 'apply-btn']"
                  @click.stop="getIsApply(item)"
                >
                  {{ item.joinStatus != 0 ? t("guild.search.withdraw") : t("guild.search.apply") }}
                </div>
                <!--  -->
                <div class="down-time" v-if="item.seconds">
                  <!-- {{ formatTime(item.seconds) }} -->
                  <count-down :time="item.seconds" format="HH:MM:DS" color="#333"></count-down>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isBottom && guildList.length < 3" class="bottom-text-box">
            {{ t("guild.search.bottomText") }}
          </div>
        </div>
        <!-- 搜索数据 -->
        <div class="scroll-container" v-show="!isSearch" @scroll="handleScroll">
          <div class="list-item" v-if="searchList.length > 0 && isExitData" v-for="item in searchList">
            <div class="left-list-detail">
              <div class="list-img">
                <img :src="item.coverPicUrl || '/guildSearch/assets/p/guild/searchpawa_avatar.png'" alt="" />
              </div>
              <!--  -->
              <div class="list-info">
                <div class="list-lable">
                  {{ t("guild.search.guildName") }}：<text>{{ item.guildName }}</text>
                </div>
                <div class="list-lable">
                  {{ t("guild.search.guildId") }}：<text>{{ item.guildId || 0 }}</text>
                </div>
                <div class="list-lable">
                  {{ t("guild.search.presidentNick") }}：<text>{{ item.nick }}</text>
                </div>
              </div>
            </div>
            <div class="right-list-detail" :class="store.language == 'ar' ? 'left-op-btn' : 'right-op-btn'">
              <div
                class="operate-btn"
                :class="[item.joinStatus != 0 ? 'withdraw-btn' : 'apply-btn']"
                @click.stop="getIsApply(item)"
              >
                {{ getBtnText(item.joinStatus) }}
              </div>
              <div class="down-time" v-if="!isSearch && item.seconds">
                {{ formatTime(item.seconds) }}
              </div>
            </div>
          </div>
          <!--  -->
          <div v-if="isBottom && isExitData && searchList.length > 9" class="bottom-text-box">
            {{ t("guild.search.bottomText") }}
          </div>
          <!--  -->
          <div class="no-data-box" v-if="!isExitData">
            <div class="no-data-img"></div>
          </div>
          <!--  -->
        </div>
        <!--  -->
      </div>
      <div class="searchDetail-container" v-else>{{ t("guild.search.loading") }}</div>
      <!-- 工会信息END  -->
    </div>
  </div>
</template>

<script setup>
import navBar from "@/components/navBar/navBar.vue";
import countDown from "@/components/countDown/countDown.vue";

import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { get, postFormData } from "@/utils/http.js";
import { useMainStore } from "@/pinia/index.js";

// 使用 Pinia store
const store = useMainStore();
const router = useRouter();
const { t } = useI18n();

onMounted(() => {
  Promise.allSettled([isJoinGuild(), getCountry()]).then(() => {
    isLoading.value = true;
  });
});

// 获取国家列表
const countryList = ref([]);
const getCountry = async () => {
  try {
    const res = await get("/country/info/list", {
      uid: store.uid,
      searchKey: "",
    });
    if (res && res.code === 200) {
      countryList.value = res.data || [];
      localStorage.setItem("countryList", JSON.stringify(countryList.value));
    }
  } catch (error) {
    console.error("Error fetching country list:", error);
  }
};

// 是否加入公会
const guildDetail = ref([]);
const isJoind = ref(false);
const isJoinGuild = async () => {
  try {
    const res = await get("/guild/home/detail", {
      uid: store.uid,
      ticket: store.ticket,
    });
    if (res && res.code === 200) {
      guildDetail.value = res.data;

      if (guildDetail.value) {
        isJoind.value = false;
        localStorage.setItem("guildDetail", JSON.stringify(guildDetail.value));
        // router.replace('/guild/anchor')
      } else {
        isJoind.value = true;
        getGuildList();
      }
    }
  } catch (error) {
    console.error("Error checking guild join status:", error);
  }
};

//公会操作
const guildId = ref(0);
const status = ref(0);
const guildList = ref([]);
const getIsApply = async (item) => {
  guildId.value = item.guildId;
  status.value = item.joinStatus;

  if (status.value == 0) {
    // 申请加入公会
    getApply(item);
  } else {
    // 撤销加入公会
    getWithdraw(item);
  }
};

// 申请加入公会
const getApply = async (item) => {
  if (item.joinStatus != 0) return;

  try {
    const res = await postFormData("/guild/join/apply", {
      uid: store.uid,
      ticket: store.ticket,
      guildId: item.guildId,
      deviceId: store.deviceId,
    });
    if (res && res.code === 200) {
      item.joinStatus = 1;

      if (guildList.length > 0) {
        guildList.value = [];
        // 查询公会列表
        getGuildList();
      }
    }
  } catch (error) {
    console.error("Error applying to join guild:", error);
  }
};

const getWithdraw = async (item) => {
  if (item.joinStatus == 0) return;

  try {
    const res = await postFormData("/guild/join/withdraw", {
      uid: store.uid,
      ticket: store.ticket,
      guildId: item.guildId,
      deviceId: store.deviceId,
    });
    if (res && res.code === 200) {
      item.joinStatus = 0;

      if (guildList.length > 0) {
        guildList.value = [];
        // 查询公会列表
        getGuildList();
      }
    }
  } catch (error) {
    console.error("Error withdrawing from guild:", error);
  }
};

const back = () => {
  router.back();
};

// 查询公会列表
const pageNum = ref(1);
const pageSize = ref(10);
const whetherLastPage = ref(false);
const isBottom = ref(false);
const isLoading = ref(false);

const getGuildList = async () => {
  try {
    const res = await get("/guild/search", {
      uid: store.uid,
      ticket: store.ticket,
      pageNum: pageNum.value,
      pageSize: 10,
      searchKey: "",
    });
    if (res && res.code === 200) {
      const newItem = res.data.list;

      if (newItem == null) {
        guildList.value = guildList.value;
      } else {
        guildList.value = guildList.value.concat(newItem);
      }

      whetherLastPage.value = res.isLastPage || false;
      isBottom.value = true;
    }

    isLoading.value = true;
  } catch (error) {
    console.error("Error fetching guild list:", error);
    isLoading.value = false;
  }
};

//
const inputValue = ref("");
const searchList = ref([]);
const isSearch = ref(true);
const isExitData = ref(false);
const getSearch = async () => {
  if (inputValue.value.trim() === "") {
    isSearch.value = true;
    searchList.value = [];
    inputValue.value = "";
    return;
  } else {
    searchList.value = [];
  }

  try {
    const res = await get("/guild/search", {
      uid: store.uid,
      ticket: store.ticket,
      pageNum: 1,
      pageSize: 10,
      searchKey: inputValue.value.trim(),
    });
    if (res && res.code === 200) {
      const newItem = res.data.list;
      if (newItem) {
        searchList.value = searchList.value.concat(newItem);
        isExitData.value = true;
      } else {
        searchList.value = [];
        isExitData.value = false;
      }

      whetherLastPage.value = res.data.whetherLastPage;
      isBottom.value = true;
    }
  } catch (error) {
    console.error("Error searching guilds:", error);
  }
};

// 清空文本框
const isShow = ref(true);
const clearVal = () => {
  inputValue.value = "";
  isSearch.value = true;
  searchList.value = [];
  isExitData.value = false;
  isShow.value = true;
};

// 倒计时显示
const getBtnText = (status) => {
  if (status == 0) {
    return t("guild.search.apply");
  } else {
    return t("guild.search.withdraw");
  }
};

const handleScroll = async (event) => {
  // const element = event.target

  // if (element.scrollHeight - element.scrollTop === element.clientHeight) {
  //     if (!whetherLastPage.value) {
  //         isBottom.value = false
  //         pageNum.value += 1
  //         if (isSearch.value) {
  //             await getGuildList()
  //         } else {
  //             await getSearch()
  //         }
  //     }
  // }

  const { scrollTop, scrollHeight, clientHeight } = event.target;

  if (scrollTop + clientHeight >= scrollHeight - 10 && !this.whetherLastPage) {
    if (isBottom.value) {
      isBottom.value = false;

      // // 显示加载提示
      alert(t("loadText"));

      pageNum.value += 1;
      if (isSearch.value) {
        await getGuildList();
      } else {
        await getSearch();
      }
    }
  }
};

// 跳转到创建公会页面
const goToNextPage = () => {
  // router.push('/guild/create')
};
</script>

<style scoped>
.guild-search-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #f6f7f9;
}

.backup-box {
  width: 100%;
  height: 320px;
  background: url("@/assets/p/guild/search/guild-create-bg@2x.png") no-repeat;
  background-size: 100% 100%;
}

.safe-mainBox {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}

.nav-container-home {
  width: 100%;
  height: 56px;
  box-sizing: border-box;
}

.searchbox-container {
  padding: 0 16px;
}

.search-container {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  margin: 8px 0;
  border-radius: 50px;
  box-sizing: border-box;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(255, 255, 255, 1);
}

.search-input {
  width: calc(100% - 64px);
  height: 100%;
  line-height: 40px;
  box-sizing: border-box;
  padding: 8px 16px;
  font-size: 14.4px;
  color: #333;
  border: none;
  background: none;
}

.search-container::placeholder {
  color: #878e9a !important;
}

.search-input:focus {
  outline: none;
}

.cancle-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancle-icon img {
  width: 24px;
  height: 24px;
}

.searchDetail-container {
  width: 100%;
  height: calc(100% - 144px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.scroll-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
  overflow: hidden;
  overflow-y: auto;
}

.list-detail {
  width: 100%;
  height: 100%;
}

.list-item {
  width: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.8px;
  position: relative;
  border-radius: 10px;
}

.top-v1 {
  background: url("@/assets/p/guild/search/topbg-v1@2x.png");
  background-size: 100% 100%;
}

.top-v2 {
  background: url("@/assets/p/guild/search/topbg-v2@2x.png");
  background-size: 100% 100%;
}

.top-v3 {
  background: url("@/assets/p/guild/search/topbg-v3@2x.png");
  background-size: 100% 100%;
}

.top-normal {
  background: #fff;
}

.left-list-detail {
  display: flex;
  align-items: center;
}

.list-info {
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  box-sizing: border-box;
}

.list-lable {
  display: flex;
  align-items: flex-end;
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14.4px;
  font-weight: 600;
  color: #000;
  padding-bottom: 10px;
}

.list-info-v2 {
  width: 100%;
  display: flex;
  align-items: center;
  color: #878e9a;
}

.member-count {
  min-width: 16px;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 5px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.8px;
}

.member-icon {
  width: 16px;
  height: 16px;
  margin: 0 2px;
  background: url("@/assets/p/guild/search/memebrcount-icon@2x.png") no-repeat;
  background-size: 100% 100%;
}

.id-info {
  font-size: 12.8px;
  padding: 0 10px;
}

.list-img {
  width: 64px;
  height: 64px;
}

.listImg-right {
  margin-right: 8px;
}

.listImg-left {
  margin-left: 8px;
}

.list-img img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.right-list-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 30%;
}

.right-op-btn {
  right: 12.8px;
}

.left-op-btn {
  left: 12.8px;
}

.operate-btn {
  min-width: 56px;
  padding: 6.4px 8px;
  border-radius: 50px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.apply-btn {
  background: url("@/assets/p/guild/search/apply-icon@2x.png");
  background-size: 100% 100%;
}

.withdraw-btn {
  background: #d8dadc;
}

.down-time {
  padding-top: 8px;
}

.bottom-text-box {
  text-align: center;
  font-size: 12.8px;
}

.no-data-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data-img {
  width: 80%;
  height: 240px;
  background: url("@/assets/p/guild/search/noData.png") no-repeat;
  background-size: 100% 100%;
}
</style>
