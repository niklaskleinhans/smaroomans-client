<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex md6>
        <v-card>
          <!-- <v-btn @click="triggerMqtt">trigger</v-btn>
          <v-btn @click="clickPub">publish</v-btn>-->
          <v-date-picker v-model="dates" color="green" multiple scrollable first-day-of-week="1"></v-date-picker>
        </v-card>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex md6>
        <v-card>
          <v-card v-for="(noti, index) in notifications" :key="index">{{noti}}</v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import debug from "debug";
// import baseUrl from "baseUrl";

export default {
  name: "User",
  data() {
    return {
      baseUrl: "http://",
      notifications: [],
      dates: []
    };
  },
  methods: {
    ...mapActions(["setCurrentUser"]),
    triggerMqtt: function() {
      axios
        .post(this.baseUrl + "/api/triggernotification")
        .then(res => {
          console.log("triggered request");
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    clickPub: function() {
      this.$mqtt.publish("param/param/param/test", "message");
    }
  },
  mounted() {
    if (debug) {
      this.baseUrl = "http://localhost:5000";
    } else {
      this.baseUrl += location.host;
    }
    console.log("Mode: " + process.env.NODE_ENV);
    this.$mqtt.subscribe("notification/thing");
    this.$mqtt.subscribe("param/param/param/test");
  },
  computed: {
    ...mapGetters(["getUsers", "getCurrentUser"]),
    currentUser: {
      get() {
        return this.getCurrentUser;
      },
      set(value) {
        this.setCurrentUser(value);
      }
    }
  },
  mqtt: {
    "notification/thing"(val, topic) {
      this.notifications.push("notification: " + val);
      this.notifications.push("notification: " + topic);
      console.log(this.notifiactions);
    },
    "param/param/param/test"(data, topic) {
      console.log("notification: " + topic + " " + data);
    }
  }
};
</script>
