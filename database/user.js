const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCKED_TIME = 2 * 60 * 60 * 1000

const UserSchema = new Schema({
  username: {
    unique: true,
    type: String
  },
  email: {
    unique: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  role: {
    type: Number,
    default: 1
  },
  lockUntil: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.virtual('isLocked').get(function () {
  // 如果 lockUntil 有值并且，时间值相对于当前时间是未来的时间戳，那么证明 用户是被锁定的
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})


UserSchema.pre('save', function (next) {
  // 如果修改的不是 password
  if (!this.isModified('password')) return next()
  
  // 创建 严
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    
    // 将 严 和 密码合成 hash 加密
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

UserSchema.methods = {
  // 用来比对密码
  comparePassword(_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (err) reject(err)
        resolve(isMatch)
      })
    })
  },
  incLoginAttempts(user) {
    return new Promise((resolve, reject) => {
      console.log(this.lockUntil && this.lockUntil < Date.now())
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: { loginAttempts: 1 },
          $unset: { lockUntil: 1 }
        }, (err) => {
          if (err) reject(err)
          resolve(true)
        })
      } else {
        const update = {
          $inc: {
            loginAttempts: 1
          }
        }
        
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          update.$set = {
            lockUntil: Date.now() + LOCKED_TIME
          }
        }
        
        this.update(update, (err) => {
          if (err) reject(err)
          resolve(true)
        })
      }
    })
  }
}

mongoose.model('User', UserSchema)
