import Group from '../../models/group'

const Index = async (req, res, next) => {
  let owned, joined, published = []

  try {
    owned = await Group.find({ admin_id: req.user.id }, { messages: { $slice: -1 } })
    joined = await Group.find({
      admin_id: { $ne: req.user.id },
      'members.user_id': req.user.id
    }, {
      messages: { $slice: -1 }
    })
    published = await Group.find({
      admin_id: { $ne: req.user.id },
      unlisted: false,
      'messages.invoker_id': req.user.id
    }, { messages: { $slice: -1 } })
  } catch (e) {
    next(e)
  }

  res.json({
    success: true,
    data: { owned, joined, published }
  })
}

const Public = (req, res, next) => {
  Group
    .find({ unlisted: false })
    .select({ _id: 1, name: 1, admin_id: 1, admin_username: 1 })
    .then(g => res.json({ success: true, data: g }))
    .catch(e => next(e))
}

const Show = (req, res, next) => {
  Group
    .findById(req.params.id)
    .then(g => {
      let is_member = g.isChatMember(req.user.id)
      res.json({
        success: true,
        data: {
          is_member,
          group: is_member ? g : g.only('_id', 'name', 'unlisted', 'closed', 'admin_id', 'admin_username', 'createAt')
        }
      })
    })
    .catch(e => next(e))
}

const Store = (req, res, next) => {
  new Group({
    name: req.body.name,
    admin_id: req.user.id,
    admin_username: req.user.username,
    unlisted: req.body.unlisted,
    members: [{ user_id: req.user.id, user_name: req.user.username }]
  })
    .save()
    .then(g => res.json({ success: true, data: g }))
    .catch(e => next(e))
}

const Update = (req, res, next) => {
  new Group({
    name: req.body.name,
    unlisted: req.body.unlisted,
    members: req.body.members,
    closed: req.body.closed
  })
    .findByIdAndUpdate(req.params.id)
    .then(g => res.json({ success: true, data: g }))
    .catch(e => next(e))
}

export default {
  Index,
  Public,
  Show,
  Store,
  Update
}