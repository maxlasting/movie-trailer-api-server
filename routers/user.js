const { prefixer, get, post, auth, admin, required } = require('../libs/decorator.js')
const { checkPassword, userRegister } = require('../services/user.js')
const { formatDate } = require('../utils')

@prefixer('/user')
class UserController {
  @post('/check')
  @auth
  async _checkLoginStatus (ctx, next) {
    const { user } = ctx.session
    const { username, _id } = user
    
    ctx.body = { 
      success: true, 
      msg: `欢迎: ${user.username} 回来!`,
      data: {
        username,
        _id,
        loginTime: formatDate(new Date()),
        timestamp: Date.now()
      }
    }
    
    await next()
  }
  
  @post('/login')
  @required({
    body: ['username', 'password']
  })
  async _checkPassword (ctx, next) {
    console.log(ctx.session)
    const { username: nameOrEmail, password } = ctx.request.body
    // console.log(nameOrEmail, password)
    const matchData = await checkPassword(nameOrEmail, password)
    // console.log(matchData)
    if (matchData.match) {
      const { user } = matchData
      const { username, _id } = user
      
      ctx.session.user = {
        username,
        _id
      }
      
      console.log(ctx.session)
      
      return (ctx.body = { 
        success: true, 
        msg: `欢迎: ${user.username} 回来!`,
        data: {
          username,
          _id,
          loginTime: formatDate(new Date()),
          timestamp: Date.now()
        }
      })
    }
    
    if (matchData.locked) {
      return (ctx.body = {
        success: false,
        msg: '密码错误次数过多，请稍后再试!'
      })
    }
    
    ctx.body = {
      success: false,
      msg: '邮箱或密码错误!'
    }
    
    await next()
  }
  
  @post('/register')
  @required({
    body: ['username', 'email', 'password']
  })
  async _userRegister (ctx, next) {
    const { username, email, password } = ctx.request.body
    
    const user = await userRegister(username, email, password)
    
    if (user) {
      ctx.body = {
        success: true,
        msg: '注册成功!'
      }
    } else {
      ctx.body = {
        success: false,
        msg: '用户名或者邮箱已经被注册!'
      }
    }
    
    await next()
  }
}
