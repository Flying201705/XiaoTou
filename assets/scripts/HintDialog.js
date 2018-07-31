// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import global from './global'
// 游戏提示对话框
cc.Class({
    extends: cc.Component,

    properties: {
        hintText: {
            default: null,
            type: cc.RichText
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    config(parentNode, hint) {
        this.parentNode = parentNode;
        this.hintText.string = hint;
    },

    hideDialog: function() {
        this.parentNode.removeChild(this.node);
        this.parentNode = null;
        global.resume();
    },
});
