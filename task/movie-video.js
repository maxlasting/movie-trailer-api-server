const { fork } = require('child_process')
const { join } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

module.exports = () => (
  new Promise(async (resolve, reject) => {
    const movies = await Movie.find({
      $or: [
        { videoUrl: { $exists: false } },
        { videoUrl: '' },
        { videoUrl: null }
      ]
    })
    
    const script = join(__dirname, '../crawler/movie-video.js')
    const child = fork(script)
    
    let invoked = false
    
    child.on('error', (err) => {
      if (invoked) return
      invoked = true
      console.log(err)
      reject(err)
    })
    
    child.on('exit', (code) => {
      if (invoked) return 
      invoked = true
      if (code === 0) {
        console.log('数据全部完善完毕，等待上传...')
        resolve()
      }
      reject(new Error('The exit code is ' + code))
    })
    
    child.on('message', async (data) => {
      const movie = await Movie.findOne({
        movieId: data.movieId
      })
      
      if (data.videoUrl) {
        movie.videoUrl = data.videoUrl
        movie.coverUrl = data.coverUrl
        await movie.save()
        console.log(`已经保存了: ${movie.title}`)
      } else {
        await movie.remove()
        console.log(`已经移除了: ${movie.title}`)
      }
    })
    
    child.send(movies)
  })
)