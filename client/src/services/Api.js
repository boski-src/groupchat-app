import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import config from '../config'
import NProgress from 'nprogress'

Vue.use(axios)

export default () => {
  const instance = axios.create({
    baseURL: config.API_URI,
    timeout: config.API_TIMEOUT,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })

  instance.interceptors.request.use(config => {
    NProgress.start()
    return config
  })

  instance.interceptors.response.use(response => {
    NProgress.done()
    return response
  }, error => {
    if (error.response.status === 403) {
      store.dispatch('logout')
    }
    NProgress.done()
    return error.response
  })

  return instance
}