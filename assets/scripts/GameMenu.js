cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.active = false;
    },

    showMenu: function () {
        cc.director.pause();
        this.node.active = true;
    },

    hideMenu: function () {
        this.node.active = false;
        cc.director.resume();
    },

    resumeGame: function() {
        this.node.active = false;
        cc.director.resume();
    },
});
