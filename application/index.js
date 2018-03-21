const Koa = require('koa')
const Load = require('./load')
const cfg = require('../config')

Load.register('database')
Load.register('common')
Load.register('router')
Load.register('task')

const app = new Koa()

Load.init(app)

app.listen(cfg.port, () => {
  console.log(`Server is running at %d`, cfg.port)
})