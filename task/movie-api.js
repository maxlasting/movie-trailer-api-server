const request = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const fetchMovie = async (data) => {
  const url = `https://api.douban.com/v2/movie/${data.id}`
  const res = await request(url)
  
  try {
    return JSON.parse(res)
  } catch(err) {
    console.log(err)
    return null
  }
}

;(async () => {
  
  const movies = await Movie.find({
    $or: [
      { summary: {$exists: false} },
      { summary: '' },
      { summary: null },
      { title: '' }
    ]
  })
  
  for (let i=0; i<movies.length; i++) {
    const movie = movies[i]
    const movieData = await fetchMovie(movie)
    
    if (movieData) {
      movie.title = movieData.alt_title || movieData.title
      movie.rawTitle = movieData.title
    }
  }
  
  
  
  
})()






















