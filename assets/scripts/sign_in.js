/**
 * 每日签到
 */
const global = require("global");
const config = require("./common/config");
import {InfoData, InfoHandle} from "./InfoData";
import * as WxHelper from "./common/WxHelper";

const remoteHelper = require("./common/RemoteHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        gotFlag: [cc.Node],
        moreDayNode: cc.Node,
        moreDayLabel: cc.Label,
        dailyButton: cc.Button,
        controlNode: cc.Node
    },

    onLoad() {
        if (config.aliveFunEnable === true) {
            this.dailyButton.node.active = false;
            this.controlNode.active = true;
        } else {
            this.dailyButton.node.active = true;
            this.controlNode.active = false;
        }
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

        this.signDays = signDays;
    },
    /**
     * 签到
     */
    signIn() {
        this.hide();
        remoteHelper.signIn(InfoData.user.id, data => {
            //签到成功领取水晶界面提示
            global.event.fire("add_reward_hint", data);
            new InfoHandle().updateLocalCrystal(data);
            // if (config.aliveFunEnable === true) {
            //     this._showWxShare();
            // }
        });
    },
    _showWxShare() {
        // if (this.signDays > 1) {
            WxHelper.share('normal', 'server');
        // }
    },

    hide() {
        this.node.removeFromParent();
        this.node.destroy();
    },

    onClickDoubleBtn() {
        this.hide();
        remoteHelper.signIn(InfoData.user.id, data => {
            //签到成功领取水晶界面提示
            global.event.fire("add_reward_hint", data);
            new InfoHandle().updateLocalCrystal(data);
            if (config.aliveFunEnable === true) {
                this._showWxShare();
            }
        });
    }
});
