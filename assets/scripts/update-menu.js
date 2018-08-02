const global = require("global");

cc.Class({
    extends: cc.Component,

    properties: {
        updateNode: {
            default: null,
            type: cc.Node
        },
        updateSprites: {
            default: [],
            type: cc.SpriteFrame
        },
        updateGold: {
            default: null,
            type: cc.Label
        },
        sellGold: {
            default: null,
            type: cc.Label
        }

    },

    onLoad: function () {
        this.anim = this.getComponent(cc.Animation);
        this.anim.play("update_menu");
    },
    onEnable: function() {
        this.anim.play("update_menu");
    },
    onDisable: function() {
        this.anim.stop("update_menu");
    },
    onDestroy: function() {
        this.anim.stop("update_menu");
    },
    buttonClick: function (event, customData) {
        cc.log("button click = " + customData);
        global.event.fire(customData + "_tower");
    },
    setTower: function (tower, gold) {
        if (tower !== null) {
            let t = tower.getComponent('tower');
            if (t.canUpgrade()) {
                this.updateNode.getComponent(cc.Sprite).spriteFrame = this.updateSprites[gold >= t.getUpgradeCost() ? 0 : 1];
                this.updateNode.getComponent(cc.Button).enabled = true;
                this.updateGold.string = t.getUpgradeCost();
            } else {
                this.updateNode.getComponent(cc.Sprite).spriteFrame = this.updateSprites[2];
                this.updateNode.getComponent(cc.Button).enabled = false;
                this.updateGold.string = "";
            }
            this.sellGold.string = t.getSelledGold();
        }
    }
});
