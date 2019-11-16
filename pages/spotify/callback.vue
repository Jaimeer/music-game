<template>
  <v-container>
    <v-row>
      <v-col>
        <span v-if="!error">Loading</span>
        <span v-else>
          {{ error }}
          <router-link :to="{ name: 'index' }">
            <b>Home</b>
          </router-link>
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import querystring from 'querystring'
import SpotifyMixin from '@/components/mixins/SpotifyMixin'
import BaseMixin from '@/components/mixins/BaseMixin'

export default {
  layout: 'callback',
  mixins: [SpotifyMixin, BaseMixin],
  data: () => ({ error: null }),
  async created() {
    const hash = this.$route.hash
    if (hash) {
      const data = querystring.decode(hash.replace('#', ''))
      await this.saveSpotifyToken({ token: data.access_token })
      this.$router.push(this.routeFrom)
    } else {
      this.error = 'ERROR'
    }
  }
}
</script>
