const request = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Cat = mongoose.model('Category')

const fetchMovie = async (data) => {
  const url = `https://api.douban.com/v2/movie/${data.movieId}`
  const res = await request(url)
  
  try {
    return JSON.parse(res)
  } catch(err) {
    console.log(err)
    return null
  }
}

const sleep = (time) => (
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })
)

module.exports = () => (
  new Promise(async (resolve) => {
    const movies = await Movie.find({
      $or: [
        { country: {$exists: false} },
        { country: '' },
        { country: null }
      ]
    })
    
    console.log(`已经获取到${movies.length}条待补充数据...`)
    
    for (let i=0; i<movies.length; i++) {
      await sleep(1000)
      
      const movie = movies[i]
      const movieData = await fetchMovie(movie)

      if (movieData && movieData.attrs) {
        const { pubdate } = movieData.attrs

        if (pubdate[0]) {
          const _cv = pubdate[0].split('(')
          movie.pubdate = _cv[0] ? _cv[0] : '3333-33-33'
          movie.country = _cv[1] ? _cv[1].split(')')[0] : '未知'
        }
        
        await movie.save()
      }
    }
    
    console.log('数据库字段加工完毕！')
    
    resolve()
  })
)






















