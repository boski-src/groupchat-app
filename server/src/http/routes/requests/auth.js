import Joi from 'joi'
import validate from 'express-validation'
import AuthMiddleware from '../../middlewares/auth'

const Login = [
  validate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    }
  })
]

const Register = [
  validate({
    body: {
      email: Joi.string().email().required(),
      username: Joi.string().min(3).max(64).trim().required(),
      password: Joi.string().min(8).required()
    }
  })
]

const Me = [
  AuthMiddleware
]

const UpdateProfile = [
  AuthMiddleware,
  validate({
    body: {
      name: Joi.string(),
      website: Joi.string()
    }
  })
]

const UpdatePassword = [
  AuthMiddleware,
  validate({
    body: {
      password: Joi.string().min(8).required()
    }
  })
]

export default {
  Login,
  Register,
  Me,
  UpdateProfile,
  UpdatePassword
}
