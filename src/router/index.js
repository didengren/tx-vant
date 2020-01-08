import Vue from "vue";
import VueRouter from "vue-router";
import home from "./home";

Vue.use(VueRouter);

const routes = [].concat(home);

const router = new VueRouter({
  mode: process.env.NODE_ENV === "development" ? "hash" : "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log("savedPosition_____", savedPosition);
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  }
});

export default router;
