# QQTZ

- [QQTZ：一个水怪的进化之旅](http://hz-cool.minihenshang.cn/views/creations/qqtz/2100802.html#%E5%8A%9F%E8%83%BD%E6%A8%A1%E5%9D%97)

> 最后更新
[Last目录](./last)

`作用于ECS上的NodeJS程序`


这次有点类似于微服务的味道

- 登录微服务，管理着登录日志
- 发帖微服务，管理者发帖日志
- 通过腾讯COS，存储着这些日志

### **功能模块**

1. 登录日志
    - 登录时间
    - 系统发帖量
    - 账户发帖量
    - `周期发帖增量` = 系统发帖量 - 上一次登录时系统发帖量
    - `周期每秒平均发帖量` = 周期发帖增量 / ( 当前时间 - 上一次登录时时间 )
    - `当天每秒平均发帖量` =  系统发帖量 / 已过时间
  
2. 发帖日志
    - 时间
    - 运行次数
    - 发送量
    - 最快和最慢耗时

3. 配置文件
    - 运行一次发送条数
    - 单条超时时间
    - 批次超时时间
    - 提交日志频率
    - 休眠时常
    - 登录频率
    - 发帖频率
   
4. 观察到的
    - 请求并不是越多越好，网络抖动响应慢,会造成请求积压
    - 但是暴力堆积请求，又是总量最高的方式

5. 记录
    - 现在账号T币在6000W左右，实际发帖也就是6000W
    - 账号发帖数在1000W，6000-1000=5000 这些可能被系统吞了
    - 最高一天在390W，可惜没破400W
    - 理想目标是500W，由于服务器在国外，跨境流量经常丢失
    - 近7天流量走势 Up:24G Down:204G
    - 现网站已瘫痪，无法访问到 😭 每天这么DDOS,估计是数据库炸了
    - 搜索引擎也没了，👴爷青结
