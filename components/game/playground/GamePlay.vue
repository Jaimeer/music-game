<template>
  <v-container v-if="userTeam || isOwner">
    <v-card class="mb-2">
      <v-card-actions v-if="!alreadyPlayed && userTeam">
        <v-btn block color="info" @click="play">Play</v-btn>
      </v-card-actions>
      <v-card-text v-if="plays.length > 0">
        <v-row>
          <v-col>
            <div v-for="(playItem, i) in plays" :key="`play${i}`" class="mb-2">
              <span class="mr-2"> {{ playItem.user.name }}</span>
              <v-chip
                label
                small
                class="white--text"
                :color="teamColor(playItem.team)"
                >Team {{ playItem.team }}</v-chip
              >
              <v-chip label small>
                <i class="caption">{{ ago(playItem.date) }}</i>
              </v-chip>
            </div>
          </v-col>
          <v-col>
            <GameSong v-if="song" :song="song" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card v-if="isOwner" class="mb-2">
      <v-card-actions>
        <v-btn
          :disabled="plays.length === 0"
          class="primary"
          @click.stop="resetPlays"
        >
          Reset
        </v-btn>
        <v-spacer />
        <v-btn class="primary" @click.stop="resume">
          Play/Resume
        </v-btn>
        <v-btn class="primary" @click.stop="pause">
          Pause
        </v-btn>
        <v-btn class="primary" @click.stop="nextSong">
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- DEBUG -->
    <v-card v-if="false" color="blue-grey lighten-5">
      <v-card-text>
        <v-row>
          <v-col>
            info
            <pre>{{ { alreadyPlayed, userTeam, plays } }}</pre>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { db } from '@/plugins/firebase'
import moment from 'moment'
import GameSong from '@/components/game/playground/GameSong'
import GameMixin from '@/components/mixins/GameMixin'
import SpotifyMixin from '@/components/mixins/SpotifyMixin'
const debug = require('debug')('app:GamePlay')

const clone = (x) => JSON.parse(JSON.stringify(x))
export default {
  components: { GameSong },
  mixins: [GameMixin, SpotifyMixin],
  data: () => ({
    song: null
  }),
  computed: {
    alreadyPlayed() {
      if (this.game && this.game.plays && this.userTeam) {
        return !!this.game.plays.find((a) => a.user.uuid === this.user.uuid)
      }
      return false
    },
    plays() {
      if (!this.game.plays) return []
      return clone(this.game.plays).sort((a, b) => a > b)
    }
  },
  watch: {
    plays(newValue, oldValue) {
      debug('watch plays', { newValue, oldValue })
      if (
        this.isOwner &&
        newValue &&
        newValue.length > 0 &&
        newValue.length !== oldValue.length
      )
        this.pauseGame()
    }
  },
  methods: {
    async play() {
      const play = {
        team: this.userTeam,
        user: this.user,
        date: new Date()
      }
      const plays = Array.isArray(this.game['plays']) ? this.game['plays'] : []
      plays.push(play)
      await db
        .collection('music-games')
        .doc(this.game.id)
        .update({ [`plays`]: JSON.parse(JSON.stringify(plays)) })
    },
    async resetPlays() {
      await db
        .collection('music-games')
        .doc(this.game.id)
        .update({ [`plays`]: [] })
    },
    ago(date) {
      if (this.plays.length === 0) return 0
      const first = moment(this.plays[0].date)
      const current = moment(date)
      return `+ ${current.diff(first) / 1000}s`
    },
    async pauseGame() {
      debug('SONG INFO')
      this.song = await this.spotifySongInfo()
    },
    resume() {
      debug('RESUME BUTTON')
      this.spotifyResume()
    },
    pause() {
      debug('PAUSE BUTTON')
      this.spotifyPause()
    },
    async nextSong() {
      debug('NEXT BUTTON')
      await this.resetPlays()
      this.spotifyNext()
    }
  }
}
</script>
