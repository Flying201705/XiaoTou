/**
 * 新手大礼包对话框
 */
const {appConfig} = require("./common/config");
import * as WxHelper from "./common/WxHelper";
import {InfoHandle} from './InfoData'
cc.Class({
    extends: cc.Component,

    properties: {
        giftBtn: {
            default: null,
            type: cc.Node
        },
        moreContent: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (appConfig.weichat.share.shareForMoreEnable === true) {
            this.giftBtn.active = false;
            this.moreContent.active = true;
        } else {
            this.giftBtn.active = true;
            this.moreContent.active = false;
        }
    },

    start () {

    },

    // update (dt) {},

    config(parentNode) {
        this.parentNode = parentNode;
    },

    getRewards: function() {
        let index = Math.floor(Math.random() * 10 / 3);
        index = index < 3 ? index + 1 : 3;
        return index;
    },

    hideDialog: function() {
        this.parentNode.removeChild(this.node);
        this.node.destroy();
        this.parentNode = null;
    },

    getGift: function() {
        console.log("zhangxx, getGift, crystal : 4, " + ", rewards : " + this.getRewards());
        new InfoHandle().updateRemoteCrystal(4);
        new InfoHandle().updateRemoteGoods(this.getRewards(), 1);
        this.hideDialog();
    },

    getDoubleGift: function() {
        WxHelper.share("normal", this.shareSuccess.bind(this), this.shareFail.bind(this));
    },

    /**
     * 分享群组成功得双倍礼包
     */
    shareSuccess: function(isShareViaGroup) {
        console.log("zhangxx, getDoubleGift, crystal : 8, " + ", rewards : " + this.getRewards());
        if (isShareViaGroup === true) {
            new InfoHandle().updateRemoteCrystal(8);
            new InfoHandle().updateRemoteGoods(this.getRewards(), 2);
        } else {
            new InfoHandle().updateRemoteCrystal(4);
            new InfoHandle().updateRemoteGoods(this.getRewards(), 1);
        }
        this.hideDialog();
    },

    shareFail: function() {

    },
});
