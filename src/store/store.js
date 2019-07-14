import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: [],
    currentUser: null,
    date: new Date().toISOString().substr(0, 10)
  },
  mutations,
  actions,
  getters
});
