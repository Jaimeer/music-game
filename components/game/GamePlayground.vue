<template>
  <v-container>
    <!-- Spotify Alert -->
    <v-row>
      <v-col v-if="isOwner && !spotifyToken">
        <v-alert
          border="left"
          color="green lighten-1"
          icon="mdi-spotify"
          dark
          class="mb-0"
        >
          {{ $t('spotify.join') }}
        </v-alert>
      </v-col>
    </v-row>
    <!-- Game Title -->
    <v-row>
      <v-col>
        <v-icon v-if="isOwner" :title="$t('general.owner')" color="info"
          >mdi-account-circle</v-icon
        >
        <span class="title">
          {{ $t('general.gameOf', { ownerName: game.ownerName }) }}
        </span>
        <v-chip label small class="info">{{ date }}</v-chip>
      </v-col>
    </v-row>
    <!-- PLAY GROUND -->
    <GamePlay :game="game" />
    <!-- TEAMS -->
    <GameTeams :game="game" />
    <!-- EXIT -->
    <v-btn dense text @click="exit">{{ $t('general.exit') }}</v-btn>
    <!-- DEBUG -->
    <v-card v-if="false" color="blue-grey lighten-5">
      <v-card-text>
        <v-row>
          <v-col>
            {{ $t('debug.info') }}
            <pre>{{ { isOwner } }}</pre>
            {{ $t('debug.info') }}
            <pre>{{ user }}</pre>
          </v-col>
          <v-col>
            {{ $t('debug.fame') }}
            <pre>{{ game }}</pre>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import GameMixin from '@/components/mixins/GameMixin'
import SpotifyMixin from '@/components/mixins/SpotifyMixin'
import GameTeams from './playground/GameTeams'
import GamePlay from './playground/GamePlay'
import moment from 'moment'

export default {
  components: { GameTeams, GamePlay },
  mixins: [GameMixin, SpotifyMixin],
  data: () => ({
    gameCopy: null
  }),
  computed: {
    date() {
      return moment(this.game.date.toDate()).format('YYYY-MM-DD')
    }
  },
  watch: {
    game: {
      immediate: true,
      handler(newValue, oldValue) {
        if (this.game) this.gameCopy = Object.freeze(this.game)
      }
    }
  },
  async beforeDestroy() {
    // if (this.myTeam) await this.removePlayer()
  },
  methods: {
    exit() {
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
