const Koa = require('koa')
const database = require('./middlewares/database')
const task = require('./task')

async function start() {
  await database()
  await task()
}

start()