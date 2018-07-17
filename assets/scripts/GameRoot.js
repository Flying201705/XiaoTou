import global from './global'

cc.Class({
    extends: cc.Component,

    properties: {
        description: {
            default: null,
            type: cc.Prefab
        },
    },

    start() {
        this.showDescDialog();
    },
    showDescDialog() {
        let descriptionDialog = cc.instantiate(this.description);
        descriptionDialog.getComponent('GameDescription').config(this.node, global.currentLevel);
        descriptionDialog.parent = this.node;
    }
});
