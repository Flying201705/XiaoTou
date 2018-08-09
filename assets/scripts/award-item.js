const PROP_URL = [
    'resources/image/deceleration.png',
    'resources/image/dizziness.png',
    'resources/image/bomb.png'
];
const CRYSTAL_URL = 'resources/image/crystal.png';
const CHIP_URL = [
    'resources/image/hero_chip.png',
    'resources/image/prop_boot_chip.png'
];

cc.Class({
    extends: cc.Component,

    properties: {
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
                this.icon.spriteFrame = this.getCrystalChipSpriteFrame();
                this.description.node.color = new cc.color(255, 255, 255, 255);
                break;
            case 2:
                let icon_index = opt.icon === undefined ? 0 : opt.icon - 1;
                this.icon.spriteFrame = this.getPropSpriteFrame(icon_index);
                this.description.node.color = new cc.color(255, 246, 1, 255);
                break;
            case 3:
                var icon_index = opt.icon === undefined ? 0 : opt.icon - 1;
                this.icon.spriteFrame = this.getHeroChipSpriteFrame(icon_index);
                this.description.node.color = new cc.color(218, 57, 252, 255);
                break;
        }

        this.description.string = opt.description;
    },
    getPropSpriteFrame(index) {
        return new cc.SpriteFrame(cc.url.raw(PROP_URL[index]));
    },
    getHeroChipSpriteFrame(index) {
        return new cc.SpriteFrame(cc.url.raw(CHIP_URL[index]));
    },
    getCrystalChipSpriteFrame() {
        return new cc.SpriteFrame(cc.url.raw(CRYSTAL_URL));
    },
});
