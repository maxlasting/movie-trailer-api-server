const puppeteer = require('puppeteer')
const path = require('path')

const url = `https://movie.douban.com/tag/#/?sort=T&range=6,10&tags=`

const sleep = (time) => (
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })
)

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: path.join(__dirname, '../chromium/Chromium.app/Contents/MacOS/Chromium')
  })
  
  console.log('浏览器初始化完毕...')
  
  const page = await browser.newPage()
  
  console.log('新建标签页完毕...')
  
  await page.goto(url)
  
  console.log('跳转到指定url:' + url)
  
  await page.waitForSelector('.more')
  
  for (let i=0; i<2; i++) {
    await sleep(2000)
    await page.click('.more')
  }
  
  const result = await page.evaluate(() => {
    const items = $('.list-wp .item')
    const data = []
    
    if (!items.length) return data
    
    items.each((index, item) => {
      const movie = $(item)
      const id = movie.find('.cover-wp').data('id')
      const title = movie.find('.title').text()
      const rate = movie.find('.rate').text()
      const poster = movie.find('img').attr('src').replace('s_ratio', 'l_ratio')
      
      data.push({ id, title, rate, poster })
    })
    
    return data
  })
  
  browser.close()
  
  process.send(result)
  process.exit(0)
})()