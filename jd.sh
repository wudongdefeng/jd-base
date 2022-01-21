#!/usr/bin/env bash

## Author: Evine Deng
## Source: https://github.com/EvineDeng/jd-base
## Modified： 2021-05-24
## Version： v4.1.3

## 路径
ShellDir=${JD_DIR:-$(cd $(dirname $0); pwd)}
[ ${JD_DIR} ] && HelpJd=jd || HelpJd=jd.sh
ScriptsDir=${ShellDir}/scripts
ConfigDir=${ShellDir}/config
FileConf=${ConfigDir}/config.sh
FileConfSample=${ShellDir}/sample/config.sh.sample
LogDir=${ShellDir}/log
##ListScripts=($(cd ${ScriptsDir}; ls *.js | grep -E "j[drx]_"))
ListScripts=($(cd ${ScriptsDir}; ls *.js))
ListCron=${ConfigDir}/crontab.list

## 导入config.sh
function Import_Conf {
  if [ -f ${FileConf} ]
  then
    . ${FileConf}
    if [ -z "${Cookie1}" ]; then
      echo -e "请先在config.sh中配置好Cookie...\n"
      exit 1
    fi
  else
    echo -e "配置文件 ${FileConf} 不存在，请先按教程配置好该文件...\n"
    exit 1
  fi
}

## 更新crontab
function Detect_Cron {
  if [[ $(cat ${ListCron}) != $(crontab -l) ]]; then
    crontab ${ListCron}
  fi
}

## 用户数量UserSum
function Count_UserSum {
  for ((i=1; i<=1000; i++)); do
    Tmp=Cookie$i
    CookieTmp=${!Tmp}
    [[ ${CookieTmp} ]] && UserSum=$i || break
  done
}

## 组合Cookie和互助码子程序
function Combin_Sub {
  CombinAll=""
  for ((i=1; i<=${UserSum}; i++)); do
    for num in ${TempBlockCookie}; do
      if [[ $i -eq $num ]]; then
        continue 2
      fi
    done
    Tmp1=$1$i
    Tmp2=${!Tmp1}
    case $# in
      1)
        CombinAll="${CombinAll}&${Tmp2}"
        ;;
      2)
        CombinAll="${CombinAll}&${Tmp2}@$2"
        ;;
      3)
        if [ $(($i % 2)) -eq 1 ]; then
          CombinAll="${CombinAll}&${Tmp2}@$2"
        else
          CombinAll="${CombinAll}&${Tmp2}@$3"
        fi
        ;;
      4)
        case $(($i % 3)) in
          1)
            CombinAll="${CombinAll}&${Tmp2}@$2"
            ;;
          2)
            CombinAll="${CombinAll}&${Tmp2}@$3"
            ;;
          0)
            CombinAll="${CombinAll}&${Tmp2}@$4"
            ;;
        esac
        ;;
    esac
  done
  echo ${CombinAll} | perl -pe "{s|^&||; s|^@+||; s|&@|&|g; s|@+|@|g}"
}

