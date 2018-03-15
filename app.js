const Koa = require('koa')
const database = require('./middlewares/database')

async function start() {
  await database()
  
  await require('./task/movie-list.js')()
  await require('./task/movie-api.js')()
  await require('./task/movie-video.js')()
}

start()