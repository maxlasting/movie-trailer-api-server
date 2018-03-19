const KoaRouter = require('koa-router')
const glob = require('glob')
const { join } = require('path')
const { resolve } = require('url')

const pathPrefix = Symbol('pathPrefix')
const routerMap = new Map()

/**
 * 类装饰器
 * @param  {String} path 路由的跟路径
 * @return {function}    
 */
const Controller = function (path) {
  return (target) => (
    target.prototype[pathPrefix] = path
  )
}

const resolvePath = function (from, to) {
  from = from.startsWith('/') ? from : '/' + from
  to = to.endsWith('/') ? to.substr(0, to.length - 1) : to
  return resolve(from, to)
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

module.exports = {
  Router,
  Controller,
  Get,
  Post
}





















