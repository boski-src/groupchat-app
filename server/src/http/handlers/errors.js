import expressValidation from 'express-validation'

export function notFound (req, res, next) {
  next({ status: 404, message: 'Resource not found.' })
}

export function catchError (err, req, res, next) {
  if (err instanceof expressValidation.ValidationError) {
    res.status(err.status)
      .json({
        success: false,
        errors: err.errors,
        message: err.statusText
      })
  } else {
    res.status(err.status || 500)
      .json({
        success: false,
        error: err.code || err.message || err.name || err
      })
  }
}