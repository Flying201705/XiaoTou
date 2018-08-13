const global = require("global");

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

    },

    // update (dt) {},

    showStageHintDialog: function(hint) {
        let hintDialog = cc.instantiate(this.stagehint);
        hintDialog.getComponent('StageHintDialog').config(this.node, hint);
        hintDialog.parent = this.node;
    },
});
