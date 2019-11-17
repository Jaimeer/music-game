import { mapGetters, mapActions } from 'vuex'
import SpotifyLib from '@/lib/SpotifyLib'
const debug = require('debug')('app:SpotifyMixin')

export default {
  computed: {
    ...mapGetters({
      spotifyToken: 'spotify/token'
    })
  },
  methods: {
    ...mapActions({
      saveSpotifyToken: 'spotify/saveToken',
      cleanSpotify: 'spotify/clean'
    }),
    spotifySignUp() {
      debug('spotifySignUp')
      return this.executeAction(SpotifyLib.signUp)
    },
    spotifyPause(token) {
      debug('spotifyPause')
      return this.executeAction(SpotifyLib.pause, true)
    },
    spotifyResume() {
      debug('spotifyResume')
      return this.executeAction(SpotifyLib.resume, true)
    },
    spotifySongInfo() {
      debug('spotifySongInfo')
      return this.executeAction(SpotifyLib.songInfo, true)
    },
    spotifyNext() {
      debug('spotifyNext')
      return this.executeAction(SpotifyLib.nextSong, true)
    },
    async executeAction(action, sendToken) {
      try {
        const response = sendToken
          ? await action(this.spotifyToken)
          : await action()
        debug('executeAction', response)
        return response
      } catch (err) {
        if (err.message.includes('401')) this.cleanSpotify()
        else debug('executeAction', err.message, err.status)
      }
    }
  }
}
