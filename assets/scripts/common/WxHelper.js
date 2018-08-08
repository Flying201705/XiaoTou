import * as net from "./net";
import {http_head} from "../InfoData";

module.exports = {
    share: share,
    showMoreGame: showMoreGame
};

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
            wx.shareAppMessage({
                title: ret.title,
                imageUrl: ret.imageUrl
            })
        },
        fail: () => {
            cc.info('get share info fail');
        }
    });
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
