const { Controller, Post } = require('../decorator/decorator.js')
const { checkPassword, userRegister } = require('../services/user.js')

@Controller('/api/v0/user')
class UserController {
  @Post('/login')
  async _checkPassword (ctx, next) {
    const { email, password } = ctx.request.body
    console.log(email, password)
    const matchData = await checkPassword(email, password)
    // console.log(matchData)
    if (matchData.match) {
      return (ctx.body = { code: 0 })
    }
    
    ctx.body = {
      code: 1,
      msg: '邮箱或密码错误!'
    }
  }
  
  @Post('/register')
  async _userRegister (ctx, next) {
    const { username, email, password } = ctx.request.body
    
    try {
      const user = await userRegister(username, email, password)
      
      if (user) {
        // ctx.response.status = 302
        // ctx.response.redirect = '/'
        
        ctx.body = {
          success: true,
          msg: ''
        }
      } else {
        ctx.body = {
          success: false,
          msg: '用户名或者邮箱已经被注册!'
        }
      }
    } catch (e) {
      ctx.response.status = 503
      
      ctx.body = {
        success: false,
        msg: '资源未找到',
        code: 503
      }
    }
  }
}
