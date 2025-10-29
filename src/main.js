import { createApp } from "vue";
import App from "./App.vue";
import "../style.css";
import HomePage from "@/pages/HomePage.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: HomePage },
  {
    path: "/:id",
    name: "movie-detail",
    component: () => import("./pages/MovieDetailPage.vue"),
    props: (route) => ({ id: Number(route.params.id) }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
