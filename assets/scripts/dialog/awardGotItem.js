cc.Class({
    extends: cc.Component,

    properties: {
        img: cc.Sprite,
        text: cc.RichText
    },

    set(spritFrame, count) {
        this.img.spriteFrame = spritFrame;
        this.text.string = `x${count}`;
    },
});
