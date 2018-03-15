const { fork } = require('child_process')
const { join } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

;(async () => {
  const movies = await Movie.find({
    $or: [
      { video: { $exists: false } },
      { video: '' },
      { video: null }
    ]
  })
  
  const script = join(__dirname, '../crawler/movie-video.js')
  const child = fork(script)
  
  let invoked = false
  
  child.on('error', (err) => {
    if (invoked) return
    invoked = true
    console.log(err)
  })
  
  child.on('exit', (code) => {
    if (invoked) return
    invoked = true
    const err = code === 0 ? null : new Error('Exit code is ' + code + '.')
    console.log(err)
  })
  
  child.on('message', async (data) => {
    console.log(data)
    const movie = await Movie.findOne({
      movieId: data.movieId
    })
    
    if (data.videoUrl) {
      movie.videoUrl = data.videoUrl
      movie.coverUrl = data.coverUrl
      await movie.save()
    } else {
      await movie.remove()
    }
  })
  
  child.send(movies)
})()