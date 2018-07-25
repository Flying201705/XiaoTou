// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import {InfoHandle, InfoData} from './InfoData'
import global from './global'

cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            default: null,
            type: cc.Node
        },
        container: {
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

            // 点击弹窗外面区域退出弹窗
            let retWord = self.container.getBoundingBoxToWorld();
            var point = event.getLocation();

            if (!retWord.contains(point)) {
                self.hideDialog();
            }
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
        // cc.director.pause();
        // global.pause = true;
        global.pause();
    },
    config(parentNode) {
        this.parentNode = parentNode;
        this.fillData();
        this.fetchData();
    },
    hideDialog() {
        cc.log('bunny hideDialog');
        this.parentNode.removeChild(this.node);
        this.parentNode = null;
        // cc.director.resume();
        // global.pause = false;
        global.resume();
    },
    configHeroChips(opt) {
        var children = this.heroItemContainer.node.children;
        if (children.length > 0) {
            cc.log('bunny-configHeroChips-1')
            for (var i = 0; i < children.length; ++i) {
                children[i].getComponent('chipItem').config(opt);
            }
        } else {
            cc.log('bunny-configHeroChips-2')
            for (let i = 0; i < 1; i++) {
                let item = cc.instantiate(this.itemPrefab);
                item.getComponent('chipItem').config(opt);
                this.heroItemContainer.node.addChild(item);
                cc.log('add hero')
            }
        }

    },
    configPropChips(opt) {
        var children = this.propItemContainer.node.children;
        if (children.length > 0) {
            for (var i = 0; i < children.length; ++i) {
                children[i].getComponent('chipItem').config(opt);
            }
        } else {
            for (let j = 0; j < 3; j++) {
                let item = cc.instantiate(this.itemPrefab);
                item.getComponent('chipItem').config(opt);
                this.propItemContainer.node.addChild(item);
                // cc.log('add prop ' + j);
            }
        }
    },
    fetchData() {
        cc.log('bunny fetchData()-2')
        var infoHandle = new InfoHandle();
        infoHandle.dataCompleteCallback = (type) => {
            cc.log('bunny dataUpdateComplete callback type:' + type)
            // 仅监听物品数据更新
            if (type != InfoData.TOKEN_GOODS) {
                return;
            }

            this.fillData();
        };

        infoHandle.getGoodsById(InfoData.user.id);


    },
    fillData() {
        var config = {kind: 0, chipIds: []};
        for (let i = 0; i < InfoData.goods.length; i++) {
            var goodsInfo = InfoData.goods[i];
            cc.log('fillData() id:' + goodsInfo.goodsid + " num:" + goodsInfo.number);

            if (goodsInfo.number <= 0) {
                continue;
            }

            var chipType = goodsInfo.goodsid.toString().substring(0, 3);
            cc.log('chipType:' + chipType)

            // 英雄碎片
            if (chipType == 100 && goodsInfo.goodsid > 1000 && config['chipIds'].indexOf(goodsInfo.goodsid) < 0) {
                config['chipIds'].push(goodsInfo.goodsid);
            }
        }

        // config['composed'] = new InfoHandle().hasHero();

        this.configHeroChips(config);

        // 二期开放功能。
        this.configPropChips({kind: 2, composed: true});
    }
});
