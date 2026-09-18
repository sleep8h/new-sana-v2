<!-- 选择祈福1次或者10次文案弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="title" :class="{ 'breathing-button': breathingShow }">{{ $t("ramadan.blessingSendTitle") }}</div>
      <div class="list">
        <div
          :class="[{ 'item-show': cur === item.value }, 'item']"
          @click="changeText(item)"
          v-for="(item, index) in textList"
          :key="index"
        >
          {{ item.label }}
          <img v-if="type === 10" class="tenTimes" :src="blessing10" alt="" />
        </div>
      </div>
      <div class="btn">
        <div class="confirm" @click="confirm">{{ $t("ramadan.confirm") }}</div>
        <div class="cancel" @click="remember">{{ $t("ramadan.blessingSendLater") }}</div>
      </div>
      <div class="toast-close" @click="closeModal"></div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import blessing10 from "@/assets/activity/ramadan/components/blessing10.png";
import { onMounted } from "vue";

const { t } = useI18n();

const props = defineProps({
  isShow: {
    //是否显示
    type: Boolean,
    default: false,
  },
  content: {
    //内容
    type: String,
    default: "",
  },
  type: {
    //类型
    type: Number,
    default: 1,
  },
});
const cur = ref(null);
const textList = [
  { label: t("ramadan.blessingSendText1"), value: 1 },
  { label: t("ramadan.blessingSendText2"), value: 2 },
  { label: t("ramadan.blessingSendText3"), value: 3 },
  { label: t("ramadan.blessingSendText4"), value: 4 },
  { label: t("ramadan.blessingSendText5"), value: 5 },
];
const breathingShow = ref(false);

const emit = defineEmits(["update:isShow", "close", "confirm"]);

const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};

const changeText = (item) => {
  cur.value = item.value;
};

const confirm = () => {
  if (!cur.value) {
    breathingShow.value = true;
    setTimeout(() => {
      breathingShow.value = false;
    }, 3000);
    return false;
  }
  emit("confirm", cur.value);
};

const remember = () => {
  if (!cur.value) {
    breathingShow.value = true;
    setTimeout(() => {
      breathingShow.value = false;
    }, 3000);
    return false;
  }
  // 记住选择项
  if (props.type === 1) localStorage.setItem("prayerText-1", cur.value);
  if (props.type === 10) localStorage.setItem("prayerText-10", cur.value);
  emit("confirm", cur.value);
};

onMounted(() => {
  cur.value = Number(localStorage.getItem("prayerText-" + props.type)) || null;
});
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
    width: 100%;
    height: 469px;
    background: url("@/assets/activity/ramadan/components/bg_rule.png") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      width: 181px;
      height: 56px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 600;
      font-size: 20px;
      color: #fef188;
      line-height: 28px;
      text-align: center;
      margin: 88px auto 12px;
      color: #fef188;
      text-shadow:
        1px 1px 0px #8a5e02,
        -1px -1px 0px #8a5e02,
        -1px 1px 0px #8a5e02,
        1px -1px 0px #8a5e02;
    }
    .list {
      width: 100%;
      height: 210px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      overflow-y: auto;
      margin: 0 auto 13px;
      .item {
        width: 265px;
        height: 34px;
        background: linear-gradient(180deg, #00461f 0%, #006729 100%);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
        border-radius: 13px;
        border: 1px solid #65b050;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 13px;
        color: #ffef74;
        line-height: 20px;
        text-align: center;
        margin-bottom: 10px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        .tenTimes {
          position: absolute;
          width: 38px;
          height: 24px;
          top: -6px;
          right: -19px;
        }
      }
      .item-show {
        width: 265px;
        height: 34px;
        background: linear-gradient(180deg, #ad8810 0%, #c5cf05 100%);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
        border-radius: 13px;
        border: 1px solid #fff8b3;
        color: #473800;
      }
    }
    .content {
      width: 257px;
      height: 291px;
      overflow-y: auto;
      font-family:
        PingFangSC,
        PingFang SC;
      font-size: 14px;
      color: #fff099;
      line-height: 20px;
      text-align: left;
    }
    .btn {
      width: 100%;
      padding: 0 53px 0 49px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .confirm,
      .cancel {
        width: 78px;
        height: 46px;
        background: url("@/assets/activity/ramadan/components/blessing_confirm.png") no-repeat center center;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 12px;
        line-height: 22px;
        text-align: center;
        color: #ffffd8;
        text-shadow:
          1px 1px 0px #473800,
          -1px -1px 0px #473800,
          -1px 1px 0px #473800,
          1px -1px 0px #473800;
      }
      .cancel {
        width: 195px;
        height: 46px;
        font-size: 12px;
        line-height: 17px;
        box-sizing: border-box;
        padding: 0 10px;
        background: url("@/assets/activity/ramadan/components/blessing_later.png") no-repeat center center;
        background-size: cover;
        color: #e2fbcf;
        text-shadow:
          1px 1px 0px #1a6301,
          -1px -1px 0px #1a6301,
          -1px 1px 0px #1a6301,
          1px -1px 0px #1a6301;
      }
    }
    .toast-close {
      position: absolute;
      top: 48px;
      right: 25px;
      width: 34px;
      height: 34px;
      background: url("@/assets/activity/ramadan/components/toast_close.png") no-repeat center center;
      background-size: cover;
    }
  }
}
</style>
