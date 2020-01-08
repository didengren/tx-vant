import homeIndex from "@/views/home/index.vue";
import home from "@/views/home/home.vue";

let routes = [
  {
    path: "/",
    name: "homeIndex",
    component: homeIndex,
    redirect: "/index",
    children: [
      {
        path: "index",
        name: "home",
        component: home
      }
    ]
  }
];

export default routes;
