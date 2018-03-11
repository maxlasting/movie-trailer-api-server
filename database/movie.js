const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const MovieSchema = new Schema({
  id: {
    type: String,
    unique: true  // 代表这个数据是唯一的
  },
  title: String,
  rate: Number,
  summary: String,
  video: String,
  cover: String,
  poster: String,
  rawTitle: String,
  types: [String],
  pubdate: Mixed,
  tags: Mixed,
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

MovieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
console.log(1111)
mongoose.model('Movie', MovieSchema)