/**
 * 每一条
    300ms
   每一批
    100条 平均 2500ms
    200条 平均 3500ms
    600条 平均 10000ms
 */
// 运行一次发送条数
var batchCounter = 100;
// 单条超市时间
var singleTimeout = 333;
// 批次超时时间
var batchTimeout = 3000;
// 回帖提交日志频率 0~100 越大越不提交
var LogPostFrequency = 99.8;
// 登录日志
var url_QqtzLogin = 'https://XXXX.cos.ap-hk.myqcloud.com/qqtz_login.json';
var LoginHeaders = {
    'Authorization': 'Authorization',
    'Content-Type': 'application/json',
};
// 回帖日志
var QqtzPostPrams = {
    url: 'https://XXXX.cos.ap-hk.myqcloud.com/qqtz.json',
    headers: {
        Authorization:
            "Authorization",
        "Content-Type": "application/json",
    }
};
// 多少秒写入一次日志
var PostTimer = 1000 * 30;
// 运行次数 0为无限次
var PostTotal = 30;
// 报错概率 0~100 越大越不显示
var ErrorFrequency = 90;
// 休眠
var sleep = 168;


/**
 * 登录
 */
// 账户
var uid = 'uid';
var pwd = 'pwd';
// 多久登录一次
var loginInterval = 1000 * 60 * 20;

module.exports = {
    batchCounter,
    LogPostFrequency,
    url_QqtzLogin,
    QqtzPostPrams,
    PostTimer,
    PostTotal,
    singleTimeout,
    batchTimeout,
    ErrorFrequency,
    sleep,
    //
    uid,
    pwd,
    LoginHeaders,
    loginInterval,
};