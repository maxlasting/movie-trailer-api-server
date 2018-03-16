module.exports = async function () {
  await require('./movie-list.js')()
  await require('./movie-api.js')()
  await require('./movie-video.js')()
  await require('./upload-qiniu.js')()
}