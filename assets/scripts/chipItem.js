import {InfoHandle, InfoData} from './InfoData'
import global from './global'

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
        chipIds: [],
        goodsId: -1,
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
    highlight: function () {
        for (let i = 0; i < this.chipIds.length; i++) {
            var pos = this.chipIds[i] % 10;

            if (pos > 3) {
                continue;
            } else {
                pos -= 1;
            }

            this.chips[pos].node.opacity = 255;
        }
    }, /**
     * 初始化预制件显示内容
     * @param opt
     */
    config(opt) {
        // this.goodsId = opt.goodsid === undefined ? -1 : opt.goodsid;
        this.chipIds = opt.chipIds === undefined ? [] : opt.chipIds;
        cc.log('chipIds len:' + this.chipIds.length);

        this.initIconBg(opt);

        this.highlight();

        this.crystalCount = opt.crystalCount === undefined ? 0 : opt.crystalCount;
        this.text.string = `需要<b><color=#8e256a>${this.crystalCount}</color></b>水晶`;
    },
    addHeroNumber: function (infoHandle, goodsId) {

        infoHandle.updateGoods(goodsId, 1, () => {
            this.updateLocalGoods(goodsId, 1);
        });
        return infoHandle;
    },
    clearChipNumber: function (infoHandle) {
        for (let i = 0; i < this.chipIds.length; i++) {
            let chipId = this.chipIds[i];
            cc.log('delete chips ' + chipId);
            infoHandle.updateGoods(chipId, -1, () => {
                this.updateLocalGoods(chipId, -1);
                //清空本地碎片图标
                this.chips[i].node.opacity = 125;
            });
        }
    },
    /**
     * 合成英雄、物品
     */
    compose() {
        var crystalCount = global.event.fire('get_crystal_count');
        cc.log('compose chip count:' + this.chipIds.length + ' crystalCount:' + crystalCount);

        if (this.chipIds.length === 3) {
            cc.log('start compose');
            var goodsId = this.chipIds[0].toString().substring(0, 3);
            var infoHandle = new InfoHandle();
            this.addHeroNumber(infoHandle, goodsId);
            this.clearChipNumber(infoHandle);
        }
    },
    updateLocalGoods(goodsId, num) {
        for (let i = 0; i < InfoData.goods.length; i++) {
            var goods = InfoData.goods[i];
            cc.log('bunny updateLocalGoods goodsId:' + goodsId + ' num:' + num)
            if (goods.goodsid == goodsId) {
                goods.number += num;
                InfoData.goods[i] = goods;
                cc.log('bunny updateLocalGoods set goods')
                break;
            }
        }
    },
    initIconBg(opt) {
        var chipSprite = this.getSprite(opt);

        if (opt.kind === 0 || this.chipIds.length > 0) {
            for (let i = 0; i < 3; i++) {
                this.chips[i].spriteFrame = chipSprite;
                this.chips[i].node.opacity = 125;
            }
        }
    }
});
