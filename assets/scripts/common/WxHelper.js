import * as net from "./net";
import {http_head} from "../InfoData";

module.exports = {
    share: share
};

/**
 * 微信分享
 * @param mode success|fail|normal
 */
function share(mode = 'normal') {
    if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
        return;
    }

    net.request({
        url: http_head + 'shareInfo',
        data: {
            mode: mode
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