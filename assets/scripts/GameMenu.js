cc.Class({
    extends: cc.Component,

    properties: {
        maskNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        // this.node.active = false;
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

    showMenu: function () {
        cc.director.pause();
        this.node.active = true;
    },

    hideMenu: function () {
        this.node.active = false;
        cc.director.resume();
    },

    resumeGame: function() {
        this.node.active = false;
        cc.director.resume();
    },

    selcetStage: function () {
        this.node.active = true;
        cc.director.resume();
        cc.director.loadScene("stage");
    },

    onClickPauseBtn: function () {
        // this.node.active = true;
        if (cc.director.isPaused()) {
            cc.director.resume();
        } else {
            cc.director.pause();
        }
    }
});
