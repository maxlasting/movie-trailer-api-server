const { Controller, Get } = require('../decorator/decorator.js')
const { getMovieDataList } = require('../services/movie.js')

@Controller('/api/v0/movie')
class MovieRouter {
  @Get('/')
  async _getMovieDataList (ctx, next) {
    const movies = await getMovieDataList()
    
    ctx.body = {
      code: 0,
      msg: 'ok',
      data: movies
    }
  }
}