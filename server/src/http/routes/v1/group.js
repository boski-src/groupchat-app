import express from 'express'

//Controller
import controller from '../../controllers/group'
//Middlerwares or Requests
import request from '../requests/group'

const router = express.Router()

//Routes
router
  .get('/', controller.Index)
  .get('/public', controller.Public)
  .get('/:id', controller.Show)
  .post('/', request.Store, controller.Store)
  .put('/:id', request.Update, controller.Update)

export default router