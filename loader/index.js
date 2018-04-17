const { join } = require('path')

class Loader {
  constructor () {
    this.middlewares = []
  }
  register (m) {
    this.middlewares.push(join(__dirname, '../middlewares', m))
  }
  async init (app) {
    for (let i=0; i<this.middlewares.length; i++) {
      const m = require(this.middlewares[i])

      if (typeof m === 'function') {
        await m(app)
      }
      
      if (typeof m === 'object' && m !== null) {
        Object.values(m).forEach(async (item) => {
          await item(app)
        })
      }
    }
  }
}

module.exports = new Loader()