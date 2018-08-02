import config from '../config'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const Schema = new mongoose.Schema({
  __v: { select: false },
  email: { type: String, trim: true, unique: true, required: true },
  username: { type: String, trim: true, unique: true, required: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, required: true, default: false },
  is_online: { type: Boolean, required: true, default: false },
  profile: {
    name: { type: String, required: true, default: '' },
    website: { type: String, required: true, default: '' }
  },
  last_logins: [{
    address: { type: String, max: 45 },
    date: { type: Date, default: Date.now() }
  }]
}, { timestamps: true })

Schema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) this.password = await this.hashPassword()
  next()
})

Schema.methods = {
  pushLastLogin (address) {
    this.last_logins.push({ address })
    return this.save()
  },

  hashPassword () {
    return bcrypt.hash(this.password, 12)
      .then(hash => hash)
  },

  comparePassword (password) {
    return bcrypt.compareSync(password, this.password)
  },

  createJWT () {
    return jwt.sign({
      id: this._id,
      email: this.email,
      username: this.username
    }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE })
  },

  renderProfile () {
    return {
      username: this.username,
      is_admin: this.is_admin,
      profile: this.profile,
      created: this.createdAt,
      last_login: this.last_logins.length ? this.last_logins[this.last_logins.length - 1].date : false
    }
  },

  render () {
    return {
      id: this._id,
      email: this.email,
      username: this.username,
      is_admin: this.is_admin,
      profile: this.profile
    }
  }
}

export default mongoose.model('User', Schema)