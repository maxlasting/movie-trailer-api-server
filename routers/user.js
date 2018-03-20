const { Controller, Post } = require('../decorator/decorator.js')
const { checkPassword } = require('../services/user.js')

@Controller('/api/v0/user')
class UserController {
  @Post('/')
  async _checkPassword (ctx, next) {
    const { emial, password } = ctx.request.body
    const matchData = await checkPassword(emial, password)
    
    if (matchData.match) {
      return (ctx.body = { code: 0 })
    }
    
    ctx.body = {
      code: 1,
      msg: '邮箱或密码错误!'
    }
  }
}
