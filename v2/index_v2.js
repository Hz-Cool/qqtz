var isLogin = false;
var timer, timeout;
const Code = {
    // 非法请求
    illegal: `<?xml version="1.0" encoding="gbk"?><ajax><![CDATA[�Ƿ������뷵�����ԣ�]]></ajax>`,
    // 成功 包含
    success: `+1</span></span><span class="st2">&nbsp;<span class="f24">`,
    // 刷新不要快于 1 秒
    Ref_1s: '<?xml version="1.0" encoding="gbk"?><ajax><![CDATA[��̳����:ˢ�²�Ҫ���� 1 ��]]></ajax>',
    // 请勿连续发表相同内容的主题
    repeat: `<?xml version="1.0" encoding="gbk"?><ajax><![CDATA[��������������ͬ���ݵ����⣡]]></ajax>`,
    // 异常
    abnormal: `<table width="100%" class="flootbg"><tbody><tr><td></td></tr></tbody></table>`,
    // 用户密码已更改 或 站点开启了安全认证
    update: '<?xml version="1.0" encoding="gbk"?><ajax><![CDATA[�û������Ѹ��� �� վ�㿪���˰�ȫ��֤ , ��Ҫ���µ�¼!<br><br>������޷��˳�,���ѡIE ����->ѡ�� Ȼ���ֶ����COOKIE]]></ajax>'
}

const statistics = {
    success_count: 0,
    error_count: 0,
    ref_1s_count: 0,
    illegal_count: 0,
    other_count: 0,
    login_count: 0,
    repeat_count: 0,
    abnormal_count: 0,
}

// 登录
function Login() {
    statistics.login_count++;
    isLogin = false;
    clearInterval(timer);
    return fetch("http://goodbye.qqtz.com/login.php?", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "upgrade-insecure-requests": "1"
        },
        "referrer": "http://goodbye.qqtz.com/login.php",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "forward=&jumpurl=http%3A%2F%2Fgoodbye.qqtz.com%2Findex.php&step=2&lgt=1&pwuser=86666&pwpwd=xxxxxxxx&question=0&customquest=&answer=&hideid=0&submit=",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
}

// 发帖请求
function post() {
    let atc_content = `Goodbye See You Again - ${new Date().getTime()} - ${Math.random()}`;
    let atc_title = `Re:Title`;
    let { tid } = GetUrlTranJson();

    return fetch("http://goodbye.qqtz.com/post.php?fid=30&nowtime=1620901107862&verify=cbd9fffb", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "cache-control": "max-age=0",
            "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryJ3SlBgS1WYyRTbN7",
            "upgrade-insecure-requests": "1"
        },
        "referrer": "http://goodbye.qqtz.com/read.php",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"atc_usesign\"\r\n\r\n1\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"atc_convert\"\r\n\r\n1\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"atc_autourl\"\r\n\r\n1\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"step\"\r\n\r\n2\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"type\"\r\n\r\najax_addfloor\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"action\"\r\n\r\nreply\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"fid\"\r\n\r\n30\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"cyid\"\r\n\r\n\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"tid\"\r\n\r\n${tid}\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"stylepath\"\r\n\r\nwind\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"ajax\"\r\n\r\n1\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"verify\"\r\n\r\ncbd9fffb\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"_hexie\"\r\n\r\na636f5cf\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"iscontinue\"\r\n\r\n0\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"isformchecked\"\r\n\r\n1\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"atc_title\"\r\n\r\n${atc_title}\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"atc_content\"\r\n\r\n${atc_content}\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7\r\nContent-Disposition: form-data; name=\"usernames\"\r\n\r\n\r\n------WebKitFormBoundaryJ3SlBgS1WYyRTbN7--\r\n`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
    // .then((req) => {
    //     return req.text()
    // });

    function GetUrlTranJson() {
        let url = location.href;
        // 获取当前浏览器的URL
        let param = {};
        // 存储最终JSON结果对象
        url.replace(/([^?&]+)=([^?&]+)/g, function (s, v, k) {
            param[v] = decodeURIComponent(k);
            // 解析字符为中文
            return k + "=" + v;
        });
        return param;
    }
}

// 发送 处理逻辑
function send(dg) {
    //     if (statistics.login_count > 5) {
    //         console.log('登录次数过多，暂停');
    //         return;
    //     }
    if (!isLogin) {
        LoginAppend();
        return;
    }
    ; post().then((data) => {
        data.text().then(t => {
            if (t.includes(Code.success)) {
                statistics.success_count++;
            } else if (t === Code.Ref_1s) {
                // 刷新不要快于 1 秒
                statistics.ref_1s_count++;
            } else if (t === Code.repeat) {
                // 请勿连续发表相同内容的主题
                statistics.repeat_count++;
            } else if (t.includes(Code.abnormal)) {
                // 异常
                statistics.abnormal_count++;
            } else if (t === Code.illegal || Code.update === t) {
                // 非法请求
                LoginAppend();
                statistics.illegal_count++;
            } else {
                console.error("🚀 ~ error", t)
                statistics.error_count++;
            }
        }
        );
        let count = 0
        Object.values(statistics).map(d => count += d)
        //&& count < 1000 && statistics.error_count < 2
        if (dg)
            send(true);

    }
    );

}

// 发送条数
function NumberMethod(n = 3) {
    //console.log(`发送${n}条`)
    for (let index = 0; index < n; index++) {
        send();
    }
}

// 间隔发送
function IntervalSend() {
    timer = setInterval(() => {
        NumberMethod();
    }
        , 500);
    //     setTimeout(() => {
    //         console.log('30s 结束')
    //         clearInterval(timer);
    //     }, 30000)
}

// 请求日志
function log() {
    setInterval(() => {
        console.log(JSON.stringify(statistics))
    }
        , 3000)
}

// 登录防抖
const LoginAppend = (data) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    timeout = setTimeout(() => {
        Login().then(() => {
            isLogin = true;
            //IntervalSend();
            send();
            //             send(true);
            //             send(true);
            //             send(true);
            console.log('登录成功')
        }
        )
    }
        , 666);
};

LoginAppend();
log()
