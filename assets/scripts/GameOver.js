import global from './global'

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
        star: {
            default: null,
            type: cc.Node
        }
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
            let star = this.star.getComponent("GameStar");
            //TODO 设置星星
            let testStar = Math.floor(Math.random()*3);
            cc.log("star: " + testStar);
            star.initSprite(testStar);
        } else {
            this.win.active = false;
            this.lose.active = true;
        }
        cc.director.pause();
        this.node.active = true;
    },
    goToNextLevel: function () {
        global.currentLevel++;
        cc.director.loadScene('game');
    },
    restartCurrentLevel: function () {
        cc.director.loadScene('game');
    },
    goToPreviousScene: function () {
        cc.director.resume();
        cc.director.loadScene("stage");
    },
    share: function () {
        
    }
});
