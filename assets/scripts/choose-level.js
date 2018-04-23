import global from "./global";

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {

    },
    startGameClick: function (event, customEventData) {
        cc.log('select level : ' + customEventData);
        global.currentLevel = customEventData;
        cc.director.loadScene("game");
    }
});