## 组合Cookie、Token与互助码，用户自己的放在前面，我的放在后面
function Combin_All {
  export JD_COOKIE=$(Combin_Sub Cookie)
  export JXNCTOKENS=$(Combin_Sub TokenJxnc)
  export FRUITSHARECODES=$(Combin_Sub ForOtherFruit "64af0fffd7b3478585b2b71b377613ce@9fe344f3887243339369fd1f564ec49e@141be55835d4494fb06b0ac4e895ddef")
  export PETSHARECODES=$(Combin_Sub ForOtherPet "MTAxODc2NTEzMTAwMDAwMDAzMzA1MDU0NQ==@MTE1NDAxNzcwMDAwMDAwMzU5MTg5Nzc=@MTE1NDQ5OTUwMDAwMDAwNDM3Mjk4Njk=")
  export PLANT_BEAN_SHARECODES=$(Combin_Sub ForOtherBean "54i3jbri2l6fomplj6zedpwt4ifexs242jkgaai@4npkonnsy7xi2fqmflib7amovspi4y7hybdrapa@tnmcphpjys5icwjpxfmm3gwodgjirglqb6pnm4q")
  export DREAM_FACTORY_SHARE_CODES=$(Combin_Sub ForOtherDreamFactory "mEnEqVBBCQZ_Jt9dHXXAbQ==@7dAa1KpAimJEKUkwYZ5ovw==@g6XKy-b1PF1JLLRD7enX3w==")
  export DDFACTORY_SHARECODES=$(Combin_Sub ForOtherJdFactory "T019_qwtFEtHolbeIRv3lP8CjVWnYaS5kRrbA@T0225KkcR09Lo1TVIhullfVedwCjVWnYaS5kRrbA@T0205KkcJ2x4nB6lQ0aH76FwCjVWnYaS5kRrbA")
  export JDZZ_SHARECODES=$(Combin_Sub ForOtherJdzz "S_qwtFEtHolbeIRv3lP8@S5KkcR09Lo1TVIhullfVedw@S5KkcJ2x4nB6lQ0aH76Fw")
  export JDJOY_SHARECODES=$(Combin_Sub ForOtherJoy "wWFOrC7_0Js_PzOOsCjhnw==@x0FKqaNRojnvTZGPkGhEIqt9zd5YaBeE@BWpGQBc1unxqf_2Xe-XV1A==")
  export JXNC_SHARECODES=$(Combin_Sub ForOtherJxnc '')
  export JDHEALTH_SHARECODES=$(Combin_Sub ForOtherHealth "T019_qwtFEtHolbeIRv3lP8CjVfnoaW5kRrbA@T0225KkcR09Lo1TVIhullfVedwCjVfnoaW5kRrbA")
  export BOOKSHOP_SHARECODES=$(Combin_Sub ForOtherBookShop "05d692a781834dc6815b90d440059d09@93c846eef3e8439ab0a655bc4c9b21e1@3113559ee4aa44469645507954dae9b4")
  export JD818_SHARECODES=$(Combin_Sub ForOther818PHONE)
  export CITY_SHARECODES=$(Combin_Sub ForOtherCity "4LmlDflSMWZKYhPHStOJu9Uq7qqRWw@-ryUXv1eMGRBYROVS9mR9J6RqP4spall@-ryUPt5tDy4xAE63MY2_u7pkqS-DNoI@-ryUI-x5HxIdAFeRCqWfuxaDubQwlPw")
  export JD_CASH_SHARECODES=$(Combin_Sub ForOtherCash "Y0ppOLnsMf4v8G_Wy3s@eU9Ya73gMPwk82-EynFH1Q@eU9YC57TD7ZUkjKmsCVp")
  export JD_CITY_HELPSHARE="false"  
  export jd_zdjr_activityUrl="https://lzkjdz-isv.isvjcloud.com"
  export jd_zdjr_activityId="9a513a4344a04e3db6e56c51ae72a7c1"
  export jd_mhurlList="https://anmp.jd.com/babelDiy/Zeus/4ZRoEPUncW1xHAUuz2CC7QhqYFSk/index.html"
  export RUSH_LZCLIENT=""
  export RUSH_SHOP_SIGN_LIST=""
  export RUSH_SEVENDAY_LIST=""
  export SHOP_TOKENS="${MyShopToken1}&${MyShopToken2}&${MyShopToken3}&${MyShopToken4}&${MyShopToken5}&${MyShopToken6}&${MyShopToken7}&${MyShopToken8}&${MyShopToken9}"

  export JDGLOBAL_SHARECODES=$(Combin_Sub ForOtherJDGLOBAL)
  if [[ $(date -u "+%H") -eq 12 ]] || [[ $(date -u "+%H") -eq 13 ]]; then
    export JDCFD_SHARECODES=$(Combin_Sub ForOtherJDCFD "26DDC6311C11085111BD817F548B8102D90CFEE44F69BB53E059EC830BC20CDE@EFF086EF2E7582413BDF061FE6F35C660BAF51E2332B8B0ADC8BC7C7FE962364@80DEC19D6ECED69F0A46CDD6E4745C9D09B0AC7744A1A1D05B78E28221ECDDD4")
  else
    export JDNIANPK_SHARECODES=$(Combin_Sub ForOtherNianPk)
  fi
    export JDSGMH_SHARECODES=$(Combin_Sub ForOtherSgmh "T019_qwtFEtHolbeIRv3lP8CjVWmIaW5kRrbA@T0225KkcR09Lo1TVIhullfVedwCjVWmIaW5kRrbA@T0205KkcJ2x4nB6lQ0aH76FwCjVWmIaW5kRrbA")
}

