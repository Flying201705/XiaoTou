
cc.Class({
    extends: cc.Component,

    properties: {
        towerBuild: {
            default: null,
            url: cc.AudioClip
        },
        towerDeselect: {
            default: null,
            url: cc.AudioClip
        },
        towerSelect: {
            default: null,
            url: cc.AudioClip
        },
        towerSell: {
            default: null,
            url: cc.AudioClip
        },
        towerUpdate: {
            default: null,
            url: cc.AudioClip
        },
        winAudio: {
            default: null,
            url: cc.AudioClip
        },

        loseAudio: {
            default: null,
            url: cc.AudioClip
        },
    },

    _playSFX: function(clip) {
        cc.audioEngine.playEffect( clip, false );
    },

    playWin: function() {
        this._playSFX(this.winAudio);
    },

    playLose: function() {
        this._playSFX(this.loseAudio);
    },

    playTowerBuild: function() {
        this._playSFX(this.towerBuild);
    },

    playTowerDeselect: function() {
        this._playSFX(this.towerDeselect);
    },

    playTowerSelect: function() {
        this._playSFX(this.towerSelect);
    },

    playTowerSell: function() {
        this._playSFX(this.towerSell);
    },

    playTowerUpdate: function() {
        this._playSFX(this.towerUpdate);
    },
});
