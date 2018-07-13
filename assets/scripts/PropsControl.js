import global from './global'

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
        this.decelerationNum = 1;
        this.dizzinessNum = 2;
        this.bombNum = 3;
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
    },
});
