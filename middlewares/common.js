const koaBody = require('koa-body')

const userKoaBody = function (app) {
  app.use(koaBody({ multipart: true }))
}

module.exports = { userKoaBody }

