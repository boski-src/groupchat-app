import User from '../../models/user'

const Login = (req, res, next) => {
  User
    .findOne({ email: req.body.email })
    .then(u => u ? u : Promise.reject({ status: 401, message: 'Account isn\'t exists in database.' }))
    .then(u => {
      if (!u.comparePassword(req.body.password)) {
        return Promise.reject({ status: 401, message: 'Email or password is incorrect.' })
      }
      u.pushLastLogin(req.connection.remoteAddress || req.headers['x-forwarded-for'])
      res.json({
        success: true,
        data: { user: u.render(), token: u.createJWT() }
      })
    })
    .catch(e => next(e))
}

const Register = (req, res, next) => {
  new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    profile: { name: req.body.username }
  })
    .save()
    .then(u => u ? u : Promise.reject())
    .then(u => {
      res.json({
        success: true,
        data: { user: u.render(), token: u.createJWT() }
      })
    })
    .catch(() => next({ status: 401, message: 'Username or email already exists in database.' }))
}

const Me = (req, res, next) => {
  User.findById(req.user.id)
    .then(u => u ? u : Promise.reject({ status: 401, message: 'Token is invalid.' }))
    .then(u => {
      res.json({
        success: true,
        data: { user: u.render(), token: { start: req.user.iat, end: req.user.exp } }
      })
    })
    .catch(e => next(e))
}

const Renew = (req, res, next) => {
  User.findById(req.user.id)
    .then(u => res.json({ success: true, data: u.createJWT() }))
    .catch(e => next(e))
}

const UpdateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, {
    profile: {
      name: req.body.name,
      website: req.body.website
    }
  })
    .then(u => res.json({ success: true, data: u.profile }))
    .catch(e => next(e))
}

const UpdatePassword = (req, res, next) => {
  User.findById(req.user.id)
    .then(u => {
      u.password = req.body.password
      u.save()
      return u
    })
    .then(u => res.json({ success: true }))
    .catch(e => next(e))
}

export default {
  Login,
  Register,
  Me,
  Renew,
  UpdateProfile,
  UpdatePassword
}

