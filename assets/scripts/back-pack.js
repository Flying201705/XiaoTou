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
        this.mask.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.on('touchend', function (event) {
            event.stopPropagation();
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
    onLoad() {

        // if (!cc.director.isPaused()) {
        // cc.director.pause();
        // this.selfPause = true;
        // }


    },
    // start() {
    //
    // },
    setContentPosition(node, pos) {
        this.parentNode = node;
        // this.content.position = pos;
    },
    config() {
        for (let i = 0; i < 1; i++) {
            let item = cc.instantiate(this.itemPrefab);
            this.heroItemContainer.node.addChild(item);
            cc.log('add hero')
        }

        for (let j = 0; j < 3; j++) {
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent('chipItem').config(j);
            this.propItemContainer.node.addChild(item);
            cc.log('add prop ' + j);
        }
    },
    dismiss() {
        this.parentNode.removeChild(this.node);
        this.parentNode = null;
        cc.director.resume();
        // if (this.selfPause) {
        // this.selfPause = false;
        // }
    }
});
