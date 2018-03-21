# Movie Api Server

> 项目完成后会移入 master 分支

---

## 项目描述

爬取豆瓣电影的基本数据组件自己的数据库和接口服务。

```
npm run dev ===> 开发服务
npm start ===> 启动服务
```

在线接口示例：[点击查看](https://www.newfq.com/doubanapi/movies)

## 技术选型

|module|version|
|--|--|
|koa|2.5.0|
|bcrypt|1.0.3|
|glob|7.1.2|
|koa-body|2.5.0|
|koa-router|7.4.0|
|mongoose|5.0.9|
|nanoid|1.0.2|
|node-schedule|1.3.0|
|puppeteer|1.1.1|
|qiniu|7.1.3|
|request|2.83.0|
|request-promise-native|1.0.5|


## 功能实现

- [x] 使用 puppeteer 爬取网页数据
- [x] 服务端请求豆瓣api接口完善数据
- [x] 抓取网络资源到七牛云
- [x] 定时开启子进程运行任务脚本
- [x] 数据自动存储 mongodb
- [x] 电影信息接口
- [ ] 用户登陆注册模型（尚未完成，即将完善）
- [x] 使用装饰器抽象路由


## 部分截图

![1.png-482.6kB](http://static.zybuluo.com/maxlasting/8y49gqmjji743byo1dfzime7/1.png)

![2.png-361.7kB](http://static.zybuluo.com/maxlasting/h0yezhrrm0tmuhcwbkme3ypf/2.png)


![3.png-277.2kB](http://static.zybuluo.com/maxlasting/nkky39nltr4hwo2i1owwvsh0/3.png)


## 遇到问题和对应的解决方案

> 问题有很多，有部分尚未解决，带完善。



## 项目收获

基本对 koa 框架有了一些深入的了解，极度丰富了自己 node 相关的知识，也再次让我坚定的选择 node 作为今后的主要发展方向。