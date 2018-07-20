import global from './global'

cc.Class({
    extends: cc.Component,

    properties: {
        maskNode: cc.Node,
        win: cc.Node,
        lose: cc.Node,
        star: cc.Node,
        ipt: cc.Prefab,
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

    showWinUI: function (stars, rewards) {
        this.win.active = true;
        this.lose.active = false;

        this.setStar(stars);
        this.setReward(rewards);

        global.pause();
        this.node.active = true;
    },

    showLoseUI:function() {
        this.win.active = false;
        this.lose.active = true;

        global.pause();
        this.node.active = true;
    },

    setStar:function(stars) {
        let star = this.star.getComponent("GameStar");
        cc.log("star: " + stars);
        star.initSprite(stars);
    },

    setReward: function(rewards) {
        let rewardNode = this.win.getChildByName('reward');
        if (rewards.length > 0) {
            rewardNode.active = true;
            for (let i = 0; i < rewards.length; i++) {
                let reward = rewards[i].split("-");
                let ipt = cc.instantiate(this.ipt);
                let icon = ipt.getChildByName('icon');
                let text = ipt.getChildByName('text');
                let url, string;
                switch (reward[0]) {
                    case "1":
                        url = cc.url.raw('resources/image/deceleration.png');
                        string = "减速x" + reward[1];
                        break;
                    case "2":
                        url = cc.url.raw('resources/image/dizziness.png');
                        string = "眩晕x" + reward[1];
                        break;
                    case "3":
                        url = cc.url.raw('resources/image/bomb.png');
                        string = "炸弹x" + reward[1];
                        break;
                    case "1001":
                        url = cc.url.raw('resources/image/hero_chip.png');
                        string = "英雄碎片1x" + reward[1];
                        break;
                    case "1002":
                        url = cc.url.raw('resources/image/hero_chip.png');
                        string = "英雄碎片2x" + reward[1];
                        break;
                    case "1003":
                        url = cc.url.raw('resources/image/hero_chip.png');
                        string = "英雄碎片3x" + reward[1];
                        break;
                    default:
                        url = cc.url.raw('resources/image/crystal.png');
                        string = "水晶x" + reward[1];
                        break;
                }
                icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(url);
                text.getComponent(cc.Label).string = string;
                rewardNode.addChild(ipt);
            }
        } else {
            rewardNode.active = false;
        }
    },

    goToNextLevel: function () {
        global.currentLevel++;
        cc.director.loadScene('game');
    },

    restartCurrentLevel: function () {
        cc.director.loadScene('game');
    },

    goToPreviousScene: function () {
        global.resume();
        cc.director.loadScene("stage");
    },

    share: function () {

    }
});
