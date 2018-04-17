const koaBody = require('koa-body')
const koaLogger = require('koa-logger')
const session = require('koa-session')
const nanoid = require('nanoid')

const SALT_WORK_FACTOR = 10

const useKoaBody = function (app) {
  app.use(koaBody({ multipart: true }))
}

const useLogger = function (app) {
  app.use(koaLogger())
}

const useSession = async function (app) {
  app.keys = [nanoid(SALT_WORK_FACTOR)]
  
  app.use(session({
    key: nanoid(SALT_WORK_FACTOR),
    maxAge: 2 * 60 * 60 * 1000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false
  }, app))
}

module.exports = { useKoaBody, useLogger, useSession }

