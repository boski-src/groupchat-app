import config from '../config'
import mongoose from 'mongoose'

export default () => mongoose.connect(config.DB_URI, { useNewUrlParser: true });