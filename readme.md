请不要fork！！！fork太多会导致项目直接挂掉,如需使用，请在右上角选择新建项目，导入代码
## 使用注意 :warning:

- :warning: 请不要fork，因为GitHub Actions也会fork过去。那样会给番组计划的服务器造成压力；又或者请求过多，有可能触发拒绝请求的保护机制，造成项目被后台删除。

- 线报监控使用方法，bash git_pull.sh后，cd config && curl -O https://github.dc-wind.ml/wudongdefeng/jd-base/raw/v3/sample/diy.sh && curl -O https://github.dc-wind.ml/wudongdefeng/jd-base/raw/v3/sample/magic.json && cd ..
    
   config.sh 下的 EnableExtraShell的变量值false改成true，然后拉取仓库就有了。 

- :warning: 码云的镜像公开私有了，大家拉github就行了！切换方法，jd目录下vi .git/config，里面带有仓库的链接改为github

见下例

[core]

        repositoryformatversion = 0
        
        filemode = true
        
        bare = false
        
        logallrefupdates = true
        
[remote "origin"]

        url = https://git.dc-wind.ml/https://github.com/wudongdefeng/jd-base
        
        fetch = +refs/heads/*:refs/remotes/origin/*
        
[branch "master"]

        remote = origin
        
        merge = refs/heads/master
        
        
        
还有一处需要修改，还是jd目录，vi scripts/.git/config，里面的仓库链接还是改成github


tg群:https://t.me/+MaBLbc9f52JlZDdl

【青龙】拉取仓库命令：
ql repo https://git.dc-wind.ml/https://github.com/wudongdefeng/tem-update.git "jd|jx|gua|jddj|getJDCookie" "activity|backUp" "^jd^_|USER|function|utils|sendNotify|ZooFakerNecklace.js|JDJRValidator|signgraphicsvalidate|ql"


如果拉库失败，可用以下代理:

https://pd.zwc365.com/https://github.com/wudongdefeng/jd-base.git

https://gh.fakev.cn/wudongdefeng/jd-base.git

https://hub.fastgit.xyz/https://github.com/wudongdefeng/jd-base.git

https://hub.0z.gs/https://github.com/wudongdefeng/jd-base.git

https://api.mtr.pub/wudongdefeng/jd-base.git

https://ghproxy.futils.com/https://github.com/wudongdefeng/jd-base.git

https://hub.xn--gzu630h.xn--kpry57d/wudongdefeng/jd-base.git

https://cors.zme.ink/https://github.com/wudongdefeng/jd-base.git

重要的事情说3遍，不要用扫码，不要用扫码，不要用扫码。
