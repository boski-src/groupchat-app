import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import socketio from 'socket.io-client'
import config from '../config'
import store from '../store'

Vue.use(VueSocketIO, socketio(config.SOCKET_URI, {
  query: {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null
  }
}), store)
