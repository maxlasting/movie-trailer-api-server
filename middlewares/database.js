const mongoose = require('mongoose')
const { join } = require('path')
const glob = require('glob')
const config = require('../config')

mongoose.Promise = global.Promise

glob.sync(join(__dirname, '../database', '**/*.js')).forEach(require)

const initSu = async () => {
  const User = mongoose.model('User')
  
  let user = await User.findOne({username: 'Fq'})
  
  if (user) return
  
  user = new User({
    username: 'Fq',
    emial: 'maxlasting@163.com',
    password: '123',
    role: 'admin' 
  })
  
  await user.save()
}

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
        return false
      }
      mongoose.connect(db)
    })
    
    mongoose.connection.on('error', (err) => {
      console.error(err)
    })
    
    mongoose.connection.once('open', async () => {
      console.log(`Connected to mongodb -> ${db}`)
      await initSu()
      resolve(true)
    })
  })
}