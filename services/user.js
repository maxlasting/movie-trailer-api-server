const mongoose = require('mongoose')
const User = mongoose.model('User')

const checkPassword = async function (email, _password) {
  const user = await User.findOne({ email })

  if (user) {
    const match = await user.comparePassword(_password, user.password)
    
    if (!match) {
      await user.incLoginAttempts()
    }
    
    console.log(user.isLocked)
    
    if (user.isLocked) return {}
    
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