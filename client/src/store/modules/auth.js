import { AuthService } from '../../services'
import router from '../../router'

const state = {
  logged: localStorage.getItem('token'),
  user: { profile: {} },
}

const getters = {
  isLogged: state => state.logged,
  getUser: state => state.user
}

const actions = {
  login ({ commit }, credentials) {
    AuthService.Login(credentials)
      .then(response => response.data.success ? response.data.data : Promise.reject())
      .then(data => {
        localStorage.setItem('token', data.token)
        commit('login', data.user)
        router.go('/')
      })
      .catch(() => {
        // todo toast message
      })
  },
  register ({ commit }, credentials) {
    AuthService.Register(credentials)
      .then(response => response.data.success ? response.data.data : Promise.reject())
      .then(data => {
        localStorage.setItem('token', data.token)
        commit('login', data.user)
        router.go('/')
      })
      .catch(() => {
        // todo toast message
      })
  },
  fetchUser ({ commit }) {
    AuthService.Me()
      .then(response => response.data.success ? response.data.data : Promise.reject())
      .then(data => {
        commit('user', data.user)
      })
  },
  renewToken () {
    AuthService.Renew()
      .then(response => response.data.success ? response.data.data : Promise.reject())
      .then(data => {
        localStorage.setItem('token', data)
      })
      .catch(() => {
        // todo toast message
      })
  },
  updateProfle ({ commit }, data) {
    commit('profile', data)
  },
  logout ({ commit }) {
    localStorage.removeItem('token')
    commit('logout')
    router.push({ name: 'AuthLogin' })
  }
}

const mutations = {
  login (state, data) {
    state.logged = 1
    state.user = data
  },
  user (state, data) {
    state.user = data
  },
  profile (state, data) {
    state.user.profile = data
  },
  logout (state) {
    state.logged = 0
    state.user = {}
  }
}

export default { state, getters, actions, mutations }