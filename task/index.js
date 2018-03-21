const glob = require('glob')
const { join } = require('path')

glob.sync(join(__dirname, '../database', '**/*.js')).forEach(require)

const sleep = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

const updateMovieData = async function () {
  console.log('定时任务开始!')
  console.log('='.repeat(80))
  await require('./movie-list.js')()
  console.log('='.repeat(80))
  await sleep(2000)
  await require('./movie-api.js')()
  await sleep(2000)
  console.log('='.repeat(80))
  await require('./movie-video.js')()
  await sleep(2000)
  console.log('='.repeat(80))
  await require('./upload-qiniu.js')()
}

module.exports = updateMovieData

