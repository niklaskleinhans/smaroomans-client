<template>
  <v-toolbar class="header">
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
      <v-combobox
        v-model="currentUser"
        :items="users"
        item-text="key"
        item-value="workplan"
        prepend-icon="fa-user"
      ></v-combobox>
    </div>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import debug from "debug";

export default {
  name: "Header",
  data() {
    return { baseUrl: "http://" };
  },
  methods: {
    ...mapActions(["setUsers", "setCurrentUser"])
  },
  computed: {
    ...mapGetters(["getUsers", "getCurrentUser"]),
    users: {
      get() {
        return this.getUsers;
      },
      set(users) {
        this.setUsers(users);
      }
    },
    currentUser: {
      get() {
        return this.getCurrentUser;
      },
      set(value) {
        this.setCurrentUser(value);
      }
    }
  },
  mounted() {
    if (debug) {
      this.baseUrl = "http://localhost:5000";
    } else {
      this.baseUrl += location.host;
    }

    axios
      .get(this.baseUrl + "/api/allusers")
      .then(res => {
        console.log(res);
        this.setUsers(res.data.users);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style>
.header {
  z-index: 100;
}
</style>
