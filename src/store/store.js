import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { users: ["user0", "user1"], currentUser: "user0" },
  mutations,
  actions,
  getters
});
