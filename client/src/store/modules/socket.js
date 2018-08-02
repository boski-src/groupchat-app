import _ from 'lodash'

const state = {
  connected: false,
  auth: false,
  notifications: []
}

const getters = {
  socketConnected: state => state.connected,
  socketAuth: state => state.auth,
  getNotifications: state => state.notifications.reverse()
}

const actions = {
  removeNotification ({ commit }, notify) {
    commit('removeNotify', notify)
  }
}

const mutations = {
  SOCKET_CONNECT: state => state.connected = true,
  SOCKET_DISCONNECT: (state) => state.connected = false,
  SOCKET_AUTH: (state, data) => state.auth = true,
  SOCKET_MESSAGE_ADDED_NOTIFY: (state, data) => state.notifications.push(data[0]),
  removeNotify (state, notify) {
    let index = state.notifications.findIndex(item => _.isEqual(item, notify))
    state.notifications.splice(index, 1)
  }
}


export default { state, getters, actions, mutations }