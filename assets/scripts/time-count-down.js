import global from "./global";

cc.Class({
    extends: cc.Component,

    properties: {
        timeCountDownAnim: {
            default: null,
            type: cc.Animation
        },
        countDownAudio: {
            default: null,
            url: cc.AudioClip
        },
        goAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    countDown: function() {
        cc.audioEngine.playEffect(this.countDownAudio, false);
    },

    startGame: function () {
        cc.audioEngine.playEffect(this.goAudio, false);
        global.event.fire("game_start");
    },
});
