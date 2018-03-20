require('babel-core/register')()
require('babel-polyfill')
require('./application')

console.log(process.env.NODE_ENV)