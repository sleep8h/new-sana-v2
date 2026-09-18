<template>
  <div v-if="showPopup" class="popup-overlay" @click="closePopup">
    <div class="popup-content" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popupdiv01",
  emits: ["close"],
  props: {
    showPopup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    closePopup() {
      // console.log('关闭')
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss">
/*遮罩层*/
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* 弹出框 */
.popup-content {
  width: 80%;
  max-width: 480px;
  height: auto;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 0 9.6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.pop-tips {
  display: inline;
  position: absolute;
  right: 16px;
  width: 32px;
  height: 32px;
}
</style>
