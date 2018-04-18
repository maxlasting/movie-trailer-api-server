# 电影预告api服务

> 1.0.0版本开发基本完成，具体api有时间会补上

---

## 更新日志

**2017-04-18 1.0.1**

- 优化部分错误提示，更友好了。
- 添加全局的错误捕获
- 准备重构数据获取功能

## 项目描述

一个提供电影预告片api和用户模块的服务。

```
npm run dev ===> 开发服务
npm start ===> 启动服务
npm test ===> 手动执行爬虫脚本
```

在线接口示例：[点击查看](https://www.newfq.com/doubanapi/v0/movie/list/?page=1&size=10)


## 功能实现

- [x] 使用 puppeteer 爬取网页数据
- [x] 服务端请求豆瓣api接口完善数据
- [x] 抓取网络资源到七牛云
- [x] 定时开启子进程运行任务脚本
- [x] 数据自动存储 mongodb
- [x] 电影信息接口
- [x] 用户登陆注册模型
- [x] 使用装饰器抽象路由


## 部分截图

![1.png-482.6kB](http://static.zybuluo.com/maxlasting/8y49gqmjji743byo1dfzime7/1.png)

![2.png-361.7kB](http://static.zybuluo.com/maxlasting/h0yezhrrm0tmuhcwbkme3ypf/2.png)


![3.png-277.2kB](http://static.zybuluo.com/maxlasting/nkky39nltr4hwo2i1owwvsh0/3.png)