const puppeteer = require('puppeteer')
const { join } = require('path')

const url = 'https://movie.douban.com/subject/'

const sleep = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

process.on('message', async (movies) => {
  const browser = await puppeteer.launch({
    executablePath: join(__dirname, '../chromium/Chromium.app/Contents/MacOS/Chromium')
  })
  
  console.log(`已接收到${movies.length}条数据！`)
  
  console.log('浏览器初始化完毕...')
  
  const page = await browser.newPage()
  
  console.log('新建页面完毕...')
  
  for (let i=0; i<movies.length; i++) {
    const { movieId } = movies[i]
    
    await page.goto(url + movieId, {
      waitUntil: 'networkidle2'
    })
    
    await sleep(2000)
    
    const trailerInfo = await page.evaluate(() => {
      const it = $('.related-pic-video')
      
      if (it.length) {
        const coverUrl = it.find('img').attr('src')
        const link = it.attr('href')
        return { coverUrl, link }
      }
    })
    
    let videoUrl = null;
    
    if (trailerInfo && trailerInfo.link) {
      console.log('已经获取到 link: '+ trailerInfo.link)
      
      await page.goto(trailerInfo.link, {
        waitUntil: 'networkidle2'
      })
      
      await sleep(2000)
      
      videoUrl = await page.evaluate(() => {
        const target = $('.vjs-tech source')
        
        if (target.length) {
          return target.attr('src')
        }
        
        return ''
      })
      
      process.send({
        movieId,
        videoUrl,
        coverUrl: trailerInfo.coverUrl
      })
    }
  }
  
  console.log('数据全部传输完毕...')
  
  browser.close()
  process.exit(0)
})