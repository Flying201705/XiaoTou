import * as net from "./net";
import {http_head, InfoHandle} from "../InfoData";

const global = require("global");
const {shareForCrystal, aliveFunEnable} = require("./config");

module.exports = {
    share: share,
    showMoreGame: showMoreGame,
    showShareMenu: showShareMenu,
    onShareAppMessage: onShareAppMessage
};

function onShareAppMessage() {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        return;
    }

    net.request({
        url: http_head + 'more/shareInfo',
        data: {
            mode: 'normal',
            control: 'local'
        },
        success: ret => {
            let crystalEnable = ret.crystalEnable;
            wx.onShareAppMessage(() => {
                return {
                    title: ret.title,
                    imageUrl: ret.imageUrl,
                    success: ret => {
                        cc.info('share success', ret);
                        if (crystalEnable && aliveFunEnable === true) {
                            _addCrystal(ret)
                        }
                    },
                    fail: ret => {
                        cc.info('share fail', ret);
                    }
                }
            });
        },
        fail: () => {
            cc.info('get share info fail');
        }
    });


}

function showShareMenu() {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        return;
    }

    wx.showShareMenu({
        withShareTicket: true,
        success: function (res) {
            // 分享成功
            console.log('showShareMenu success')
            console.log('分享' + res)
        },
        fail: function (res) {
            // 分享失败
            console.log('showShareMenu fail')
            console.log(res)
        }
    });
}

/**
 * 微信分享
 * @param mode success|fail|normal
 * @param control local|server
 */
function share(mode = 'normal', control = 'local') {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        return;
    }

    net.request({
        url: http_head + 'more/shareInfo',
        data: {
            mode: mode,
            control: control
        },
        success: ret => {
            let crystalEnable = ret.crystalEnable;
            wx.shareAppMessage({
                title: ret.title,
                imageUrl: ret.imageUrl,
                success: ret => {
                    cc.info('share success', ret);
                    if (crystalEnable && aliveFunEnable === true) {
                        _addCrystal(ret)
                    }
                },
                fail: ret => {
                    cc.info('share fail', ret);
                }
            })
        },
        fail: () => {
            cc.info('get share info fail');
        }
    });
}

function _addCrystal(data) {
    let crystalCount = _isShareViaGroup(data) ? shareForCrystal.group : shareForCrystal.person;
    cc.info('_addCrystal:' + crystalCount);
    //分享成功获得水晶界面提示
    global.event.fire("add_crystal_hint", crystalCount);
    new InfoHandle().updateRemoteCrystal(crystalCount);
}

/**
 * 从返回结果判断是否通过群组分享
 */
function _isShareViaGroup(data) {
    return data.shareTickets && data.shareTickets.length > 0;
}

/**
 * 显示更多好玩图片
 */
function showMoreGame() {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        return;
    }

    net.request({
        url: http_head + 'more/moreGameInfo',
        success: url => {
            wx.previewImage({
                current: url,
                urls: [url]
            });
        },
        fail: () => {
            cc.info('get share info fail');
        }
    });
}
