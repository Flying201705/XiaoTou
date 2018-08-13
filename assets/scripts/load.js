const login = require('./common/login');

cc.Class({
    extends: cc.Component,

    properties: {
        loadBar: cc.ProgressBar
    },

    onLoad: function () {
        this.loadBar.progress = 0;
        login.login();
    },

    start() {
        let self = this;
        cc.loader.onProgress = function (completedCount, totalCount, item) {
            self.loadBar.progress = completedCount / totalCount;
        };
        cc.director.preloadScene('main.fire', () => {
            cc.loader.onProgress = null;
            cc.director.loadScene('main.fire');
        });
    }
});
