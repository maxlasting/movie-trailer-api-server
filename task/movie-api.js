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

module.exports = () => (
  new Promise(async (resolve) => {
    const movies = await Movie.find({
      $or: [
        { summary: {$exists: false} },
        { summary: '' },
        { summary: null },
        { title: '' }
      ]
    })
    
    console.log(`已经获取到${movies.length}条待加工数据...`)
    
    for (let i=0; i<movies.length; i++) {
      const movie = movies[i]
      const movieData = await fetchMovie(movie)

      if (movieData) {
        movie.title = movieData.alt_title || movieData.title || ''
        movie.raw_title = movieData.title || movieData.alt_title || ''
        movie.summary = movieData.summary || ''

        if (movieData.attrs) {
          const { pubdate, movie_type, year } = movieData.attrs
          console.log(pubdate)
          if (pubdate[0]) {
            const _cv = pubdate[0].split('(')
            movie.pubdate = _cv[0] ? _cv[0] : '3333-33-33'
            movie.country = _cv[1] ? _cv[1].split(')')[0] : '未知'
          }
          
          movie.types = movie_type || []
          movie.year = year[0] || 33333
          
          for (let i=0; i<movie_type.length; i++) {
            const type = movie_type[i]
      
            let cat = await Cat.findOne({
              name: type
            })
      
            if (!cat) {
              cat = new Cat({
                name: type,
                movies: [movie._id]
              })
            } else {
              if (cat.movies.indexOf(movie._id) === -1) {
                cat.movies.push(movie._id)
              }
            }
      
            await cat.save()
      
            if (!movie.category) {
              movie.category = [cat._id]
            } else {
              if (movie.category.indexOf(cat._id) === -1) {
                movie.category.push(cat._id)
              }
            }
          }
        }
      
        if (movieData.tags) {
          movie.tags = movieData.tags.map((item) => {
            return item.name
          })
        } else {
          movie.tags = []
        }
      
        await movie.save()
      }
    }
    
    console.log('数据库字段加工完毕！')
    
    resolve()
  })
)






















