// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
import global from './global'
import {InfoHandle} from './InfoData'
import {InfoData} from './InfoData'

cc.Class({
    extends: cc.Component,

    properties: {
        propIconNode: {
            default: null,
            type: cc.Sprite
        },
        propNumNode: {
            default: null,
            type: cc.Label
        },
        propItemFrames: {
            default: [],
            type: cc.SpriteFrame
        },
    },

    onLoad () {
        this.propId = 0;
        this.propNums = new Map();
        this.initPropNum();
    },

    initData: function(index) {
        /**
         * 道具ID对应道具位置
         * 减速 id : 1， 位置: 0
         * 眩晕 id : 2， 位置: 1
         * 炸弹 id : 3， 位置: 2
         * ......
         * **/
        this.propId = index + 1;
        if (index >= 0 && index < this.propItemFrames.length) {
            this.propIconNode.spriteFrame = this.propItemFrames[index];
            this.propNumNode.node.active = true;
        }
    },

    initPropNum: function() {
        if (InfoData.goods === undefined) {
            return;
        }

        for (let i = 0; i < InfoData.goods.length; i++) {
            let gd = InfoData.goods[i];
            if (gd.goodsid > 10) {
                continue;
            }
            this.propNums.set(gd.goodsid, gd.number);
        }
    },

    onPressPropBtn: function() {
        let propNum = this.propNums.get(this.propId);
        if (propNum > 0) {
            this.onPropTrigger(this.propId);
            propNum--;
            this.propNums.set(this.propId, propNum);
            // 更新服务器道具数量
            new InfoHandle().updateGoods(this.propId, -1, null);
        } else {
            this.onPropBuy(this.propId);
        }
    },

    onPropTrigger: function(prop_id) {
        if (prop_id === 1) {
            console.log("施放道具1--全屏减速");
            global.event.fire("release_slow");
        } else if (prop_id === 2) {
            console.log("施放道具2--全屏眩晕");
            global.event.fire("release_stun");
        } else if (prop_id === 3) {
            console.log("施放道具3--炸弹100");
            global.event.fire("release_damage");
        }
    },

    onPropBuy: function(prop_id) {
        if (prop_id === 1) {
            console.log("购买道具1--全屏减速");
            global.event.fire("show_buy_prop_dialog", 1);
        } else if (prop_id === 2) {
            console.log("购买道具2--全屏眩晕");
            global.event.fire("show_buy_prop_dialog", 2);
        } else if (prop_id === 3) {
            console.log("购买道具3--炸弹100");
            global.event.fire("show_buy_prop_dialog", 3);
        }
    },

    addPropNum: function(num) {
        let propNum = this.propNums.get(this.propId);
        if (propNum === undefined) {
            propNum = num;
        } else {
            propNum += num;
        }
        this.propNums.set(this.propId, propNum);
    },

    update (dt) {
        let num = this.propNums.get(this.propId);
        if (num !== undefined) {
            this.propNumNode.getComponent(cc.Label).string = num.toString();
        }
    },
});
