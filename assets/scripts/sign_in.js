/**
 * 每日签到
 */
import {InfoHandle} from "./InfoData";

const crystalPerDay = [1, 2, 3, 4, 6, 8, 10];

cc.Class({
    extends: cc.Component,

    properties: {
        gotFlag: [cc.RichText]
    },

    start() {

    },
    /**
     * 签到
     */
    signIn() {
        this.node.parent.removeChild(this.node);

        new InfoHandle().updateLocalCrystal();

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.shareAppMessage({
                title: '一起来玩小兵时代',
                imageUrl: 'http://zhang395295759.xicp.net:30629/xiaotou-res/share_img.jpg',
                success: () => {
                    cc.info('share success');
                },
                fail: () => {
                    cc.info('share fail');
                }
            })
        }
    }
});
