<template>
  <v-toolbar>
    <v-spacer></v-spacer>
    <v-toolbar-title>Smart Room Management System</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <router-link to="/" tag="button">
        <v-btn flat>User</v-btn>
      </router-link>
      <router-link to="/system" tag="button">
        <v-btn flat>System</v-btn>
      </router-link>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <div data-app>
      <v-combobox v-model="currentUser" :items="getUsers" label="User" prepend-icon="fa-user"></v-combobox>
    </div>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Header",
  data() {
    return {};
  },
  methods: {
    ...mapActions(["setCurrentUser"])
  },
  computed: {
    ...mapGetters(["getCurrentUser", "getUsers"]),
    currentUser: {
      get() {
        return this.getCurrentUser;
      },
      set(value) {
        this.setCurrentUser(value);
      }
    }
  }
};
</script>
