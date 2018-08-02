import Api from './Api'
import qs from 'querystring'

const BASE_PATH = 'users'

export default {
  search (search) {
    return Api().get(`${BASE_PATH}?${qs.stringify({ search })}`,)
  },
  fetch (id) {
    return Api().get(`${BASE_PATH}/${id}`)
  }
}