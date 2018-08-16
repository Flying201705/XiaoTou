const DEBUG = true;
/**
 * appConfig会被服务器返回值替换
 */
const appConfig = {
    /**
     * 微信分享配置内容
     */
    weichat: {
        share: {
            /**
             * 签到分享开关
             */
            signInEnable: false,
            /**
             * 分享得礼包开关
             */
            shareForGiftEnable: false,
            /**
             * 游戏成功分享内容
             */
            success: {
                title: '@你 我是“小兵时代”王者，不服来战~',
                imageUrl: 'http://cdn-xyx.raink.com.cn/xbsd/test/xbsd-res/share_success.png'
            },
            /**
             * 游戏失败分享内容
             */
            fail: {
                title: '@你 这一关太难了~快来救救我吧',
                imageUrl: 'http://cdn-xyx.raink.com.cn/xbsd/test/xbsd-res/share_fail.jpg'
            },
            /**
             * 通用分享内容
             */
            normal: {
                title: '2018最好玩塔防游戏，快来开启冒险之旅途吧',
                imageUrl: 'http://cdn-xyx.raink.com.cn/xbsd/test/xbsd-res/share_normal.png'
            }
        }
    },
    /**
     * 更多好玩配置
     */
    moreGame: {
        imgUrl: 'http://cdn-xyx.raink.com.cn/xbsd/test/xbsd-res/zsdl_image.jpg'
    },
};
module.exports = {
    appConfig: appConfig,
    //小游戏版本号
    version: "1.0.0",
    host: DEBUG ? 'http://qyx18.com:1234' : 'https://xyxxbsd.raink.com.cn:8086',
    // 分享得水晶数
    shareForCrystal: {
        person: 2,
        group: 10
    },
    //开放最大关卡数
    openLevel: 40
};