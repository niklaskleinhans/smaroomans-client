import Vue from "vue";
import Router from "vue-router";
import User from "./views/User.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "User",
      component: User
    },
    {
      path: "/system",
      name: "System",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/System.vue")
    }
  ]
});
