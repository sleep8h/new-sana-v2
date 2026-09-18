<template>
  <div class="vip-content">
    <div class="vip-level-animal">
      <div class="vip-animal" :class="'tag-v' + vipId"></div>
      <div class="vip-expireTime" v-if="expireTime != null && vipId <= nowVipId">
        {{ t("vipPrivilege.expire") }}：{{ getFormatTime(expireTime) || "xxxx.xx.xx" }}
      </div>
    </div>
    <div class="privilege" :class="'target-v' + vipId">
      <div class="tag-bottom">
        <div class="vip-item" v-show="vipId != 0" @click="$emit('changeVip', vipId - 1)">
          <div class="disc"></div>
          <div class="vip-text">VIP{{ vipId }}</div>
        </div>
        <div class="vip-item center">
          <div class="disc disc-active"></div>
          <div class="vip-text text-active">VIP{{ vipId + 1 }}</div>
        </div>
        <div class="vip-item" v-show="vipId < 7 && vipId != 6" @click="$emit('changeVip', vipId + 1)">
          <div class="disc"></div>
          <div class="vip-text">VIP{{ vipId + 2 }}</div>
        </div>
      </div>
      <div class="vip-level-info">
        <div class="scroll-levelBox">
          <div class="tag-name">
            <div class="line-box" :class="'line-v' + vipId">
              <div class="mask-box mask-left"></div>
              <div class="mask-title">{{ t("vipPrivilege.tag1") }}</div>
              <div class="mask-box mask-right"></div>
            </div>
          </div>
          <div class="tag-list">
            <div class="tag-item" v-for="(item, index) in data.resourcesList">
              <div class="tag-item-bg" :class="'item-bg-v' + vipId">
                <img :src="item.privilegeImage" alt="" @click="showPopup(1, item, index + 1)" />
              </div>
              <div class="tag-item-name">{{ item.privilegeName || "*****" }}</div>
            </div>
          </div>

          <div class="tag-name">
            <div class="line-box" :class="'line-v' + vipId">
              <div class="mask-box mask-left"></div>
              <div class="mask-title">{{ t("vipPrivilege.tag2") }}</div>
              <div class="mask-box mask-right"></div>
            </div>
          </div>
          <div class="tag-list">
            <div class="tag-item" v-for="(item, index) in data.privilegesList">
              <div class="tag-item-bg">
                <img
                  v-if="item.privilegeStatus == 0"
                  :src="item.privilegeImage"
                  alt=""
                  @click="showPopup(2, item, 0)"
                />
                <img v-else :src="item.privilegeDetailImage" alt="" @click="showPopup(3, item, 0)" />
              </div>
              <div class="tag-item-name">{{ item.privilegeName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="value-box" :class="'value-v' + vipId">
      <div class="value-left">
        <div class="diamonds"></div>
        <text class="diamond-text">{{ data.goldPrice || 0 }} / {{ data.days || 30 }}days</text>
      </div>
      <div class="value-right">
        <button class="buy-btn" v-if="data.buyStatus != 0" @click="getNew(data.buyStatus, data.vipId)">
          {{ getBtnName(data.buyStatus) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { ref, computed } from "vue";

const props = defineProps({
  vipId: {
    type: Number,
    default: 0,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  expireTime: {
    type: Number,
    default: 0,
  },
  nowVipId: {
    type: Number,
    default: 0,
  },
});

const emits = defineEmits(["getVipInfo", "getNew", "showPopup", "changeVip"]);

const getBtnName = (status) => {
  // 0不可购买 1购买 2续费 3升级 4升级，已拥有价值溢出
  switch (status) {
    case 0:
      return t("vipPrivilege.buy1");
    case 1:
      return t("vipPrivilege.buy2");
    case 2:
      return t("vipPrivilege.buy3");
    case 3:
      return t("vipPrivilege.buy4");
    case 4:
      return t("vipPrivilege.buy4");
    default:
      return t("vipPrivilege.buy6");
  }
};

const getFormatTime = (time) => {
  if (!time) return "";
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const getVipInfo = (url, name) => {
  emits("getVipInfo", url, name);
};

const getNew = (status, vipId) => {
  emits("getNew", status, vipId);
};

const showPopup = (type, item, index) => {
  emits("showPopup", type, item, index);
};
</script>

<style scoped>
.vip-content {
  width: 100%;
  height: 100%;
}

.vip-level-animal {
  width: 100%;
  height: 288px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.vip-animal {
  width: 200px;
  height: 200px;
  margin: 16px 0 8px;
}

.vip-expireTime {
  min-width: 160px;
  height: 24px;
  line-height: 24px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 12.8px;
  border-radius: 25px;
  text-align: center;
  padding: 0 8px;
  letter-spacing: 1px;
}

/* privilege */
.privilege {
  width: 100%;
  height: calc(100% - 352px);
  position: relative;
}

.target-v0 {
  background: url("@/assets/p/vipPrivilege/target-v1.png") no-repeat;
  background-size: 100% 100%;
}

.target-v1 {
  background: url("@/assets/p/vipPrivilege/target-v2.png") no-repeat;
  background-size: 100% 100%;
}

.target-v2 {
  background: url("@/assets/p/vipPrivilege/target-v3.png") no-repeat;
  background-size: 100% 100%;
}

.target-v3 {
  background: url("@/assets/p/vipPrivilege/target-v4.png") no-repeat;
  background-size: 100% 100%;
}

.target-v4 {
  background: url("@/assets/p/vipPrivilege/target-v5.png") no-repeat;
  background-size: 100% 100%;
}

.target-v5 {
  background: url("@/assets/p/vipPrivilege/target-v6.png") no-repeat;
  background-size: 100% 100%;
}

.target-v6 {
  background: url("@/assets/p/vipPrivilege/target-v7.png") no-repeat;
  background-size: 100% 100%;
}

.tag-bottom {
  width: 100%;
  height: 48px;
  display: flex;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  gap: 16px;
  position: relative;
}

.vip-item {
  width: 80px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #c2ad6b;
  position: absolute;
}

.disc {
  width: 12.8px;
  height: 12.8px;
  background: #c2ad6b;
  border-radius: 16px;
}

.disc-active {
  background: #ffd141;
}

.text-active {
  color: #ffda8b;
  font-size: 16px;
}

.vip-item:nth-child(1) {
  top: 3.2px;
  left: 40px;
}

.vip-item:nth-child(2) {
  top: -6.4px;
}

.vip-item:nth-child(3) {
  top: 3.2px;
  right: 40px;
}

.vip-level-info {
  width: 100%;
  height: calc(100% - 64px);
  box-sizing: border-box;
  padding: 16px 0;
}

.scroll-levelBox {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.tag-name {
  width: 100%;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.line-box {
  min-width: 288px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.line-v0 {
  background: url("@/assets/p/vipPrivilege/line-v1.png") no-repeat;
  background-size: 100% 100%;
}

.line-v1 {
  background: url("@/assets/p/vipPrivilege/line-v2.png") no-repeat;
  background-size: 100% 100%;
}

.line-v2 {
  background: url("@/assets/p/vipPrivilege/line-v3.png") no-repeat;
  background-size: 100% 100%;
}

.line-v3 {
  background: url("@/assets/p/vipPrivilege/line-v4.png") no-repeat;
  background-size: 100% 100%;
}

.line-v4 {
  background: url("@/assets/p/vipPrivilege/line-v5.png") no-repeat;
  background-size: 100% 100%;
}

.line-v5 {
  background: url("@/assets/p/vipPrivilege/line-v6.png") no-repeat;
  background-size: 100% 100%;
}

.line-v6 {
  background: url("@/assets/p/vipPrivilege/line-v7.png") no-repeat;
  background-size: 100% 100%;
}
.mask-box {
  width: 16px;
  height: 16px;
  background: pink;
}

.mask-title {
  padding: 0 8px;
  color: #ffd262;
  font-size: 16px;
  font-weight: 600;
}

.mask-left {
  background: url("@/assets/p/vipPrivilege/second-left@2x.png") no-repeat;
  background-size: 100% 100%;
}

.mask-right {
  background: url("@/assets/p/vipPrivilege/second-right@2x.png") no-repeat;
  background-size: 100% 100%;
}

/* tag-list */
.tag-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  place-items: center;
  gap: 8px;
  margin: 16px 0;
  align-items: start;
}

.tag-item {
  min-width: 112px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tag-item-bg {
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-item-bg img {
  width: 56px;
  min-height: 16px;
}

.tag-item-name {
  width: 96px;
  text-align: center;
  font-size: 13.6px;
  color: #ffd262;
  padding: 8px 0;
}

.value-box {
  width: 100%;
  height: 64px;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 0;
}

.value-left {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #ffd262;
  font-size: 13.6px;
}

.diamonds {
  width: 24px;
  height: 24px;
  background: url("@/assets/p/vipPrivilege/diamond@2x.png");
  background-size: 100% 100%;
}

.diamond-text {
  padding: 0 8px;
}

.value-right {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.buy-btn {
  min-width: 96px;
  height: 16px;
  padding: 0 16px;
  background: linear-gradient(130deg, #ffc673 0%, #e9aa28 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13.6px;
}

/* vip等级对应的动物勋章 */
.tag-v0 {
  background: url("https://file.sanalive.online/FvZ8OlBmOMF7HVWjxSzsoXs5M_FJ?imageslim/zlevel/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100%;
}

.tag-v1 {
  background: url("https://file.sanalive.online/Fu6zlD2ApUj4-VPwbz3sKYG3QwsP?imageslim/zlevel/1/format/webp/ignore-error/1")
    no-repeat;
  background-size: 100%;
}

.tag-v2 {
  background: url("https://file.sanalive.online/Fi4d0Nvk482uRqBgMGwO9cF5NZsU?imageslim/zlevel/1/format/webp/ignore-error/1");
  background-size: 100%;
}

.tag-v3 {
  background: url("https://file.sanalive.online/FiIVCDCNrH1Vh8LzfB2S1Ta6MeU0?imageslim/zlevel/1/format/webp/ignore-error/1");
  background-size: 100%;
}

.tag-v4 {
  background: url("https://file.sanalive.online/FjiRIwb8O7uyuup7FOU66yShlBpu?imageslim/zlevel/1/format/webp/ignore-error/1");
  background-size: 100%;
}

.tag-v5 {
  background: url("https://file.sanalive.online/FgiknQLAJu6cgrzFLBbRcWIq0PMp?imageslim/zlevel/1/format/webp/ignore-error/1");
  background-size: 100%;
}

.tag-v6 {
  background: url("https://file.sanalive.online/Fskfr3gUWMX7Q6BAPrx7O_fJNIj0?imageslim/zlevel/1/format/webp/ignore-error/1");
  background-size: 100%;
}

.item-bg-v0 {
  background: url("@/assets/p/vipPrivilege/item-bg-v1.png") no-repeat;
  background-size: 100% 100%;
}

.item-bg-v1 {
  background: url("@/assets/p/vipPrivilege/item-bg-v2.png") no-repeat;
  background-size: 100% 100%;
}

.item-bg-v2 {
  background: url("@/assets/p/vipPrivilege/item-bg-v3.png") no-repeat;
  background-size: 100% 100%;
}

.item-bg-v3 {
  background: url("@/assets/p/vipPrivilege/item-bg-v4.png") no-repeat;
  background-size: 100% 100%;
}

.item-bg-v4 {
  background: url("@/assets/p/vipPrivilege/item-bg-v5.png") no-repeat;
  background-size: 100% 100%;
}

.item-bg-v5 {
  background: url("@/assets/p/vipPrivilege/item-bg-v6.png") no-repeat;
  background-size: 100% 100%;
}

.item-bg-v6 {
  background: url("@/assets/p/vipPrivilege/item-bg-v7.png") no-repeat;
  background-size: 100% 100%;
}

.value-v0 {
  background: url("@/assets/p/vipPrivilege/value-v1.png") no-repeat;
  background-size: 100% 100%;
}

.value-v1 {
  background: url("@/assets/p/vipPrivilege/value-v2.png") no-repeat;
  background-size: 100% 100%;
}

.value-v2 {
  background: url("@/assets/p/vipPrivilege/value-v3.png") no-repeat;
  background-size: 100% 100%;
}

.value-v3 {
  background: url("@/assets/p/vipPrivilege/value-v4.png") no-repeat;
  background-size: 100% 100%;
}

.value-v4 {
  background: url("@/assets/p/vipPrivilege/value-v5.png") no-repeat;
  background-size: 100% 100%;
}

.value-v5 {
  background: url("@/assets/p/vipPrivilege/value-v6.png") no-repeat;
  background-size: 100% 100%;
}

.value-v6 {
  background: url("@/assets/p/vipPrivilege/value-v7.png") no-repeat;
  background-size: 100% 100%;
}
</style>
