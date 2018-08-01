import global from './global'
import {InfoHandle} from './InfoData'
import {InfoData} from './InfoData'

cc.Class({
    extends: cc.Component,

    properties: {
        propIcon: cc.Sprite,
        propNumLabel: cc.Label,
        coolDownProgress: cc.ProgressBar,
    },

    onLoad() {
        this.propId = 0;
        this.propNums = 0;
        this.coolDownTime = 20000; //道具冷却时间 单位ms
    },

    initData: function (index, num) {
        /**
         * 道具ID对应道具位置
         * 减速 id : 1， 位置: 0
         * 眩晕 id : 2， 位置: 1
         * 炸弹 id : 3， 位置: 2
         * ......
         * **/
        this.propId = index + 1;
        if (num) {
            this.propNums = num;
        }
        this.propNumLabel.string = this.propNums.toString();

        switch (this.propId) {
            case 1:
                this.propIcon.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/image/deceleration.png'));
                this.propNumLabel.node.active = true;
                break;
            case 2:
                this.propIcon.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/image/dizziness.png'));
                this.propNumLabel.node.active = true;
                break;
            case 3:
                this.propIcon.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/image/bomb.png'));
                this.propNumLabel.node.active = true;
                break;
            default:
                break;
        }
    },

    onPressPropBtn: function () {
        if (this.propNums > 0) {
            if (this.isCoolDown()) {
                return;
            }
            this.onPropTrigger(this.propId);

            this.propNums--;
            this.propNumLabel.string = this.propNums.toString();

            new InfoHandle().updateLocalGoods(this.propId, -1, null);
        } else {
            this.onPropBuy(this.propId);
        }
    },

    onPropTrigger: function (prop_id) {
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

        this.coolDown();
    },

    onPropBuy: function (prop_id) {
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

    addPropNum: function (num) {
        if (this.propNums === undefined) {
            this.propNums = num;
        } else {
            this.propNums += num;
        }
        this.propNumLabel.string = this.propNums.toString();
    },

    coolDown: function () {
        this.coolDownProgress.progress = 1;

        this.updateProgress();
    },

    updateProgress: function () {
        if (this.coolDownProgress.progress <= 0) {
            return;
        }

        let self = this;
        this.scheduleOnce(function () {
            if (!global.isPause()) {
                self.coolDownProgress.progress -= 10 / this.coolDownTime;
            }
            self.updateProgress();
        }, 0.1);
    },

    isCoolDown: function () {
        return this.coolDownProgress.progress > 0;
    }
});
