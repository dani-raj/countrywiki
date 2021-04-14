import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CountryDetails from "../views/CountryDetails.vue";
import FlagQuiz from "../views/FlagQuiz.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/details/:name",
    name: "CountryDetails",
    component: CountryDetails,
    children: [
      {
        path: "random",
        name: "RandomDetails",
        component: CountryDetails
      }
    ]
  },
  {
    path: "/quiz",
    name: "FlagQuiz",
    component: FlagQuiz
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
