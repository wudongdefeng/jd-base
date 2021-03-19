#!/usr/bin/env bash

## 文件路径、脚本网址、文件版本以及各种环境的判断
ShellDir=${JD_DIR:-$(cd $(dirname $0); pwd)}
[[ ${JD_DIR} ]] && ShellJd=jd || ShellJd=${ShellDir}/jd.sh
LogDir=${ShellDir}/log
[ ! -d ${LogDir} ] && mkdir -p ${LogDir}
ScriptsDir=${ShellDir}/scripts3
ConfigDir=${ShellDir}/config
FileConf=${ConfigDir}/config.sh
FileDiy=${ConfigDir}/diy.sh
FileConfSample=${ShellDir}/sample/config.sh.sample
ListCron=${ConfigDir}/crontab.list
ListCronLxk=${ScriptsDir}/docker/crontab_list.sh
ListTask=${LogDir}/task.list
ListJs=${LogDir}/js.list
ListJsAdd=${LogDir}/js-add.list
ListJsDrop=${LogDir}/js-drop.list
ContentVersion=${ShellDir}/version
ContentNewTask=${ShellDir}/new_task
ContentDropTask=${ShellDir}/drop_task
SendCount=${ShellDir}/send_count
isTermux=${ANDROID_RUNTIME_ROOT}${ANDROID_ROOT}
ScriptsURL=https://github.com.cnpmjs.org/i-chenzhe/qx
ShellURL=https://github.com/wudongdefeng/jd-base


## 克隆scripts3
function Git_CloneScripts {
  git clone -b main ${ScriptsURL} ${ScriptsDir}
  ExitStatusScripts=$?
  echo
}

## 更新scripts3
function Git_PullScripts {
  cd ${ScriptsDir}
  git fetch --all
  ExitStatusScripts=$?
  git reset --hard origin/main
  echo
}