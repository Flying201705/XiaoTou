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

    // called every frame
    update: function (dt) {
        if (this.loadBar.progress < 0.99) {
            this.loadBar.progress += 0.5 * dt;
        } else {
            this.isLoad = true;
            if (this.isLoad !== global.loadRes) {
                global.loadRes = true;
                this.goToMainScene();
            }
        }
    },
    goToMainScene: function () {
        cc.director.loadScene("main.fire", () => {
            // main启动后，load场景已经销毁，this.loadBar已经找不到对象了，会报错。
            // this.loadBar.progress = 1;
        });
    },
});
