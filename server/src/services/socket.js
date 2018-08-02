import config from '../config'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import socketIo from 'socket.io'
import Group from '../models/group'

export default (server) => {
  return new Promise(resolve => {
    const io = socketIo.listen(server)
    let socketUsers = {}

    io.use((socket, next) => {
      socket.userInfo = { logged: 0, data: {}, chatGroup: '' }
      let token = socket.handshake.query.token
      if (!token) return next(new Error('Authentication error.'))
      jwt.verify(token, config.JWT_SECRET, (err, data) => {
        if (!err && data) {
          socket.userInfo.logged = 1
          socket.userInfo.data = data
          socket.emit('auth')
          return next()
        }
      })
    })

    io.use(async (socket, next) => {
      socketUsers[socket.userInfo.data.id] = {
        socket: socket.id,
        data: {
          id: socket.userInfo.data.id,
          name: socket.userInfo.data.username
        },
        chatGroup: ''
      }
      await User.findByIdAndUpdate(socket.userInfo.data.id, { is_online: !0 })
      socket.emit('message_added_toast', {
        type: 'info',
        msg: `${socket.userInfo.data.username}, succesfully connected.`
      })
      next()
    })

    io.on('connection', (socket) => {
      let userInfo = socket.userInfo

      const toGroupMembers = async ({ _id, members }, eventName, eventData) => {
        let users = await Object.keys(socketUsers)
          .filter((key, index, self) => (socketUsers[key].chatGroup != _id.toString()) && index == self.indexOf(key))
        users.forEach(member => {
          socket.to(socketUsers[member].socket).emit(eventName, eventData)
        })
      }

      const getOnlineMembers = ({ _id }) => {
        return Object.keys(socketUsers)
          .filter((key, index, self) => socketUsers[key].chatGroup == _id.toString() && index == self.indexOf(key))
          .reduce((filtred, userId) => {
            filtred.push({ user_id: socketUsers[userId].data.id, user_name: socketUsers[userId].data.name })
            return filtred
          }, [])
      }

      socket.on('member_join', async ({ chatGroupId }) => {
        if (!userInfo.chatGroup === chatGroupId) return
        let chatGroup = await Group.findById(chatGroupId)
        if (!chatGroup.isChatMember(userInfo.data.id)) {
          return
          // socket.emit('message_added_toast', {
          //   type: 'error',
          //   msg: 'You are\'t a group chat member.'
          // })
        }

        if (userInfo.chatGroup) {
          socket.broadcast.to(userInfo.chatGroup).emit('member_inactived', {
            invoker: !1,
            invoker_id: userInfo.data.id,
            invoker_name: userInfo.data.username,
            text: 'Is inactive!'
          })
        }

        socketUsers[userInfo.data.id].chatGroup = chatGroup._id
        userInfo.chatGroup = chatGroup._id
        socket.join(userInfo.chatGroup.toString())
        io.sockets.in(userInfo.chatGroup).emit('member_actived', {
          invoker: !1,
          invoker_id: userInfo.data.id,
          invoker_name: userInfo.data.username,
          text: 'Now is active!'
        })
        socket.emit('group_updated_members', {
          online: getOnlineMembers(chatGroup)
        })
      })

      socket.on('member_quit', () => {
        if (!userInfo.chatGroup) return

        socket.broadcast.to(userInfo.chatGroup).emit('member_inactived', {
          invoker: !1,
          invoker_id: userInfo.data.id,
          invoker_name: userInfo.data.username,
          text: 'Is inactive!'
        })

        userInfo.chatGroup = ''
        socketUsers[userInfo.data.id].chatGroup = ''
      })

      socket.on('member_leave', async ({ chatGroupId }) => {
        let chatGroup = await Group.findById(chatGroupId)
        if (!chatGroup.isChatMember(userInfo.data.id)) {
          return
          // socket.emit('message_added_toast', {
          //   type: 'error',
          //   msg: 'You are\'t a group chat member.'
          // })
        }
        if (!chatGroup.unlisted) return

        let msg = {
          invoker: !1,
          invoker_id: userInfo.data.id,
          invoker_name: userInfo.data.username,
          text: 'Left the conversation.'
        }

        chatGroup.messages.push(msg)
        chatGroup.members.pull(chatGroup.members.find(m => m.user_id === userInfo.data.id))
        chatGroup.save()

        socket.leave(userInfo.chatGroup)
        io.sockets.in(userInfo.chatGroup).emit('group_updated_members', {
          closed: chatGroup.closed,
          message: msg,
          members: chatGroup.members,
          online: getOnlineMembers(chatGroup)
        })
        userInfo.chatGroup = ''
        socketUsers[userInfo.data.id].chatGroup = ''
      })

      socket.on('group_update_members', async ({ chatGroupId, updatedMembers }) => {
        let chatGroup = await Group.findById(chatGroupId)
        if (!chatGroup.isChatAdmin(userInfo.data.id)) {
          return
          // socket.emit('message_added_toast', {
          //   type: 'error',
          //   msg: 'You are\'t a group chat admin.'
          // })
        }
        if (!chatGroup.unlisted) return

        let msg = {
          invoker: !1,
          invoker_id: userInfo.data.id,
          invoker_name: userInfo.data.username,
          text: 'Updated the group members.'
        }

        chatGroup.messages.push(msg)
        chatGroup.members = updatedMembers
        chatGroup.save()

        let data = {
          emit: {
            message: msg,
            members: chatGroup.members,
            online: getOnlineMembers(chatGroup)
          },
          notify: {
            invoker: {
              id: userInfo.data.id,
              name: userInfo.data.username
            },
            group: {
              id: chatGroup._id,
              name: chatGroup.name
            },
            text: 'Updated the group members.',
            date: Date.now()
          }
        }

        io.sockets.in(userInfo.chatGroup).emit('group_updated_members', data.emit)
        if (chatGroup.unlisted) toGroupMembers(chatGroup, 'message_added_notify', data.notify)
      })

      socket.on('group_update_name', async ({ chatGroupId, newName }) => {
        let chatGroup = await Group.findById(chatGroupId)
        if (!chatGroup.isChatAdmin(userInfo.data.id)) {
          return
          // socket.emit('message_added_toast', {
          //   type: 'error',
          //   msg: 'You are\'t a group chat admin.'
          // })
        }
        if (chatGroup.name === newName) return

        let msg = {
          invoker: !1,
          invoker_id: userInfo.data.id,
          invoker_name: userInfo.data.username,
          text: `Changed group name from ${chatGroup.name} to: ${newName}`
        }

        chatGroup.messages.push(msg)
        chatGroup.name = newName
        chatGroup.save()

        let data = {
          emit: {
            message: msg,
            name: chatGroup.name
          },
          notify: {
            invoker: {
              id: userInfo.data.id,
              name: userInfo.data.username
            },
            group: {
              id: chatGroup._id,
              name: chatGroup.name
            },
            text: 'Changed group name.',
            date: Date.now()
          }
        }

        io.sockets.in(userInfo.chatGroup).emit('group_updated_name', data.emit)
        if (chatGroup.unlisted) toGroupMembers(chatGroup, 'message_added_notify', data.notify)
      })

      socket.on('group_update_status', async ({ chatGroupId, closed }) => {
        let chatGroup = await Group.findById(chatGroupId)
        if (!chatGroup.isChatAdmin(userInfo.data.id)) {
          return
          // socket.emit('message_added_toast', {
          //   type: 'error',
          //   msg: 'You are\'t a group chat admin.'
          // })
        }
        if (chatGroup.closed === closed) return

        let msg = {
          invoker: !1,
          invoker_id: userInfo.data.id,
          invoker_name: userInfo.data.username,
          text: `Changed group closed status from "${chatGroup.closed}" to "${closed}".`
        }

        chatGroup.messages.push(msg)
        chatGroup.closed = closed
        chatGroup.save()

        let data = {
          emit: {
            message: msg,
            closed: chatGroup.closed
          },
          notify: {
            invoker: {
              id: userInfo.data.id,
              name: userInfo.data.username
            },
            group: {
              id: chatGroup._id,
              name: chatGroup.name
            },
            text: 'Changed group status.',
            date: Date.now()
          }
        }

        io.sockets.in(userInfo.chatGroup).emit('group_updated_status', data.emit)
        if (chatGroup.unlisted) toGroupMembers(chatGroup, 'message_added_notify', data.notify)
      })

      socket.on('message_add', async ({ message }) => {
        let chatGroup = await Group.findById(userInfo.chatGroup)
        if (!chatGroup.isChatMember(userInfo.data.id)) {
          return
          // socket.emit('message_added_toast', {
          //   type: 'error',
          //   msg: 'You are\'t a group chat member.'
          // })
        }
        if (chatGroup.closed) {
          return
          // socket.emit('message_added_toast', {
          //   type: 'error',
          //   msg: 'Group status is closed.'
          // })
        }

        chatGroup.messages.push({
          invoker_id: userInfo.data.id,
          invoker_name: userInfo.data.username,
          text: message
        })
        chatGroup.save()

        let data = {
          emit: {
            invoker: true,
            invoker_id: userInfo.data.id,
            invoker_name: userInfo.data.username,
            text: message
          },
          notify: {
            invoker: {
              id: userInfo.data.id,
              name: userInfo.data.username
            },
            group: {
              id: chatGroup._id,
              name: chatGroup.name
            },
            text: 'New message.',
            date: Date.now()
          }
        }

        io.sockets.in(userInfo.chatGroup).emit('message_added', data.emit)
        //if (chatGroup.unlisted) toGroupMembers(chatGroup, 'message_added_notify', data.notify)
      })

      socket.on('disconnect', async (reason) => {
        if (reason === 'transport close') {
          delete socketUsers[userInfo.data.id]
        }
        if (!userInfo.logged) return
        await User.findByIdAndUpdate(userInfo.data.id, { is_online: !1 })
        if (userInfo.chatGroup) {
          socket.leave(userInfo.chatGroup)
          socket.broadcast.to(userInfo.chatGroup).emit('member_inactived', {
            invoker: !1,
            invoker_id: userInfo.data.id,
            invoker_name: userInfo.data.username,
            text: 'Is inactive!'
          })
        }
      })
    })

    resolve()
  })
}