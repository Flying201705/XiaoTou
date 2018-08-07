/**
 * 每日签到
 */
import {InfoData, InfoHandle} from "./InfoData";
import * as WxHelper from "./common/WxHelper";

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
        WxHelper.share('normal');
    }
});
