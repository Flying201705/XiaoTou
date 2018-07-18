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
        mask: {
            default: null,
            type: cc.Node
        },
        heroItemContainer: {
            default: null,
            type: cc.Layout
        },
        propItemContainer: {
            default: null,
            type: cc.Layout
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab
        }
        // selfPause: false
    },
    onEnable() {
        let self = this;
        this.mask.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.on('touchend', function (event) {
            event.stopPropagation();
            self.dismiss();
        });
    },
    onDisable() {
        this.mask.off('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.off('touchend', function (event) {
            event.stopPropagation();
        });
    },
    start() {
        cc.director.pause();
    },
    config(parentNode) {
        this.parentNode = parentNode;

        for (let i = 0; i < 1; i++) {
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent('chipItem').config({kind: 0, chipCount: 2, crystalCount: 50});
            this.heroItemContainer.node.addChild(item);
            cc.log('add hero')
        }

        for (let j = 0; j < 3; j++) {
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent('chipItem').config({kind: 1, propType: j, chipCount: j + 1, crystalCount: 50});
            this.propItemContainer.node.addChild(item);
            cc.log('add prop ' + j);
        }
    },
    dismiss() {
        this.parentNode.removeChild(this.node);
        this.parentNode = null;
        cc.director.resume();
    }
});
