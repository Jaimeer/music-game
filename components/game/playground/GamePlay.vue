<template>
  <div v-if="userTeam || isOwner">
    <v-card class="mb-2">
      <v-card-actions v-if="!alreadyPlayed && userTeam">
        <v-btn block color="info" @click="play">
          {{ $t('general.participate') }}
        </v-btn>
      </v-card-actions>
      <template v-if="plays.length > 0">
        <v-card-title>
          {{ $t('player.participationOrder') }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <div
                v-for="(playItem, i) in plays"
                :key="`play${i}`"
                class="mb-2"
              >
                <v-chip :color="orderColor(i)" class="mr-2" label small>
                  #{{ i + 1 }}
                </v-chip>

                <span class="mr-2"> {{ playItem.user.name }}</span>
                <v-chip
                  label
                  small
                  class="white--text"
                  :color="teamColor(playItem.team)"
                >
                  {{ $t('general.team') }} {{ playItem.team }}
                </v-chip>
                <v-chip label small>
                  <i class="caption">{{ ago(playItem.date) }}</i>
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <GameSong v-if="game.song" :song="game.song" />
            </v-col>
          </v-row>
          <v-divider v-if="isOwner" />
          <v-row v-if="isOwner">
            <v-col
              v-for="(team, code) in game.teams"
              :key="code"
              :color="teamColor(code)"
            >
              <v-row dense>
                <v-col>
                  <span class="subtitle-1">
                    {{ $t('general.team') }} {{ code }}
                  </span>
                  <v-chip label small class="ml-2" :color="teamColor(code)" />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <v-btn
                    block
                    small
                    :color="teamColor(code)"
                    class="white--text mr-2"
                    @click="teamWon(code, 1)"
                  >
                    +1
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    block
                    small
                    :color="teamColor(code)"
                    class="white--text mr-2"
                    @click="teamWon(code, -1)"
                  >
                    -1
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </template>
    </v-card>
    <v-card v-if="isOwner" class="mb-2">
      <v-card-actions>
        <v-row dense>
          <v-col cols="6" md="2">
            <v-btn
              block
              :disabled="plays.length === 0"
              class="primary"
              @click.stop="nextSong"
            >
              {{ $t('player.next') }}
            </v-btn>
          </v-col>
          <v-col cols="6" md="2">
            <v-btn
              block
              :disabled="plays.length === 0"
              class="primary"
              @click.stop="clean"
            >
              {{ $t('player.clean') }}
            </v-btn>
          </v-col>
          <v-col cols="4" md="2" class="offset-md-2">
            <v-btn
              block
              :disabled="!spotifyToken"
              class="secondary"
              @click.stop="songInfo"
            >
              {{ $t('player.songInfo') }}
            </v-btn>
          </v-col>
          <v-col cols="4" md="2">
            <v-btn
              block
              :disabled="!spotifyToken"
              class="secondary"
              @click.stop="resume"
            >
              {{ $t('player.resume') }}
            </v-btn>
          </v-col>
          <v-col cols="4" md="2">
            <v-btn
              block
              :disabled="!spotifyToken"
              class="secondary"
              @click.stop="pause"
            >
              {{ $t('player.pause') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <!-- DEBUG -->
    <v-card v-if="false" color="blue-grey lighten-5">
      <v-card-text>
        <v-row>
          <v-col>
            {{ $t('debug.info') }}
            <pre>{{ { alreadyPlayed, userTeam, plays } }}</pre>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
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
  data: () => ({}),
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
    orderColor(num) {
      return (
        [
          'orange white--text',
          'blue-grey lighten-1 white--text',
          'brown darken-1 white--text'
        ][num] || 'light-green lighten-4'
      )
    },
    async play() {
      debug('play')
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
    ago(date) {
      if (this.plays.length === 0) return 0
      const first = moment(this.plays[0].date)
      const current = moment(date)
      return `+ ${current.diff(first) / 1000}s`
    },
    async pauseGame() {
      debug('pause')
      this.pause()
    },
    async clean() {
      this.resetPlays()
      await this.cleanSongInfo()
      this.resume()
    },
    resume() {
      debug('resume')
      this.spotifyResume()
    },
    pause() {
      debug('pause')
      this.spotifyPause()
    },
    async nextSong() {
      debug('nextSong')
      await this.resetPlays()
      await this.cleanSongInfo()
      this.spotifyNext()
    },
    async songInfo() {
      const songData = await this.spotifySongInfo()
      debug('songInfo', songData)
      if (songData) {
        const song = {
          image: songData.item.album.images[0].url,
          name: songData.item.name,
          artists: songData.item.artists.map((x) => ({
            id: x.id,
            name: x.name
          })),
          releaseDate: songData.item.album.release_date
        }
        await db
          .collection('music-games')
          .doc(this.game.id)
          .update({ song: JSON.parse(JSON.stringify(song)) })
      }
    },
    async cleanSongInfo() {
      await db
        .collection('music-games')
        .doc(this.game.id)
        .update({ song: null })
    },
    async teamWon(code, num) {
      debug('teamWon', code)
      let score = this.game.teams[code].score + num
      if (score < 0) score = 0
      await db
        .collection('music-games')
        .doc(this.game.id)
        .update({ [`teams.${code}.score`]: score })
    }
  }
}
</script>
