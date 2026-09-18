<template>
  <view class="mask" v-if="isShowMask" @click="closeMask">
    <view class="modal" @click.stop :style="{ top: cTop + '%' }">
      <view class="modal-content">
        <slot name="content"></slot>
        <!-- 插槽内容 -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "maskModal",
  props: {
    isShowMask: {
      type: Boolean,
      default: false,
    },
    cTop: {
      type: Number,
      default: 10,
    },
  },
  methods: {
    // 打开弹窗
    openModal() {
      this.$emit("update:isShowMask", true); // 打开弹窗，使用 v-model 的双向绑定
    },

    // 关闭弹窗
    closeModal() {
      this.$emit("update:isShowMask", false); // 关闭弹窗
    },

    // 清空插槽内容
    clearContent() {
      // 清空插槽内容的方法
      this.$slots.default = [];
    },

    // 关闭弹窗并触发父组件监听的 closeMask 事件
    closeMask() {
      this.closeModal(); // 调用关闭弹窗
      this.$emit("closeMask"); // 触发父组件监听的 closeMask 事件
    },
  },
};
</script>

<style scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.modal {
  position: fixed;

  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  min-height: 160px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* background: linear-gradient(to right,#631383 0% ,#290B5A 100%); */
  background: #fff;
}

.modal-content {
  width: 100%;
  height: 100%;
  font-size: 16px;
  text-align: center;
  color: #333;
  color: #fff;
}
</style>
