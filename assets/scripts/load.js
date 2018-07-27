import global from "./global";

const login = require('./common/login');

cc.Class({
    extends: cc.Component,

    properties: {
        loadBar: cc.ProgressBar
    },

    // use this for initialization
    onLoad: function () {
        this.loadBar.progress = 0;
        login.login();
    },

    start() {
        cc.director.preloadScene('main.fire', () => {
            this.loadBar.progress = 1;
            this.scheduleOnce(this.goToMainScene, 0.1);
        });
    },

    // called every frame
    update: function (dt) {
        if (this.loadBar.progress < 0.99) {
            this.loadBar.progress += 0.5 * dt;
        }
    },

    goToMainScene: function () {
        cc.director.loadScene('main.fire');
    },
});
