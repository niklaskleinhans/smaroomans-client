<template>
  <v-container fluid class="system">
    <v-layout>
      <v-flex md6>
        <v-card>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex v-for="(room, index) in rooms" :key="index" d-flex md2>
                <v-card :color="room.inUse">
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
        <v-card v-if="roomInfo.key">
          <v-card-title primary-title>{{roomInfo.key}}</v-card-title>
          <v-card-text>
            <div left>maxStaff: {{roomInfo.maxStaff}}</div>
          </v-card-text>
          <v-data-table
            :headers="headers"
            :items="roomInfo.sensors"
            rows-per-page-text="25"
            hide-actions
          >
            <template v-slot:items="props">
              <td>{{props.item.key}}</td>
              <td>{{props.item.value}}</td>
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
// import baseUrl from "baseUrl";

export default {
  name: "System",
  data() {
    return {
      baseUrl: "http://",
      roomInfo: { key: null, maxStaff: null, sensors: [] },
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
      this.roomInfo.key = room.key;
      this.roomInfo.maxStaff = room.maxStaff;

      // remove current subscriptions
      for (let subscription in this.subscriptions) {
        this.$mqtt.unsubscribe(this.subscriptions[subscription]);
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
              this.$mqtt.subscribe(sensors[sensor].sensortopic);
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

        // for (let room in this.rooms) {
        //   axios
        //     .get(this.baseUrl + "/api/roomsensors/" + this.rooms[room].key)
        //     .then(res => {
        //       console.log("/api/roomsensors/" + this.rooms[room].key);
        //       console.log(res.data);
        //       for (let sensor in res.data.sensors) {
        //         if (
        //           res.data.sensors[sensor].sensortopic != null &&
        //           !this.subscriptions.includes(
        //             res.data.sensors[sensor].sensortopic
        //           )
        //         ) {
        //           this.$mqtt.subscribe(res.data.sensors[sensor].sensortopic);
        //           this.subscriptions.push(res.data.sensors[sensor].sensortopic);
        //           // console.log(this.$mqtt);
        //         }
        //       }
        //     })
        //     .catch(err => {
        //       console.log(err);
        //     });
        // }
      })
      .catch(err => {
        console.log(err);
      });

    this.$mqtt.on("message", (topic, message) => {
      // var room = topic.split("/")[1];
      // var sensor = topic.split("/")[2];
      // for (let data in message) {
      // }
      console.log("mqtt message: '" + topic + "' received");
      var messageJson = JSON.parse(message);
      console.log(messageJson);
      // check if message contains data for current displayed room
      if (messageJson.room == this.roomInfo.key) {
        var dataKey = Object.keys(messageJson.data)[0];
        var obj = { key: dataKey, value: messageJson.data[dataKey] };
        // delete element from array if there is an older version in there
        var alreadyIn = false;
        for (let element in this.roomInfo.sensors) {
          if (this.roomInfo.sensors[element].key == dataKey) {
            alreadyIn = true;
            let pos = this.roomInfo.sensors.indexOf(
              this.roomInfo.sensors[element]
            );
            // this.roomInfo.sensors.splice(pos, 1);
            this.roomInfo.sensors[pos].value = messageJson.data[dataKey];
            break;
          }
        }
        if (!alreadyIn) {
          this.roomInfo.sensors.push(obj);
        }
      }
    });
  },
  mqtt: {
    // allTopics(res, topic) {
    //   console.log(res);
    //   console.log(topic);
    // }
  }
};
</script>
