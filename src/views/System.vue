<template>
  <v-container fluid class="system">
    <v-layout>
      <v-flex md5>
        <v-card>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex v-for="(room, index) in rooms" :key="index" d-flex md2>
                <v-card :color="room.active ? 'green' : 'red'">
                  <v-card-title>{{ room.key }}</v-card-title>
                  <v-card-actions>
                    <v-btn flat color="info" @click="showInfo(room)">Info</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex md6>
        <v-card v-if="roomInfo.room">
          <v-card-title primary-title>{{ roomInfo.room }}</v-card-title>
          maxStaff: {{ roomInfo.maxStaff }}
          <v-data-table
            :headers="headers"
            :items="roomInfo.sensors"
            rows-per-page-text="25"
            hide-actions
          >
            <template v-slot:items="props">
              <td>{{ props.item.sensortype }}</td>
              <td>{{ props.item.data[Object.keys(props.item.data)[0]] }}</td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import debug from "debug";
import mqtt from "mqtt";
// import baseUrl from "baseUrl";

export default {
  name: "System",
  data() {
    return {
      baseUrl: "http://",
      client: {},
      mqtt: require("mqtt"),
      roomInfo: { room: null, maxStaff: null, sensors: [] },
      rooms: {},
      headers: [
        { text: "name", align: "left", value: "key" },
        { text: "value", align: "left", sortable: false, value: "key" }
      ],
      subscriptions: []
    };
  },
  methods: {
    showInfo(room) {
      // empty sensorlist
      this.roomInfo.sensors = [];
      // fill data
      this.roomInfo.room = room.key;
      this.roomInfo.maxStaff = room.maxStaff;

      // remove current subscriptions
      for (let subscription in this.subscriptions) {
        this.client.unsubscribe(this.subscriptions[subscription]);
      }
      this.subscriptions = [];
      // subscribe to new topics, where data of the sensors in the current room are published
      axios
        .get(this.baseUrl + "/api/roomsensors/" + room.key)
        .then(res => {
          console.log("GET request: /api/roomsensors/" + room.key + " success");
          console.log(res);
          let sensors = res.data.sensors;
          for (let sensor in sensors) {
            if (
              sensors[sensor].sensortopic != null &&
              !this.subscriptions.includes(sensors[sensor].sensortopic)
            ) {
              this.client.subscribe(sensors[sensor].sensortopic);
              this.subscriptions.push(sensors[sensor].sensortopic);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    if (debug) {
      this.baseUrl = "http://localhost:5000";
    } else {
      this.baseUrl += location.host;
    }

    axios
      .get(this.baseUrl + "/api/allrooms")
      .then(res => {
        console.log("GET request: /api/allrooms/ success");
        console.log(res);
        this.rooms = res.data.rooms;
      })
      .catch(err => {
        console.log(err);
      });

    // mqtt.js
    this.client = mqtt.connect("mqtt://192.168.0.230:1884");
    this.client.on("connect", () => {
      console.log("User - succesfully connected mqtt");
    });

    var self = this;
    this.client.on("message", (topic, message) => {
      console.log("mqtt message: '" + topic + "' received");
      var messageJson = JSON.parse(message);
      // check if message contains data for current displayed room
      if (
        messageJson.room != null &&
        messageJson.room == self.roomInfo.room &&
        messageJson.sensortype != null
      ) {
        // delete element from array if there is an older version in there
        var alreadyIn = false;
        for (let element in self.roomInfo.sensors) {
          if (self.roomInfo.sensors[element].key == messageJson.key) {
            alreadyIn = true;
            let pos = self.roomInfo.sensors.indexOf(
              self.roomInfo.sensors[element]
            );
            // var dataKey = Object.keys(messageJson.data)[0];
            // self.roomInfo.sensors[pos].data[dataKey] =
            //   messageJson.data[dataKey];
            self.roomInfo.sensors.splice(pos, 1);
            self.roomInfo.sensors.push(messageJson);
            break;
          }
        }
        if (!alreadyIn) {
          self.roomInfo.sensors.push(messageJson);
        }
      }
    });
  }
};
</script>
