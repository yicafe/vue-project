import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
// 从 router 文件夹下引入路由实例
import router from "./router";

createApp(App).use(router);
createApp(App).mount('#app');

//和上面的重复
createApp(App).use(router).mount('#app')