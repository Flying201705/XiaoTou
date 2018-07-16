// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node
        },
        selfPause: false
    },

    onLoad() {
        if (!cc.director.isPaused()) {
            cc.director.pause();
            this.selfPause = true;
        }
    },
    start() {

    },
    setContentPosition(node, pos) {
        this.parentNode = node;
        this.content.position = pos;
    },
    dismiss() {
        this.parentNode.removeChild(this.node);
        if (this.selfPause) {
            cc.director.resume();
            this.selfPause = false;
        }
    }
});
