const database = require('../middlewares/database.js')
const task = require('./index.js')

;(async () => {
  await database()
  
  task()
})()

