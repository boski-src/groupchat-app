import express from 'express'
import AuthMiddleware from '../../middlewares/auth'
//Routes
import authRoute from './auth'
import groupRoute from './group'
import userRoute from './user'

const router = express.Router()

//Aliases
router.use('/auth', authRoute)
router.use('/groups', AuthMiddleware, groupRoute)
router.use('/users', AuthMiddleware, userRoute)

export default router