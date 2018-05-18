
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
                item.init(i + 1, Math.floor(Math.random()*10+1) % 2 === 1, Math.floor(Math.random()*3+1));
                this.node.addChild(item.node);
            }
            this.itemList.push(item);
        }
    },
});
