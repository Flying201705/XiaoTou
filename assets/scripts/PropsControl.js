import global from './global'
import {InfoHandle} from './InfoData'
import {InfoData} from './InfoData'

cc.Class({
    extends: cc.Component,

    properties: {
        btn1Num: {
            default: null,
            type: cc.Label
        },
        btn2Num: {
            default: null,
            type: cc.Label
        },
        btn3Num: {
            default: null,
            type: cc.Label
        },
    },

    onLoad: function () {
        this.initData();
    },

    initData: function() {
        this.decelerationNum = 0;
        this.dizzinessNum = 0;
        this.bombNum = 0;
        if (InfoData.goods === undefined) {
            return;
        }

        for (let i = 0; i < InfoData.goods.length; i++) {
            let gd = InfoData.goods[i];
            if (gd.goodsid == 1) {
                this.decelerationNum = gd.number;
            } else if (gd.goodsid == 2) {
                this.dizzinessNum = gd.number;
            } else if (gd.goodsid == 3) {
                this.bombNum = gd.number;
            }
        }
    },

    update: function (dt) {
        this.btn1Num.getComponent(cc.Label).string = this.decelerationNum.toString();
        this.btn2Num.getComponent(cc.Label).string = this.dizzinessNum.toString();
        this.btn3Num.getComponent(cc.Label).string = this.bombNum.toString();
    },

    onPressSummonBtn: function () {
        global.event.fire("summon_hero");
    },

    onPressProp1Btn: function () {
        if (this.decelerationNum > 0) {
            console.log("施放道具1--全屏减速");
            global.event.fire("release_slow");
            this.decelerationNum--;
            new InfoHandle().updateGoods(1, -1, null);
        } else {
            console.log("购买道具1--全屏减速");
            global.event.fire("show_buy_prop_dialog", 1);
        }
    },

    onPressProp2Btn: function () {
        if (this.dizzinessNum > 0) {
            console.log("施放道具2--全屏眩晕");
            global.event.fire("release_stun");
            this.dizzinessNum--;
            new InfoHandle().updateGoods(2, -1, null);
        } else {
            console.log("购买道具2--全屏眩晕");
            global.event.fire("show_buy_prop_dialog", 2);
        }
    },

    onPressProp3Btn: function () {
        if (this.bombNum > 0) {
            console.log("施放道具3--炸弹100");
            global.event.fire("release_damage");
            this.bombNum--;
            new InfoHandle().updateGoods(3, -1, null);
        } else {
            console.log("购买道具3--炸弹100");
            global.event.fire("show_buy_prop_dialog", 3);
        }
    },

    addProp: function (type, num) {
        if (type === 1) {
            this.decelerationNum += num;
        } else if (type === 2) {
            this.dizzinessNum += num;
        } else if (type === 3) {
            this.bombNum += num;
        }

        new InfoHandle().updateGoods(type, num, null);
    },
});
