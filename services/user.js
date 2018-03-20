const mongoose = require('mongoose')
const User = mongoose.model('User')

const checkPassword = async function (email, _password) {
  const user = await User.findOne({ emial })
  
  if (user) {
    const match = user.comparePassword(_password, user.password)
    
    return { match, user}
  }
  
  return {}
}

module.exports = { checkPassword }