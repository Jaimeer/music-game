import UserMixin from '@/components/mixins/UserMixin'
import { db } from '@/plugins/firebase'

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
      Object.keys(this.game.teams).forEach((code) => {
        if (!userTeam) {
          const found = this.game.teams[code].find(
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
      if (this.game)
        await db
          .collection('music-games')
          .doc(this.game.id)
          .update({ [`plays`]: null })
    }
  }
}
