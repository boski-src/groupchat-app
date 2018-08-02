import config from '../../config'
import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  let token = req.headers.authorization || req.query.token || ''
  token = token.split(' ')

  if (!token || token[0] !== 'Bearer') {
    return next({ status: 400, message: 'Auth token in headers or query string not found.' })
  }

  jwt.verify(token[1], config.JWT_SECRET, (err, data) => {
    if (err) return next({ status: 403, message: 'Auth token expired or invalid.' })
    req.user = data
    next()
  })
}