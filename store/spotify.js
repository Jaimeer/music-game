export const state = () => ({
  token: null
})

export const actions = {
  clean({ commit }) {
    commit('SET_TOKEN', null)
  },
  saveToken({ commit }, { token }) {
    commit('SET_TOKEN', token)
  }
}

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  }
}

export const getters = {
  token: (state) => state.token
}
