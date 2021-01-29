/*
 * @Author: shylocks https://github.com/shylocks
 * @Date: 2021-01-13 16:13:41
 * @Last Modified by:   shylocks
 * @Last Modified time: 2021-01-13 18:25:41
 */
/*
京东粉丝专享
签到5天可兑换40京豆
活动入口：京东JD.COM 公众号-粉丝福利-签到兑红包
已支持IOS双京东账号,Node.js支持N个京东账号
需要获取额外ck，获取方式为从活动入口进入一次，不会影响原有京东ck
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
[MITM]
hostname = wq.jd.com
============Quantumultx===============
[rewrite_local]
https:\/\/wq\.jd\.com\/bases\/jssdk\/GetWxJsApiSign url script-request-header https://raw.githubusercontent.com/shylocks/Loon/main/jd_wechat_sign.js
[task_local]
#京东粉丝专享
10 0 * * * https://raw.githubusercontent.com/shylocks/Loon/main/jd_wechat_sign.js, tag=京东粉丝专享, img-url=https://raw.githubusercontent.com/yogayyy/Scripts/master/Icon/shylocks/jd_wechat_sign.jpg, enabled=true

================Loon==============
[Script]
http-request https:\/\/wq\.jd\.com\/bases\/jssdk\/GetWxJsApiSign tag=获取京东微信ck, script-path=https://raw.githubusercontent.com/shylocks/Loon/main/jd_wechat_sign.js
cron "10 0 * * *" script-path=https://raw.githubusercontent.com/shylocks/Loon/main/jd_wechat_sign.js,tag=京东粉丝专享

===============Surge=================
[Script]
获取京东微信ck = type=http-request,pattern=^https:\/\/wq\.jd\.com\/bases\/jssdk\/GetWxJsApiSign,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/shylocks/Loon/main/jd_wechat_sign.js,script-update-interval=0
京东粉丝专享 = type=cron,cronexp="10 0 * * *",wake-system=1,timeout=200,script-path=https://raw.githubusercontent.com/shylocks/Loon/main/jd_wechat_sign.js
*/
const $ = new Env('京东粉丝专享');
const APIKey = "CookiesJD";
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '', message;
let EXCHANGE = $.isNode() ? (process.env.EXCHANGE_WECHAT?process.env.EXCHANGE_WECHAT : true) : ($.getdata('JDWECHATEXCHANGE') ? $.getdata('JDWECHATEXCHANGE') : true)
function getCache() {
  var cache = $.getdata(APIKey) || "[]";
  $.log(cache);
  return JSON.parse(cache);
}
function GetCookie() {
  try {
    if ($request.headers && $request.url.indexOf("GetWxJsApiSign") > -1) {
      var CV = $request.headers["Cookie"] || $request.headers["cookie"];
      if (CV.match(/(wq_skey=.+?wq_uin=|wq_uin=.+?wq_skey=)/)) {
        var CookieValue = CV.match(/wq_skey=.+?;/) + CV.match(/wq_uin=.+?;/);
        var UserName = CV.match(/jdpin=(.+?);/)[1];
        var DecodeName = decodeURIComponent(UserName);
        var EncodeName = encodeURIComponent(UserName)
        var CookiesData = getCache();
        let hasCk = false
        var updateCookiesData = [...CookiesData];
        var updateIndex;
        var CookieName = "【账号】";
        var updateCodkie = CookiesData.find((item, index) => {
          var ck = item.cookie;
          var Account = ck
            ? ck.match(/pt_pin=.+?;/)
              ? ck.match(/pt_pin=(.+?);/)[1]
              : null
            : null;
          const verify = EncodeName === Account && ck.indexOf(CookieValue) === -1;
          if (ck.indexOf(CookieValue)>-1) hasCk = true
          if (verify) {
            updateIndex = index;
          }
          return verify;
        });
        var tipPrefix = "";
        if (updateCodkie) {
          updateCookiesData[updateIndex].cookie = updateCookiesData[updateIndex].cookie.match(/pt_key=.+?;/) + updateCookiesData[updateIndex].cookie.match(/pt_pin=.+?;/) + CookieValue;
          CookieName = `【账号${updateIndex + 1}】`;
          tipPrefix = "更新京东微信";
          const cacheValue = JSON.stringify(updateCookiesData, null, "\t");
          $.setdata(cacheValue, APIKey);
          $.msg(
            "用户名: " + DecodeName,
            "",
            tipPrefix + CookieName + "Cookie成功 🎉"
          );
        } else if(!hasCk) {
          for(let key of ["CookieJD","CookieJD2"]) {
            let ck = $.getdata(key);
            if (ck) {
              let Account = ck
                ? ck.match(/pt_pin=.+?;/)
                  ? ck.match(/pt_pin=(.+?);/)[1]
                  : null
                : null
              const verify = EncodeName === Account && ck.indexOf(CookieValue) === -1;
              if (verify) {
                $.setdata(ck.match(/pt_key=.+?;/) + ck.match(/pt_pin=.+?;/) + CookieValue, key)
                $.msg(
                  "用户名: " + DecodeName,
                  "",
                  "微信Cookie获取成功 🎉"
                );
              }
            }
          }
        }
      } else {
        $.msg("写入京东微信Cookie失败", "", "请查看脚本内说明, 登录网页获取 ‼️");
      }
      $.done();
      return;
    } else {
      $.msg("写入京东微信Cookie失败", "", "请检查匹配URL或配置内脚本类型 ‼️");
    }
  } catch (eor) {
    $.setdata("", CacheKey);
    $.msg("写入京东微信Cookie失败", "", "已尝试清空历史Cookie, 请重试 ⚠️");
    console.log(
      `\n写入京东微信Cookie出现错误 ‼️\n${JSON.stringify(
        eor
      )}\n\n${eor}\n\n${JSON.stringify($request.headers)}\n`
    );
  }
  $.done();
}
if (!$.isNode() && typeof $request !=='undefined') {
  GetCookie();
}else{
  if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
      cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
    };
    if(JSON.stringify(process.env).indexOf('GITHUB')>-1) process.exit(0)
  } else {
    let cookiesData = $.getdata('CookiesJD') || "[]";
    cookiesData = jsonParse(cookiesData);
    cookiesArr = cookiesData.map(item => item.cookie);
    cookiesArr.reverse();
    cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
    cookiesArr.reverse();
    cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
  }
  !(async () => {
    if (!cookiesArr[0]) {
      $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
      return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
      if (cookiesArr[i]) {
        cookie = cookiesArr[i];
        if(cookie.indexOf('wq_uin')===-1) continue
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = '';
        $.beans = 0
        message = '';
        await TotalBean();
        console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
        if (!$.isLogin) {
          $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
          if ($.isNode()) {
            await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
          } else {
            $.setdata('', `CookieJD${i ? i + 1 : ""}`);//cookie失效，故清空cookie。$.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
          }
          continue
        }
        await jdWe()
      }
    }
  })()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
}
async function jdWe() {
  $.point = 0
  await sign()
  await getReward()
  await showMsg()
}
function sign() {
  return new Promise(resolve => {
    $.get(taskUrl('jdAccountSignIn/Query'),async (err,resp,data)=>{
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data)
          console.log(`签到成功，获得${data.signInModule.signPoints}金币`)
          $.currentPoint = data.currPoint
          for(let task of data.task_info.taskFavShop){
            await completeTask(1, task.taskId)
            await $.wait(500)
          }
          for(let task of data.task_info.taskBrowse){
            await completeTask(2, task.taskId)
            await $.wait(500)
          }
          for(let task of data.task_info.taskNewUser){
            await completeTask(5, task.taskId)
            await $.wait(500)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function getReward() {
  return new Promise(resolve => {
    $.get(taskUrl('jdAccountSignIn/Query'),async (err,resp,data)=>{
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data)
          $.currentPoint = data.currPoint
          for(let task of data.complete_task_info.taskFavShop){
            await rewardTask(1, task.taskId)
            await $.wait(500)
          }
          for(let task of data.complete_task_info.taskBrowse){
            await rewardTask(2, task.taskId)
            await $.wait(500)
          }
          for(let task of data.complete_task_info.taskOrder){
            await rewardTask(4, task.taskId)
            await $.wait(500)
          }
          for(let task of data.complete_task_info.taskNewUser){
            await rewardTask(5, task.taskId)
            await $.wait(500)
          }
          for(let ex of data.exchangeList){
            if(EXCHANGE && ex['remainPercent']!=='0.00' && ex['prizeName'].indexOf('京豆')>-1 && ex['needPoint'] <= $.currentPoint ){
              console.log(`满足条件，去兑换${ex['prizeName']}`)
              await exchange(ex.pondId,ex.level)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function completeTask(taskType,taskId) {
  return new Promise(resolve => {
    $.get(taskUrl('jdAccountSignIn/CompleteTask',`taskType=${taskType}&taskId=${taskId}`),(err,resp,data)=>{
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data)
          if(data.iRet===0)
            console.log(`任务完成成功，预计获得${data.getPoint}金币`)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function rewardTask(taskType,taskId) {
  return new Promise(resolve => {
    $.get(taskUrl('jdAccountSignIn/GetTaskPoint',`taskType=${taskType}&taskId=${taskId}`),(err,resp,data)=>{
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data)
          if(data.iRet===0) {
            console.log(`任务领奖成功，获得${data.getPoint}金币`)
            $.point += data.getPoint
            $.currentPoint += data.getPoint
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function exchange(pondId,level) {
  return new Promise(resolve => {
    $.get(taskUrl('jdAccountSignIn/ExchangeMyPrize',`pondId=${pondId}&level=${level}`),(err,resp,data)=>{
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data)
          if(data.iRet===0) {
            console.log(`兑换成功`)
            $.currentPoint = data.currPoint
          }else{
            console.log(`兑换失败，错误信息：${data.errMsg}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function showMsg() {
  return new Promise(resolve => {
    message += `本次运行获得${$.point}金币，累计${$.currentPoint}金币`
    $.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
    resolve()
  })
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            $.nickName = data['base'].nickname;
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function taskUrl(function_id, body = '') {
  return {
    url: `https://wq.jd.com/${function_id}?_=${new Date().getTime()}&g_login_type=0&g_tk=1422557157&g_ty=ls&${body}`,
    headers: {
      'Host': 'wq.jd.com',
      'Accept': 'application/json',
      'Accept-Language': 'zh-cn',
      'Content-Type': 'application/json;charset=utf-8',
      'Origin': 'wq.jd.com',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.20(0x1700142b) NetType/WIFI Language/zh_CN',
      'Referer': `https://anmp.jd.com/babelDiy/Zeus/xKACpgVjVJM7zPKbd5AGCij5yV9/index.html?wxAppName=jd`,
      'Cookie': cookie
    }
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
