<template>
  <v-container>
    <HelloWorld />
    <v-layout>
      <v-flex>
        <v-card>
          <v-btn @click="triggerMqtt">trigger</v-btn>
          <v-btn @click="clickPub">publish</v-btn>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card>
          <v-card v-for="(noti, index) in notifications" :key="index">{{noti}}</v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

const axios = require("axios");

export default {
  name: "User",
  components: {
    HelloWorld
  },
  data() {
    return {
      baseUrl: "http://",
      notifications: []
    };
  },
  methods: {
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
    if (process.env.NODE_ENV == "development") {
      this.baseUrl = "http://localhost:5000";
    } else {
      this.baseUrl += location.host;
    }
    this.$mqtt.subscribe("notification/thing");
    this.$mqtt.subscribe("param/param/param/test");
    console.log("Mode: " + process.env.NODE_ENV);
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
