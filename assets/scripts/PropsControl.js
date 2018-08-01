import global from './global'
import {InfoHandle} from './InfoData'
import {InfoData} from './InfoData'

cc.Class({
    extends: cc.Component,

    properties: {
        propItemPrefab: {
            default: null,
            type: cc.Prefab
        },
        propItemNodes: {
            default: [],
            type: cc.Node
        },
    },

    onLoad: function () {
        this.initPropNum();

        for (let i = 0; i < this.propItemNodes.length; i++) {
            let propItem = cc.instantiate(this.propItemPrefab);
            propItem.parent = this.propItemNodes[i];
            let num = 10;
            if (this.propNums) {
                num = this.propNums.get(i + 1);
            }
            propItem.getComponent("prop-item").initData(i, num);
        }
    },

    initPropNum: function () {
        if (InfoData.goods === undefined) {
            return;
        }

        this.propNums = new Map();
        for (let i = 0; i < InfoData.goods.length; i++) {
            let gd = InfoData.goods[i];
            if (gd.goodsid > 10) {
                continue;
            }
            this.propNums.set(gd.goodsid, gd.number);
        }
    },

    onPressSummonBtn: function () {
        global.event.fire("summon_hero");
    },

    addProp: function (type, num) {
        /**
         * 道具ID对应道具位置
         * 减速 id : 1， 位置: 0
         * 眩晕 id : 2， 位置: 1
         * 炸弹 id : 3， 位置: 2
         * ......
         * **/
        let index = type - 1;
        if (index < this.propItemNodes.length) {
            this.propItemNodes[index].getChildByName('prop_item').getComponent("prop-item").addPropNum(num);
            new InfoHandle().updateLocalGoods(type, num, null);
        }
    },
});
