import {InfoData, InfoHandle} from "./InfoData";
const global = require("global");
const config = require("./common/config");

cc.Class({
    extends: cc.Component,

    properties: {
        index: 1,
        label: {
            default: null,
            type: cc.Label
        },
        star1: {
            default: null,
            type: cc.Node
        },
        star2: {
            default: null,
            type: cc.Node
        },
        star3: {
            default: null,
            type: cc.Node
        },
        lock: {
            default: null,
            type: cc.Node
        },
        button: {
            default: null,
            type: cc.Button
        },
        clickAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    init: function (index, isLock, star) {
        this.index = index;
        this.label.string = index.toString();
        this.button.enabled = !isLock;

        if (isLock === true) {
            this.lock.active = true;
            this.star1.active = false;
            this.star2.active = false;
            this.star3.active = false;
        } else if (star === 1) {
            this.lock.active = false;
            this.star1.active = true;
            this.star2.active = false;
            this.star3.active = false;
        } else if (star === 2) {
            this.lock.active = false;
            this.star1.active = true;
            this.star2.active = true;
            this.star3.active = false;
        } else if (star === 3) {
            this.lock.active = false;
            this.star1.active = true;
            this.star2.active = true;
            this.star3.active = true;
        } else {
            this.lock.active = false;
            this.star1.active = false;
            this.star2.active = false;
            this.star3.active = false;
        }
    },

    startGameClick: function (event, customEventData) {
        if (this.index > 30) {
            let minStars = 25 * Math.floor(this.index / 10);
            let currentStars = new InfoHandle().getStarsForLevels();
            // console.log("zhangxx minStars = " + minStars + ", currentStars = " + currentStars);
            if (currentStars < minStars) {
                let hint = `您已获得 <size=20>${currentStars}</size> 颗星星\n还需 <size=20><color=#fa6868>${minStars - currentStars}</color></size> 颗星星解锁此关`;
                this.showStageHintDialog(hint);
                return;
            }
        }

        if (this.index > config.openLevel) {
            let hint = `您已完成所有开放关卡\n敬请期待新关卡开放`;
            this.showStageHintDialog(hint);
            return;
        }
        this.preOnClick && this.preOnClick();
        cc.audioEngine.playEffect(this.clickAudio, false);

        new InfoHandle().checkUserById({
            success: () => {
                cc.info('check user success');
                this.loadSceneByIndex();
            },
            fail:()=>{
                cc.info('check user fail');
                this.onFail();
            }
        });

    },
    loadSceneByIndex() {
        global.currentLevel = this.index;
        cc.info('select level : ' + global.currentLevel);
        cc.director.loadScene("game");
        cc.info('after load game scene');
    },

    showStageHintDialog(hint) {
        global.event.fire("show_stage_hint_dialog", hint);
    },

    preOnClick() {

    },
    onFail(){

    }
});
