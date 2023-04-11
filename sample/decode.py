# 可以修改 if __name__ == "__main__": 中的url用于测试

import re


url_rules = {  # 格式  "变量": "正则表达式"，正则表达式可以去各大在线测试网站慢慢撸
    "/cjhy(dz)?-isv\.isvjcloud\.com\/wxTeam\/activity/": "jd_cjhydz_wxTeam_Id",
    "/lzkj(dz)?-isv\.isvj(clou)?d.com\/wxTeam\/activity/": "jd_lzkjdz_wxTeam_Id",
    "/cjhy(dz)?-isv\.isvjcloud\.com\/microDz\/invite\/activity/": "jd_cjhydz_microDz_Id",
    "/cjhy(dz)?-isv\.isvjcloud\.com\/microDz\/invite\/openLuckBag/": "jd_openLuckBag_Id",
    "/https:\/\/lzkj-isv\.isvj(clou)?d\.com\/wxShopFollowActivity/": "jd_lzkj_wxShopFollowActivity_activityId",
    "https://cjhy-isv.isvjcloud.com/wxShopFollowActivity/activity": "jd_cjhy_wxShopFollowActivity_activityId",
    "https://lzkj-isv.isvjcloud.com/wxCollectionActivity/activity2": "jd_lzkj_wxCollectionActivityId",
    "https://cjhy-isv.isvjcloud.com/wxCollectionActivity/activity": "jd_cjhy_wxCollectionActivityId",
    "/https:\/\/lzkj-isv\.isvj(cloud)?\.com\/lzclient/": "jd_lzkj_wxDrawActivity_Id",
    "https://cjhy-isv.isvjcloud.com/wxDrawActivity/activity/": "jd_cjhy_wxDrawActivity_Id",
    "/lzkj-isv\.isvj(clou)?d\.com\/wxGameActivity/": "jd_lzkj_wxGameActivity_activityId",
    "/lzkj-isv\.isvj(clou)?d.com\/wxgame/": "WXGAME_ACT_ID",
    "https://cjhy-isv.isvjcloud.com/wxGameActivity/activity": "jd_cjhy_wxGameActivity_activityId",
    "https://lzkj-isv.isvjcloud.com/wxKnowledgeActivity/activity": "jd_lzkj_wxKnowledgeActivity_activityId",
    "https://cjhy-isv.isvjcloud.com/wxKnowledgeActivity/activity": "jd_cjhy_wxKnowledgeActivity_activityId",
    "https://txzj-isv.isvjcloud.com/cart_item": "jd_txzj_cart_item_id",
    "https://txzj-isv.isvjcloud.com/collect_item": "jd_txzj_collect_item_id",
    "https://txzj-isv.isvjcloud.com/sign_in": "jd_txzj_sign_in_id",
    "https://txzj-isv.isvjcloud.com/lottery": "jd_txzj_lottery_id",
    "https://cjhy-isv.isvjcloud.com/activity/daily/": "jd_cjhy_daily_ids",
    "https://cjhy-isv.isvjcloud.com/mc/wxMcLevelAndBirthGifts/activity": "jd_cjhy_wxMcLevelAndBirthGifts_ids",
    "/(cjhy|lzkj)-isv\.isvj(clou)?d\.com\/sign/": "jd_sevenDay_activityUrl",
    "/cjhy-isv\.isvjcloud\.com\/sign\/signActivity/": "jd_cjhy_signActivity_ids",
    "/cjhy-isv.isvj(clou)?d.com\/sign\/sevenDay\/signActivity/": "jd_cjhy_sevenDay_ids",
    "/lzkj-isv.isvj(clou)?d.com\/sign\/signActivity/": "jd_lzkj_signActivity2_ids",
    "/lzkj-isv.isvj(clou)?d.com\/sign\/sevenDay/": "jd_lzkj_sevenDay_ids",
    "/lzkj-isv.isvj(clou)?d.com\/wxBuildActivity/": "jd_lzkj_wxBuildActivity_activityId",
    "/lzkj-isv\.isvj(clou)?d.com\/wxShopGift/": "jd_lzkj_wxShopGift_ids",
    "/cjhy-isv\.isvjcloud\.com\/wxShopGift/": "jd_cjhy_wxShopGift_ids",
    "/lorealjdcampaign-rc\.isvjcloud.comapps\/interact\/index\?activityType=10001/": "jd_loreal_interact_ljqdysl_Ids",
    "/interact\/index\?activityType=10006/": "jd_lzkj_interact_yqrhyl_activityId",
    "/interactsaas\/index\?activityType=10024/": "jd_lzkj_interactsaas_jgyl_activityId",
    "/interactsaas\/index\?activityType=10040/": "jd_lzkj_interactsaas_qrqd_Ids",
    "/interactsaas\/index\?activityType=10047/": "jd_lzkj_interactsaas_glyl_Ids",
    "/interactsaas\/index\?activityType=10053/": "jd_lzkj_interactsaas_gzspyl_activityId",
    "/interactsaas\/index\?activityType=10069/": "jd_lzkj_interactsaas_gzyl_activityId",
    "/interactsaas\/index\?activityType=10070/": "jd_lzkj_interactsaas_yqhyrh_activityId",
    "wxCollectionActivity/activity": "jd_wxCollectionActivity_activityUrl",
    "wxDrawActivity|lzclient": "LUCK_DRAW_URL",
    "wxShopFollowActivity": "jd_wxShopFollowActivity_activityUrl",
    "wxKnowledgeActivity": "jd_wxKnowledgeActivity_activityUrl",
    "(lzkj-isv.isvj(clou)?d.com\/wxShopGift)|(cjhy-isv\.isvjcloud\.com\/wxShopGift)": "jd_wxShopGift_activityUrl",
    "https://txzj-isv.isvjcloud.com/cart_item": "jd_cart_item_activityUrl",
    "https://txzj-isv.isvjcloud.com/collect_item": "jd_collect_item_activityUrl",
    "https://txzj-isv.isvjcloud.com/collect_shop": "jd_collect_shop_activityUrl",
    "https://txzj-isv.isvjcloud.com/lottery": "jd_lottery_activityUrl",
    "jinggeng-isv\.isvj(clou)?d\.com\/ql\/front\/showInviteJoin": "jd_showInviteJoin_activityUrl",
}


