#!/usr/bin/env bash
 
## 导入通用变量与函数
dir_shell=/ql/shell
. $dir_shell/share.sh
 
env_name=(
  FRUITSHARECODES
  PETSHARECODES
  PLANT_BEAN_SHARECODES
  DREAM_FACTORY_SHARE_CODES
  DDFACTORY_SHARECODES
  JDZZ_SHARECODES  
  JD_CASH_SHARECODES
  JDSGMH_SHARECODES
  JDCFD_SHARECODES
  JDHEALTH_SHARECODES
)
var_name=(
  ForOtherFruit
  ForOtherPet
  ForOtherBean
  ForOtherDreamFactory
  ForOtherJdFactory
  ForOtherJdzz  
  ForOtherCash
  ForOtherSgmh
  ForOtherCfd
  ForOtherHealth
)
 
name_js=(
  wudongdefeng_tem-update_jd_fruit_Mod.js
  wudongdefeng_tem-update_jd_hello_wind_pet
  wudongdefeng_tem-update_jd_zero_wind_plantBean
  wudongdefeng_tem-update_jd_dreamFactory
  wudongdefeng_tem-update_jd_jdfactory
  wudongdefeng_tem-update_jd_faker_wind_jdzz
  wudongdefeng_tem-update_jd_bookshop
  wudongdefeng_tem-update_jd_wind_cash_Mod_Panda
  wudongdefeng_tem-update_jd_faker_wind_sgmh
  wudongdefeng_tem-update_jd_cfd
  wudongdefeng_tem-update_jd_faker_wind_health
)
 
name_config=(
  Fruit
  Pet
  Bean
  DreamFactory
  JdFactory
  Jdzz
  BookShop
  Cash
  Sgmh
  Cfd
  Health
)
 
name_chinese=(
  东东农场
  东东萌宠
  京东种豆得豆
  京喜工厂
  东东工厂
  京东赚赚
  口袋书店
  签到领现金
  闪购盲盒
  京喜财富岛
  东东健康社区
)
 
gen_pt_pin_array() {
  local envs=$(eval echo "\$JD_COOKIE")
  local array=($(echo $envs | sed 's/&/ /g'))
  user_sum="${#array[*]}"
  local tmp1 tmp2 i pt_pin_temp
  for i in "${!array[@]}"; do
    pt_pin_temp=$(echo ${array[i]} | perl -pe "{s|.*pt_pin=([^; ]+)(?=;?).*|\1|; s|%|\\\x|g}")
    [[ $pt_pin_temp == *\\x* ]] && pt_pin[i]=$(printf $pt_pin_temp) || pt_pin[i]=$pt_pin_temp
  done
}
 
