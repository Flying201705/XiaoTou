/**
 *千墨对接文件
 */
let recommendIndex = 0;
let recommendList = [];

function init(callback) {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        callback();
        return;
    }

    let account = {
        openid: "0"
    };
    report.initWithAccount(5054, "xbsd", account, wx.getLaunchOptionsSync());
    report.getRecommendInfo(function (tablelist) {
        recommendIndex = 0;
        recommendList = recommendList.concat(tablelist);
        callback();
    }, this, false);
}

function updateRecommend() {
    report.getRecommendInfo(function (tablelist) {
        recommendIndex = 0;
        recommendList = [];
        recommendList = recommendList.concat(tablelist);
    }, this, false);
}

function getCurrentRecommend() {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        return null;
    }

    if (recommendList === null || recommendList.length === 0) {
        return null;
    }

    console.log("zzz recommendList.length:" + recommendList.length);

    return recommendList[recommendIndex];
}

function goToRecommend() {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        return;
    }

    let recommendData = getCurrentRecommend();
    if (recommendData === null) {
        return;
    }

    wx.getSystemInfo({
        success: function (system) {
            if (system && system.SDKVersion >= "2.2.0") {
                wx.navigateToMiniProgram({
                    appId: recommendData.appid,
                    path: recommendData.page,
                    extraData: null,
                    envVersion: "release",
                    success: (res) => {
                        report.linkEvent(recommendData.aid, recommendData.adid);
                    },
                    fail: (res) => {

                    },
                    complete: (res) => {
                    },
                })
            } else {
                wx.previewImage({
                    urls: [recommendData.ad_image],
                    success: res => {
                        report.linkEvent(recommendData.aid, recommendData.adid);
                    },
                    fail: res => {
                    }
                });
            }

            if (recommendList.length === 1) {
                updateRecommend();
            } else {
                recommendIndex++;
                if (recommendIndex >= recommendList.length) {
                    recommendIndex = 0;
                }
            }
        }
    })
}

module.exports = {
    recommendIndex: recommendIndex,
    recommendList: recommendList,
    init: init,
    getCurrentRecommend: getCurrentRecommend,
    goToRecommend: goToRecommend
};