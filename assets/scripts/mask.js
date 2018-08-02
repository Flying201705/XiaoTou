import rank from './rank_list'

cc.Class({
    extends: cc.Component,

    properties: {
        parentNode: cc.Node,
        border: cc.Node,
        mode: {
            default: "OUT_BORDER",
            type: cc.Enum({
                "NONE": 0,
                "OUT_BORDER": 1,
                "BORDER_SIDE": 2,
            })
        }
    },
    onEnable() {
        let self = this;

        this.node.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.node.on('touchend', function (event) {
            console.log('on touchend');
            event.stopPropagation();

            if (self.mode == 0) {
                return;
            }

            // 点击弹窗外面区域退出弹窗
            if (self.border != null) {
                let retWord = self.border.getBoundingBoxToWorld();

                //点击窗口两侧区域消失。
                if (self.mode === 1) {
                    retWord.height = self.getViewHeight();
                    retWord.y = 0;
                }

                console.log('width：' + retWord.width + ' height:' + retWord.height + ' x:' + retWord.x + ' y:' + retWord.y);

                var point = event.getLocation();

                if (!retWord.contains(point)) {
                    console.log('hide');
                    self.hide();
                }
            }
        });
    },
    getViewHeight() {
        return this.parentNode.height;
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
