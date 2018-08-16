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

    getGift: function() {

    },

    getDoubleGift: function() {

    },
});