export_codes_sub() {
    local task_name=$1
    local config_name=$2
    local chinese_name=$3
    local config_name_my=My$config_name
    local config_name_for_other=ForOther$config_name
    local i j k m n pt_pin_in_log code tmp_grep tmp_my_code tmp_for_other user_num random_num_list
    if cd $dir_log/$task_name &>/dev/null && [[ $(ls) ]]; then
        ## 寻找所有互助码以及对应的pt_pin
        i=0
        pt_pin_in_log=()
        code=()
        pt_pin_and_code=$(ls -r *.log | xargs awk -v var="的$chinese_name好友互助码" 'BEGIN{FS="[（ ）】]+"; OFS="&"} $3~var {print $2,$4}')
        for line in $pt_pin_and_code; do
            pt_pin_in_log[i]=$(echo $line | awk -F "&" '{print $1}')
            code[i]=$(echo $line | awk -F "&" '{print $2}')
            let i++
        done
 
        ## 输出My系列变量
        if [[ ${#code[*]} -gt 0 ]]; then
            for ((m = 0; m < ${#pt_pin[*]}; m++)); do
                tmp_my_code=""
                j=$((m + 1))
                for ((n = 0; n < ${#code[*]}; n++)); do
                    if [[ ${pt_pin[m]} == ${pt_pin_in_log[n]} ]]; then
                        tmp_my_code=${code[n]}
                        break
                    fi
                done
                echo "$config_name_my$j='$tmp_my_code'"
            done
        else
            echo "## 从日志中未找到任何互助码"
        fi
 
        ## 输出ForOther系列变量
        if [[ ${#code[*]} -gt 0 ]]; then
            echo
            case $HelpType in
            0) ## 全部一致
                tmp_for_other=""
                for ((m = 0; m < ${#pt_pin[*]}; m++)); do
                    j=$((m + 1))
                    tmp_for_other="$tmp_for_other@\${$config_name_my$j}"
                done
                echo "${config_name_for_other}1=\"$tmp_for_other\"" | perl -pe "s|($config_name_for_other\d+=\")@|\1|"
                for ((m = 1; m < ${#pt_pin[*]}; m++)); do
                    j=$((m + 1))
                    echo "$config_name_for_other$j=\"\${${config_name_for_other}1}\""
                done
                ;;
 
            1) ## 均等助力
                for ((m = 0; m < ${#pt_pin[*]}; m++)); do
                    tmp_for_other=""
                    j=$((m + 1))
                    for ((n = $m; n < $(($user_sum + $m)); n++)); do
                        [[ $m -eq $n ]] && continue
                        if [[ $((n + 1)) -le $user_sum ]]; then
                            k=$((n + 1))
                        else
                            k=$((n + 1 - $user_sum))
                        fi
                        tmp_for_other="$tmp_for_other@\${$config_name_my$k}"
                    done
                    echo "$config_name_for_other$j=\"$tmp_for_other\"" | perl -pe "s|($config_name_for_other\d+=\")@|\1|"
                done
                ;;
 
            2) ## 本套脚本内账号间随机顺序助力
                for ((m = 0; m < ${#pt_pin[*]}; m++)); do
                    tmp_for_other=""
                    random_num_list=$(seq $user_sum | sort -R)
                    j=$((m + 1))
                    for n in $random_num_list; do
                        [[ $j -eq $n ]] && continue
                        tmp_for_other="$tmp_for_other@\${$config_name_my$n}"
                    done
                    echo "$config_name_for_other$j=\"$tmp_for_other\"" | perl -pe "s|($config_name_for_other\d+=\")@|\1|"
                done
                ;;
 
            *) ## 按编号优先
                for ((m = 0; m < ${#pt_pin[*]}; m++)); do
                    tmp_for_other=""
                    j=$((m + 1))
                    for ((n = 0; n < ${#pt_pin[*]}; n++)); do
                        [[ $m -eq $n ]] && continue
                        k=$((n + 1))
                        tmp_for_other="$tmp_for_other@\${$config_name_my$k}"
                    done
                    echo "$config_name_for_other$j=\"$tmp_for_other\"" | perl -pe "s|($config_name_for_other\d+=\")@|\1|"
                done
                ;;
            esac
        fi
    else
        echo "## 未运行过 $task_name.js 脚本，未产生日志"
    fi
}
 
export_all_codes() {
    gen_pt_pin_array
    echo -e "\n# 从日志提取互助码，如果为空就是所有日志中都没有。\n"
    echo -n "# 你选择的互助码模板为："
    case $HelpType in
    0)
        echo "所有账号助力码全部一致。"
        ;;
    1)
        echo "所有账号机会均等助力。"
        ;;
    2)
        echo "本套脚本内账号间随机顺序助力。"
        ;;
    *)
        echo "按账号编号优先。"
        ;;
    esac
    for ((i = 0; i < ${#name_js[*]}; i++)); do
        echo -e "\n## ${name_chinese[i]}："
        export_codes_sub "${name_js[i]}" "${name_config[i]}" "${name_chinese[i]}"
    done
}
 
export_all_codes | perl -pe "{s|京东种豆|种豆|; s|crazyJoy任务|疯狂的JOY|}"
 
combine_sub() {
    local what_combine=$1
    local combined_all=""
    local tmp1 tmp2
    local envs=$(eval echo "\$JD_COOKIE")
    local array=($(echo $envs | sed 's/&/ /g'))
    local user_sum=${#array[*]}
    for ((i = 1; i <= $user_sum; i++)); do
        local tmp1=$what_combine$i
        local tmp2=${!tmp1}
        combined_all="$combined_all&$tmp2"
    done
    echo $combined_all | perl -pe "{s|^&||; s|^@+||; s|&@|&|g; s|@+&|&|g; s|@+|@|g; s|@+$||}"
}
 
## 正常依次运行时，组合所有账号的Cookie与互助码
combine_all() {
    echo -e "\n## 互助变量："
    for ((i = 0; i < ${#env_name[*]}; i++)); do
        result=$(combine_sub ${var_name[i]})
        if [[ $result ]]; then
            echo "export ${env_name[i]}=\"$result\""
        fi
    done
}
 
if [[ $(ls $dir_code) ]]; then
    latest_log=$(ls -r $dir_code | head -1)
    . $dir_code/$latest_log
    combine_all
fi
