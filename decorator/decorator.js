const KoaRouter = require('koa-router')
const glob = require('glob')
const { join } = require('path')

const pathPrefix = Symbol('pathPrefix')
const routerMap = new Map()

const Controller = function (path) {
  return (target) => (
    target.prototype[pathPrefix] = path
  )
}

const resolvePath = function (from, to) {
  from = from.startsWith('/') ? from : '/' + from
  to = to.startsWith('/') ? to : '/' + to
  
  return from + to
}

const change2Arr = function (target) {
  return Array.isArray(target) ? target : [target]
}

const setRouter = function (method) {
  return (subPath) => (
    (target, key, descriptor) => (
      routerMap.set(
        {
          method,
          subPath,
          target
        },
        target[key]
      )
    )
  )
}

const Get = setRouter('get')

const Post = setRouter('post')

const Put = setRouter('put')

const Delete = setRouter('delete')

class Router {
  constructor (app, routersPath) {
    this.app = app
    this.routersPath = routersPath
    this.router = new KoaRouter()
  }
  
  init () {
    const { app, router, routersPath } = this
    
    glob.sync(join(routersPath, '*.js')).forEach(require)

    for (let [conf, controllers] of routerMap) {
      const { method, subPath, target } = conf

      router[method](
        resolvePath(target[pathPrefix], subPath), ...change2Arr(controllers)
      )
    }
    
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}

const covert = function (middleware) {
  return (target, key, descriptor) => {
    const arr = []
    
    target[key] = change2Arr(target[key]).concat(change2Arr(middleware))
    
    return descriptor
  }
}

const Auth = covert(async (ctx, next) => {
  if (!ctx.session.user) {
    ctx.body = {
      success: false,
      msg: '登陆信息失效',
      code: 401
    }
    return
  }
  await next()
})

module.exports = { Router, Controller, Get, Post }





















