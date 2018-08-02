import Joi from 'joi'
import validate from 'express-validation'

const Search = [
  validate({
    query: {
      search: Joi.string().required()
    }
  })
]

export default {
  Search
}
