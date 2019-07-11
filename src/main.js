import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueMqtt from "vue-mqtt";
import "@fortawesome/fontawesome-free/css/all.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(VueMqtt, "ws://192.168.0.230:1884", {});
Vue.use(Vuetify, { iconfont: "md" });

Vue.config.productionTip = false;

const debug = process.env.NODE_ENV !== "production";
var burl = "http://";
if (debug) {
  burl = "http://localhost:5000";
} else {
  burl += location.host;
}
const baseUrl = burl;
const axios = require("axios");

new Vue({
  router,
  store,
  axios,
  debug,
  baseUrl,
  render: h => h(App)
}).$mount("#app");
