import '@babel/polyfill'
import Vue from 'vue'

import App from './App.vue'
import router from './router/index'
import store from './store'

import './plugins/vuetify'
import './plugins/validate'
import './plugins/socket'
import 'nprogress/nprogress.css'

import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
