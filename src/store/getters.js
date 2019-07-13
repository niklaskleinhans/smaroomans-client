export default {
  getUsers: state => {
    return state.users;
  },
  getCurrentUser: state => {
    return state.currentUser;
  },
  getDate: state => {
    return state.date;
  }
};
