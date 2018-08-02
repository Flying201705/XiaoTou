import {InfoHandle, InfoData} from './InfoData'
const global = require("global");

cc.Class({
    extends: cc.Component,

    properties: {
        composeButton: cc.Button,
        composeContainer: cc.Node,
        text: {
            default: null,
            type: cc.RichText
        },
        heroSpriteFrame: cc.SpriteFrame,
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
        this.kind = opt.kind;
        if (opt.composed) {
            this._setComposeStatus();
        } else {
            this.oneChipPrice = global.event.fire('get_one_chip_price');

            this.chipIds = opt.chipIds === undefined ? [] : opt.chipIds;
            cc.log('chipIds len:' + this.chipIds.length);
            this._setChipEnable(true);
            this._initIconBg(opt);
            this._highlight();
            this.chipCount = this._getChipCount();
            this._updatePriceLabel(this.chipCount);
        }

        //仅英雄开放按钮可用，二期再做调整。
        this._setComposeContainerEnable(this.kind == 100);
    },
    /**
     * 合成之后：
     * 1、背包格第一位显示合成后的图片。
     * 2、按钮区域消失。
     */
    _setComposeStatus() {
        // this._updatePriceLabel(3);

        this._setChipEnable(false);
        this._setChipsCompleteStatue();

        //临时功能，二期去掉if。
        if (this.kind == 100) {
            this.composeContainer.active = false;
        }
    },
    _setComposeContainerEnable(enable) {
        if (enable) {
            this.composeButton.enabled = true;
            this.composeContainer.opacity = 255;
        } else {
            this.composeButton.enabled = false;
            this.composeContainer.opacity = 128;
        }
    },
    _setChipEnable(enable) {
        for (let i = 0; i < this.chips.length; i++) {
            this.chips[i].node.active = enable;
        }
    },
    _setChipsCompleteStatue() {
        if (this.kind == 100) {
            this.chips[0].node.active = true;
            this.chips[0].node.opacity = 255;
            this.chips[0].spriteFrame = this.heroSpriteFrame;
        }
        // 物品碎片，二期增加
        // else {
        //     this.chips[0].spriteFrame = this.heroSpriteFrame;
        // }

    },
    _getSprite(opt) {
        let chipSprite = this.heroChipSprites[0];

        if (opt.kind == 100) {
            chipSprite = this.heroChipSprites[0];
        } else if (opt.kind == 1) {
            chipSprite = this.propChipSprites[opt.propType];
        }
        return chipSprite;
    },
    _highlight: function () {
        for (let i = 0; i < this.chipIds.length; i++) {
            let pos = this.chipIds[i] % 10;

            if (pos > 3) {
                continue;
            } else {
                pos -= 1;
            }

            this.chips[pos].node.opacity = 255;
        }
    },
    _getChipCount: function () {
        let chipCount = 0;

        for (let i = 0; i < this.chips.length; i++) {
            if (this.chips[i].node.opacity === 255) {
                chipCount++;
            }
        }

        return chipCount;
    },
    _updatePriceLabel: function (chipCount) {
        if (chipCount === undefined || chipCount < 0 || chipCount > 3) {
            return;
        }
        let oneChipPrice = this.oneChipPrice === undefined ? 0 : this.oneChipPrice;
        this.crystalCountForPay = oneChipPrice * (3 - chipCount);
        this.text.string = `需要<b><color=#8e256a>${this.crystalCountForPay}</color></b>水晶`;
    },
    _getLeftCrystalCount() {
        let left = this.crystalCount - this.crystalCountForPay;
        return left < 0 ? 0 : left;
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

        cc.log('start compose');
        this._updateData(this.kind, this.chipIds);
    },
    _updateData(propId, chipIds) {
        if (propId && chipIds && chipIds.length === 3) {
            let tempIds = Array.from(new Set(chipIds));
            if (tempIds.length != 3) {
                callback && callback.fail && callback.fail('物品ID重复，总数不足3');
                return;
            }


            let infoHandle = new InfoHandle();
            infoHandle.updateLocalGoods(propId, 1);
            for (let i = 0; i < chipIds.length; i++) {
                infoHandle.updateLocalGoods(chipIds[i], -1);
            }

            global.event.fire('update_crystal_count', this._getLeftCrystalCount());
            this._setComposeStatus();
            // callback && callback.success && callback.success(ret);
        } else {
            // callback && callback.fail && callback.fail();
        }
    },
    _initIconBg(opt) {
        let chipSprite = this._getSprite(opt);

        if (opt.kind === 100 || this.chipIds.length > 0) {
            for (let i = 0; i < 3; i++) {
                this.chips[i].spriteFrame = chipSprite;
                this.chips[i].node.opacity = 125;
            }
        }
    }
});
