const KoaRouter = require('koa-router')
const glob = require('glob')
const { join } = require('path')

const methods = ['get', 'post', 'put', 'delete', 'all']
const pathPrefixer = Symbol('pathPrefixer')
const routerMap = new Map()

const prefixer = function (path) {
  return (target) => (
    target.prototype[pathPrefixer] = path
  )
}

const change2Arr = function (target) {
  return Array.isArray(target) ? target : [target]
}

const normalizePath = (path) => (
  path.startsWith('/') ? path : '/' + path
)

const setRouter = function (method) {
  return (subPath) => (
    (target, key, descriptor) => {
      routerMap.set(
        {
          method,
          subPath,
          target
        },
        target[key]
      )
      return descriptor
    }
  )
}

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
        normalizePath(join(target[pathPrefixer], subPath)),
        ...change2Arr(controllers)
      )
    }
    
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}

const covert = function (middleware) {
  return (target, key, descriptor) => {
    const arr = []
    
    target[key] = change2Arr(middleware).concat(change2Arr(target[key]))
    
    return descriptor
  }
}

const auth = covert(async (ctx, next) => {
  console.log(ctx.session)
  if (!ctx.session.user) {
    ctx.body = {
      success: false,
      msg: '登陆信息失效!',
      code: 401
    }
    return false
  }
  await next()
})

const admin = (roleExpected) => covert(async (ctx, next) => {
  const { role } = ctx.session.user
  
  if (!role || role !== roleExpected) {
    ctx.body = {
      success: false,
      msg: '无操作权限!',
      code: 403
    }
    return false
  }
  
  await next()
})

const required = (rules) => covert(async (ctx, next) => {
  let errs = []
  
  for (let key in rules) {
    const vals = rules[key]
    errs = errs.concat(vals.filter((item) => (!ctx.request[key][item])))
  }
  
  if (errs.length) return ctx.throw(412, `${errs.join(',')} is required`)
  
  await next()
})

module.exports = {
  ...methods.reduce((ctx, key) => {
    ctx[key] = setRouter(key)
    return ctx
  }, {}),
  prefixer,
  auth,
  admin,
  required,
  Router
}





















