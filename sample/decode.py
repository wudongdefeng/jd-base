# 可以修改 if __name__ == "__main__": 中的url用于测试

import re


url_rules = {  # 格式  "变量": "正则表达式"，正则表达式可以去各大在线测试网站慢慢撸
    "wxDrawActivity": "M_WX_LUCK_DRAW_URL",
    "lzclient": "M_WX_LUCK_DRAW_URL",
    "wxCollectionActivity": "M_WX_ADD_CART_URL",
    "wxCollectCard": "M_WX_COLLECT_CARD_URL",
    "wxShareActivity": "jd_fxyl_activityId",
    "wxgame": "WXGAME_ACT_ID",
    "wxSecond": "jd_wxSecond_activityId",
    "wxCartKoi/cartkoi": "jd_wxCartKoi_activityId",
    "drawCenter": "jd_drawCenter_activityId",
    "wxInviteActivity/openCard": "VENDER_ID",
    "https://jinggengjcq-isv.isvjcloud.com/jdbeverage/pages": "DPLHTY",
    "https://cjhydz-isv.isvjcloud.com/wxTeam/activity": "jd_cjhy_activityId",
    "wxShopGift": "jd_task_wuxian_custom",
    "pool/captain": "jd_task_wuxian_custom",
    "wxShopFollowActivity": "jd_task_wuxian_custom",
    "wxGameActivity": "jd_task_wuxian_custom",
    "wxBuildActivity": "jd_task_wuxian_custom",
    "sign/signActivity2": "jd_task_wuxian_custom",
    "sign/sevenDay": "jd_task_wuxian_custom",
    "wxMcLevelAndBirthGifts": "jd_task_wuxian_custom",
    "daily": "jd_task_wuxian_custom",
    "wxPointShopView/pointExgBeans": "jd_task_wuxian_custom",
    "wxFansInterActionActivity": "jd_task_wuxian_custom",
    "index.html?code=": "yhyauthorCode",
    "wxUnPackingActivity": "jd_wxUnPackingActivity_activityId",
    "activityType=10024": "jd_lzkj_loreal_cart_url",
    "activityType=10020": "jd_lzkj_loreal_draw_url",
    "activityType=10021": "jd_lzkj_loreal_draw_url",
    "activityType=10026": "jd_lzkj_loreal_draw_url",
    "activityType=10080": "jd_lzkj_loreal_draw_url",
    "activityType=10069": "jd_lzkj_loreal_followShop_url",
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
    env = 'https://lzkj-isv.isvjcloud.com/wxgame/activity/b9d33b3f7d824cf499e1870f9a0637bb?activityId=b9d33b3f7d824cf499e1870f9a0637bb'
    str_out = decode(env)
    print(str_out)
