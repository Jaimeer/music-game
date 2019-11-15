<template>
  <v-toolbar dense>
    <v-toolbar-title>Music Game</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn text>{{ user.name }}</v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import UserMixin from '@/components/mixins/UserMixin'

export default {
  mixins: [UserMixin]
}
</script>
