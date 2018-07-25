import rank from './rank_list'

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
            if (self.border != null) {
                let retWord = self.border.getBoundingBoxToWorld();
                console.log('width：' + retWord.width + ' height:' + retWord.height);
                var point = event.getLocation();

                if (!retWord.contains(point)) {
                    console.log('hide');
                    self.hide();
                }
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
        rank.hide();
    },
});
