<template>
  <v-toolbar dense>
    <v-toolbar-title @click="home">{{ $t('general.title') }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn text icon @click="spotify">
        <v-icon :class="{ 'green--text': !!spotifyToken }">mdi-spotify</v-icon>
      </v-btn>
      <v-btn text>{{ user.name }}</v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import UserMixin from '@/components/mixins/UserMixin'
import SpotifyMixin from '@/components/mixins/SpotifyMixin'
import BaseMixin from '@/components/mixins/BaseMixin'

export default {
  mixins: [UserMixin, SpotifyMixin, BaseMixin],
  methods: {
    spotify() {
      if (this.spotifyToken) this.cleanSpotify()
      else {
        this.setRouteFrom({ route: this.$route.fullPath })
        this.spotifySignUp()
      }
    },
    home() {
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
