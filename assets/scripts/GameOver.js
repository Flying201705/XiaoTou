import {InfoHandle} from "./InfoData";

const global = require("global");

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

        let scheduler = cc.director.getScheduler();
        scheduler.setTimeScale(1);
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

    showLoseUI: function (wave) {
        this.win.active = false;
        this.lose.active = true;

        let descNode = this.lose.getChildByName('description');
        descNode.getComponent(cc.RichText).string = '<color=white>您共击退了</c><color=red>'
            + wave + '</c><color=white>波怪物</c>';

        global.pause();
        this.node.active = true;
    },

    setStar: function (stars) {
        let star = this.star.getComponent("GameStar");
        cc.log("star: " + stars);
        star.initSprite(stars);
    },

    setReward: function (rewards) {
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
                        string = "减速";
                        break;
                    case "2":
                        url = cc.url.raw('resources/image/dizziness.png');
                        string = "眩晕";
                        break;
                    case "3":
                        url = cc.url.raw('resources/image/bomb.png');
                        string = "炸弹";
                        break;
                    case "1001":
                        url = cc.url.raw('resources/image/hero_chip.png');
                        string = "英雄碎片1";
                        break;
                    case "1002":
                        url = cc.url.raw('resources/image/hero_chip.png');
                        string = "英雄碎片2";
                        break;
                    case "1003":
                        url = cc.url.raw('resources/image/hero_chip.png');
                        string = "英雄碎片3";
                        break;
                    default:
                        url = cc.url.raw('resources/image/crystal.png');
                        string = "水晶x" + reward[1];
                        break;
                }
                let goodsId = Number(reward[0]);
                if (goodsId > 1000) {
                    text.color = new cc.color(218, 57, 252, 255);
                } else if (goodsId > 0) {
                    text.color = new cc.color(255, 246, 1, 255);
                } else {
                    text.color = new cc.color(255, 255, 255, 255);
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
        new InfoHandle().checkUserById({
            success: () => {
                cc.info('check user success');
                global.currentLevel++;
                global.resume();
                cc.director.loadScene('game');
            },
            fail:()=>{
                cc.info('check user fail');
                if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                    wx.showToast({
                        title: '无法连接服务器',
                        icon: 'none'
                    })
                }
            }
        });
    },

    restartCurrentLevel: function () {
        global.resume();
        cc.director.loadScene('game');
    },

    goToPreviousScene: function () {
        global.resume();
        cc.director.loadScene("stage");
    },

    share: function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.shareAppMessage({
                title: '一起来玩小兵时代',
                imageUrl:'http://zhang395295759.xicp.net:30629/xiaotou-res/share_img.jpg'
            })
        }
    }
});
