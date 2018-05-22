import {InfoData} from './InfoData'
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        itemCount: 0,
        scrollView: cc.ScrollView,
    },

    onLoad () {
        this.itemList = [];
        this.initList();
    },

    initList: function () {
        for (let i = 0; i < this.itemCount; ++i) {
            let item = cc.instantiate(this.itemPrefab).getComponent('StageItem');
            if (item !== null) {
                if (i < InfoData.user.level) {
                    if (i < InfoData.levels.length) {
                        item.init(i + 1, false, InfoData.levels[i].stars);
                    } else {
                        item.init(i + 1, false, 0);
                    }
                } else {
                    item.init(i + 1, true, 0);
                }
                // 测试代码开始
                // 放开所有关卡
                //item.init(i + 1, false, 1);
                //测试代码结束
                this.node.addChild(item.node);
            }
            this.itemList.push(item);
        }
    },
});