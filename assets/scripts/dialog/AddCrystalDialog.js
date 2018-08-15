const global = require("../global");
const WxHelper = require("../common/WxHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node
    },

    start() {
        global.pause();
    },

    onEnable() {
        this.mask.on(cc.Node.EventType.TOUCH_START, this.maskTouch);
        this.mask.on(cc.Node.EventType.TOUCH_END, this.maskTouch);
    },
    onDisable() {
        this.mask.off(cc.Node.EventType.TOUCH_START, this.maskTouch);
        this.mask.off(cc.Node.EventType.TOUCH_END, this.maskTouch);
    },

    maskTouch(event) {
        event.stopPropagation();
    },

    onClickShareBtn() {
        WxHelper.onShareAppMessage();
        global.resume();
        this.node.destroy();
    }

});
