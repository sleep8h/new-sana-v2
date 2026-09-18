<template>
  <div class="modal-box-container" v-if="isShow" @click="closeModal">
    <div
      class="modal-box-content"
      @click.stop
      :style="{
        backgroundImage: `url('${bgUrl}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        width: width + '%',
        minHeight: height + 'rem',
      }"
    >
      <div class="modal-box-contain">
        <div
          class="modal-box-title"
          :style="{
            minWidth: tWidth + 'rem',
            height: tHeight + 'rem',
          }"
        >
          <slot name="title"></slot>
        </div>
        <div
          class="modal-close-btn"
          v-if="props.showCloseIcon"
          :style="{
            // backgroundImage: `url('${closeIcon}')`,
            // backgroundRepeat: 'no-repeat',
            // backgroundSize: '100% 100%',
            width: cWidth + 'rem',
            height: cHeight + 'rem',
            top: cTop + 'rem',
            right: cRight + 'rem',
          }"
          @click="closeModal"
        ></div>
        <div class="modal-box-content-item">
          <!-- 设置插槽    -->
          <slot name="content"></slot>
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
  title: {
    //标签标题
    type: String,
    default: "",
  },
  content: {
    //内容
    type: String,
    default: "",
  },
  width: {
    //宽度
    type: Number,
    default: 85,
  },
  height: {
    //高度
    type: Number,
    default: 50,
  },
  top: {
    //顶部
    type: Number,
    default: 15,
  },
  bgUrl: {
    type: String,
    default: "",
  },
  titleBg: {
    type: String,
    default: "",
  },
  tWidth: {
    type: Number,
    default: 50,
  },
  tHeight: {
    type: Number,
    default: 3,
  },
  closeIcon: {
    type: String,
    default: "",
  },
  cWidth: {
    type: Number,
    default: 2,
  },
  cHeight: {
    type: Number,
    default: 2,
  },
  cTop: {
    type: Number,
    default: 1,
  },
  cRight: {
    type: Number,
    default: 1,
  },
  showCloseIcon: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:isShow", "close"]);

const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};
</script>

<style scoped lang="scss">
.modal-box-container {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal-box-content {
  position: relative;
  padding: 20px;
  z-index: 10000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 16px;
}

.modal-box-contain {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 0 8px;
  box-sizing: border-box;
}

.modal-box-title {
  position: absolute;
  top: -48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: #efefef; */
}

.modal-box-content-item {
  width: 100%;
  height: 100%;
  /* background: #efefef; */
}

.modal-close-btn {
  position: absolute;
  // background:url('@/assets/close.png') no-repeat;
  // background-size: 100% 100%;
}
</style>
