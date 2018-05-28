import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
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
    buttonClick: function (event, coustomData) {
        cc.log("button click = " + coustomData);
        global.event.fire(coustomData + "_tower");
    },
    setTower: function (tower) {
        if (tower !== null) {
            this.updateGold.string = tower.getComponent('tower').getUpgradeCost();
            this.sellGold.string = tower.getComponent('tower').getSelledGold();
        }
    }
});
