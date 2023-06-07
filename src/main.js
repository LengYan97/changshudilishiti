/*
 * @Author: your name
 * @Date: 2022-03-28 10:43:19
 * @LastEditTime: 2023-06-06 14:21:41
 * @LastEditors: lengyan
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webSystem\src\main.js
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia'
import axios from 'axios'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import 'animate.css/animate.css'
import '@/assets/css/map.css'
import '@/assets/css/main.css'




const app = createApp(App)

app.config.globalProperties.$axios = axios
app.use(createPinia()).use(router).use(ElementPlus).mount("#app");
