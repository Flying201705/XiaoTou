cc.Class({
    extends: cc.Component,

    properties: {
        clickAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    onClickBackButton: function () {
        cc.audioEngine.playEffect(this.clickAudio, false);
        cc.director.loadScene("main");
    },
});
