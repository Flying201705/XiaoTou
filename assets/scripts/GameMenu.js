const global = require("global");

cc.Class({
    extends: cc.Component,

    properties: {
        maskNode: cc.Node,
        levelNode:  cc.Node,
        clickAudio: cc.AudioClip,
        speedMenuSprites:[cc.SpriteFrame],
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

    playButtonAudio: function() {
        cc.audioEngine.playEffect(this.clickAudio, false);
    },

    selcetStage: function () {
        this.playButtonAudio();

        this.node.active = true;
        global.resume();
        cc.director.loadScene("stage");
    },

    onClickPauseBtn: function (event) {
        this.playButtonAudio();

        let button = event.target;
        if (global.isPause()) {
            global.resume(global.pauseState.ButtonPause);
            button.getComponent(cc.Sprite).spriteFrame = this.pauseMenuSprites[0];
        } else {
            global.pause(global.pauseState.ButtonPause);
            button.getComponent(cc.Sprite).spriteFrame = this.pauseMenuSprites[1]
        }
    },
    
    onClickSpeedBtn: function (event) {
        this.playButtonAudio();

        let scheduler = cc.director.getScheduler();
        this.isOpenSpeedUp = (this.isOpenSpeedUp !== true);
        scheduler.setTimeScale(this.isOpenSpeedUp ? 2 : 1);
        let button = event.target;
        button.getComponent(cc.Sprite).spriteFrame = this.speedMenuSprites[this.isOpenSpeedUp ? 1 : 0];
    }
});
