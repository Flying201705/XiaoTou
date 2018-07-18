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
        text: {
            default: null,
            type: cc.RichText
        },
        heroChipSprites: {
            default: [],
            type: [cc.SpriteFrame]
        },
        propChipSprites: {
            default: [],
            type: [cc.SpriteFrame]
        },
        chips: {
            default: [],
            type: [cc.Sprite]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    getSprite(opt) {
        var chipSprite = this.heroChipSprites[0];

        if (opt.kind == 0) {
            chipSprite = this.heroChipSprites[0];
        } else if (opt.kind == 1) {
            chipSprite = this.propChipSprites[opt.propType];
        }
        return chipSprite;
    },
    config(opt) {
        // type, chipCount, crystalCount
        var chipSprite = this.getSprite(opt);

        this.chips[0].spriteFrame = opt.chip0 === 1 ? chipSprite : null;
        this.chips[1].spriteFrame = opt.chip1 === 1 ? chipSprite : null;
        this.chips[2].spriteFrame = opt.chip2 === 1 ? chipSprite : null;

        this.crystalCount = opt.crystalCount === undefined ? 0 : opt.crystalCount;
        this.text.string = `需要<b><color=#8e256a>${this.crystalCount}</color></b>水晶`;
    }

    // update (dt) {},
});
