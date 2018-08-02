import Api from './Api'

const BASE_PATH = 'groups'

export default {
  fetchAll () {
    return Api().get(`${BASE_PATH}`)
  },
  fetch (id) {
    return Api().get(`${BASE_PATH}/${id}`)
  },
  fetchPublic () {
    return Api().get(`${BASE_PATH}/public`,)
  },
  create (data) {
    return Api().post(`${BASE_PATH}`, data)
  },
  update (id, data) {
    return Api().put(`${BASE_PATH}/${id}`, data)
  }
}