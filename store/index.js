const uuidv4 = require('uuid/v4')

export const state = () => ({
  user: null,
  routeFrom: null
})

export const actions = {
  login({ commit }, { name }) {
    commit('SET_USER', { uuid: uuidv4(), name })
  },
  logout({ commit }, { name }) {
    commit('SET_USER', null)
    commit('SET_SPOTIFY_CODE', null)
  },
  setRouteFrom({ commit }, { route }) {
    commit('SET_ROUTE', route)
  }
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_ROUTE(state, route) {
    state.routeFrom = route
  }
}

export const getters = {
  user: (state) => state.user,
  routeFrom: (state) => state.routeFrom
}
