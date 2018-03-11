const R = require('ramda')

const sumArgs = (...args) => R.sum(args)

// console.log(sumArgs(1, 2, 3, 4))

const curryAdd4Nums = R.curryN(4, sumArgs)

console.log(curryAdd4Nums(1, 2, 3, 4, 5))