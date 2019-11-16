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
      return SpotifyLib.signUp()
    },
    spotifyPause(token) {
      debug('spotifyPause')
      return SpotifyLib.pause(this.spotifyToken)
    },
    spotifyResume() {
      debug('spotifyResume')
      return SpotifyLib.resume(this.spotifyToken)
    },
    spotifySongInfo() {
      debug('spotifySongInfo')
      return SpotifyLib.songInfo(this.spotifyToken)
    },
    spotifyNext() {
      debug('spotifyNext')
      return SpotifyLib.nextSong(this.spotifyToken)
    }
  }
}
