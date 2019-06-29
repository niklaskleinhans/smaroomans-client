<template>
  <v-container>
    <HelloWorld />
    <v-layout>
      <v-flex>
        <v-card>
          <v-btn @click="triggerMqtt">trigger</v-btn>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card>
          <div>{{ notificationtext }}</div>
          <div>blub</div>
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
      notificationtext: ""
    };
  },
  methods: {
    triggerMqtt: function() {
      axios
        .post(this.baseUrl + "/api/triggernotification")
        .then(res => {
          console.log("triggered request");
          console.log(res);
          this.notificationtext += "\nnext notification";
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.baseUrl += location.host;
    this.$mqtt.subscribe("notification");
  },
  mqtt: {
    notification: function() {
      console.log("notification");
    }
  }
};
</script>
