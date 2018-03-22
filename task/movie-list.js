const { fork } = require('child_process')
const { join } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

module.exports = () => (
  new Promise((resolve, reject) => {
    const script = join(__dirname, '../crawler/movie-list.js')
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
        console.log('基础数据建立完毕...')
        resolve()
      }
      reject(new Error('The exit code is ' + code))
    })
    
    child.on('message', async (data) => {
      console.log(`子进程接到${data.length}条数据`)
      for (let i=0; i<data.length; i++) {
        let movie = await Movie.findOne({ movieId: data[i].movieId })
        
        if (!movie) {
          movie = new Movie(data[i])
          await movie.save()
          console.log(`已经保存基础数据: ${movie.title}`)
        }
      }
    })
  })
)