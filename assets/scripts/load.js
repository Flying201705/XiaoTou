const login = require('./common/login');
const qmHelper = require("./common/QmHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        loadBar: cc.ProgressBar
    },

    onLoad: function () {
        this.loadBar.progress = 0;
        login.login(this.loginSuccess.bind(this));
    },

    loginSuccess() {
        qmHelper.init(this.loadMain.bind(this));
    },

    loadMain() {
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
