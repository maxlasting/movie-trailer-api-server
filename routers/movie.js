const { Controller, Get } = require('../decorator/decorator.js')

@Controller('/api/movie')
class MovieRouter {
  @Get('/')
  async getMovieDataList (ctx, next) {
    ctx.body = 'ok'
  }
}