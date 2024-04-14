import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./reset.scss";

import { createPinia } from "pinia";
import { useTagStore } from "./store/index.ts";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ElementPlus);

app.mount("#app");

// 初始化时获取标签数据
const tagStore = useTagStore();
tagStore.fetchTag();
