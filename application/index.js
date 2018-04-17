const Koa = require('koa')
const Loader = require('../loader')
const cfg = require('../config')

const modules = ['database', 'common', 'router', 'task']

modules.forEach((m) => (
  Loader.register(m)
))

const app = new Koa()

Loader.init(app)

app.listen(cfg.port, () => {
  console.log(`Server is running at %d`, cfg.port)
})