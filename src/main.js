import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueMqtt from "vue-mqtt";
import "@fortawesome/fontawesome-free/css/all.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(VueMqtt, "ws://192.168.1.230:1884", {});
Vue.use(Vuetify, { iconfont: "md" });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
