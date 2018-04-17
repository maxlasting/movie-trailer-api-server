const { Router } = require('../libs/decorator.js')
const { join } = require('path')

module.exports = function (app) {
  const routersPath = join(__dirname, '../routers')
  const router = new Router(app, routersPath)
  router.init()
}
