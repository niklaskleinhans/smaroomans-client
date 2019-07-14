<template>
  <div id="app">
    <Header />
    <!-- <router-link to="/">User</router-link>
    <router-link to="/system">System</router-link>-->
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import axios from "axios";
import debug from "debug";

export default {
  name: "app",
  components: { Header },
  mounted() {
    if (debug) {
      // axios
      //   .put("http://localhost:5000/api/initdb")
      //   .then(res => {
      //     console.log(res);
      //     axios
      //       .put("http://localhost:5000/api/start")
      //       .then(res => {
      //         console.log(res);
      //       })
      //       .catch(err => {
      //         console.log(err);
      //       });
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
