const { prefixer, get, post } = require('../libs/decorator.js')
const { getMovieList, getMovieDetail } = require('../services/movie.js')

@prefixer('/movie')
class MovieRouter {
  @get('/list')
  async _getMovieList (ctx, next) {
    const { page, size, base, type, year } = ctx.query
    const movies = await getMovieList(page, size, base, type, year)
    
    ctx.body = {
      success: true,
      msg: 'ok',
      data: movies
    }
    await next()
  }
  
  @get('/detail/:id')
  async _getMovieDetail (ctx, next) {
    const { id } = ctx.params
    const detail = await getMovieDetail(id)
  
    ctx.body = {
      success: true,
      msg: 'ok',
      data: detail
    }
    
    await next()
  }
}