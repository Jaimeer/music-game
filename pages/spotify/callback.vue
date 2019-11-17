<template>
  <v-container>
    <v-row>
      <v-col>
        <span v-if="!error">{{ $t('general.loading') }}</span>
        <span v-else>
          {{ error }}
          <router-link :to="{ name: 'index' }">
            <b>{{ $t('general.home') }}</b>
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
const debug = require('debug')('app:CallbackPage')

export default {
  layout: 'callback',
  mixins: [SpotifyMixin, BaseMixin],
  data: () => ({ error: null }),
  async created() {
    const hash = this.$route.hash
    debug('hash', hash)
    if (hash) {
      const data = querystring.decode(hash.replace('#', ''))
      debug('data', data)
      await this.saveSpotifyToken({ token: data.access_token })
      this.$router.push(this.routeFrom)
    } else {
      this.error = 'ERROR'
    }
  }
}
</script>
