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
        title:{
            default: null,
            type: cc.Sprite
        },
        titleSprites:{
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

    onEnable:

        function () {
            this.mask.on('touchstart', function (event) {
                event.stopPropagation();
            });
            this.mask.on('touchend', function (event) {
                event.stopPropagation();
            });
        }

    ,

    onDisable: function () {
        this.mask.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.off('touchend', function (event) {
            event.stopPropagation();
        });
    }
    ,
    showDialog: function (mode) {
        if (mode === undefined || mode == 1) {
            this.title.spriteFrame = this.titleSprites[0];

            this.description.string = this.getDescription();
            this.towerIcon.spriteFrame = this.getTowerIcon();
            this.levelIcon.spriteFrame = this.getLevelIcon();

            this.contentHero.active = true;
            this.contentAward.active = false;
        } else {
            this.title.spriteFrame = this.titleSprites[1];

            var item1 = cc.instantiate(this.awardItemPrefab);
            // var item2 = cc.instantiate(this.awardItemPrefab);
            // var item3 = cc.instantiate(this.awardItemPrefab);
            this.awardList.node.addChild(item1);
            // this.awardList.node.addChild(item2);
            // this.awardList.node.addChild(item3);

            this.contentHero.active = false;
            this.contentAward.active = true;
        }

        cc.director.pause();
        this.node.active = true;
    }
    ,
    hideDialog() {
        cc.audioEngine.playEffect(this.clickAudio, false);
        cc.director.resume();
        this.node.active = false;
    }
    ,
    getDescription() {
        return '打钱能手，主要的金钱来源\n每次攻击获取一定比例金钱';
    }
    ,
    getTowerIcon() {
        return this.towerSprites[0];
    }
    ,
    getLevelIcon() {
        return this.levelSprites[0];
    }
    ,

})
;