const fetch = require("node-fetch");
var FormData = require("form-data");
const iconv = require("iconv-lite");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Shanghai");
const AbortController = require("abort-controller");
const {
  batchCounter,
  LogPostFrequency,
  url_QqtzLogin,
  QqtzPostPrams,
  PostTimer,
  PostTotal,
  singleTimeout,
  batchTimeout,
  ErrorFrequency,
  sleep
} = require("./tools/config");

// 发送传递参数
var PostParms = {
  Cookie: "",
  verifyhash: "",
  tid: 5079072,
}
// 上传日志参数
var log = {
  timer: "",
  sendCount: 0,
  time_consuming: [],
  counter: 0,
  errorCounter: 0,
};
// 发帖
function post(signal) {
  let verify = PostParms.verifyhash || '82c0f119';
  let nowtime = new Date().getTime();
  let fid = 30;
  let tid = PostParms.tid;
  let atc_content = `Goodbye See You Again - ${nowtime} - ${Math.random()}`;

  let formData = new FormData();
  formData.append("atc_content", atc_content);
  formData.append("fid", fid);
  formData.append("tid", tid);
  formData.append("action", "reply");
  //文章分类
  formData.append("step", 2);
  formData.append("type", "ajax_addfloor");

  // 网站规则变更21-07-28
  formData.append("magicname", "");
  formData.append("magicid", "");
  formData.append("verify", verify);
  formData.append("cyid", 0);
  formData.append("ajax", 1);
  formData.append("iscontinue", 0);
  formData.append("usernames", "");
  formData.append("atc_money", "");
  formData.append("atc_rvrc", "");
  formData.append("atc_usesign", "");
  formData.append("atc_convert", "");
  formData.append("pid", "");
  formData.append("fid", fid);
  formData.append("tid", tid);
  formData.append("article", "");
  formData.append("special", "");



  let headers = {
    Cookie: PostParms.Cookie,
  };
  let payload = {
    headers,
    signal,
    redirect: 'error',
    follow: 0, // 最大重定向计数。0 不遵循重定向          
    // highWaterMark: 1024 * 1024,
    body: formData,
    method: "POST",
  }
  if (singleTimeout) {
    payload.timeout = singleTimeout;
  }
  return fetch(`http://goodbye.qqtz.com/post.php?fid=${fid}&nowtime=${nowtime}&verify=${verify}`, payload);
}
// 发帖集合
var tidList = ['5079072', '5079073', '5079074'];
// 并发发送
function send() {
  console.log('Start---');
  let array = [];
  log.counter++;
  PostParms.tid = tidList[Math.floor(Math.random() * 3)];
  let time = new Date().getTime();
  const controller = new AbortController();
  // 并发请求
  for (let index = 0; index < batchCounter; index++) {
    let p = post(controller.signal);
    // 100%不会进入then Math.random() * 100 > 101
    // if (false) {
    p.then(function (res) {
      return res.buffer();
    }).then(function (res) {
      let body = iconv.decode(Buffer.concat([res]), "Glog");
      if (body.indexOf("回复帖子，奖励积分") > -1) {
        console.log("🚀 ~ 回复帖子，奖励积分");
      } else if (body.indexOf('<a href="u.php?uid=86666">知鱼之乐</a>') > -1) {
        console.log("🚀 ~ 知鱼之乐");
      } else if (body.indexOf("用户密码已更改 或 站点开启了安全认证 , 需要重新登录")) {
        console.log("🚀 ~ 用户密码已更改 或 站点开启了安全认证 , 需要重新登录");
      } else {
        // const fs = require("fs");
        // const path = require("path");
        // let file = path.resolve(__dirname, "./1.html");
        //fs.appendFile(file, body, { encoding: "utf8" }, (err) => { });
        console.log("错误");
      }
    });
    // }
    array.push(p);
  }
  // 超时整个队列中断
  let timeout;
  // timeout = setTimeout(() => {
  //   controller.abort();
  // }, batchTimeout);

  Promise.all(array).then(() => {
    log.sendCount += batchCounter;
  }).catch((e) => {
    log.errorCounter++;
    if (Math.random() * 100 > ErrorFrequency)
      console.log(e);
  }).finally(() => {
    // 日志
    let t = new Date().getTime() - time;
    if (log.time_consuming.length >= 20) {
      log.time_consuming = [];
    }
    log.time_consuming.push(t);
    // 打印
    console.log(`耗时${t},发送${array.length}条,错误${log.errorCounter}条`);
    console.log('End-----\r\n');
    // 清理数据
    controller.abort();
    clearTimeout(timeout);
    array = [];
    //休息100ms 避免积压
    if (PostTotal === 0) {
      setTimeout(() => {
        send();
      }, sleep);
    } else {
      if (log.counter < PostTotal) {
        setTimeout(() => {
          send();
        }, sleep);
      }
    }
  });
}
// 发帖日志写入
function setCOS() {
  fetch(QqtzPostPrams.url, {
    method: "GET",
  }).then((response) => {
    return response.json();
  }).then((data) => {
    let newList = data;
    if (data.length >= 20) {
      newList = data.slice(1, 20);
    }
    log.timer = moment().format("YYYY-MM-DD HH:mm:ss");
    let list = [...log.time_consuming];
    list.sort((a, b) => a - b);
    log.time_consuming = [
      list[0] + "ms",
      list[list.length - 1] + "ms",
      list.length + "条",
    ];
    newList.push(log);
    fetch(QqtzPostPrams.url, {
      headers: QqtzPostPrams.headers,
      method: "PUT",
      body: JSON.stringify(newList),
    });
  });
}
// 入口
function Entry() {
  fetch(url_QqtzLogin, {
    method: "GET",
  }).then((response) => {
    return response.json();
  }).then((data) => {
    let last = data[data.length - 1];
    PostParms.Cookie = last.cookie;
    PostParms.verifyhash = last.verifyhash;
    send();
  });
  setInterval(() => {
    //console.log("LOG:", log);
    if (Math.random() * 100 > LogPostFrequency) {
      setCOS(log);
    } else {
      //console.log('不上传');
    }
  }, PostTimer);
}

Entry();
