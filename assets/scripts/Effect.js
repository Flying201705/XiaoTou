cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    onEffectEnd: function(prop) {
        console.log("onEffectEnd~~" + prop);
        this.node.destroy();
    },

    playAnim: function() {
        this.node.getComponent(cc.Animation).play("bobm_effect");
    },
});
