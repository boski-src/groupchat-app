import User from '../../models/user'

const Search = (req, res, next) => {
  User
    .find({ username: { $regex: req.query.search } })
    .select({ _id: 1, username: 1 })
    .limit(10)
    .then(u => res.json({ success: true, data: u }))
    .catch(e => next(e))
}

const Show = (req, res, next) => {
  let name = req.params.name
  User
    .findOne({
      $or: [
        { _id: name },
        { username: name }
      ]
    })
    .exec()
    .then(u => u ? u : Promise.reject('User not found.'))
    .then(u => res.json({ success: true, data: u.renderProfile() }))
    .catch(e => next(e))
}

export default {
  Search,
  Show
}