## 转换JD_BEAN_SIGN_STOP_NOTIFY或JD_BEAN_SIGN_NOTIFY_SIMPLE
function Trans_JD_BEAN_SIGN_NOTIFY {
  case ${NotifyBeanSign} in
    0)
      export JD_BEAN_SIGN_STOP_NOTIFY="true"
      ;;
    1)
      export JD_BEAN_SIGN_NOTIFY_SIMPLE="true"
      ;;
  esac
}

## 转换UN_SUBSCRIBES
function Trans_UN_SUBSCRIBES {
  export UN_SUBSCRIBES="${goodPageSize}\n${shopPageSize}\n${jdUnsubscribeStopGoods}\n${jdUnsubscribeStopShop}"
}

## 申明全部变量
function Set_Env {
  Count_UserSum
  Combin_All
  Trans_JD_BEAN_SIGN_NOTIFY
  Trans_UN_SUBSCRIBES
}

## 随机延迟
function Random_Delay {
  if [[ -n ${RandomDelay} ]] && [[ ${RandomDelay} -gt 0 ]]; then
    CurMin=$(date "+%-M")
    if [[ ${CurMin} -gt 2 && ${CurMin} -lt 30 ]] || [[ ${CurMin} -gt 31 && ${CurMin} -lt 59 ]]; then
      CurDelay=$((${RANDOM} % ${RandomDelay} + 1))
      echo -e "\n命令未添加 \"now\"，随机延迟 ${CurDelay} 秒后再执行任务，如需立即终止，请按 CTRL+C...\n"
      sleep ${CurDelay}
    fi
  fi
}

