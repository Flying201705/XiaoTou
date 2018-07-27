// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import global from './global'
// 游戏界面的英雄、道具介绍弹窗。
cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            default: null,
            type: cc.Node
        },
        title: {
            default: null,
            type: cc.Sprite
        },
        titleSprites: {
            default: [],
            type: [cc.SpriteFrame]
        },
        contentHero: {
            default: null,
            type: cc.Node
        },
        contentAward: {
            default: null,
            type: cc.Node
        },
        awardList: {
            default: null,
            type: cc.Layout
        },
        awardItemPrefab: {
            default: null,
            type: cc.Prefab
        },
        towerName: {
            default: null,
            type: cc.Label
        },
        description: {
            default: null,
            type: cc.Label
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
        clickAudio: {
            default: null,
            url: cc.AudioClip
        },
    },
    onEnable() {
        this.mask.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.on('touchend', function (event) {
            event.stopPropagation();
        });
    },
    onDisable() {
        this.mask.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.off('touchend', function (event) {
            event.stopPropagation();
        });
    },
    config(parentNode, config) {
        this.parentNode = parentNode;

        var mode = config.mode;

        if (mode === undefined || mode == 1) {
            this.title.spriteFrame = this.titleSprites[0];
            this.towerName.string = config.towerName;
            this.description.string = config.description;
            this.towerIcon.spriteFrame = this.getTowerIcon(config.tower_icon);
            this.levelIcon.spriteFrame = this.getLevelIcon(config.tower_level);

            this.contentHero.active = true;
            this.contentAward.active = false;
        } else if (mode == 2) {
            this.title.spriteFrame = this.titleSprites[1];

            var goodsList = config.goods;

            for (var index = 0; index < goodsList.length; index++) {
                var goods = goodsList[index];
                var item = cc.instantiate(this.awardItemPrefab);
                item.getComponent('award-item').set(goods);
                this.awardList.node.addChild(item);
            }

            this.contentHero.active = false;
            this.contentAward.active = true;
        }

        // cc.director.pause();
        global.pause();


    },
    hideDialog() {
        this.parentNode.removeChild(this.node);
        this.parentNode = null;
        cc.audioEngine.playEffect(this.clickAudio, false);
        // cc.director.resume();
        global.resume();
    },
    getTowerIcon(index) {
        return this.towerSprites[index];
    },
    getLevelIcon(level) {
        return this.levelSprites[level - 1];
    },
});