<template>
  <v-toolbar>
    <v-toolbar-title>Smart Room Management System</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat>
        <router-link to="/">User</router-link>
      </v-btn>
      <v-btn flat>
        <router-link to="/system">System</router-link>
      </v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
export default {};
</script>
