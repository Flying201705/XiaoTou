cc.Class({
    extends: cc.Component,

    properties: {
        avatar: cc.Sprite,
        level: cc.Label,
    },

    setLevel(value) {
        this.level.string = `第${value}关`;
    },
    setAvatar(url) {
        var self = this;
        cc.loader.load({url: url, type: 'jpg'}, function (err, tex) {
            self.avatar.spriteFrame = new cc.SpriteFrame(tex);
        })
    }
});
