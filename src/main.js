import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import i18n from "./i18n";
import sanaAutoText from "@/components/sanaAutoText/index.vue";
import "@/utils/vap.js";
import { List } from "vant";
import VConsole from "vconsole";

if (import.meta.env.VITE_APP_ENV === "development") {
  new VConsole();
}

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(i18n);
app.use(List);
app.component("sanaAutoText", sanaAutoText);
app.mount("#app");
