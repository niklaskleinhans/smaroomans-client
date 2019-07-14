<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex md6>
        <v-card>
          <v-card-title primary-title>Home Office Planner</v-card-title>
          <v-date-picker
            v-model="currentUser.workplan"
            color="green"
            multiple
            scrollable
            first-day-of-week="1"
            :disabled="!currentUser"
          ></v-date-picker>
        </v-card>
        <v-card>
          <v-btn :disabled="!currentUser" @click="saveUserPlan(currentUser)">
            <v-icon>save</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
      <v-flex offset-md2 md4>
        <v-card>
          <v-card-title>Notifications</v-card-title>
          <v-card color="grey lighten-2" hover v-for="(noti, index) in notifications" :key="index">
            <v-card-title primary-title>{{noti.text}}</v-card-title>
            <v-card-actions>
              <v-flex offset-md9 md2>
                <v-btn v-if="noti.topic" @click="doAction(noti.topic, noti.topicdata)">Accept</v-btn>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import debug from "debug";
import mqtt from "mqtt";
// import baseUrl from "baseUrl";

export default {
  name: "User",
  data() {
    return {
      baseUrl: "http://",
      client: {},
      mqtt: require("mqtt"),
      notifications: [],
      dates: []
    };
  },
  methods: {
    ...mapActions(["setCurrentUser"]),
    saveUserPlan: function(plan) {
      axios
        .put(this.baseUrl + "/api/setuserplan", plan)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    doAction: function(topic, topicdata) {
      this.client.publish(topic, JSON.stringify(topicdata));
      console.log("published: " + topic + " " + JSON.stringify(topicdata));
    }
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
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

    // mqtt.js
    this.client = mqtt.connect("mqtt://192.168.0.230:1884");
    this.client.on("connect", () => {
      console.log("User - succesfully connected mqtt");
      this.client.subscribe("client/notifications");
    });

    var self = this;
    this.client.on("message", (topic, message) => {
      // console.log("User: mqtt message: '" + topic + "' received"); // log
      var messageJson = JSON.parse(message);
      // console.log(messageJson);  // log
      if (self.currentUser != undefined) {
        if (messageJson.user == self.currentUser.key) {
          self.notifications = messageJson.data;
        }
      }
    });
  },
  beforeDestroy() {
    console.log("destroying now!");
    this.client.unsubscribe("client/notifications");
    // this.$mqtt.unsubscribe("client/notifications");
    this.notifications = [];
  }
};
</script>
