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
    <v-menu v-model="menu" :close-on-content-click="false" full-width max-width="290">
      <template v-slot:activator="{on}">
        <v-text-field :value="computedDateFormatted" readonly v-on="on"></v-text-field>
      </template>
      <v-date-picker
        color="blue"
        v-model="date"
        first-day-of-week="1"
        @change="menu = false; updateDate()"
      ></v-date-picker>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import debug from "debug";
import moment from "moment";

export default {
  name: "Header",
  data: () => ({
    baseUrl: "http://",
    menu: false
  }),
  methods: {
    ...mapActions(["setUsers", "setCurrentUser", "setDate"]),
    updateDate() {
      axios
        .put(this.baseUrl + "/api/updatedate", { date: this.getDate })
        .then(res => {
          console.log("SmaRooManS Header: /api/updatedate ", res);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  computed: {
    ...mapGetters(["getUsers", "getCurrentUser", "getDate"]),
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
    },
    date: {
      get() {
        return this.getDate;
      },
      set(value) {
        this.setDate(value);
      }
    },
    computedDateFormatted() {
      return this.date ? moment(this.date).format("dddd, MMMM Do YYYY") : "";
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
        console.error(err);
      });
  }
};
</script>

<style>
.header {
  z-index: 100;
}
</style>
