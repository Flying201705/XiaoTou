import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
        spriteNode: {
            default: null,
            type: cc.Sprite
        },
        spriteFrames: {
            default: [],
            type: cc.SpriteFrame
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    initWithData: function(towerIndex) {
        this.spriteNode.spriteFrame = this.spriteFrames[towerIndex];
    },
});
