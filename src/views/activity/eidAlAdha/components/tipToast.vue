<!-- 积分不足提示弹窗 -->
<template>
  <div class="toast" v-if="isShow">
    <p>{{ $t("eidAlAdha.insufficientPointsTip") }}</p>
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

const emit = defineEmits(["update:isShow", "close"]);

const closeModal = () => {
  emit("update:isShow", false);
  emit("close");
};
</script>

<style scoped lang="scss">
.toast {
  width: 224px;
  min-height: 72px;
  position: fixed;
  bottom: 143px;
  z-index: 10000;
  background: rgba(179, 91, 1, 0.85);
  border-radius: 12px;
  border: 1px solid #ffd656;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
  line-height: 20px;
  text-align: center;
  font-style: normal;
  box-sizing: border-box;
  padding: 16px 20px;
}
</style>
