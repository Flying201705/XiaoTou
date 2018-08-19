import {InfoData, InfoHandle} from "../InfoData";
import global from "../global";

function weChatLogin(callback) {
    cc.log('login');
    wx.login({
        success: function (res) {
            console.log("wx code : " + res.code);
            new InfoHandle().init(res.code);
            // wx.getUserInfo({
            //     success: function (res) {
            //         global.userInfo = res.userInfo;
            //         let userInfo = res.userInfo;
            //         let nickName = userInfo.nickName;
            //         let avatarUrl = userInfo.avatarUrl;
            //         let gender = userInfo.gender; //性别 0：未知、1：男、2：女
            //         let province = userInfo.province;
            //         let city = userInfo.city;
            //         let country = userInfo.country;
            //         console.log("wx : " + nickName + "," + avatarUrl + ", " + gender + ", " + province + ", " + city + ", " + country);
            //     }
            // });
            console.log("zzz login success");
            callback();
        },
        fail: function (res) {
            // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
            if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                // 处理用户拒绝授权的情况
                console.log('拒绝授权');
                global.userInfo = null;
            }

            cc.info('login fail');
            InfoData.FLAG_DATA_DOWNLOAD_STATUS = -1;
            global.event.fire("onDataDownloadCallback", InfoData.TOKEN_ERROR);
        }
    })
}

module.exports = {
    login: (callback) => {
        console.log('[login] login');
        if (cc.sys.platform === cc.sys.WECHAT_GAME) { //微信小游戏
            weChatLogin(callback);
        } else {
            new InfoHandle().init(0);
            callback();
        }
    }
};