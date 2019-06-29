import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueMqtt from "vue-mqtt";

Vue.use(VueMqtt, "ws://192.168.1.230:1884", {});
Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
