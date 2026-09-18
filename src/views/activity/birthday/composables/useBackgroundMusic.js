import { ref } from "vue";

// 全局单例音频实例
let globalAudio = null;
let globalSrc = "";
const isPlaying = ref(false);

export function useBackgroundMusic() {
  const initAudio = (src, volume = 0.5) => {
    // 如果换了音频源，重新创建
    if (globalAudio && globalSrc !== src) {
      globalAudio.pause();
      globalAudio = null;
    }
    
    if (!globalAudio) {
      globalAudio = new Audio(src);
      globalAudio.loop = true;
      globalAudio.volume = volume;
      globalSrc = src;
      
      // 监听音频结束事件（虽然设置了 loop，但以防万一）
      globalAudio.addEventListener("ended", () => {
        globalAudio.currentTime = 0;
        globalAudio.play().catch(() => {});
      });
    }
  };

  const play = (src, volume = 0.5) => {
    initAudio(src, volume);
    if (globalAudio.paused) {
      globalAudio.play().catch((e) => {
        console.warn("Audio play blocked:", e);
      });
    }
    isPlaying.value = true;
  };

  const pause = () => {
    if (globalAudio) {
      globalAudio.pause();
    }
    isPlaying.value = false;
  };

  const toggle = (src, volume = 0.5) => {
    if (isPlaying.value) {
      pause();
    } else {
      play(src, volume);
    }
  };

  const destroy = () => {
    if (globalAudio) {
      globalAudio.pause();
      globalAudio = null;
      globalSrc = "";
    }
    isPlaying.value = false;
  };

  return {
    isPlaying,
    play,
    pause,
    toggle,
    destroy,
  };
}