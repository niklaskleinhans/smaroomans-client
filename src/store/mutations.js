export default {
  SET_CURRENT_USER: (state, value) => {
    state.currentUser = value;
  },
  SET_USERS: (state, users) => {
    state.users = users;
  },
  SET_DATE: (state, value) => {
    state.date = value;
  }
};
