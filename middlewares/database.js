const mongoose = require('mongoose')
const { join } = require('path')
const glob = require('glob')
const config = require('../config')

mongoose.Promise = global.Promise

glob.sync(join(__dirname, '../database', '**/*.js')).forEach(require)

module.exports = () => {
  let maxConnectTimes = 0
  
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true)
    }

    const { db } = config
    
    mongoose.connect(db)
    
    mongoose.connection.on('disconnected', () => {
      if (++maxConnectTimes >= 5) {
        reject(new Error('数据库错误!'))
      }
      mongoose.connect(db)
    })
    
    mongoose.connection.on('error', (err) => {
      console.error(err)
    })
    
    mongoose.connection.once('open', () => {
      console.log(`Connected to mongodb -> ${db}`)
      resolve(true)
    })
  })
}