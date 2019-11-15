import createPersistedState from 'vuex-persistedstate'

export default ({ store, req, res }) => {
  createPersistedState({
    key: 'state',
    paths: ['user']
  })(store)
}
