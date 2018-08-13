const global = require("global");
const config = require("common/config");
import {InfoData} from './InfoData'

cc.Class({
    extends: cc.Component,

    properties: {
        stagehint: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        global.event.on("show_stage_hint_dialog", this.showStageHintDialog.bind(this));
    },

    onDestroy() {
        global.event.off("show_stage_hint_dialog", this.showStageHintDialog);
    },

    start () {
        if (InfoData.user.level >= config.openLevel) {
            let hintDialog = cc.instantiate(this.stagehint);
            hintDialog.getComponent('StageHintDialog').config(this.node, `您已完成所有开放关卡\n敬请期待新关卡开放`);
            hintDialog.parent = this.node;
        }
    },

    // update (dt) {},

    showStageHintDialog: function() {
        let hintDialog = cc.instantiate(this.stagehint);
        hintDialog.getComponent('StageHintDialog').config(this.node, `继续前面的关卡，可以解锁更多关卡\n加油哦~`);
        hintDialog.parent = this.node;
    },
});
