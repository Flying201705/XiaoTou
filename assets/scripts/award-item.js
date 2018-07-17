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
        typeCrystal: {
            default: [],
            type: [cc.SpriteFrame]
        },
        typeProp: {
            default: [],
            type: [cc.SpriteFrame]
        },
        typeHeroChip: {
            default: [],
            type: [cc.SpriteFrame]
        },
        icon: {
            default: null,
            type: cc.Sprite
        },
        description: {
            default: null,
            type: cc.Label
        }
    },
    set(opt) {
        cc.log(opt.type + ' ' + opt.description);

        switch (opt.type) {
            case 1:
                this.icon.spriteFrame = this.typeCrystal[0];
                break;
            case 2:
                var icon_index = opt.icon === undefined ? 0 : opt.icon - 1;
                this.icon.spriteFrame = this.typeProp[icon_index];
                break;
            case 3:
                var icon_index = opt.icon === undefined ? 0 : opt.icon - 1;
                this.icon.spriteFrame = this.typeHeroChip[icon_index];
                break;
        }

        this.description.string = opt.description;
    }
});
