const isDev = process.env.NODE_ENV === 'development'

module.exports = function (app) {
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      console.error(e)
      ctx.status = 500
      if (isDev) {
        ctx.body = e.message
      } else {
        ctx.body = {
          success: false,
          code: 500,
          msg: 'Please try again later!'
        }
      }
    }
  })
}