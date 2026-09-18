<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner"></div>
    <div class="loading-text">{{ t("common.loading") }}</div>
  </div>

  <transition name="fade">
    <div class="main-contianer">
      <div class="main-contianer-outer" :class="'bg-v' + index"></div>
      <div class="main-contianer-inner">
        <!-- 导航 -->
        <div class="nav-container">
          <navBar :isText="false" :rightLink="true" @onLeftClick="back" themeType="white">
            <template #center>{{ t("vipPrivilege.title") }}</template>
          </navBar>
        </div>
        <div class="scroll-contentDiv">
          <Swiper
            :initial-slide="index"
            :slides-per-view="1"
            :space-between="0"
            @slideChange="onSwiperChange"
            style="height: 100%"
          >
            <SwiperSlide v-for="(item, idx) in vipList" :key="idx">
              <vipPage
                :vipId="index"
                :nowVipId="vipIndex"
                :expireTime="userData?.expirationTimestamp || 0"
                :data="vipList[vipIndex]"
                @getNew="buyVip"
                @showPopup="showMaskPage"
                @changeVip="changeSwiper"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  </transition>

  <!-- 使用图片预览组件 -->
  <maskModal v-model:isShowMask="showPreview" :cTop="topNum">
    <template #content>
      <div class="popup-box">
        <div class="pop-img">
          <div
            v-if="levelType == 1"
            :class="privilegeType != 2 && privilegeType != 6 ? 'page-img page-img-grid' : 'page-img page-img-flex'"
          >
            <template v-for="(img, idx) in privilegeList" :key="idx">
              <div
                :class="privilegeType != 2 && privilegeType != 6 ? 'page-item-grid' : 'page-item-flex'"
                :style="idx === privilegeList.length - 1 ? 'grid-column: 1 / span 2; justify-self: center;' : ''"
              >
                <img
                  :class="privilegeType != 2 && privilegeType != 6 ? 'img-grid' : 'img-flex'"
                  :src="img.pic"
                  alt=""
                />
                <span class="vip-name" v-if="privilegeType != 2 && privilegeType != 6">VIP{{ idx + 1 }}</span>
              </div>
            </template>
          </div>
          <div class="page-exclusivo" v-else>
            <img :src="levelData.privilegeDetailImage" alt="" />
          </div>
        </div>
        <div class="pop-content">
          <span>{{ levelData.privilegeName || "privilege Name" }}</span>
          <p>{{ levelData.privilegeDescribe || "privilege Describe" }}</p>
        </div>
        <div class="pop-button" @click="showPreview = false">{{ $t("vipPrivilege.ok") }}</div>
      </div>
    </template>
  </maskModal>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import vipPage from "./components/vipPage.vue";
import navBar from "@/components/navBar/navBar.vue";
import maskModal from "./components/maskModal.vue";
import message from "@/utils/message.js";
import { onMounted, ref } from "vue";
import { useMainStore } from "@/pinia/index.js";
import { get, postForm } from "@/utils/http";
const store = useMainStore();
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const isLoading = ref(false); // 控制加载动画显示

const vipList = ref([]);
const userData = ref({});
const index = ref(0);
const vipIndex = ref(0);
const show = ref(false);

onMounted(async () => {
  try {
    // 依次获取 VIP 数据并保存到 vipList 中
    for (let i = 1; i <= 7; i++) {
      await getVipInfo(i, "all");
    }

    // 所有操作完成后显示内容
    await getUserInfo();
    show.value = true;
  } catch (error) {
    console.error("初始化失败:", error);
    show.value = true;
  }

  if (store.os === "ios") {
    initIOS();
  }
});

// 获取vip数据
const getVipInfo = async (vipId, type) => {
  try {
    const res = await get("vip/info", {
      uid: store.uid,
      vipId,
      ticket: store.ticket,
      language: store.language,
    });
    if (res.code === 200) {
      if (type === "all") {
        vipList.value.push(res.data);
      } else {
        return res.data;
      }
    } else {
      console.log("获取VIP信息失败:", res.message);
    }
  } catch (e) {
    console.error(`获取 VIP${vipId} 数据时发生错误:`, e);
  }
};

// 获取用户信息
const getUserInfo = async () => {
  try {
    const res = await get("vip/user/info", {
      uid: store.uid,
      ticket: store.ticket,
      language: store.language,
      appid: store.appid,
      os: store.os,
      deviceId: store.deviceId,
      appVersion: store.appVersion,
    });

    if (res.code === 200) {
      if (!res.data) {
        index.value = 0;
        vipIndex.value = 0;
        console.error("用户信息不存在", res.data);
      } else {
        userData.value = res.data;
        index.value = res.data?.nextVipId > 7 ? 7 : res.data?.nextVipId;
        vipIndex.value = res.data.vipId;
      }
    } else {
      console.log("获取用户信息失败:", res.message);
    }
  } catch (e) {
    console.error("获取用户信息失败:", e);
  }
};

// 切换swiper
const onSwiperChange = (swiper) => {
  index.value = swiper.activeIndex;
};

// 切换VIP
const changeSwiper = (newIndex) => {
  onSwiperChange({ activeIndex: newIndex });
  vipIndex.value = newIndex;
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

const initIOS = () => {
  window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null);
};

// 购买VIP(1:续费 2:升级 3:购买)
const buyVip = (status, vipId) => {
  console.log("购买VIP，状态:", status);
  // 购买VIP的逻辑
  let api = "";
  switch (status) {
    case 1:
      api = "vip/purchase"; // 购买
      break;
    case 2:
      api = "vip/renew"; // 续费
      break;
    case 3:
      api = "vip/upgradation"; // 升级
      break;
    default:
      api = "vip/upgradation";
      return;
  }
  handleVipRequest(api, vipId, status);
};

