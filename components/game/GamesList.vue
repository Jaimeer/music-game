<template>
  <v-card>
    <v-card-title>Music Games </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="item in musicGames"
            :key="item.code"
            @click="enter(item)"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item.code }}
                <v-chip v-if="isOwner(item)" label small color="info">
                  owner
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn v-if="isOwner(item)" icon>
                <v-icon color="grey lighten-1" @click.stop="remove(item)">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-btn absolute dark fab top right color="primary" @click="createRoom">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/plugins/firebase'
import UserMixin from '@/components/mixins/UserMixin'

export default {
  mixins: [UserMixin],

  data: () => ({
    musicGames: []
  }),
  methods: {
    async createRoom() {
      const guid = Date.now().toString(36)
      const musicGame = {
        code: guid,
        owner: this.user.uuid,
        teams: {}
      }
      await this.$firestoreRefs.musicGames.doc(musicGame.code).set(musicGame)
    },
    async remove(item) {
      console.log('REMOVE', item) // eslint-disable-line
      await this.$firestoreRefs.musicGames.doc(item.code).delete()
    },
    enter(item) {
      console.log('ENTER', item) // eslint-disable-line
      this.$router.push({ name: 'gameId', params: { gameId: item.code } })
    },
    isOwner(game) {
      return game.owner === this.user.uuid
    }
  },
  firestore: {
    musicGames: db.collection('music-games')
  }
}
</script>
