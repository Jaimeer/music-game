import UserMixin from '@/components/mixins/UserMixin'
import { db } from '@/plugins/firebase'
const debug = require('debug')('app:GameMixin')

export default {
  mixins: [UserMixin],
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  computed: {
    isOwner() {
      if (!this.game) return null
      return this.game.owner === this.user.uuid
    },
    userTeam() {
      if (!this.game) return null
      let userTeam = null
      debug('aaaa1', this.game.teams)
      Object.keys(this.game.teams).forEach((code) => {
        if (!userTeam) {
          debug('aaaa2', code, this.game, this.game.teams[code].players)
          const found = this.game.teams[code].players.find(
            (user) => user.uuid === this.user.uuid
          )
          if (found) userTeam = code
        }
      })
      return userTeam
    }
  },
  methods: {
    teamColor(code) {
      const colors = [
        'blue darken-1',
        'teal darken-1',
        'orange darken-1',
        'brown darken-1'
      ]
      return colors[(code - 1) % colors.length]
    },
    async resetPlays() {
      debug('resetPlays')
      if (this.game)
        await db
          .collection('music-games')
          .doc(this.game.id)
          .update({ [`plays`]: null })
    }
  }
}
