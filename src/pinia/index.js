import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    uid: "9000162",
    ticket: "ticket",
    appVersion: "1.0.3.0",
    appid: "xchat",
    platform: "android", // android ios web
    os: "android",
    deviceId: "",
    language: "en", // en zh ar pt
    token: "",
    code: "",
    roomId: "",
  }),
  actions: {
    setParams(params) {
      console.log(params);
      // 需要转成数字
      this.uid = params.uid || 0;
      this.ticket = params.ticket || "ticket";
      this.language = params.language || "en";
      this.platform = params.platform || "android";
      this.appVersion = params.appVersion || "1.0.1.0";
      this.os = params.os || "android";
      this.deviceId = params.deviceId || "deviceId";
      this.appid = params.appid || "xchat";
      this.roomId = params.roomId || "";
      console.log(this.roomId, "rom id");
    },
  },
  getters: {
    // 获取安全区域总高度
    safeContent: (state) => state.safeTop + state.safeBottom,
    // 判断版本号是否高于
    isAppVersionHigher: (state) => {
      if (state.platform === "ios") {
        return true;
      } else {
        if (!state.appVersion || typeof state.appVersion !== "string") {
          return false;
        }
        const version = state.appVersion.trim();
        const targetVersion = "1.0.3.9";
        const versionRegex = /^\d+\.\d+\.\d+\.\d+$/;
        if (!versionRegex.test(version)) {
          console.warn("Invalid appVersion format:", version);
          return false;
        }
        const versionParts = version.split(".").map(Number);
        const targetParts = targetVersion.split(".").map(Number);
        for (let i = 0; i < Math.max(versionParts.length, targetParts.length); i++) {
          const versionPart = versionParts[i] || 0;
          const targetPart = targetParts[i] || 0;
          if (versionPart > targetPart) {
            return true;
          } else if (versionPart < targetPart) {
            return false;
          }
        }
        return false;
      }
    },
  },
});
