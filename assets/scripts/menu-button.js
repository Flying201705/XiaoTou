cc.Class({
    extends: cc.Component,

    properties: {
        selectAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    clickAdventureButton: function(event, customEventData) {
        this.playSelectAudio();
        cc.director.loadScene("stage.fire");
    },

    clickBossButton: function(event, customEventData) {
        this.playSelectAudio();
        cc.log("点击Boss按钮");
    },

    clickNestButton: function(event, customEventData) {
        this.playSelectAudio();
        cc.log("点击怪物窝按钮");
    },

    playSelectAudio: function () {
        cc.audioEngine.play(this.selectAudio, false, 1);
    }
});
