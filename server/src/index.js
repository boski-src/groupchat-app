import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import routesV1 from './http/routes/v1'
import { catchError, notFound } from './http/handlers/errors'
import socketService from './services/socket'
import mongooseService from './services/mongoose'

const app = express()
const server = app.listen(5000, () => console.log('+ | Server started...'))

socketService(server)
  .then(() => console.log('+ | Web socket is running...'))
  .catch((err) => console.log('- | Socket error: %s', err))

mongooseService()
  .then(() => console.log('+ | Connected to database...'))
  .catch((err) => console.log('- | Database error: %s', err))

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/v1', routesV1)

app.use(notFound)
app.use(catchError)