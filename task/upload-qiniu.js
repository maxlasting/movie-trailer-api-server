const qiniu = require('qiniu')
const nanoid = require('nanoid')
const cfg = require('../config')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const { AK, SK, bucket, resBaseUrl } = cfg.qiniu

const mac = new qiniu.auth.digest.Mac(AK, SK)
const config = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, config)

const upload = (resUrl, key) => (
  new Promise((resolve, reject) => {
    bucketManager.fetch(resUrl, bucket, key, function(err, respBody, respInfo) {
      if (err) {
        reject(err)
      } else {
        if (respInfo.statusCode == 200) {
          resolve(respBody)
        } else {
          reject(respInfo.statusCode)
        }
      }
    })
  })
)

module.exports = () => (
  new Promise(async (resolve, reject) => {
    const movies = await Movie.find({
      $or: [
        {video: { $exists: false }},
        {video: ''},
        {video: null}
      ]
    })
    
    for (let i=0; i<movies.length; i++) {
      const movie = movies[i]
      
      if (movie.videoUrl) {
        try {
          const video = await upload(movie.videoUrl, nanoid())
          const cover = await upload(movie.coverUrl, nanoid())
          const poster = await upload(movie.posterUrl, nanoid())
          
          video && (movie.video = resBaseUrl + video.key)
          cover && (movie.cover = resBaseUrl + cover.key)
          poster && (movie.poster = resBaseUrl + poster.key + '?imageMogr2/thumbnail/x1680/crop/1080x1600')
          
          await movie.save()
          
          console.log(`已经上传完成: ${movie.title}`)
        } catch (e) {
          console.log(e)
        }
      }
    }
    console.log(`数据上传七牛云完毕!`)
  })
)