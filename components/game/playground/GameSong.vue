<template>
  <v-container class="GameSong">
    <v-row>
      <v-col>
        <img :src="song.item.album.images[0].url" />
      </v-col>
      <v-col>
        <div class="title">{{ song.item.name }}</div>
        <div
          v-for="artist in song.item.artists"
          :key="artist.id"
          class="subtitle-1"
        >
          {{ artist.name }}
        </div>
        <div>
          <v-chip label small>{{ song.item.album.release_date }}</v-chip>
        </div>
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
  }
}
</script>

<style lang="scss">
.GameSong {
  img {
    max-width: 100px;
    max-height: 100px;
  }
}
</style>
