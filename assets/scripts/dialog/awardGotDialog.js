cc.Class({
    extends: cc.Component,

    properties: {
        itemContainer: cc.Node,
        itemPrefab: cc.Prefab
    },

    // onLoad () {},

    start() {

    },
    config(configs) {
        if (configs.length == 1) {
            let itemNode = this._getItem(configs[0]);
            this.itemContainer.addChild(itemNode);
        } else if (configs.length > 1) {
            let itemNodeLeft = this._getItem(configs[0], 'left');
            let itemNodeRight = this._getItem(configs[1], 'right');
            this.itemContainer.addChild(itemNodeLeft);
            this.itemContainer.addChild(itemNodeRight);
        }
    },
    onClickOk() {
        this.node.removeFromParent();
        this.node.destroy();
    },
    _getItem(conf, position) {
        let item = cc.instantiate(this.itemPrefab).getComponent('awardGotItem');
        item.set(this._getSprite(conf.type), conf.count);
        switch (position) {
            case 'left':
                item.node.setPositionX(-this.itemContainer.width / 2);
                break;
            case 'right':
                item.node.setPositionX(this.itemContainer.width / 2);
                break;
        }
        return item.node;
    },
    _getSprite(type) {
        let sf = null;
        switch (type) {
            case 0:
                sf = new cc.SpriteFrame(cc.url.raw('resources/image/crystal.png'));
                break;
            case 1:
                sf = new cc.SpriteFrame(cc.url.raw('resources/image/deceleration.png'));
                break;
            case 2:
                sf = new cc.SpriteFrame(cc.url.raw('resources/image/dizziness.png'));
                break;
            case 3:
                sf = new cc.SpriteFrame(cc.url.raw('resources/image/bomb.png'));
                break;
        }

        return sf;
    }
});
