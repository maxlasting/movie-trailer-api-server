const Koa = require('koa')
const koaBody = require('koa-body')
const database = require('../middlewares/database')
const router = require('../middlewares/router.js')
// const task = require('../task')
const cfg = require('../config')

;(async function start() {
  await database()
  
  const app = new Koa()
  
  app.use(koaBody())
  
  router(app)
  
  app.listen(cfg.port, () => {
    console.log(`Server is running at %d`, cfg.port)
  })
})()