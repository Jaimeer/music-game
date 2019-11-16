import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['routeFrom'])
  },
  methods: {
    ...mapActions(['setRouteFrom'])
  }
}
