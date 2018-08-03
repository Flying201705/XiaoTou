/**
 * 每日签到
 */
import {InfoData, InfoHandle} from "./InfoData";

const remoteHelper = require("./common/RemoteHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        gotFlag: [cc.Node],
        moreDayNode: cc.Node,
        moreDayLabel: cc.Label
    },

    start() {

    },
    /**
     * 初始化签到天数显示UI
     * @param signDays 签到天数
     */
    init(signDays) {

        for (let i = 0; i < this.gotFlag.length; i++) {
            this.gotFlag[i].active = i < signDays;
        }

        if (signDays >= this.gotFlag.length) {
            this.moreDayNode.active = true;
            this.moreDayLabel.string = `第${signDays + 1}天`;
        }
    },
    /**
     * 签到
     */
    signIn() {
        this.node.parent.removeChild(this.node);
        remoteHelper.signIn(InfoData.user.id, data => {
            new InfoHandle().updateLocalCrystal(data);
            this._showWxShare();
        });
    },
    _showWxShare() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

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
});
