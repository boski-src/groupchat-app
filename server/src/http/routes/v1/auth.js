import express from 'express'

//Controller
import controller from '../../controllers/auth'
//Middlerwares or Requests
import request from '../requests/auth'

const router = express.Router()

//Routes
router
  .post('/login', request.Login, controller.Login)
  .post('/register', request.Register, controller.Register)
  .get('/me', request.Me, controller.Me)
  .get('/renew', request.Me, controller.Renew)
  .patch('/update/profile', request.UpdateProfile, controller.UpdateProfile)
  .patch('/update/password', request.UpdatePassword, controller.UpdatePassword)

export default router