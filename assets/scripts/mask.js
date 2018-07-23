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
        parentNode: cc.Node,
        border: cc.Node,
    },

    onEnable() {
        let self = this;

        this.node.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.node.on('touchend', function (event) {
            console.log('on touchend');


            event.stopPropagation();

            // 点击弹窗外面区域退出弹窗
            let retWord = self.border.getBoundingBoxToWorld();
            console.log('width：' + retWord.width + ' height:' + retWord.height);
            var point = event.getLocation();

            if (!retWord.contains(point)) {
                console.log('hide');
                self.hide();
            }
        });
    },
    onDisable() {
        this.node.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.node.off('touchend', function (event) {
            event.stopPropagation();
        });
        console.log('off touchend');
    },
    hide() {
        this.parentNode.active = false;
    },
});
