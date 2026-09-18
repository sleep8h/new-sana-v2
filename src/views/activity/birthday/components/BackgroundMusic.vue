<template>
  <img
    class="music-btn"
    :class="{ paused: !isPlaying }"
    :src="isPlaying ? btnMusicImg : btnMusicCloseImg"
    alt=""
    @click="handleToggle"
  />
</template>

<script setup>
import { computed } from "vue";
import { useBackgroundMusic } from "@/views/activity/birthday/composables/useBackgroundMusic.js";
import btnMusicImg from "@/assets/activity/birthday/btn_music.png";
import btnMusicCloseImg from "@/assets/activity/birthday/btn_music_close.png";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  volume: {
    type: Number,
    default: 0.5,
  },
});

const { isPlaying, toggle, play, pause } = useBackgroundMusic();

const handleToggle = () => {
  toggle(props.src, props.volume);
};

// 暴露方法给父组件
defineExpose({
  play: () => play(props.src, props.volume),
  pause,
  isPlaying,
});
</script>

<style lang="scss" scoped>
.music-btn {
  width: 32px;
  height: 32px;
  // animation: musicRotate 3s linear infinite;
  &.paused {
    animation-play-state: paused;
  }
}

@keyframes musicRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>