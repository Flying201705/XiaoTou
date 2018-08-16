const global = require("global");

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
        clickAudio: {
            default: null,
            url: cc.AudioClip
        },
        propType: 1,
        propNumber: 0,
        crystalNumber: 0,
        crystalTotalNumber: 0,
    },
    onLoad() {
        this.mask.getComponent('mask').onHide = this.onDialogHide;
    },
    onDialogHide() {
        global.resume();
    },
    config(parentNode, propType, crystalTotalNumber) {
        this.parentNode = parentNode;
        cc.log('buy prop type :' + propType);

        this.propType = propType;
        switch (propType) {
            case 1:
                this.propIconSprite.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/image/deceleration.png'));
                break;
            case 2:
                this.propIconSprite.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/image/dizziness.png'));
                break;
            case 3:
                this.propIconSprite.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/image/bomb.png'));
                break;
        }

        this.crystalTotalNumber = crystalTotalNumber;
        cc.log("crystalTotalNumber:" + this.crystalTotalNumber)
        this.crystalLeftNumberLabel.string = this.crystalTotalNumber;

        this.propNumber = 0;
        this.crystalNumber = 0;

        this.propNumberLabel.string = '0';
        this.crystalNumberLabel.string = '0';

        // cc.director.pause();
        global.pause();
        this.node.active = true;
    },
    hideDialog() {
        // cc.director.resume();
        global.resume();
        // this.node.active = false;
        this.parentNode.removeChild(this.node);
        this.node.destroy();
        this.parentNode = null;
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
});
