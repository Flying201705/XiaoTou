import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        cc.log("onLoad");
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
    }
});
