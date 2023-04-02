import { createApp } from "vue";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from "./App.vue";
import router from "./router/index";
import "@arco-design/web-vue/dist/arco.css";
import store from "@/store";
import installIcons from "@/icons";
import { Message, Modal } from "@arco-design/web-vue";

const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);
installIcons(app);
app.use(router);
app.use(store);
app.mount("#app");
Message._context = app._context;
Modal._context = app._context;
