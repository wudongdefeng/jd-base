#!/usr/bin/env bash
ShellDir=${JD_DIR:-$(cd $(dirname $0); pwd)}
[[ ${JD_DIR} ]] && ShellJd=jd || ShellJd=${ShellDir}/jd.sh
LogDir=${ShellDir}/log
[ ! -d ${LogDir} ] && mkdir -p ${LogDir}
ScriptsDir=${ShellDir}/scripts3

## 克隆scripts
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