const handleVipRequest = async (api, vipId, status) => {
  const res = await postForm(api, {
    uid: store.uid,
    ticket: store.ticket,
    language: store.language,
    appVersion: store.appVersion,
    appid: store.appid,
    os: store.os,
    deviceId: store.deviceId,
    vipId,
  });

  if (res.code == 200) {
    message.success(res.message);
    this.getUserInfo(); // 刷新用户信息

    if (status != 3) {
      // 找到vipList内vipId对应handleVipRequest传入的vipId的项，将该项内buyStatus值 +1
      const vipItem = vipList.value.find((item) => item.vipId === vipId);
      if (vipItem) {
        vipItem.buyStatus = (vipItem.buyStatus || 0) + 1;
      }
    }
  } else {
    message.error(res.message);
  }
};

//
const topNum = ref(10);
const levelType = ref(0);
const levelData = ref({});
const privilegeList = ref({});
const privilegeType = ref(1);
const showPreview = ref(false);
const showMaskPage = async (type, data, index) => {
  levelType.value = type;
  levelData.value = data;
  privilegeType.value = index;

  if (type === 1) {
    await getVipPrivileges(index);
    topNum.value = 10;
  } else {
    topNum.value = 20;
  }

  showPreview.value = true;
};

//
const getVipPrivileges = async (vipId) => {
  try {
    const res = await get("vip/getVipPrivileges", {
      uid: store.uid,
      privilegeType: vipId,
      ticket: store.ticket,
    });
    if (res.code === 200) {
      privilegeList.value = res.data;
    } else {
      console.error(`获取 VIP${vipId} 特权数据失败:`, res.message);
    }
  } catch (err) {
    console.error(`获取 VIP${vipId} 特权数据时发生错误:`, err);
  }
};
</script>

<style>
.home-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.main-contianer {
  width: 100%;
  height: 100%;
  background: #000000;
  position: relative;
}

.main-contianer-outer {
  width: 100%;
  height: 400px;
}

.main-contianer-inner {
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

/* 滚动视图 */
.scroll-contentDiv {
  width: 100%;
  height: calc(100% - 56px);
}

.bg-v0 {
  background: url("https://file.sanalive.online/FqTUa6AiyRAcupLNf7zG9PMfY_Ya?imageslim/zlevel/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100% 100%;
}

.bg-v1 {
  background: url("https://file.sanalive.online/FlvUh-4IEt1nEKOaACPPC3GMzhOl?imageslim/zlevel/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100% 100%;
}

.bg-v2 {
  /* background: url('@/assets/p/vipPrivilege/bg-v3@2x.png') no-repeat; */
  background: url("https://file.sanalive.online/FuQ__xOjOcFCh4o97si3VelxriJQ?imageslim/zlevel/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100% 100%;
}

.bg-v3 {
  /* background: url('@/assets/p/vipPrivilege/bg-v4@2x.png') no-repeat; */
  background: url("https://file.sanalive.online/FstOyrsQlikdaIx6hTQI6z7O5t8x?imageslim/zlevel/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100% 100%;
}

.bg-v4 {
  /* background: url('@/assets/p/vipPrivilege/bg-v5@2x.png') no-repeat; */
  background: url("https://file.sanalive.online/FkvA02XK8X48CUGs0vcMNwuDif3Y?imageslim/zlevel/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100% 100%;
}

.bg-v5 {
  /* background: url('@/assets/p/vipPrivilege/bg-v6@2x.png') no-repeat; */
  background: url("https://file.sanalive.online/Fsk3HcVmhIurKOsHmu_BAI11DwPL?imageslim/zlevel/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100% 100%;
}

.bg-v6 {
  /* background: url('@/assets/p/vipPrivilege/bg-v7@2x.png') no-repeat; */
  background: url("https://file.sanalive.online/FrzySVE5kPfWaTKIFI1bFR6h18nf?imageslim/zlevel/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100% 100%;
}

.loading-box {
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
}

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

/*  */
.vip {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #333;
}

.vip img {
  width: 16px;
  height: 16px;
}

.vip-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/*  */
.popup-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.pop-img {
  width: 100%;
}

.page-img {
  width: 100%;
  height: 400px;
  padding: 40px 16px 0;
  box-sizing: border-box;
}

.page-img-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  place-items: center;
}

.page-img-flex {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.page-item-grid {
  width: 58px;
}

.page-item-flex {
  width: 100%;
}

.img-grid {
  width: 100%;
  max-height: 58px;
  object-fit: cover;
}

.img-flex {
  width: 100%;
  height: 16px;
  object-fit: cover;
}

.vip-name {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 13.6px;
  color: #151515;
  margin-bottom: 8px;
}

.page-exclusivo {
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: url('@/assets/p/vipPrivilege/v-popbtm@2x.png') no-repeat; */
  background: url("https://file.pawalive.com/Ft0jrM1z1Q5SW1KDlEC-44_eP9-k?imageslim/zlevel/3%7Cimagediv2/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100% 100%;
}

.page-exclusivo img {
  width: 64px;
  height: 64px;
  object-fit: cover;
}

.pop-content {
  width: 100%;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 8px 0 16px;
  color: #151515;
}

.pop-content span {
  color: #151515;
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0;
}

.pop-content p {
  color: #151515;
  font-size: 13.6px;
  letter-spacing: 1px;
}

.pop-button {
  /* background: linear-gradient(to right, #D468FF 0%, #8E51FF 100%); */
  background: #00dbb3;
  width: 80%;
  height: 40px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}
</style>
