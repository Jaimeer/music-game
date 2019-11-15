import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['logout', 'login'])
  }
}
