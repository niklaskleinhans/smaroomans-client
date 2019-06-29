<template>
  <div class="user">
    <HelloWorld />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "User",
  components: {
    HelloWorld
  }
};
</script>
