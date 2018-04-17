const mongoose = require('mongoose')
const User = mongoose.model('User')

const checkPassword = async function (nameOrEmail, _password) {
  const user = await User.findOne({
    $or: [
      { username: nameOrEmail },
      { email: nameOrEmail }
    ]
  })
  
  if (user) {
    const match = await user.comparePassword(_password, user.password)
    
    // 如果没有哦匹配成功或者之前被锁定过，那么就重置锁定信息
    if (!match || user.lockUntil) await user.incLoginAttempts()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('===user.isLoced===', user.isLocked)
    }
    
    if (user.isLocked) return { locked: true }
    
    return { match, user }
  }
  
  return {}
}

const userRegister = async function (username, email, password) {
  let user = await User.findOne(
    {
      $or: [
        { username },
        { email }
      ]
    }
  )
  
  if (user) {
    return false
  } else {
    user = new User({
      username,
      email,
      password
    })
    
    await user.save()
    return true
  }
}

module.exports = { checkPassword, userRegister }