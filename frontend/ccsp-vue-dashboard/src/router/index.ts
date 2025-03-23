import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/forms",
      name: "forms",
      component: () => import("../views/Forms.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../views/Users.vue"),
    },
  ],
});

export default router;