## 使用说明
function Help {
  echo -e "本脚本的用法为："
  echo -e "1. bash ${HelpJd} xxx      # 如果设置了随机延迟并且当时时间不在0-2、30-31、59分内，将随机延迟一定秒数"
  echo -e "2. bash ${HelpJd} xxx now  # 无论是否设置了随机延迟，均立即运行"
  echo -e "3. bash ${HelpJd} hangup   # 重启挂机程序"
  echo -e "4. bash ${HelpJd} resetpwd # 重置控制面板用户名和密码"
  echo -e "\n针对用法1、用法2中的\"xxx\"，无需输入后缀\".js\"，另外，如果前缀是\"jd_\"的话前缀也可以省略。"
  echo -e "当前有以下脚本可以运行（仅列出以jd_、jr_、jx_开头的脚本）："
  cd ${ScriptsDir}
  for ((i=0; i<${#ListScripts[*]}; i++)); do
    Name=$(grep "new Env" ${ListScripts[i]} | awk -F "'|\"" '{print $2}')
    echo -e "$(($i + 1)).${Name}：${ListScripts[i]}"
  done
}

## nohup
function Run_Nohup {
  for js in ${HangUpJs}
  do
    if [[ $(ps -ef | grep "${js}" | grep -v "grep") != "" ]]; then
      ps -ef | grep "${js}" | grep -v "grep" | awk '{print $2}' | xargs kill -9
    fi
  done

  for js in ${HangUpJs}
  do
    [ ! -d ${LogDir}/${js} ] && mkdir -p ${LogDir}/${js}
    LogTime=$(date "+%Y-%m-%d-%H-%M-%S")
    LogFile="${LogDir}/${js}/${LogTime}.log"
    nohup node ${js}.py > ${LogFile} &
  done
}

## pm2
function Run_Pm2 {
  pm2 flush
  for js in ${HangUpJs}
  do
    pm2 restart ${js}.js || pm2 start ${js}.js
  done
}

## 运行挂机脚本
function Run_HangUp {
  Import_Conf $1 && Detect_Cron && Set_Env
  HangUpJs="jd_crazy_joy_coin"
  cd ${ScriptsDir}
  if type pm2 >/dev/null 2>&1; then
    Run_Pm2 2>/dev/null
  else
    Run_Nohup >/dev/null 2>&1
  fi
}

## 重置密码
function Reset_Pwd {
  cp -f ${ShellDir}/sample/auth.json ${ConfigDir}/auth.json
  echo -e "控制面板重置成功，用户名：admin，密码：adminadmin\n"
}

## 运行京东脚本
function Run_Normal {
  Import_Conf $1 && Detect_Cron && Set_Env
  
  FileNameTmp1=$(echo $1 | perl -pe "s|\.py||")
##  FileNameTmp2=$(echo $1 | perl -pe "{s|jd_||; s|\.js||; s|^|jd_|}")
  FileNameTmp2=$(echo $1 | perl -pe "s|\.js||")
  FileNameTmp3=$(echo $1 | perl -pe "s|\.ts||")
  SeekDir="${ScriptsDir} ${ScriptsDir}/backUp ${ShellDir}/HelloWorld ${ShellDir}/PKC"
  FileName=""
  WhichDir=""

  for dir in ${SeekDir}
  do
    if [ -f ${dir}/${FileNameTmp1}.py ]; then
      FileName=${FileNameTmp1}
      WhichDir=${dir}
      break
    elif [ -f ${dir}/${FileNameTmp2}.js ]; then
      FileName=${FileNameTmp2}
      WhichDir=${dir}
      break
    elif [ -f ${dir}/${FileNameTmp3}.ts ]; then
      FileName=${FileNameTmp3}
      WhichDir=${dir}
      break
    fi
  done
  
  if [ -f ${dir}/${FileName}.py ] && [ -n "${WhichDir}" ]
  then
    [ $# -eq 1 ] && Random_Delay
    LogTime=$(date "+%Y-%m-%d-%H-%M-%S")
    LogFile="${LogDir}/${FileName}/${LogTime}.log"
    [ ! -d ${LogDir}/${FileName} ] && mkdir -p ${LogDir}/${FileName}
    cd ${WhichDir}
    python3 ${FileName}.py | tee ${LogFile}
  elif [ -f ${dir}/${FileName}.js ] && [ -n "${WhichDir}" ]
  then
    [ $# -eq 1 ] && Random_Delay
    LogTime=$(date "+%Y-%m-%d-%H-%M-%S")
    LogFile="${LogDir}/${FileName}/${LogTime}.log"
    [ ! -d ${LogDir}/${FileName} ] && mkdir -p ${LogDir}/${FileName}
    cd ${WhichDir}
    node ${FileName}.js | tee ${LogFile}
  elif [ -f ${dir}/${FileName}.ts ] && [ -n "${WhichDir}" ]
  then
    [ $# -eq 1 ] && Random_Delay
    LogTime=$(date "+%Y-%m-%d-%H-%M-%S")
    LogFile="${LogDir}/${FileName}/${LogTime}.log"
    [ ! -d ${LogDir}/${FileName} ] && mkdir -p ${LogDir}/${FileName}
    cd ${WhichDir}
    ts-node ${FileName}.ts | tee ${LogFile}
  else
    echo -e "\n在${ScriptsDir}、${ScriptsDir}/backUp、${ConfigDir}三个目录下均未检测到 $1 脚本的存在，请确认...\n"
    Help
  fi
}

## 命令检测
case $# in
  0)
    echo
    Help
    ;;
  1)
    if [[ $1 == hangup ]]; then
      Run_HangUp
    elif [[ $1 == resetpwd ]]; then
      Reset_Pwd
    else
      Run_Normal $1
    fi
    ;;
  2)
    if [[ $2 == now ]]; then
      Run_Normal $1 $2
    else
      echo -e "\n命令输入错误...\n"
      Help
    fi
    ;;
  *)
    echo -e "\n命令过多...\n"
    Help
    ;;
esac
