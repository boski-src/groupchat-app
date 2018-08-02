import Api from './Api'

const BASE_PATH = 'auth'

export default {
  Login ({ email, password }) {
    return Api().post(`${BASE_PATH}/login`, { email, password })
  },
  Register ({ email, username, password }) {
    return Api().post(`${BASE_PATH}/register`, { email, username, password })
  },
  Me () {
    return Api().get(`${BASE_PATH}/me`)
  },
  Renew () {
    return Api().post(`${BASE_PATH}/renew`)
  },
  UpdateProfile ({ name, website }) {
    return Api().patch(`${BASE_PATH}/update/profile`, { name, website })
  },
  UpdatePassword ({ password }) {
    return Api().patch(`${BASE_PATH}/update/password`, { password })
  }
}