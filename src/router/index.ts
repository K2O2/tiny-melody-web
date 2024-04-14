import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),

  routes: [
    // {
    //   path: "/exploer",
    //   component: () => import("../components/pages/exploer/index.vue"),
    // },
    // {
    //   path: "/playing",
    //   component: () => import("../components/pages/playing/index.vue"),
    // },
    {
      path: "/",
      component: () => import("../components/pages/exploer/index.vue"),
      // redirect: "exploer",
    },
  ],
});
