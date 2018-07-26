import {InfoData} from './InfoData'

var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        rootNode: cc.Node,
        loadingMaskPrefab: cc.Prefab,
        itemPrefab: cc.Prefab,
        itemCount: 0,
        scrollView: cc.ScrollView,
    },

    onLoad() {
        self = this;
        this.firstLockLevel = -1;
        this.itemHeight = 0;
        this.initList();
    },

    initList: function () {
        for (let i = 0; i < this.itemCount; ++i) {
            let item = cc.instantiate(this.itemPrefab).getComponent('StageItem');
            if (item !== null) {
                item.preOnClick = this.showLoadingMask;
                if (i < InfoData.user.level) {
                    if (i < InfoData.levels.length) {
                        item.init(i + 1, false, InfoData.levels[i].stars);
                    } else {
                        item.init(i + 1, false, 0);
                    }
                } else {
                    item.init(i + 1, true, 0);
                    if (this.firstLockLevel < 0) {
                        this.firstLockLevel = i + 1;
                        this.itemHeight = item.node.height;
                    }
                }
                // 测试代码开始
                // 放开所有关卡
                // item.init(i + 1, false, 1);
                //测试代码结束
                this.node.addChild(item.node);
            }
        }
    },
    showLoadingMask() {
        let loadingMask = cc.instantiate(self.loadingMaskPrefab);
        loadingMask.parent = self.rootNode;
    },
    onEnable() {
        this.initScrollViewPos();
    },

    initScrollViewPos: function () {
        let layout = this.getComponent(cc.Layout);
        layout.updateLayout();

        let moveStep = Math.floor(this.firstLockLevel / 5);
        let remainder = this.firstLockLevel % 5;
        if (remainder === 0) {
            moveStep -= 1;
            moveStep = moveStep < 0 ? 0 : moveStep;
        }
        let offsetY = moveStep * (this.itemHeight + layout.spacingY);

        this.scrollView.scrollToOffset(cc.p(0, offsetY), 0.1);
    }
});