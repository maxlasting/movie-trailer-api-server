const { fork } = require('child_process')
const { join } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

;(async () => {
  const script = join(__dirname, '../crawler/movie-list.js')
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
    const err = code === 0 ? null : new Error('The exit code is ' + code)
    console.log(err)
  })
  
  child.on('message', async (data) => {
    for (let i=0; i<data.length; i++) {
      const movie = await Movie.findOne({ movieId: data[i].movieId })
      
      if (!movie) {
        await new Movie(data[i]).save()
      }
    }
    console.log('基础数据建立完毕！')
  })
})()