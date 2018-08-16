/**
 * 新手大礼包对话框
 */
const {appConfig} = require("./common/config");
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
        console.log("zhangxx, getGift, crystal : 4, " + ", rewards : " + getRewards);
        this.hideDialog();
    },

    getDoubleGift: function() {
        WxHelper.share("normal", this.shareSuccess.bind(this), this.shareFail.bind(this));
    },

    shareSuccess: function() {
        console.log("zhangxx, getDoubleGift, crystal : 8, " + ", rewards : " + getRewards);
        this.hideDialog();
    },

    shareFail: function() {

    },
});
