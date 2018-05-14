cc.Class({
    extends: cc.Component,

    properties: {
        maskNode: {
            default: null,
            type: cc.Node
        },
        win: {
            default: null,
            type: cc.Node
        },
        lose: {
            default: null,
            type: cc.Node
        },
    },

    onEnable: function () {
        this.maskNode.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.maskNode.on('touchend', function (event) {
            event.stopPropagation();
        });
    },

    onDisable: function () {
        this.maskNode.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.maskNode.off('touchend', function (event) {
            event.stopPropagation();
        });
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
