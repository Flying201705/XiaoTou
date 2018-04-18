import global from "./global";

cc.Class({
    extends: cc.Component,

    properties: {
        // PageViewLabel: {
        //     default: null,
        //     type: cc.Label
        // },
    },

    onLoad: function () {
        this.pageIndex = 0;
        // this.PageViewLabel.string = PageNames[this.pageIndex];

    },
    pageViewClick: function (event, coustomData) {
        let node = event.node;
        this.pageIndex = node.getComponent(cc.PageView).getCurrentPageIndex();
        // this.PageViewLabel.string = PageNames[this.pageIndex];
        cc.log('page index ' + this.pageIndex);
        // let content = node.getComponent(cc.PageView).content;
        // for (let i = 0; i < content.children.length; i++) {
        //     content.children[i].setScale(0.8);
        //     if (i === this.pageIndex) {
        //         content.children[i].setScale(1);
        //     }
        // }

    },
    startGameClick: function (event, coustomData) {
        cc.log('page index' + this.pageIndex);
        global.currentLevel = this.pageIndex + 1;
        cc.director.loadScene("game");
    }
});
