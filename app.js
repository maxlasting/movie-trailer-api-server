const Koa = require('koa')

async function start() {
  await require('./middlewares/database')()
  // await require('./task/movie-list.js')
}

start()