import * as net from "./net";
import {http_head, InfoHandle} from "../InfoData";

const global = require("global");
const {appConfig, shareForCrystal} = require("./config");

module.exports = {
    share: share,
    showMoreGame: showMoreGame,
    showShareMenu: showShareMenu,
    onShareAppMessage: onShareAppMessage
};

/**
 * 点击微信菜单分享时回调方法。
 */
function onShareAppMessage() {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        return;
    }

    let content = _getShareContentByMode('normal');

    wx.onShareAppMessage(() => {
        return {
            title: content.title,
            imageUrl: content.imageUrl,
            success: ret => {
                cc.info('share success', ret);
                cc.info('shareForMoreEnable:' + appConfig.weichat.share.shareForMoreEnable);
                if (appConfig.weichat.share.shareForMoreEnable) {
                    _addCrystal(ret)
                }
            },
            fail: ret => {
                cc.info('share fail', ret);
            }
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
 * 发起主动微信分享
 * @param mode success|fail|normal
 */
function share(mode = 'normal') {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        return;
    }
    let content = _getShareContentByMode(mode);

    wx.shareAppMessage({
        title: content.title,
        imageUrl: content.imageUrl,
        success: ret => {
            cc.info('share success', ret);
            cc.info('shareForMoreEnable:' + appConfig.weichat.share.shareForMoreEnable);
            if (appConfig.weichat.share.shareForMoreEnable) {
                _addCrystal(ret)
                global.event.fire("add_reward_hint", data);
            }
        },
        fail: ret => {
            cc.info('share fail', ret);
        }
    })
}

function _getShareContentByMode(mode) {
    let title = '';
    let imgUrl = '';

    switch (mode) {
        case 'success':
            title = appConfig.weichat.share.success.title;
            imgUrl = appConfig.weichat.share.success.imageUrl;
            break;
        case 'fail':
            title = appConfig.weichat.share.fail.title;
            imgUrl = appConfig.weichat.share.fail.imageUrl;
            break;
        default:
            title = appConfig.weichat.share.normal.title;
            imgUrl = appConfig.weichat.share.normal.imageUrl;
    }

    return {
        title: title, imageUrl: imgUrl
    };
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

    wx.previewImage({
        current: appConfig.moreGame.imgUrl,
        urls: [appConfig.moreGame.imgUrl]
    });

}
