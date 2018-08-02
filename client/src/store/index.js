import Vue from 'vue'
import Vuex from 'vuex'

import AuthModule from './modules/auth'
import SocketModule from './modules/socket'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'production',
  modules: {
    AuthModule,
    SocketModule
  }
})