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
        crystalNumberLabel: {
            default: null,
            type: cc.Label
        },
        propNumberLabel: {
            default: null,
            type: cc.Label
        },
        propIconSprite: {
            default: null,
            type: cc.Sprite
        },
        sprArray:{
            default: [],
            type: [cc.Sprite]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // update (dt) {},

    showDialog(propType) {
        cc.log('buy prop type :' + propType);

        // this.iconSprite = this.propIconNode.getComponent(cc.Sprite).spriteFrame;
        // this.propIcon1Url = cc.url.raw('texture/scene/crystal.png')
        // this.propIcon1Texture = cc.textureCache.addImage(this.propIcon1Url);
        // this.iconSprite.setTexture(this.propIcon1Texture);
        // cc.log('bunny:'+iconSprite.spriteFrame.getTexture())

        // iconSpirte.spriteFrame.setTexture(cc.url.raw('res/textures/scene/deceleration.png'));

        this.propIconSprite.spriteFrame = this.sprArray[propType-1].spriteFrame;


        cc.director.pause();
        this.node.active = true;
    },
    hideDialog() {
        cc.director.resume();
        this.node.active = false;
    },
});
