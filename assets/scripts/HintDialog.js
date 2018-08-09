const global = require("global");
// 游戏提示对话框
cc.Class({
    extends: cc.Component,

    properties: {
        hintText: {
            default: null,
            type: cc.RichText
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    config(parentNode, hint) {
        this.parentNode = parentNode;
        this.hintText.string = hint;
    },

    hideDialog: function() {
        this.parentNode.removeChild(this.node);
        this.node.destroy();
        this.parentNode = null;
        global.resume();
    },
});
