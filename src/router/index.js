/*
 * @Author: your name
 * @Date: 2022-03-28 10:43:19
 * @LastEditTime: 2023-06-06 18:39:10
 * @LastEditors: lengyan
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webSystem\src\router\index.js
 */
import { createRouter, createWebHashHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
let noAuth = true;
let requiresAuth = true;  // 当前路由是否需要权限访问
import storage from 'good-storage';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  // {
  //   path: "/login",
  //   name: "login",
  //   component: () => import(/* webpackChunkName: "about" */ "@/views/login/index.vue"),
  //   meta: {
  //     title: "登录",
  //     noAuth
  //   },
  // },

  {
    path: "/test",
    name: "test",
    component: () => import(/* webpackChunkName: "test" */ "@/views/test/index.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "@/views/map/index.vue"),
    meta: {
      title: "首页",
      requiresAuth
    },
    // children: [
    //   {
    //     // path: "linkLayer",
    //     // name: "linkLayer",
    //     // component: () => import(/* webpackChunkName: "linkLayer" */ "@/views/right/link_layer/index.vue"),
    //     // meta: {
    //     //   transitionName: "slide-fade-new2"
    //     // },
    //   },

    // ]
  },

];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

// 登录拦截
router.beforeEach((to, from, next) => {
  // 此处做权限拦截
  // if (!to.meta.noAuth && !storage.session.get('isLogin', 0)) {
  //   return next({ path: '/login' });
  // }
  // else if (to.meta.requiresAuth && !storage.session.get('isLogin')) {
  //   return {
  //     path: '/login',
  //   }
  // }
  // else next();
  next();
});



export default router;
