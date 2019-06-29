<template>
  <v-toolbar>
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
  </v-toolbar>
</template>

<script>
export default {};
</script>
