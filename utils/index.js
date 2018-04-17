
const add0 = (n) => (n < 10 ? '0' + n : '' + n)

const formatDate = function (time) {
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const date = time.getDate()
  const day = time.getDay()
  const h = time.getHours()
  const m = time.getMinutes()
  const s = time.getSeconds()
  return [year, month, date, day, h, m, s]
}

module.exports = {
  formatDate
}