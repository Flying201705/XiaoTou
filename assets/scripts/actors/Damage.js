const damageMng = require("DamageMng");

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this.label = this.getComponent(cc.Label);
        this.anim = this.getComponent(cc.Animation);
    },

    init(mng) {
        this.damageMng = mng;
    },

    onEnable() {
        this.anim.on("finished", this.onAnimationFinished, this);
    },

    onDisable() {
        this.anim.off("finished", this.onAnimationFinished, this);
    },

    hit: function (damage, beCrit) {
        this.label.string = damage;

        if (beCrit === true) {
            this.node.color = new cc.color(255, 104, 104, 255);
        } else {
            this.node.color = new cc.color(255, 255, 255, 255);
        }

        this.anim.play("damage");
    },

    onAnimationFinished: function () {
        cc.log("zzz onAnimationFinished");
        this.damageMng.destroyDamage(this.node);
    }
});
