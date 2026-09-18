<template>
  <div>
    <div ref="anim" :id="domId" class="anim-container"></div>
  </div>
</template>

<script>
import url from "@/assets/activity/eidAlAdha/myRanch/video_1.mp4";
import config from "@/assets/activity/eidAlAdha/myRanch/vapc_1.json";
export default {
  name: "vap",
  props: {
    // 动画视频地址
    url: {
      type: String,
      default: url,
      required: true,
    },
    // 配置文件对象
    config: {
      type: Object,
      default: config,
      required: true,
    },
    // 容器宽度
    width: {
      type: [String, Number],
      default: 250,
    },
    // 容器高度
    height: {
      type: [String, Number],
      default: 250,
    },
    // 是否循环播放
    loop: {
      type: Boolean,
      default: true,
    },
    // 帧率配置
    fps: {
      type: Number,
      default: 60,
    },
    // Dom ID
    domId: {
      type: String,
      default: "anim-container",
    },
    // 精准模式
    accurate: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      access: true,
      vap: null,
    };
  },
  methods: {
    play(flag) {
      if (!this.access) {
        return;
      }
      const that = this;
      that.vap = window.Vap.default(
        Object.assign(
          {},
          {
            container: document.getElementById(this.domId),
            // 素材视频链接
            src: that.url,
            // 素材配置json对象
            config: config,
            width: this.width,
            height: this.height,
            // 同素材生成工具中配置的保持一致
            fps: 60,
            // 是否循环
            loop: true,
            // 起始播放时间点
            beginPoint: 0,
            // 精准模式
            accurate: true,
            // 播放起始时间点(秒)
          },
          flag
            ? {
                // 融合信息（图片/文字）,同素材生成工具生成的配置文件中的srcTag所对应，比如[imgUser] => imgUser
                // imgUser: '//shp.qlogo.cn/pghead/Q3auHgzwzM6TmnCKHzBcyxVPEJ5t4Ria7H18tYJyM40c/0',
                // imgAnchor: '//shp.qlogo.cn/pghead/PiajxSqBRaEKRa1v87G8wh37GibiaosmfU334GBWgk7aC8/140',
                // textUser: 'user1',
                // textAnchor: 'user2',
                type: 2,
              }
            : { type: 1 },
        ),
      )
        .on("playing", () => {
          that.access = false;
          console.log("playing");
        })
        .on("ended", () => {
          that.access = true;
          this.vap = null;
          console.log("play ended");
        })
        .on("frame", (frame, timestamp) => {
          // frame: 当前帧(从0开始)  timestamp: (播放时间戳)
          if (frame === 50) {
            // do something
          }
        });
      window.vap = this.vap;
      console.log(window.vap, "Vap");
    },
    pause() {
      this.vap.pause();
    },
    playContinue() {
      this.vap.play();
    },
  },
  mounted() {
    this.play(0);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.anim-container {
  width: 250px;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
</style>
