import global from './global'

cc.Class({
    extends: cc.Component,

    properties: {

    },
    
    onPressProp1Btn: function () {
        cc.log("施放道具1--全屏减速");
        global.event.fire("release_slow");
    },

    onPressProp2Btn: function () {
        cc.log("施放道具2--全屏眩晕");
        global.event.fire("release_stun");
    },

    onPressProp3Btn: function () {
        cc.log("施放道具3--炸弹100");
        global.event.fire("release_damage");
    },
});
