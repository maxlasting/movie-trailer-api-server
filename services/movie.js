const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const commonFilter = {
  __v: 0,
  posterUrl: 0,
  coverUrl: 0,
  videoUrl: 0,
  meta: 0,
  category: 0
}

const baseFilter = {
  _id: 1, 
  year: 1, 
  types: 1, 
  poster: 1, 
  raw_title: 1, 
  rate: 1, 
  title: 1
}

const getMovieDataList = async function (page, size, base, type, year) {
  let query = {}
  let filter = commonFilter
  
  if (type) {
    query.types = {
      $in: [type]
    }
  }
  
  if (year) query.year = year
  
  if (base) filter = baseFilter
  
  let movies = Movie.find(query, filter)
  
  if (page && size) {
    page = Math.max(page*1, 1)
    size = Math.max(size*1, 1)
    
    movies = await movies.limit(size).skip((page-1)*size)
  } else {
    movies = await movies
  }
  
  return movies
}

const getMovieDetail = async function (id) {
  const detail = await Movie.findById(id)
  
  if (detail) return detail
  
  return {}
}

module.exports = { getMovieDataList, getMovieDetail }