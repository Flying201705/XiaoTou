cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0.01,
        label: {
            default: null,
            type: cc.Label
        },
        loadBar: {
            default: null,
            type: cc.ProgressBar
        },
        // defaults, set visually when attaching this script to the Canvas
        text: '欢迎来到小偷世界!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        this.loadBar.progress = 0;
    },

    // called every frame
    update: function (dt) {
        var progress = this.loadBar.progress;
        if (progress < 1.0) {
            progress += this.speed * dt;
        }
        this.loadBar.progress += progress;
    },
});
