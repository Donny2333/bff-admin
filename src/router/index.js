import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store/index";
const routes = [
  {
    path: "/",
    redirect: "/dict",
    children: [
      {
        path: "/dict",
        component: () => import("../views/dict/index.vue"),
        meta: { highlight: "/dict" },
      },
      {
        path: "/ns",
        component: () => import("../views/ns/index.vue"),
        meta: { highlight: "/ns" },
      },
    ],
  },
  {
    path: "/login",
    component: () => import("../views/login/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory("/"),
  routes,
});
// 监听路由拦截
router.beforeEach((to, from, next) => {
  const token = store.state.user.token;
  if (!token && to.path !== "/login") {
    next("/login");
  } else {
    if (token && to.path === "/login") {
      next("/demandmanage");
    }
    next();
  }
});
export default router;
