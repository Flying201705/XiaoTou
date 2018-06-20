cc.Class({
    extends: cc.Component,

    properties: {
        sprites: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    setLife: function (life) {
        this.node.getComponent(cc.Sprite).spriteFrame = this.sprites[life - 1];
    }
});
