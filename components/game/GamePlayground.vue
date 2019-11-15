<template>
  <v-container>
    <v-row>
      <v-col>
        <span class="title">Juego</span>
        <v-chip label small>{{ game.id }}</v-chip>
        <v-chip v-if="isOwner" label small class="info">owner</v-chip>
      </v-col>
    </v-row>
    <!-- PLAY GROUND -->
    <GamePlay :game="game" />
    <!-- TEAMS -->
    <GameTeams :game="game" />
    <!-- EXIT -->
    <v-row>
      <v-col>
        <v-btn text @click="exit">Salir</v-btn>
      </v-col>
    </v-row>
    <!-- DEBUG -->
    <v-card color="blue-grey lighten-5">
      <v-card-text>
        <v-row>
          <v-col>
            info
            <pre>{{ { isOwner } }}</pre>
            user
            <pre>{{ user }}</pre>
          </v-col>
          <v-col>
            game
            <pre>{{ game }}</pre>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import GameMixin from '@/components/mixins/GameMixin'
import GameTeams from './playground/GameTeams'
import GamePlay from './playground/GamePlay'

export default {
  components: { GameTeams, GamePlay },
  mixins: [GameMixin],
  data: () => ({
    gameCopy: null
  }),
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
