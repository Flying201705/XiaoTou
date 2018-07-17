// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import global from "./global";

const ONE_PROP_PRICE = 10;
cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            default: null,
            type: cc.Node
        },
        crystalNumberLabel: {
            default: null,
            type: cc.Label
        },
        propNumberLabel: {
            default: null,
            type: cc.Label
        },
        crystalLeftNumberLabel: {
            default: null,
            type: cc.Label
        },
        propIconSprite: {
            default: null,
            type: cc.Sprite
        },
        propIcons: {
            default: [],
            type: [cc.SpriteFrame]
        },
        clickAudio: {
            default: null,
            url: cc.AudioClip
        },
        backPackPrefab: {
            default: null,
            type: cc.Prefab
        },
        propType: 1,
        propNumber: 0,
        crystalNumber: 0,
        crystalTotalNumber: 0,
    },
    onEnable() {
        this.mask.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.on('touchend', function (event) {
            event.stopPropagation();
        });
    },
    onDisable() {
        this.mask.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.off('touchend', function (event) {
            event.stopPropagation();
        });
    },
    config(parentNode, propType, crystalTotalNumber) {
        this.parentNode = parentNode;
        cc.log('buy prop type :' + propType);

        this.propType = propType;
        this.propIconSprite.spriteFrame = this.propIcons[propType - 1];

        this.crystalTotalNumber = crystalTotalNumber;
        cc.log("crystalTotalNumber:" + this.crystalTotalNumber)
        this.crystalLeftNumberLabel.string = this.crystalTotalNumber;

        this.propNumber = 0;
        this.crystalNumber = 0;

        this.propNumberLabel.string = '0';
        this.crystalNumberLabel.string = '0';

        cc.director.pause();
        this.node.active = true;
    },
    hideDialog() {
        cc.director.resume();
        // this.node.active = false;
        this.parentNode.removeChild(this.node);
    },
    refreshNumber(propNumber) {
        cc.audioEngine.playEffect(this.clickAudio, false);

        this.propNumberLabel.string = propNumber.toString();

        var crystalForPay = propNumber * ONE_PROP_PRICE;
        this.crystalNumberLabel.string = crystalForPay.toString();

        // this.crystalLeftNumber -= crystalForPay;
        var currentLeftNumber = this.crystalTotalNumber - crystalForPay;
        this.crystalLeftNumberLabel.string = currentLeftNumber.toString();
    },
    addPropNumber() {
        var totalCrystalNumberForPay = this.propNumber * ONE_PROP_PRICE;
        if (ONE_PROP_PRICE > (this.crystalTotalNumber - totalCrystalNumberForPay)) {
            return;
        }

        this.propNumber++;

        this.refreshNumber(this.propNumber);
    },
    minusPropNumber() {
        if (this.propNumber <= 0) {
            this.propNumber = 0;
        } else {
            this.propNumber--
        }

        this.refreshNumber(this.propNumber);
    },
    convert() {
        cc.audioEngine.playEffect(this.clickAudio, false);

        switch (this.propType) {
            case 1:
                global.event.fire("buy_slow", this.propNumber);
                break;
            case 2:
                global.event.fire("buy_stun", this.propNumber);
                break;
            case 3:
                global.event.fire("buy_damage", this.propNumber);
                break;
        }

        var crystalLeft = this.crystalTotalNumber - this.propNumber * ONE_PROP_PRICE;
        cc.log('crystalLeft:' + crystalLeft);
        global.event.fire("update_crystal_count", crystalLeft);

        this.hideDialog();
    },
    /**
     * 显示背包弹窗
     */
    showBackPack(event) {
        cc.log('showBackPack')
        // var pos = event.target.getPosition();
        // this.backPack.getComponent('back-pack').setContentPosition(this.node, pos);
        this.backPack = cc.instantiate(this.backPackPrefab);
        this.backPack.getComponent('back-pack').config();
        this.backPack.parent = this.node;
    },
});
