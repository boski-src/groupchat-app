import express from 'express'

//Controller
import controller from '../../controllers/user'
//Middlerwares or Requests
import request from '../requests/user';

const router = express.Router()

//Routes
router
  .get('/', controller.Search)
  .get('/:name', controller.Show)

export default router