import global from "./global";

cc.Class({
    extends: cc.Component,

    properties: {
        timeCountDownAnim: {
            default: null,
            type: cc.Animation
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    startGame: function () {
        global.event.fire("game_start");
    },

    // update (dt) {},
});
