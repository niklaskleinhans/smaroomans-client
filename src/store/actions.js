export default {
  setCurrentUser({ commit }, value) {
    commit("SET_CURRENT_USER", value);
  },
  setUsers({ commit }, users) {
    commit("SET_USERS", users);
  },
  setDate({ commit }, value) {
    commit("SET_DATE", value);
  }
};
