import Joi from 'joi'
import validate from 'express-validation'

const Search = [
  validate({
    query: {
      search: Joi.string().required()
    }
  })
]

const Store = [
  validate({
    body: {
      name: Joi.string().min(3).max(64).required(),
      unlisted: Joi.boolean().required()
    }
  })
]

const Update = [
  validate({
    body: {
      name: Joi.string().min(3).max(64).required(),
      unlisted: Joi.boolean().required(),
      members: Joi.array().required(),
      closed: Joi.boolean().required()
    }
  })
]

export default {
  Search,
  Store,
  Update
}
