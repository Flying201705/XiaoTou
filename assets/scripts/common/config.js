const DEBUG = true;

module.exports = {
    //小游戏版本号
    version: "1.0.0",
    host: DEBUG ? 'http://qyx18.com:1234' : 'https://xyxxbsd.raink.com.cn:8086',
    versionUrl: DEBUG ? "https://cdn-xyx.raink.com.cn/xbsd/test/version.json" : "https://cdn-xyx.raink.com.cn/ad/xbsd/version.json",
    //敏感功能开关，默认打开
    aliveFunEnable: true,
    // 分享得水晶数
    shareForCrystal: {
        person: 2,
        group: 10
    },
    /*目前开放凑数*/
    openLevel: 40
};