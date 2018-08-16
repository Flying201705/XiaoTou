import rank from './rank_list'
const global = require("global");

cc.Class({
    extends: cc.Component,

    properties: {
        parentNode: cc.Node,
        border: cc.Node,
        mode: {
            default: 0,
            type: cc.Enum({
                "NONE": 0,
                "OUT_BORDER": 1,
                "BORDER_SIDE": 2,
            })
        }
    },
    onEnable() {
        let self = this;
        let parentSelf = this.parentSelf;

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
                if (self.mode === 2) {
                    retWord.height = self.getViewHeight();
                    retWord.y = 0;
                }

                console.log('width：' + retWord.width + ' height:' + retWord.height + ' x:' + retWord.x + ' y:' + retWord.y);

                let point = event.getLocation();

                if (!retWord.contains(point)) {
                    console.log('hide');
                    self.onHide(parentSelf);
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
        if (this.parentNode != null) {
            this.parentNode.active = false;
        }
        rank.hide();
    },
    onHide() {
        cc.info('onHide');
    },
    setSelf(self) {
        this.parentSelf = self;
    }
});
