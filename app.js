const Koa = require('koa')
const database = require('./middlewares/database')

async function start() {
  await database()
  
  // require('./task/movie-list.js')
  // require('./task/movie-api.js')
}

start()