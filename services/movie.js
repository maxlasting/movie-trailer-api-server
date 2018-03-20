const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const commonQuery = {
  __v: 0,
  posterUrl: 0,
  coverUrl: 0,
  videoUrl: 0
}

const getMovieDataList = async function () {
  const movies = await Movie.find({}, commonQuery)
  
  return movies
}

module.exports = { getMovieDataList }