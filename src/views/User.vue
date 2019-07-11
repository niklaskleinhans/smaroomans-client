<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex md6>
        <v-card>
          <v-card-title primary-title>Home Office Planner</v-card-title>
          <!-- <v-btn @click="triggerMqtt">trigger</v-btn> -->
          <!-- <v-btn @click="clickPub">publish</v-btn> -->
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
// import baseUrl from "baseUrl";

export default {
  name: "User",
  data() {
    return {
      baseUrl: "http://",
      notifications: [
        // {
        //   text: "Open window",
        //   topic: "plugwise2py/cmd/switch/000D6F0004B1E6C4",
        //   topicdata: { val: "off" }
        // }
        // {
        //   text: "Turn light on",
        //   topic: "actuator/light",
        //   topicdata: { val: "on" }
        // }
      ],
      dates: []
    };
  },
  methods: {
    ...mapActions(["setCurrentUser"]),
    // mqtt test functions for buttons on top
    // triggerMqtt: function() {
    //   axios
    //     .post(this.baseUrl + "/api/triggernotification")
    //     .then(res => {
    //       console.log("triggered request");
    //       console.log(res);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // clickPub: function() {
    //   var topic = "client/notifications";
    //   this.$mqtt.publish(topic, "message");
    // },
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
      this.$mqtt.publish(topic, JSON.stringify(topicdata));
      console.log("published: " + topic + " " + JSON.stringify(topicdata));
    },
    function(connack) {
      console.log("succesfully connected with: ", connack);
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

    this.$mqtt.subscribe("client/notifications");
    var self = this;
    this.$mqtt.on("message", (topic, message) => {
      console.log("mqtt message: '" + topic + "' received");
      var messageJson = JSON.parse(message);
      console.log(messageJson);
      if (messageJson.user == self.currentUser.key) {
        self.notifications = messageJson.data;
      }
    });

    // console.log("Mode: " + process.env.NODE_ENV);
    // this.$mqtt.subscribe("notification/thing");
    // this.$mqtt.subscribe("param/param/param/test");
  },
  beforeDestroy() {
    console.log("destroying now!");
    this.$mqtt.unsubscribe("client/notifications");
    this.notifications = [];
  },
  mqtt: {
    // "notification/thing"(val, topic) {
    //   this.notifications.push("notification: " + val);
    //   this.notifications.push("notification: " + topic);
    //   console.log(this.notifiactions);
    // },
    // "param/param/param/test"(data, topic) {
    //   console.log("notification: " + topic + " " + data);
    // }
  }
};
</script>
