/**
 * 这是最初版 V1 ， 只能应用于浏览器
 * 
 * 观察到:
 * 回帖时，整个页面并不会全刷
 * 只会再原来基础上增加HTML
 * 
 * 实现方式：
 * 通过操作DOM的方式填写回帖内容
 * 然后点击回帖按钮，提交数据
 * 
 * 缺点：
 * 1.登录状态不可控
 * 2.有并发限制 FORM并发限制 浏览器并发上限
 * 
 * 
 * 貌似Form表单有防抖限制
 * 一个浏览器窗口每秒只能提交一次请求
 * 如果需要高并发，则需要多开窗口，非常损耗性能
 * 
 * 浏览器限制最多六个请求在并发
 * 火狐浏览器可以修改请求上限
 */


let pw_content = document.getElementById("pw_content");
if (pw_content) {
    pw_content.remove();
}
setInterval(function(){
    try{
        document.getElementById("textarea").value=`“自然选择号”前进四！${new Date().getTime()}-${Math.random()}`
        checkpost(document.FORM);
        document.getElementsByName('Submit')[0].click();
    }catch(e){
        //console.log(e);
    }
},100)
