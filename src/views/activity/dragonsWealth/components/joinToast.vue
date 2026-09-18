<!-- 请选择阵营加入弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <div class="toast-mask" @click="closeModal"></div>
    <div class="toast-content">
      <div class="toast-close" @click="closeModal"></div>
      <div class="content">
        <div class="title">{{ $t("dragons.chooseCamp") }}</div>
        <div class="camp">
          <div class="camp-knight">
            <div :data-text="$t('dragons.knight')">{{ $t("dragons.knight") }}</div>
          </div>
          <div class="camp-dragons">
            <div :data-text="$t('dragons.dragon')">{{ $t("dragons.dragon") }}</div>
          </div>
        </div>
        <div class="btn">
          <div class="btn-knight" @click="joinCamp(1)">{{ $t("dragons.joinKnight") }}</div>
          <div class="btn-dragons" @click="joinCamp(2)">{{ $t("dragons.joinDragon") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isShow: {
    //是否显示
    type: Boolean,
    default: false,
  },
});

const joinCamp = (type) => {
  emit("update:isShow", false);
  emit("close");
  emit("joinCamp", type);
};

const emit = defineEmits(["update:isShow", "close", "joinCamp"]);

const closeModal = () => {
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
    width: 345px;
    height: 459px;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    .toast-close {
      position: absolute;
      top: 0;
      right: 0;
      width: 34px;
      height: 34px;
      background: url("@/assets/activity/dragonsWealth/toast-close.png") no-repeat center center;
      background-size: cover;
    }
    .content {
      position: absolute;
      top: 40px;
      left: 0;
      width: 345px;
      height: 419px;
      background: url("@/assets/activity/dragonsWealth/toast-bg.png") no-repeat center center;
      background-size: cover;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .title {
        margin: 19px auto 49px;
        height: 22px;
        font-weight: bold;
        box-sizing: border-box;
        padding-top: 3px;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        background: linear-gradient(90deg, #f4f998 0%, #ffe721 100%);
        -webkit-background-clip: text; /* Safari/Chrome 兼容 */
        background-clip: text; /* 现代浏览器标准属性 */
        color: transparent; /* 文字透明以显示背景渐变 */
        display: inline-block; /* 必须为块级或行内块元素 [1][3][6] */
      }
      .camp {
        width: 100%;
        box-sizing: border-box;
        padding: 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .camp-knight {
          width: 138px;
          height: 206px;
          background: url("@/assets/activity/dragonsWealth/dragonsLair/knight.png") no-repeat center center;
          background-size: cover;
          position: relative;
          > div {
            position: absolute;
            top: 138px;
            display: inline-block;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 16px;
            color: #ffffff;
            box-sizing: border-box;
            padding-top: 3px;
            line-height: 22px;
            &::after {
              content: attr(data-text);
              position: absolute;
              color: #ffffff;
              text-shadow:
                1px 1px 0px #052150,
                -1px -1px 0px #052150,
                -1px 1px 0px #052150,
                1px -1px 0px #052150;
            }
            &::before {
              content: attr(data-text);
              position: absolute;
              background: linear-gradient(180deg, #ffeec2 0%, #a58948 100%);
              color: transparent;
              -webkit-background-clip: text;
              z-index: 2;
              background-clip: text;
            }
          }
        }
        .camp-dragons {
          width: 138px;
          height: 206px;
          background: url("@/assets/activity/dragonsWealth/dragonsLair/dragon.png") no-repeat center center;
          background-size: cover;
          position: relative;
          > div {
            position: absolute;
            top: 138px;
            display: inline-block;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 16px;
            color: #ffffff;
            box-sizing: border-box;
            padding-top: 3px;
            line-height: 22px;
            &::after {
              content: attr(data-text);
              position: absolute;
              color: #ffffff;
              text-shadow:
                1px 1px 0px #500603,
                -1px -1px 0px #500603,
                -1px 1px 0px #500603,
                1px -1px 0px #500603;
            }
            &::before {
              content: attr(data-text);
              position: absolute;
              background: linear-gradient(180deg, #ffeec2 0%, #a58948 100%);
              color: transparent;
              -webkit-background-clip: text;
              z-index: 2;
              background-clip: text;
            }
          }
        }
      }
      .btn {
        width: 100%;
        box-sizing: border-box;
        padding: 0 28px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn-knight {
          width: 140px;
          height: 48px;
          background: url("@/assets/activity/dragonsWealth/dragonsLair/buttonLeft.png") no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 16px;
          color: #f0fb5d;
          box-sizing: border-box;
          padding-top: 3px;
          text-shadow:
            1px 1px 0px #023768,
            -1px -1px 0px #023768,
            -1px 1px 0px #023768,
            1px -1px 0px #023768;
        }
        .btn-dragons {
          width: 140px;
          height: 48px;
          background: url("@/assets/activity/dragonsWealth/dragonsLair/buttonRight.png") no-repeat center center;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 16px;
          color: #f0fb5d;
          box-sizing: border-box;
          padding-top: 3px;
          text-shadow:
            1px 1px 0px #613c01,
            -1px -1px 0px #613c01,
            -1px 1px 0px #613c01,
            1px -1px 0px #613c01;
        }
      }
    }
  }
}
</style>
