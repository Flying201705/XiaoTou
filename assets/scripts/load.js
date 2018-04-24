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
        //测试程序
        //this.sendPostRequest();
    },

    // called every frame
    update: function (dt) {
        var progress = this.loadBar.progress;
        if (progress < 1.0) {
            progress += this.speed * dt;
        } else {
            cc.director.loadScene("main.fire");
        }
        this.loadBar.progress += progress;
    },

    sendPostRequest:function () {
        var url="http://zhang395295759.xicp.net:30629/xiaotou/user/getUserInfoId.do?id=100";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log("<test> : " + response);
            }
        }
        xhr.open("GET", url, true);
        xhr.send();
    }
});
