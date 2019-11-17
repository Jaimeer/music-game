<template>
  <v-container class="GameSong">
    <v-row>
      <v-col cols="12" sm="6">
        <img :src="song.image" />
      </v-col>
      <v-col cols="12" sm="6">
        <div class="title">
          {{ song.name }} <v-chip label small>{{ date }}</v-chip>
        </div>
        <div class="subtitle-1">{{ artists }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    song: {
      type: Object,
      required: true
    }
  },
  computed: {
    artists() {
      return this.song.artists.map((x) => x.name).join(', ')
    },
    date() {
      return new Date(this.song.releaseDate).getFullYear()
    }
  }
}
</script>

<style lang="scss">
.GameSong {
  img {
    width: 100%;
  }
}
</style>
