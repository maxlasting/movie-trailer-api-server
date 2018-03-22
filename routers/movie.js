const { Controller, Get, Post } = require('../decorator/decorator.js')
const { getMovieDataList, getMovieDetail } = require('../services/movie.js')

@Controller('/doubanapi/v0/movie')
class MovieRouter {
  @Get('/list')
  async _getMovieDataList (ctx, next) {
    const { page, size, base, type, year } = ctx.query
    const movies = await getMovieDataList(page, size, base, type, year)
    
    ctx.body = {
      success: true,
      msg: 'ok',
      data: movies
    }
  }
  
  @Get('/detail/:id')
  async _getMovieDetail (ctx, next) {
    const { id } = ctx.params
    const detail = await getMovieDetail(id)
  
    ctx.body = {
      success: true,
      msg: 'ok',
      data: detail
    }
  }
}