def check_active(url):
    """
    根据url匹配活动变量
    :param url:
    :return:
    """
    for variable in url_rules:
        print(url_rules[variable])
        res = re.findall(variable, url)
        if len(res) > 0:
            return f'export {url_rules[variable]}="{url}"'
    result = None
    if 'https://cjhydz-isv.isvjcloud.com/wxTeam/activity' in url:
        activityId = url.split('&')[0].split('activityId=')[1]
        result = 'export jd_cjhy_activityId="' + str(
        activityId) + '"\n' + 'export jd_cjhy_activityUrl="https://cjhydz-isv.isvjcloud.com"'
    elif 'https://lzkjdz-isv.isvjcloud.com/wxTeam/activity2' in url:
        activityId = url.split('&')[0].split('activityId=')[1]
        result = 'export jd_zdjr_activityId="' + str(
        activityId) + '"\n' + 'export jd_zdjr_activityUrl="https://lzkjdz-isv.isvjcloud.com"'
    elif 'microDz' in url:
        activityId = url.split('&')[0].split('activityId=')[1]
        result = 'export jd_wdz_activityId="' + str(
        activityId) + '"\n' + 'export jd_wdz_activityUrl="https://cjhydz-isv.isvjcloud.com"'

    return result


def decode(msg_list):
    """
    decode接口，输入为list，输出为list，必须遵循，否则将会报错
    :param msg_list:
    :return:
    """
    try:
        str_in = str(msg_list)  # 提取收到的字符串
        # url提取和处理
        url_list = re.findall(r'http[s]{0,1}?://(?:[#?&\-=\w./]|(?:%[\da-fA-F]+))+', str_in)  # 提取url
        print(url_list)
        if len(url_list) > 0:
            res = check_active(url_list[0])
            if res:
                return [res]

        # 口令提取和处理
        text = re.findall(
            "[㬌京亰倞兢婛景椋猄竞竟競竸綡鲸鶁][一-龥]{8,16}[东倲冻凍埬岽崠崬東栋棟涷菄諌鯟鶇]|[$%￥@！(#!][a-zA-Z0-9]{6,20}[$%￥@！)#!]",
            str_in)
        if len(text):
            from plugins.jiexi import jComExchange   # 加载解析插件的解析接口
            msg = jComExchange(text)
            if 'http' in msg:
                res = check_active(url_list[0])
                if res:
                    return [res]
    except Exception as e:
        print(e)
    return msg_list


if __name__ == "__main__":
    env = 'https://cjhy-isv.isvjcloud.com/mc/wxMcLevelAndBirthGifts/activity?activityId=03e9043bd1014887b6d663bab7001562'
    str_out = decode(env)
    print(str_out)
