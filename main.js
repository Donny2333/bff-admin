import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';
import router from "./router/index"
import '@arco-design/web-vue/dist/arco.css';
import store from '@/store'
import installIcons from '@/icons'
const app = createApp(App);
app.use(ArcoVue);
installIcons(app)
app.use(router)
app.use(store)
app.mount('#app');
