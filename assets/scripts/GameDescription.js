// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// 游戏界面的英雄、道具介绍弹窗。
cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            default: null,
            type: cc.Node
        },
        description: {
            default: null,
            type: cc.Label
        },
        clickAudio: {
            default: null,
            url: cc.AudioClip
        },
        towerSprites: {
            default: [],
            type: [cc.SpriteFrame]
        },
        levelSprites: {
            default: [],
            type: [cc.SpriteFrame]
        },
        towerIcon: {
            default: null,
            type: cc.Sprite
        },
        levelIcon: {
            default: null,
            type: cc.Sprite
        },
    },

    onEnable: function () {
        this.mask.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.on('touchend', function (event) {
            event.stopPropagation();
        });
    },

    onDisable: function () {
        this.mask.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.off('touchend', function (event) {
            event.stopPropagation();
        });
    },
    showDialog: function () {
        this.description.string = this.getDescription();
        this.towerIcon.spriteFrame = this.getTowerIcon();
        this.levelIcon.spriteFrame = this.getLevelIcon();

        cc.director.pause();
        this.node.active = true;
    },
    hideDialog() {
        cc.audioEngine.playEffect(this.clickAudio, false);
        cc.director.resume();
        this.node.active = false;
    },
    getDescription() {
        return '打钱能手，主要的金钱来源\n每次攻击获取一定比例金钱';
    },
    getTowerIcon() {
        return this.towerSprites[0];
    },
    getLevelIcon() {
        return this.levelSprites[0];
    },

});