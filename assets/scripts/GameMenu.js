const global = require("global");

cc.Class({
    extends: cc.Component,

    properties: {
        maskNode: cc.Node,
        levelNode:  cc.Node,
        clickAudio: cc.AudioClip,
        pauseMenuSprites:[cc.SpriteFrame]
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

    onClickPauseBtn: function (event) {
        cc.audioEngine.playEffect(this.clickAudio, false);

        let button = event.target;
        if (global.isPause()) {
            global.resume();
            button.getComponent(cc.Sprite).spriteFrame = this.pauseMenuSprites[0];
        } else {
            global.pause();
            button.getComponent(cc.Sprite).spriteFrame = this.pauseMenuSprites[1]
        }
    }
});
