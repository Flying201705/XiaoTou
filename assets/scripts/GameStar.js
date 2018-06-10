cc.Class({
    extends: cc.Component,

    properties: {
        sprites: {
            default: [],
            type: cc.SpriteFrame
        }
    },
    
    initSprite: function (star) {
        if (star > 0 && star <= 3) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.sprites[star - 1];
        }
    }
});
