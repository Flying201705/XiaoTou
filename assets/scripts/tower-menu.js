cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames:  [cc.SpriteFrame],
    },

    initWithData: function(towerIndex) {
        this.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[towerIndex];
    }
});
