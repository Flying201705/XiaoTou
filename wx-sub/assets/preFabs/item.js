// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        rank: cc.Label,
        avatar: cc.Sprite,
        nickName: cc.Label,
        level: cc.Label,
        background: cc.Node,
    },
    onLoad() {
        console.log('item load');
    },
    start() {
        console.log('item start');

    },
    setRank(value) {
        this.rank.string = value;
        if (value % 2 == 1) {
            this.background.opacity = 128;
        } else {
            this.background.opacity = 50;
        }
    },
    setNickName(value) {
        this.nickName.string = value;
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
