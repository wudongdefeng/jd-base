#!/usr/bin/env bash

##############################################################################
#                                                                            #
#                          自动拉取各个作者库内指定脚本
#                   把此diy.sh放入config即可,会自动同步最新脚本
#                    如有好用的脚本或者脚本更新不及时请@ljhnchina
#                              2021年3月31日 21:40:41
#                                                                            #
##############################################################################

############################## 作者名称 ##############################
author_list="
wudongdefeng
"
######################################################################

############################## 维护:wudongdefeng ##############################
# 库地址:https://github.com/wudongdefeng/jd-temporary
scripts_base_url_1=https://ghproxy.com/https://raw.githubusercontent.com/wudongdefeng/jd-temporary/main/
my_scripts_list_1="
monk-coder_monk_pasture.js
monk-coder_z_asus_iqiyi.js
monk_skyworth.js
i-chenzhe-z_xmf.js
"


############################ 是否强制替换脚本的定时 ############################
# 设为"true"时强制替换脚本的定时，设为"false"则不替换脚本的定时...
Enablerenew="false"

############################## 随机函数 ##############################
rand(){
    min=$1
    max=$(($2-$min+1))
    num=$(cat /proc/sys/kernel/random/uuid | cksum | awk -F ' ' '{print $1}')
    echo $(($num%$max+$min))
}

############################## 手动删除失效脚本 ##############################
cd $ScriptsDir
# rm -rf qq34347476_getShareCode_format.js

############################## 开始下载脚本 ##############################
index=1
for author in $author_list
do
  echo -e "######################### 开始下载 $author 的脚本 #########################"
  # 下载my_scripts_list中的每个js文件，重命名增加前缀"作者昵称_"，增加后缀".new"
  eval scripts_list=\$my_scripts_list_${index}
  eval url_list=\$scripts_base_url_${index}
  for js in $scripts_list
  do
    eval url=$url_list$js
    eval name=$author"_"$js
    echo $name
    wget -q --no-check-certificate $url -O $name.new

    # 如果上一步下载没问题，才去掉后缀".new"，如果上一步下载有问题，就保留之前正常下载的版本
    if [ $? -eq 0 ]; then
      mv -f $name.new $name
      echo -e "$name 更新成功!!!"
	  croname=`echo "$name"|awk -F\. '{print $1}'`
	  script_date=`cat  $name|grep "http"|awk '{if($1~/^[0-59]/) print $1,$2,$3,$4,$5}'|sort |uniq|head -n 1`
	  [ -z "${script_date}" ] && script_date=`cat  $name|grep -Eo "([0-9]+|\*) ([0-9]+|\*) ([0-9]+|\*) ([0-9]+|\*) ([0-9]+|\*)"|sort |uniq|head -n 1`
	  if [ -z "${script_date}" ]; then
	    cron_min=$(rand 1 59)
	    cron_hour=$(rand 7 9)
      [ $(grep -c "$croname" ${ConfigDir}/crontab.list) -eq 0 ] && sed -i "/hangup/a${cron_min} ${cron_hour} * * * bash jd $croname"  ${ConfigDir}/crontab.list
	  else
	    check_existing_cron=`grep -c "$croname" ${ConfigDir}/crontab.list`
	    echo $name "开始添加定时..."
	    if [ "${check_existing_cron}" -eq 0 ]; then
	      sed -i "/hangup/a${script_date} bash /data/data/com.termux/files/home/storage/shared/jd/jd.sh $croname"  ${ConfigDir}/crontab.list
	      echo -e "$name 成功添加定时!!!\n"
	    else
	      if [ "${Enablerenew}" = "true" ]; then
	      	echo -e "检测到"$name"定时已存在开始替换...\n"
	        grep -v "$croname" ${ConfigDir}/crontab.list > output.txt
		      mv -f output.txt ${ConfigDir}/crontab.list
		      sed -i "/hangup/a${script_date} bash jd $croname"  ${ConfigDir}/crontab.list
	        echo -e "替换"$name"定时成功!!!"
	      else
	        echo -e "$name 存在定时,已选择不替换...\n"
	      fi
	    fi
	  fi
    else
      [ -f $name.new ] && rm -f $name.new
      echo -e "$name 脚本失效,已删除脚本...\n"
      croname=`echo "$name"|awk -F\. '{print $1}'`
      check_existing_cron=`grep -c "$croname" ${ConfigDir}/crontab.list`
      if [ "${check_existing_cron}" -ne 0 ]; then
        grep -v "$croname" ${ConfigDir}/crontab.list > output.txt
        mv -f output.txt ${ConfigDir}/crontab.list
        echo -e "检测到"$name"残留文件..."
        rm -f ${name:-default}
        echo -e "开始清理"$name"残留文件..."
        cd $LogDir
        rm -rf ${croname:-default}
        echo -e "清理"$name"残留文件完成!!!\n"
        cd $ScriptsDir
      fi
    fi
  done
  index=$[$index+1]
done


############################## 更新diy.sh ##############################
cd $ConfigDir
echo -e "开始更新 diy.sh "
wget -q --no-check-certificate https://ghproxy.com/https://raw.githubusercontent.com/wudongdefeng/jd-temporary/main/diy.sh -O diy.sh.new
if [ $? -eq 0 ]; then
  mv -f diy.sh.new diy.sh
  echo -e "更新 diy.sh 成功!!!"
else
  rm -rf diy.sh.new
  echo -e "更新 diy.sh 失败...\n"
fi
