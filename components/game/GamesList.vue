<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>{{ $t('general.games') }}</v-card-title>
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
                      <v-icon v-if="isOwner(item)" color="info"
                        >mdi-account-circle</v-icon
                      >
                      <span class="mr-4">
                        {{
                          $t('general.gameOf', { ownerName: item.ownerName })
                        }}
                      </span>
                      <v-chip label small class="info">{{ date }}</v-chip>
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
            <v-btn
              absolute
              small
              dark
              fab
              bottom
              right
              color="primary"
              @click="createRoom"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '@/plugins/firebase'
import UserMixin from '@/components/mixins/UserMixin'
import moment from 'moment'
const debug = require('debug')('app:GameList')

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
        ownerName: this.user.name,
        date: new Date(),
        teams: {}
      }
      await this.$firestoreRefs.musicGames.doc(musicGame.code).set(musicGame)
    },
    async remove(item) {
      debug('REMOVE', item) // eslint-disable-line
      await this.$firestoreRefs.musicGames.doc(item.code).delete()
    },
    enter(item) {
      debug('ENTER', item) // eslint-disable-line
      this.$router.push({ name: 'gameId', params: { gameId: item.code } })
    },
    isOwner(game) {
      return game.owner === this.user.uuid
    },
    date(game) {
      return moment(game.date.toDate()).format('YYYY-MM-DD')
    }
  },
  firestore: {
    musicGames: db.collection('music-games')
  }
}
</script>
