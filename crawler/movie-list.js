const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/tag/#/?sort=T&range=6,10&tags=&playable=1`

const sleep = (time) => (
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })
)

;(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  
  console.log('浏览器初始化完毕...')
  
  const page = await browser.newPage()
  
  console.log('新建标签页完毕...')
  
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })
  
  console.log('跳转到指定url:' + url)
  
  await page.waitForSelector('.more')
  
  for (let i=0; i<1; i++) {
    await page.click('.more', {
      delay: 50
    })
    console.log(`已经加载第${i+1}次...`)
    await sleep(2000)
  }
  
  const result = await page.evaluate(() => {
    const items = $('.list-wp .item')
    const data = []
    
    if (!items.length) return data
    
    console.log(`已经找到${items.length}个节点...`)
    
    items.each((index, item) => {
      const movie = $(item)
      const movieId = movie.find('.cover-wp').data('id')
      const title = movie.find('.title').text()
      const rate = movie.find('.rate').text()
      const posterUrl = movie.find('img').attr('src').replace('s_ratio', 'l_ratio')
      
      data.push({ movieId, title, rate, posterUrl })
    })
    
    return data
  })
  
  browser.close()
  
  // console.log(result)
  
  console.log(`可以发送${result.length}条基础数据...`)
  
  for (let i=0; i<result.length; i+=10) {
    const _result = result.slice(i, i+10)
    process.send(_result)
    await sleep(2000)
  }
  
  process.exit(0)
})()