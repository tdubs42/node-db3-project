const db = require('../../data/db-config')

const checkSchemeId = async (req, res, next) => {
  const {scheme_id} = req.params

  const exists = await db('schemes')
    .where('scheme_id', scheme_id)
    .first()

  if (!exists
    || typeof exists
    === 'undefined') {
    next({
      status: 404,
      message: `scheme with scheme_id ${scheme_id} not found`
    })
  }
  next()
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const {scheme_name} = req.body

  if (!scheme_name
    || typeof scheme_name
    !== 'string'
    || scheme_name.trim()
    === '') {
    next({
      status: 400,
      message: 'invalid scheme_name'
    })
  }
  next()
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const {
    instructions,
    step_number
  } = req.body

  if (!instructions
    || typeof instructions
    === 'undefined'
    || instructions
    === ''
    || typeof step_number
    !== 'number'
    || step_number
    < 1) {
    next({
      status: 400,
      message: 'invalid step'
    })
  }
  next()
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
