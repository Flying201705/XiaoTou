// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        background: {
            default: null,
            type: cc.Sprite
        },

        path: {
            default: null,
            type: cc.Sprite
        }
    },

    onLoad () {
        var background = this.background;
        this._addSpritePic(background, "background/BG1-hd");
        var path = this.path;
        this._addSpritePic(path, "background/BG-hd");
    },

    start () {

    },

    // update (dt) {},

    _addSpritePic: function(container, addres){
        cc.loader.loadRes(addres, cc.SpriteFrame, function (err, spFrame) {
            if (!err) {
                container.spriteFrame = spFrame;
            }
        });
    },
});
