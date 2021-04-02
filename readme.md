请不要fork！！！fork太多会导致项目直接挂掉,如需使用，请在右上角选择新建项目，导入代码
## 使用注意 :warning:

- :warning: 请不要fork，因为GitHub Actions也会fork过去。那样会给番组计划的服务器造成压力；又或者请求过多，有可能触发拒绝请求的保护机制，造成项目被后台删除。

- :warning: lxk大佬的代码已私人化，请自寻路径了，以前的代码不更新还能用

不看注释的可以保存下来了

京东领京豆各类不好找的小游戏入口：

1.美丽研究院

活动入口：京东app首页-美妆馆-底部中间按钮

2.口袋书店

活动入口：京东app首页-京东图书-右侧口袋书店

3.京东汽车，签到满500赛点可兑换500京豆

活动入口：京东APP首页-车管家-京东汽车-屏幕右中部

4.签到领现金，每日2毛～5毛

活动入口：京东APP搜索领现金进入

5.摇京豆

活动入口：京东APP首页-领京豆-摇京豆/京东APP首页-我的-京东会员-摇京豆

6.疯狂的JOY

活动入口：京东APP我的-更多工具-疯狂的JOY

7.天天提鹅

活动入口：京东金融-天天提鹅

8.京东京喜工厂（可能要下京喜APP）

活动入口：京东APP-游戏与互动-查看更多-京喜工厂

或者: 京东APP首页搜索 "玩一玩" ,造物工厂即可

9.东东水果

活动入口：京东APP我的-更多工具-东东农场

10.东东工厂，不是京喜工厂

活动入口：京东APP首页-数码电器-东东工厂

11.宠汪汪

活动入口：京东APP我的-更多工具-宠汪汪

12.京喜农场

活动入口：京喜APP我的-京喜农场

13.京东摇钱树 

活动入口：京东APP我的-更多工具-摇钱树

14.京东秒秒币

一天签到100币左右，100币可兑换1毛钱红包，推荐攒着配合农场一起用

活动入口：京东app-京东秒杀-签到领红包

15.点点券，可以兑换无门槛红包（1元，5元，10元，100元，部分红包需抢购）

活动入口：京东APP-领券中心/券后9.9-领点点券

16.东东萌宠

活动入口：京东APP我的-更多工具-东东萌宠

17.东东小窝

活动入口：京东APP我的-游戏与更多-东东小窝

18.东东超市

活动入口：京东APP首页-京东超市-底部东东超市

19.赚京豆

活动入口：赚京豆(微信小程序)-赚京豆-签到领京豆

  详细的教程在wiki> https://gitee.com/wudongdefeng/jd-base/wikis <

  依次按下顺序运行代码  

  
  使用termux高级教程配置好，百度第一个就是  

  pkg update  

  pkg install git perl nodejs-lts wget curl nano cronie moreutils  

  git clone https://gitee.com/wudongdefeng/jd-base.git ~/storage/shared/jd  

  cd  ~/storage/shared/jd  

  cp sample/auth.json config/auth.json  

  cp sample/termux.list.sample config/crontab.list  

  cp ~/storage/shared/jd/sample/config.sh.sample config/config.sh  

  bash git_pull.sh  

  至此代码已OK！  

  控制面板开启方法  

  cd panel  

  npm install || npm install --registry=https://registry.npm.taobao.org.com  

  node server.js  

 出现端口5678提示，进手机网页127.0.0.1:5678就好了（当然用pm2也行，但是用pm2不容易发现错误，会导致控制面板能显示但为空白，建议node server.js成功后再使用pm2) 
  

 出现错误无非是npm的问题，自己在网页搜索相关的教程，一般重新安装nodejs-lts就能解决  

 最后代码怎么运行呢  

 crond ~/storage/shared/jd/config/crontab.list
  
 crond
 
 好了代码已全自动了，切记每次重启软件需要重新运行这句上面两行代码。


拉取失败怎么办呢

cd  ~/storage/shared/jd

rm -rf scripts

bash git_pull.sh
  

 
 


