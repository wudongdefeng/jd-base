#!/usr/bin/env bash

## Author: Evine Deng
## Source: https://gitee.com/wudongdefeng/jd-base
## Modified： 2021-08-01
## Version： v4.1.4

## 路径
ShellDir=${JD_DIR:-$(cd $(dirname $0); pwd)}
[ ${JD_DIR} ] && HelpJd=jd || HelpJd=jd.sh
ScriptsDir=${ShellDir}/scripts
ConfigDir=${ShellDir}/config
FileConf=${ConfigDir}/config.sh
FileConfSample=${ShellDir}/sample/config.sh.sample
LogDir=${ShellDir}/log
ListScripts=($(cd ${ScriptsDir}; ls *.js | grep -E "j[drx]_"))
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
  export JXNC_SHARECODES=$(Combin_Sub ForOtherJxnc '{"smp":"da6762718787c913e5285470772b3b09","active":"jdnc_1_3yuanyoutao210616_2","joinnum":3}'@'{"smp":"236c07b9af98f718aa64a712e9c057f7","active":"jdnc_1_3yuanyoutao210616_2","joinnum":3}'@'{"smp":"1e51775af56a39a17086a73469e7b093","active":"jdnc_1_3yuanyoutao210616_2","joinnum":3}')
  export JDHEALTH_SHARECODES=$(Combin_Sub ForOtherHealth "T019_qwtFEtHolbeIRv3lP8CjVfnoaW5kRrbA@T0225KkcR09Lo1TVIhullfVedwCjVfnoaW5kRrbA")
  export BOOKSHOP_SHARECODES=$(Combin_Sub ForOtherBookShop "05d692a781834dc6815b90d440059d09@93c846eef3e8439ab0a655bc4c9b21e1@3113559ee4aa44469645507954dae9b4")
  export JD818_SHARECODES=$(Combin_Sub ForOther818PHONE)
  export CITY_SHARECODES=$(Combin_Sub ForOtherCity "XNS7nLn6Fgiqf4KZF9x_mlpC9xjVzAK_IUu2RrX6TF7AqQI@RtGKz732FwqhfILLFtZn1bWu3jJRk8VejV-Up_XHO3niqEZ0Dw@RtGKr57FKEDRHd_pbIJJmo8Y6alAS1HdJXzTgji8RfSudaw7@RtGKgI71IlXjB-rgQpVkmoxs6VRSIG80QyiYRSV_4MAdghSh")
  export JD_CASH_SHARECODES=$(Combin_Sub ForOtherCash "Y0ppOLnsMf4v8G_Wy3s@eU9Ya73gMPwk82-EynFH1Q@eU9YC57TD7ZUkjKmsCVp")
  export JD_CITY_HELPSHARE="false"  
  export jd_zdjr_activityUrl="https://lzkjdz-isv.isvjcloud.com"
  export jd_zdjr_activityId="1c0fdb5afd304204887422f20e53cd14"
  export RUSH_LZCLIENT="95a036d4a5d64af8aa25bce946ae8aec@3e1be624560a4ac195dda0a45485d517@5409c2b9f6db4591964b712a5ecde939@6169e46916784333b31872a001549ce3@3a541178cda644849987889842892ddf@bdacfcba95964d04b3e1cf0cb0e186dd@95296c37ca8e4d5ea5bc54d561c1b118@60d5d203147e47f1b7e6e31bf3d4f64e@7ba6e649d11c4da7a1b4ba78892f6c39@e169d5f957694a5198b2609d93d0cd21@685a7a9bea814a36969501470250c35b@540ddf14f8144f54b14735e84d5b5794@52c69e6825984fd98fc849404422a251@6f4b07f7a48343e38e3866257f99983f@3951a6101a8d4c2b91fe0588f3b90d4d@8e0c9ae62f214d4e893c1edefdd39831@22f12d38c1e74baaa536fc7caa8536d4@0bf802edba204ff88fa941a92494237b@021167e2993d4785adf3d3a8cbcd92a9@1900f76d7d37467ca2eaf17992e67e57@cee3b7b8f3f0456a84a7341eb245c63f@6a9f3d3fe1734665993ca7be444013ae@7b093c347b894731abda124b1bba690e@99ba887559804bef9130b988abbf9437@dd977c155d3942caad4dcddf74f7cd26@5d200f87a36546ba950281555c21e53b@8edf9c234674436e80238244af539bc4@683495ffe50e4bf783f590058dd57d58@6ddc3889cd0e4bc798e06cf86b8c4db9@beb103015b694349bcc4f74fa4f93f12@ed4131ffb1ed4853acd8064b60f77378@c16602512f8c4c70a4ab5728df52e7d5@d04d9c9dab664f32846fdf3a47e237e8@7c1604681f9c4c48af710c7e58dc89e3@7371d90caf964a46a3de05ce692a828c@7fd45a42256c4447ab0c5c85d848cf32@c22f4dd40946446d96fb8a935c40a2ae@1749940c7e674648817de6927b6f76eb@5676445d266742d1988b381e04e69b1f@cf77b88dd69846dfa2bcb5f69132fcd7@47edff69a42143afa2921be8e323a53c@763c8182470f483eb3990f19391d99fb@38c38ef55c4e4dab9af30fb888e07a8f@a9346fd228d7441199efbe12b8d1fc17@05d0b09edb2447f99df985b2ed5da6cb@cddba69152894bc586daadaa1c76da49@e257ed5ec9024633944a9b2a17c0d7d0@29993fba05d9481d8da8572202ba9b4c@2c6fd0cc08f24a968c939d8ec86bf6cd@678d692e1ea143b89dd042fbde199179@9a6cef536f2b4aca81e408ee4b45a99f@e83b82b7701146119053dc321492a239@2dff07d9845e4055897049aa11b55d00@26e0f35a564a47d2aeccaa3b1abf64d3@72a13ace86b1499b8bf17831cd151539@365379d2daab4a26a62e69bddccc2688@572e968964b94f388cee57e8438b2213@f71f790dca0e471dac4d52d42c668d2d@1b4159ed1e9640699017e86838615407@95f8ff19a6d64e4aaf790dbb2833e109@23068145aa2d496a90d61a72ef42b386@186a059e6ba74a11a1421ccb06a89d95@ffb4403800e44cfb8a1e52bdda58aa3e@2344971a8957480fa2af6fe5c5b4115d@5407fc0a3c9c4e8d8a0fdb6f8779098a@709f2f6fb71f4b7d9894347668c3018f@0669df56cfd64da08822aa25279e4c65@187bad0fa5124ed6a2ce6e08a43e4f03@78061db5fa9f46eda7f346266d50f1fd@83756dd037514790926694bcc731a8f9@854819c3fcf14d1c85241eca509b085f@d77c4a24865b4617be5b1d38f3297241@a6db8c4763114329b46a34ecf67402d5@c9416df7a9ee45bf980c42607aca1fe0@eba9a226726e45e9b0443d172a6fe42d@f016576357ed419eac21aa69fdc38dbb@699aa4c8cd1b41cd9d9b54d591862bb9@6efdd0d7f67c4bf48b3ba2d2711a661a@c4fbc428f5fb4533968e0574ca5be294@9198140b216343d29f739c161ab98461@00289aef303b4a8792152d8408f8d089@e9d0fcad02004cc1a48919f3b019dcb7@4de739cf07804af0be1c5420a5aea6e7@282906d6789e49a09068799bfb50a9d4@87f74ace4b2d42c5bb99fe0ce2be8c77@8f6d8c4c57214dd8be81e7676683276c@8b1d7eb6e9f84e23bb75bc348ca06c05@79d4df50165c49d79526571dc68cd048@1653cbfc99834c05974f55bac1115a4b@568da9fd3b694556bed6129494f061f9@97e13975d303414a9b206c09e0b126ac@3a5d0d24cc1b4a2f8fa28b4ee84d88bf@80fceed7a970414482a8240025871c39@0339f90773524364bf63e9c55fbeb469@fc34aeb0b1974b47b55c7972eaaaaff3@58b35633322046ab9751abfff8fcd477@aac8e875e7b249cfbdc89a94ee436672@75a2e1a4041e40f4b1a4d3dbebd75bf0@8fcaf447b44745baa0c4a8e4e511965d@274669ab3b514ba0a72567565c89043b@e738cfad8d2e4244b504fcd82fdc42c9@7024ef78b7d74f579645d9f74ee54c40@ad48ad3902164c7c920d42b00101fcb9@9d68e15fc5504d2fa13d42a57f9400c5@6c27e02adba24fee8198e08223abb43f@edcda7f2db0641449b0cc721d6a966a6@166c4360ff084dcf8b745eca0fba2350@378bb02797cb43dbbd225f6149cee42f@f182d87db82b4ee786e8549306fd536c@c6c7f5c3c5d449e0b7f14f0d442f6d78@fd1847bff86142099ac50b27efe5f0be@71dfe880f924463da62fca2f12a4404a@18d93071150c49b7814f689e0c294f70@7dac0e36cee3404d83712529e415093b@4e19f178cfa0440b9a6cbb5904191c25@b5df7d1e569f4c8e9ec50b0e7b704041@8a322fee3f5f43f7b7371250512a39a4@0594411b4d494f8ea87997c2f9aca63b@d3182fa5c2d043fbbf0f6bb1ddb30801@262d5bfd553e445db23b5ba187c5a9f4@f56041f707864ec5bccd47f9ce6b1c79@95075236ea5b48809f5ee5714357e002@c86b695bf1cc4f23a5d10b877a8c9e66@2c9d2f8e390f4daf9ddfb7b334748d46@d2c1219320ac4e47baa174b1cb2c9cc3@e9141aca4d414779a25ea5d33e2bf8a2@823d62d5423a437a9800b6bea5c9c2ca@0bd8a7289a854087a345fb0ff105ade0@6a960b3684a2441ca50e55223507a860@bbaa3a5c5c8d4225a4127110e596313c@d11163cf367c42cea5390ba7b0212cd4@87017c2dca7148a1be64257a79a2d9f9@90fb9887bbe644aabbe27d8de841a22f@e41b26532b8f4833a55df00c03e0f9d5@061707c1ba0d4bc1a185aa9e75d3d810@4709cd3b2f504658b11087c6823efb37@48fb2f10a1504347b11a51c9d547025f@e47ef306493b49dd9a7cbac3e3b86ade@3759216838a54078806baecae257683b@c8530ed0ba734eba9467fb8eca7077f3@c5a7bda439354ce39f815dfbf1b4e5b8@c067594aeee041818a094403b0a62b60@43a2826534f3428bbe87d91de5852322@fa6a0c1efddc4715ba297036bf2d20e2@cecbbffa0bbd4472ae6cd28af200faba@a7c342d7a67b4a3cab0de22406dc2f32@ddb559e1ad5d45ff883893c17ecc60ce@55e16abe4c644e7092a58a5770ab97a3@627fae9c98e4465685d03b1e9e0c0694@c372abead98a4b71a5eee9ca971a9949@f4a5909258e64f3a8553d723395a48f3@01ed89128613469586b1987304d3bb17@394dba7c2b3f4142af75ae7217eeb214@fca18d9087ed42d18f6bc68c593ca109@09a666ea0de54731a9d161463b0d2968@40372846655c42c7948523941e9e2223@f5508b66ef9c4d1987ff5eafe093821a@2f3c55901805489ab47b7cb657ce7a7f@5ede0e6049544817a2ef9463f1de1da7@a7d94be098c0431ba2761a1a0a09487a@c8fb05044d6d497eb668c3060c49a2e4@e5917ef9679a4bfbb4e8ee7590084262@084375be31074a81b3d45bf6552f9c3f@dd92842eec6b4f24b93f58fe0edaccb0@1c7693f45bea45e8bd3a678afa318232@cc38b884eed94b299b93c1250437b14a@a4896f81f3914cb880578e26e51f88fa@a0ffbc5eaf2142f895906c85f071e60f@3182b10e7a554dba83e6eb62902625a9@034f5e9e3c7847f6a08ef37aed88fc3d@6f387544869048c297d31953ef218189@0caad4445f1f4ec89bb5f3ca1c40e76c@41b719e536674fad931c9293fc134b1b@b4a01e9066fd4b95bc0c60a526f61c75@2ba9f8db763842b990f220a0875c989d@6391f9261f884a12ab6bf320673165bc@e6ce1ca2d80f4924ab168bf21791726a@eeff77200c264e50956c788b95264b05@5b8f3664bb8a45d4b382e34fbe786f6a@d2c7271d878b4f659628007ef852fce0@23182e7f574a4363b983b593c0dc2642@6ad57bfeffd14eec9188bb9b03bd4050@6ddaf2876d72486a8176e7745ca5afe8@5ef69e786f79470dabbc49b2d5f0523a@c509c06ef0ee4f7bb90fe7d07892ab47@6b554980de5f4576a0c989699dbb6bbe@136e61b05fd042d0b39f5ed7d00248d0@3029f9e9faf8440e825a1237a5c68172@6e824cc2e5134b91b5233346d566d066@42a7dc943c01482ea773e3f09ef89a8b@49ea36dbb6b44f8b9ea9726d94dbb617@f1e322b121b740c0ab658cc584f135b0@b1464f8cd0c44b1ea895887bb11d94a2@e40d66cd0ac94835a580f876a7d83fd1@2cdcfb454bdc435cb1f8e4f0e9a53c2e@ec054f9636f54d70a2926e592fdfe6e3@bdecf2138bb9427a9a21e7629ecc4232@cd884a9541e3417bb77e4cde02ad7906@6c060742c1904ff1af0053818f50af3d@b98c560cec2545dba271ad2fdacc6ac9@2091af4a778d4140ab948354f1282a43@eb91c109b0a54ecfae7f7d4a68140799@33951aa85e374e3fbce656b767137b46@ecf679fd851443a88763ea8aed7fc0b8@321d4e2d9c9a4765852280f52e45b5a1@1367f751ec5b40fabc74d29feb766f16@43533adf68e844d4923a7753a56d2f9b@4c75ce06b6414da2825ab467a0840683@ad0cd9a80dfe49368eedc31b1d19cc67@32c5e20b0ea145ca959d320c8e30e33d@20e7afd9326a4cb18fc4e56ce4991bc6@19c8c557a42242939024f15c4e514498@a28b58fd1d5f4bb48d467db602579809@4954a64047ab49fa8b8d5607ed4fc292@93d7cd84f8ed433994ee6e7adbd08983@1ea5ce9afdd645f29682824a52599e8d@8a64c2ceb55546a0baaeaab04f434f45@c1bac2416ad64ca984158e9740a0edc0@599823de50b64a7d822b4401e107b1b0@9ff7dad808a2488c8f2b4a6f98080be5@f4393f6f5efe42f38798f57b85b4c2bd@9cf1a7bbdd6d4a67bce2b16166e05a48@6a52f75bb96c41f7ac979ef5cc41ced7@f3ad71df9c034f2ba7372a496f55fb42@41c110be1ec645768ec8800419c2df27@09ae40074f9b4c378a1f8d2a51cef279@a45d28df24b14c7189df274596e5fb92@bbdd6c28c9b440e390653be4a16d1db0@f0ae73aca3ab4e49b81ca1f4b371bc48@4c7d52a8bc58407baf34e78dd562ff5f@29eb7c7d45ce41edb37bb4872c5b1817@147a9e5762d24f79a5d2779db56b79dd@1f55a47cf2a744fb9609ee147cb5c701@1de347bdc3e445ceb20258d9646ee70f@c79447263de24413b0576a6dae5e112e@b09c109bba114bbfa853c72179d34474@529e9988cf754a459508920511fa8927@80c648f06bec4969a3d7d64f40d23969@8b7c254b67b14df49c658636d6664bc9@65e31a4fb56f471f8cf84570f86b1477@c91b3bd90ee5482f9ee540939c3c42bc@c8e58e1b1c594ae98d8baec5e1235063@8c8fa8048db04cfab0fed02f57f20c17@7df4a950b8ce47c9a47975fea79fb554@c69b062803854751b8b208975b6405e7@8aacc31c039e43ebbc78a52e525287f9@844604f8a7f940ee80a12f7daa1f80ad@f51b5e93f8914bb8922c98582143a431@334cbd232ffd4d0a989216fed3d90e46@a39eca744f604aeea030d4b3fc022f11@271a7b6606d44e688284fc25e42103d9@1e30f7176fff41e39ab754e01bdcb8e0@fadd7832312541d28ca2439566acda5e@531f465727e74b5292ab7e4b84c4b810@905ff9e4b4ed4b9db2f98b7238f7714d@d3ee56fa66964eceab2cc226873f8d48@66f87d0f04f04138a6e64425852e70cd@223af331a66a4408a959a04145355cc6@4dd6ddbe97d04abea16bec783a245181@620b41d78ce245d4ac8b567fa663ef72@113d74615f36447985faae81258fa824@f403d7ae443048f9bffa8d85e4a2ad0a@feb560aee629495da986cea82a6391b9@407a12b58be9461fa296b68dd313006f@0964ecf802fa4578a46b35ac9273e158@b09c1c257b204a98bf9e29c5c1b5d164"
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
    nohup node ${js}.js > ${LogFile} &
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
  HangUpJs="jd_Aaron_wind_cfd_loop"
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
  
  FileNameTmp1=$(echo $1 | perl -pe "s|\.js||")
  FileNameTmp2=$(echo $1 | perl -pe "{s|jd_||; s|\.js||; s|^|jd_|}")
  SeekDir="${ScriptsDir} ${ScriptsDir}/backUp ${ConfigDir}{ScriptsDir}/scripts3"
  FileName=""
  WhichDir=""

  for dir in ${SeekDir}
  do
    if [ -f ${dir}/${FileNameTmp1}.js ]; then
      FileName=${FileNameTmp1}
      WhichDir=${dir}
      break
    elif [ -f ${dir}/${FileNameTmp2}.js ]; then
      FileName=${FileNameTmp2}
      WhichDir=${dir}
      break
    fi
  done
  
  if [ -n "${FileName}" ] && [ -n "${WhichDir}" ]
  then
    [ $# -eq 1 ] && Random_Delay
    LogTime=$(date "+%Y-%m-%d-%H-%M-%S")
    LogFile="${LogDir}/${FileName}/${LogTime}.log"
    [ ! -d ${LogDir}/${FileName} ] && mkdir -p ${LogDir}/${FileName}
    cd ${WhichDir}
    node ${FileName}.js | tee ${LogFile}
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
