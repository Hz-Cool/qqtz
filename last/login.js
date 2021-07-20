const fetch = require('node-fetch');
const iconv = require('iconv-lite');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Shanghai");
const {
    uid,
    pwd,
    url_QqtzLogin,
    LoginHeaders,
    loginInterval
} = require("./tools/config");
//
let obj = {};

function Login(callback) {
    fetch("http://goodbye.qqtz.com/login.php", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "upgrade-insecure-requests": "1",
        },
        "body": `forward=&jumpurl=http%3A%2F%2Fgoodbye.qqtz.com%2Findex.php&step=2&lgt=1&pwuser=${uid}&pwpwd=${pwd}&question=0&customquest=&answer=&hideid=0&submit=`,
        "method": "POST",
    }).then(function (res) {
        res.headers.raw()['set-cookie'].map((entry) => {
            const parts = entry.split(';');
            const cookiePart = parts[0];
            if (cookiePart.indexOf('c0b45_winduser') > -1) {
                obj.cookie = cookiePart;
            }
            return cookiePart;
        }).join(';');
        obj.date = moment().format('YYYY-MM-DD HH:mm:ss')
        obj.time_consuming = new Date().getTime();
        return res.buffer();
    }).then(function (res) {
        let body = iconv.decode(Buffer.concat([res]), 'GBK');
        let login_index = body.indexOf('您已经顺利登录');
        if (login_index > -1) {
            //console.log("🚀 ~ res.headers.raw ~ obj.cookie", obj)
            if (callback) callback();
        } else {
            Login();
            console.log("登录错误")
        }
    }).catch((e) => {
        Login();
        console.log('Login错误', e)
    })
}

function getVerify(callback) {
    fetch(`http://goodbye.qqtz.com`, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "upgrade-insecure-requests": "1",
            cookie: obj.cookie,
        },
        follow: 0,
        "referrer": "http://goodbye.qqtz.com",
        "method": "POST",
    }).then(function (res) {
        return res.buffer();
    }).then(function (res) {
        let body = iconv.decode(Buffer.concat([res]), 'GBK');
        let v_index = body.indexOf('verifyhash');
        let v_string = body.substring(v_index, v_index + 26);
        obj.verifyhash = v_string.substring(14, 22);

        //let today_find = body.indexOf('menu-half cc');
        //let today_string_100 = body.substring(today_find, today_find + 100);
        //let today_str_list = today_string_100.split('</li>');
        //let today = today_str_list[2].substring(today_str_list[2].indexOf('今日: '), today_str_list[2].length);
        //let post = today_str_list[1].substring(today_str_list[1].indexOf('帖子: '), today_str_list[1].length);
        //obj.self_today = today;
        //obj.self_post = post;

        // let c_index = body.indexOf('nofollow">');
        // let c_string_100 = body.substring(c_index, c_index + 30);
        // let cc_index = c_string_100.indexOf('nofollow">');
        // let a_index = c_string_100.indexOf('</a>')
        // obj.today = c_string_100.substring(cc_index + 10, a_index);

        let system_today_find = body.indexOf('sch_time=today');
        let system_today_str_100 = body.substring(system_today_find, system_today_find + 100);
        let system_today_list = system_today_str_100.split('</em></li>');
        let system_today_start = system_today_list[0].indexOf('llow">');
        let system_today_end = system_today_list[0].indexOf('</a>');
        let system_today = system_today_list[0].substring(system_today_start + 6, system_today_end);
        obj.system_today = Number(system_today);
        obj.today_AVG = (obj.system_today / moment().diff(moment().startOf('day'), 'seconds')).toFixed(2);
        callback();
    }).catch((e) => {
        console.log("🚀 ~ ", e)
        Login();
    })
}

function setCOS(obj) {
    fetch(url_QqtzLogin, {
        "method": "GET",
    }).then((response) => {
        return response.json();
    }).then(data => {
        let newList = data;
        if (data.length >= 30) {
            newList = data.slice(1, 9);
        }
        let last = newList[newList.length - 1];
        obj.decrement = obj.system_today - last.system_today;
        obj.decrement_AVG = (obj.decrement / moment().diff(moment(last.date), 'seconds')).toFixed(2);
        obj.time_consuming = new Date().getTime() - obj.time_consuming;
        newList.push(obj);
        console.log(obj)
        fetch(url_QqtzLogin, {
            "headers": LoginHeaders,
            "method": "PUT",
            "body": JSON.stringify(newList),
        });
    });

}

function load() {
    console.log("🚀 ~ load ~ load", "开始登录")
    Login(() => {
        console.log("Login")
        getVerify(() => {
            console.log("getVerify")
            setCOS(obj);
        });
    })
}

load()
setInterval(() => {
    load();
}, loginInterval)
