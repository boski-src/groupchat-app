export default (to, from, next) => {
  if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('token')) {
      next({ name: 'Home' })
    }
    return next()
  }

  if (!localStorage.getItem('token')) {
    return next({ name: 'AuthLogin' })
  }

  next()
}