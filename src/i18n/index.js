import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import pt from "./locales/pt.json";
import ar from "./locales/ar.json";
import tr from "./locales/tr.json";

const i18n = createI18n({
  legacy: false, // 启用 Composition API 模式
  locale: "en", // 设置默认语言
  fallbackLocale: "en", // 设置回退语言
  globalInjection: true, // 全局注入 $t 函数
  messages: {
    en,
    zh,
    pt,
    ar,
    tr,
  },
});

// 语言代码映射
const languageMap = {
  zh: "zh",
  ch: "zh",
  "zh-cn": "zh",
  "zh-tw": "zh",
  en: "en",
  "en-us": "en",
  "en-gb": "en",
  pt: "pt-BR",
  ar: "ar",
  tr: "tr",
};

// 切换语言方法
export const setLanguage = (lang) => {
  // 转换语言代码
  const mappedLang = languageMap[lang.toLowerCase()] || "en";
  i18n.global.locale.value = mappedLang;
  localStorage.setItem("language", mappedLang);
  document.querySelector("html").setAttribute("lang", mappedLang);
  // console.log('语言已切换到:', mappedLang)
  if (mappedLang === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
  } else {
    document.documentElement.removeAttribute("dir");
  }
};

export default i18n;
