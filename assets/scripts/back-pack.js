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
        this.fetchData();
    },
    dismiss() {
        this.parentNode.removeChild(this.node);
        this.parentNode = null;
        cc.director.resume();
    },
    configHeroChips(opt) {
        for (let i = 0; i < 1; i++) {
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent('chipItem').config(opt);
            this.heroItemContainer.node.addChild(item);
            cc.log('add hero')
        }
    },
    configPropChips(opt) {
        for (let j = 0; j < 3; j++) {
            let item = cc.instantiate(this.itemPrefab);
            item.getComponent('chipItem').config(opt);
            this.propItemContainer.node.addChild(item);
            cc.log('add prop ' + j);
        }
    },
    fetchData() {
        cc.log('bunny fetchData()-2')
        // var infoHandle = new InfoHandle();
        // infoHandle.dataUpdateComplete = type => {
        //     cc.log('bunny dataUpdateComplete callback')
        //     // 仅监听物品数据更新
        //     if (type != 3) {
        //         return;
        //     }
        //
        //     var config = {kind: 0, crystalCount: 50};
        //     for (let i = 0; i < InfoData.goods.length; i++) {
        //         var goodsInfo = InfoData.goods[i];
        //         cc.log('bunny id:' + goodsInfo.goodsid);
        //     }
        //
        //
        //     // this.configHeroChips();
        //
        // };
        //
        // infoHandle.getGoodsById(InfoData.user.id);

        var config = {kind: 0, crystalCount: 50};
        for (let i = 0; i < InfoData.goods.length; i++) {
            var goodsInfo = InfoData.goods[i];
            cc.log('bunny id:' + goodsInfo.goodsid);
            if (goodsInfo.goodsid == 1001) {
                config['chip0'] = 1;
            } else if (goodsInfo.goodsid == 1002) {
                config['chip1'] = 1;
            } else if (goodsInfo.goodsid == 1003) {
                config['chip2'] = 1;
            }
        }

        this.configHeroChips(config);
        // 二期开放功能。
        this.configPropChips({kind:2});
    }
});
