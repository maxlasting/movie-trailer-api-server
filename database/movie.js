const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const MovieSchema = new Schema({
  movieId: {
    type: String,
    unique: true  // 代表这个数据是唯一的
  },
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  title: String,
  rate: Number,
  summary: String,
  videoUrl: String,
  coverUrl: String,
  posterUrl: String,
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

mongoose.model('Movie', MovieSchema)