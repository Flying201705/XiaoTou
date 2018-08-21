cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.ProgressBar
    },

    onLoad() {
        this.progressBar.progress = 0;
    },

    onProgress(progress) {
        this.progressBar.progress = progress;
    },

    onFinished() {
        this.progressBar.progress = 1;
    }

});
