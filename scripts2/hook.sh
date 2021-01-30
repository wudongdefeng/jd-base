repo=https://raw.githubusercontent.com/shylocks/Loon/main

# Loon
loon=./loon/shylocks_LoonTask.conf
rm $loon
echo "hostname = api.m.jd.com, wq.jd.com\n" >>$loon

for file in $(ls | grep jd_ $1); do
  test=$(cat $file | grep 'cron.*script-path=.*tag=.*')
  test2=$(cat $file | grep 'http-request.*tag=.*script-path=.*')
  if [ -n "$test" ]; then
    var=$(cat $file | grep -oEi 'new Env(.*)')
    var=${var#*Env\(\'}
    var='# '${var%\'*}
    echo $var >>$loon
    if [ -n "$test2" ]; then
      echo $test2 >>$loon
    fi
    echo $test"\n" >>$loon
  fi
done
git add $loon

# Quantumultx
qx=./quantumultx/shylocks_gallery.json
rm $qx
echo "{" >>$qx
echo '  "name": "shylocks task gallery",' >>$qx
echo '  "description": "https://github.com/shylocks/Loon",' >>$qx
echo '  "task": [' >>$qx

for file in $(ls | grep jd_ $1); do
  task=$(cat $file | grep 'tag=.*img-url=.*,')
  if [ -n "$task" ]; then
    str='    {\n      "config": "'$task'"'
    re=$(cat $file | grep '.*script-request-header.*')
    if [ -n "$re" ]; then
      str=$str','
      echo $str >>$qx
      rm "./quantumultx/${file%.*}.qxrewrite"
      echo $(cat $file | grep 'hostname = .*')"\n" >>"./quantumultx/${file%.*}.qxrewrite"
      echo $re >>"./quantumultx/${file%.*}.qxrewrite"
      git add "./quantumultx/${file%.*}.qxrewrite"
      echo '      "addons": "'$repo'/quantumultx/'${file%.*}'.qxrewrite, tag='${file%.*}'_COOKIE"' >>$qx
    else
      echo $str >>$qx
    fi
    echo '    },' >>$qx
  fi
done
echo '  ]\n}' >>$qx
git add $qx

# Surge
surge=./surge/shylocks_Task.sgmodule.sgmodule
rm $surge
echo "#!name=shylocks iOS Tasks Module" >>$surge
echo "#!desc=iOS Tasks 模块配置" >>$surge
echo '[Script]' >>$surge

for file in $(ls | grep jd_ $1); do
  task=$(cat $file | grep 'type=cron.*wake-system.*,')
  if [ -n "$task" ]; then
    echo $task >>$surge
  fi
done
git add $surge

# docker
docker=./docker/crontab_list.sh
rm $docker
for file in $(ls | grep jd_ $1); do
  task=$(cat $file | grep 'tag=.*img-url=.*,')
  if [ -n "$task" ]; then
    var=$(cat $file | grep -oEi 'new Env(.*)')
    var=${var#*Env\(\'}
    var='# '${var%\'*}
    echo $var >> $docker
    cron=$(cat $file | grep 'cron ".*" s')
    cron=${cron#*cron \"}
    cron=${cron%\"*}
    echo $cron' node /scripts/'${file%.*}'.js >> /scripts/logs/'${file%.*}'.log 2>&1' >> $docker
    echo >> $docker
  fi
done
git add $docker
