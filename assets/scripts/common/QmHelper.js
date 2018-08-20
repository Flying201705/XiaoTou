/**
 *千墨对接文件
 */
let recommend = null;

function init(callback) {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        let account = {
            openid: "0"
        };
        report.initWithAccount(5054, "xbsd", account, wx.getLaunchOptionsSync());
    }

    callback();
}

function updateRecommend(callback) {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        report.getRecommendInfo(function (tablelist) {
            recommend = tablelist;
            if (callback) {
                callback(tablelist);
            }
        }, this);
    }
}

function goToRecommend() {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        return;
    }

    let recommendData = recommend;
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
        }
    })
}

module.exports = {
    recommend: recommend,
    init: init,
    updateRecommend: updateRecommend,
    goToRecommend: goToRecommend
};