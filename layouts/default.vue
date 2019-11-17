<template>
  <v-app>
    <v-content>
      <TopNav v-if="user" />
      <Login v-if="!user" />
      <template v-else>
        <nuxt />
      </template>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import TopNav from '@/components/ui/TopNav'
import Login from '@/components/ui/Login'

export default {
  components: { Login, TopNav },
  data: () => ({}),
  computed: {
    ...mapGetters(['user'])
  }
}
</script>
