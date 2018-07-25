import {InfoHandle, InfoData} from './InfoData'
import global from './global'

cc.Class({
    extends: cc.Component,

    properties: {
        composeButton: cc.Button,
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
    /**
     * 初始化预制件显示内容
     * @param opt
     */
    config(opt) {
        if (opt.composed) {
            this.setComposeStatus();
        } else {
            this.oneChipPrice = global.event.fire('get_one_chip_price');

            this.chipIds = opt.chipIds === undefined ? [] : opt.chipIds;
            cc.log('chipIds len:' + this.chipIds.length);
            this.composeButton.enabled = true;
            this.setChipEnable(true);
            this.initIconBg(opt);
            this.highlight();
            this.chipCount = this.getChipCount();
            this.updatePriceLabel(this.chipCount);
        }
    },
    /**
     * 合成之后：
     * 1、背包格不显示碎片图标。
     * 2、按钮不可点击。
     */
    setComposeStatus() {
        this.updatePriceLabel(3);
        this.composeButton.enabled = false;
        this.composeButton.node.opacity = 128;
        this.setChipEnable(false);
    },
    setChipEnable(enable) {
        for (let i = 0; i < this.chips.length; i++) {
            this.chips[i].node.active = enable;
        }
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
    },
    getChipCount: function () {
        var chipCount = 0;

        for (let i = 0; i < this.chips.length; i++) {
            if (this.chips[i].node.opacity === 255) {
                chipCount++;
            }
        }

        return chipCount;
    },
    updatePriceLabel: function (chipCount) {
        if (chipCount === undefined || chipCount < 0 || chipCount > 3) {
            return;
        }
        var oneChipPrice = this.oneChipPrice === undefined ? 0 : this.oneChipPrice;
        this.crystalCountForPay = oneChipPrice * (3 - chipCount);
        this.text.string = `需要<b><color=#8e256a>${this.crystalCountForPay}</color></b>水晶`;
    },
    getLeftCrystalCount() {
        var left = this.crystalCount - this.crystalCountForPay;
        return left < 0 ? 0 : left;
    },
    addHeroNumber: function (infoHandle, goodsId) {
        infoHandle.updateGoods(goodsId, 1, () => {
            this.updateLocalGoods(goodsId, 1);
            global.event.fire('update_crystal_count', this.getLeftCrystalCount());
            this.setComposeStatus();
        });
        return infoHandle;
    },
    getChipIndex(chipId) {
        var pos = chipId % 10;

        if (pos > 3) {
            return -1;
        } else {
            return pos - 1;
        }
    },
    /**
     * 合成英雄、物品
     */
    compose() {
        this.crystalCount = global.event.fire('get_crystal_count');

        cc.log('compose chip count:' + this.chipIds.length + ' crystalCount:' + this.crystalCount + " crystalCountForPay:" + this.crystalCountForPay);

        if (this.crystalCountForPay > this.crystalCount) {
            return;
        }

        // if (this.chipIds.length === 3) {
        cc.log('start compose');
        var goodsId = this.chipIds[0].toString().substring(0, 3);
        var infoHandle = new InfoHandle();
        this.addHeroNumber(infoHandle, goodsId);
        this.clearChipNumber(infoHandle);
        // }
    },
    clearChipNumber: function (infoHandle) {
        for (let i = 0; i < this.chipIds.length; i++) {
            let chipId = this.chipIds[i];
            cc.log('delete chips ' + chipId);

            infoHandle.updateGoods(chipId, -1, () => {
                this.updateLocalGoods(chipId, -1);
                // var index = this.getChipIndex(chipId);
                //本地碎片图标变暗
                // this.chips[index].node.opacity = 125;
                // this.updatePriceLabel(--this.chipCount);
            });
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
