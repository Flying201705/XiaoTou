cc.Class({
    extends: cc.Component,

    properties: {
        win: {
            default: null,
            type: cc.Node
        },
        lose: {
            default: null,
            type: cc.Node
        },
    },

    showUI: function (win) {
        cc.log("win=" + win);
        if (win === true) {
            this.win.active = true;
            this.lose.active = false;
        } else {
            this.win.active = false;
            this.lose.active = true;
        }
        cc.director.pause();
        this.node.active = true;
    },

});
