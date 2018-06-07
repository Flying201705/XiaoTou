cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.label = this.getComponent(cc.Label);
        this.anim = this.getComponent(cc.Animation);
    },

    hit: function (damage) {
        this.label.string = damage;
        this.anim.play("damage");
    }
});
