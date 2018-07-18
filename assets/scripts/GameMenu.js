import global from './global'

cc.Class({
    extends: cc.Component,

    properties: {
        maskNode: {
            default: null,
            type: cc.Node
        },
        levelNode: {
            default: null,
            type: cc.Node
        },
        clickAudio: {
            default: null,
            url: cc.AudioClip
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
        // cc.director.pause();
        global.pause();
        this.node.active = true;
    },

    hideMenu: function () {
        this.node.active = false;
        // cc.director.resume();
        global.resume();
        this.levelNode.resumeAllActions();
    },

    resumeGame: function() {
        cc.audioEngine.playEffect(this.clickAudio, false);
        this.node.active = false;
        // cc.director.resume();
        global.resume();
    },

    restartGame: function() {
        cc.director.loadScene('game');
    },

    selcetStage: function () {
        cc.audioEngine.playEffect(this.clickAudio, false);
        this.node.active = true;
        // cc.director.resume();
        global.resume();
        cc.director.loadScene("stage");
    },

    onClickPauseBtn: function () {
        // this.node.active = true;
        cc.audioEngine.playEffect(this.clickAudio, false);
        if (cc.director.isPaused()) {
            cc.director.resume();
        } else {
            cc.director.pause();
        }
    }
});
