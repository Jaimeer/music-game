const uuidv4 = require('uuid/v4')

export const state = () => ({
  user: null
})

export const actions = {
  login({ commit }, { name }) {
    commit('SET_USER', {
      uuid: uuidv4(),
      name
    })
  },
  logout({ commit }, { name }) {
    commit('SET_USER', null)
  }
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  }
}

export const getters = {
  user: (state) => state.user
}
