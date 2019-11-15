<template>
  <v-container>
    <template v-if="!game">Trying to load this game...</template>
    <template v-else>
      <game-playground :game="game" />
    </template>
  </v-container>
</template>

<script>
import { db } from '@/plugins/firebase'
import GamePlayground from '@/components/game/GamePlayground'

export default {
  components: { GamePlayground },
  data: () => ({
    game: null,
    gameId: null
  }),
  watch: {
    gameId: {
      immediate: true,
      handler(gameId) {
        if (gameId) this.$bind('game', db.collection('music-games').doc(gameId))
      }
    }
  },
  created() {
    this.gameId = this.$route.params.gameId
  }
}
</script>
