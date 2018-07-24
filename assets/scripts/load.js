import {InfoHandle} from './InfoData'
import global from "./global";

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0.01,
        label: {
            default: null,
            type: cc.Label
        },
        loadBar: {
            default: null,
            type: cc.ProgressBar
        },
        // defaults, set visually when attaching this script to the Canvas
        text: '欢迎来到小兵时代!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        this.loadBar.progress = 0;

        this.isLoad = false;
        if (CC_JSB) { //模拟器
            new InfoHandle().init(0);
        } else {
            if (cc.sys.platform === cc.sys.WECHAT_GAME) { //微信小游戏
                this.weChatLogin();
            } else {
                new InfoHandle().init(0);
            }
        }
    },

    // called every frame
    update: function (dt) {
        let progress = this.loadBar.progress;
        if (progress < 1.0) {
            progress += this.speed * dt;
        } else {
            this.isLoad = true;
            if (this.isLoad !== global.loadRes) {
                global.loadRes = true;
                this.goToMainScene();
            }
        }
        this.loadBar.progress += progress;
    },

    goToMainScene: function () {
        cc.director.loadScene("main.fire");
    },

    weChatLogin: function () {
        cc.log('login');
        let that = this;
        wx.login({
            success: function (res) {
                console.log("wx code : " + res.code);
                wx.request({
                    url:"http://zhang395295759.xicp.net:30629/xiaotou/user/getOpenId.do",
                    header: {"Content-Type": "application/x-www-form-urlencoded"},
                    method: "POST",
                    data: {code: res.code},
                    success: function(res) {
                        if (res.data.data.indexOf("openid") !== -1) {
                            console.log("wx success data.data : " + res.data.data);
                            var obj = JSON.parse(res.data.data);
                            new InfoHandle().init(obj.openid);
                        } else {
                        console.log("wx fail data.data : " + res.data);
                        }
                    },
                    fail: function (res) {
                        console.log("wx fail data : " + res.data);
                    }
                });
                wx.getUserInfo({
                    success: function (res) {
                        global.userInfo = res.userInfo;
                        let userInfo = res.userInfo;
                        let nickName = userInfo.nickName;
                        let avatarUrl = userInfo.avatarUrl;
                        let gender = userInfo.gender; //性别 0：未知、1：男、2：女
                        let province = userInfo.province;
                        let city = userInfo.city;
                        let country = userInfo.country;
                        console.log("wx : " + nickName + "," + avatarUrl + ", " + gender + ", " + province + ", " + city + ", " + country);
                    }
                });
            },
            fail: function (res) {
                // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                    // 处理用户拒绝授权的情况
                    console.log('拒绝授权');
                    global.userInfo = null;
                }
            }
        })
    },
});
