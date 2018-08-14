import {InfoHandle, InfoData} from './InfoData'
import * as util from "./common/util";

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
    config(self, opt) {
        this.target = self;
        this.propCompelteSpriteFrame = opt && opt.completeSpriteFrame;
        this.propChipSpriteFrame = opt && opt.chipSpriteFrame;
        this.propId = opt && opt.propId;

        if (util.isEmpty(this.propCompelteSpriteFrame) || util.isEmpty(this.propChipSpriteFrame)) {
            this._setComposeContainerEnable(false);
            return;
        }

        if (opt.composed) {
            this._setCompleteStatus();
        } else {
            this.oneChipPrice = global.event.fire('get_one_chip_price');

            this.chipIds = opt.chipIds === undefined ? [] : opt.chipIds;
            cc.log('chipIds len:' + this.chipIds.length);
            this.chipCount = this._getChipCount();
            this._setChipEnable(true);
            this._initIconBg();
            this._highlight();
            this._updatePriceLabel(this.chipCount);
        }
    },
    /**
     * 合成之后：
     * 1、背包格第一位显示合成后的图片。
     * 2、按钮区域消失。
     */
    _setCompleteStatus() {
        this._setChipEnable(false);
        this._showCompleteSprite();

        this.composeContainer.active = false;
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
    _showCompleteSprite() {
        this.chips[0].node.active = true;
        this.chips[0].node.opacity = 255;
        this.chips[0].spriteFrame = this.propCompelteSpriteFrame;

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
        this._updateData(this.propId, this.chipIds);
    },
    _updateData(propId, chipIds) {
        if (propId) {
            let tempIds = Array.from(new Set(chipIds));
            if (tempIds.length > 3) {
                // callback && callback.fail && callback.fail('物品ID重复，总数不足3');
                return;
            }


            let infoHandle = new InfoHandle();
            let ret = infoHandle.updateLocalGoods(propId, 1);
            cc.info('增加物品：' + ret);
            for (let i = 0; i < chipIds.length; i++) {
                infoHandle.updateLocalGoods(chipIds[i], -1);
            }

            global.event.fire('update_crystal_count', this._getLeftCrystalCount());
            this._setCompleteStatus();
            // callback && callback.success && callback.success(ret);
        } else {
            // callback && callback.fail && callback.fail();
        }
    },
    _initIconBg() {
        for (let i = 0; i < 3; i++) {
            this.chips[i].spriteFrame = this.propChipSpriteFrame;
            this.chips[i].node.opacity = 125;
        }
    },
    /**
     * 物品item点击回调方法
     */
    onItemClick(e) {
        if (e.target.active) {
            this.onItemClickCallback(this.target);
        }
    },
    /**
     * 物品item点击，对外提供的回调方法
     */
    onItemClickCallback() {
        cc.info('onItemClickCallback');
    }
});
