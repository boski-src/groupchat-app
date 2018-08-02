import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
  __v: { select: false },
  name: { type: String, required: true },
  admin_id: { type: String, required: true },
  admin_username: { type: String, required: true, trim: true },
  unlisted: { type: Boolean, default: true, required: true },
  closed: { type: Boolean, default: false, required: true },
  members: [{
    user_id: { type: String, index: { dropDups: true }, required: true },
    user_name: { type: String, required: true },
    since: { type: Date, default: Date.now }
  }],
  messages: [{
    invoker: { type: Boolean, default: true },
    invoker_id: { type: String },
    invoker_name: { type: String, trim: true },
    text: { type: String, required: true },
    from: { type: String, max: 45, select: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

Schema.pre('update', function (next) {
  if (this.isModified('members')) this.ifAdminLeave()
  next()
})

Schema.pre('save', function (next) {
  if (this.isModified('members')) this.ifAdminLeave()
  next()
})

Schema.methods = {
  isChatAdmin (id) {
    return this.admin_id === id
  },

  isChatMember (id) {
    if (!this.unlisted) return true
    return this.members.find(member => id === member.user_id)
  },

  ifAdminLeave () {
    if (!this.members.find(member => this.admin_id === member.user_id)) {
      this.closed = true
    }
  },

  only (...fields) {
    return fields.reduce((filtred, field) => {
      filtred[field] = this[field]
      return filtred
    }, {})
  }
}

export default mongoose.model('Group', Schema)