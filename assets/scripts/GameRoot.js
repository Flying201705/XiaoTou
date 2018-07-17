import global from './global'

cc.Class({
    extends: cc.Component,

    properties: {
        description: {
            default: null,
            type: cc.Prefab
        },
        buyProp: {
            default: null,
            type: cc.Prefab
        },
        gameNode: {
            default: null,
            type: cc.Node
        }
    },
    onLoad() {
        global.event.on("show_buy_prop_dialog", this.showBuyPropDialog.bind(this));
        global.event.on("get_crystal_count", this.getCrystalCount.bind(this));
        global.event.on("update_crystal_count", this.updateCrystalCount.bind(this));
    },
    start() {
        this.showDescDialog();
    },
    showDescDialog() {
        let descriptionDialog = cc.instantiate(this.description);
        descriptionDialog.getComponent('GameDescription').config(this.node, global.currentLevel);
        descriptionDialog.parent = this.node;
    },
    showBuyPropDialog(propType) {
        this.gameWorld = this.gameNode.getComponent('GameWorld');
        var crystalCount = this.getCrystalCount();
        let buyPropDialog = cc.instantiate(this.buyProp);
        buyPropDialog.getComponent('GameBuyProp').config(this.node, propType, crystalCount);
        buyPropDialog.parent = this.node;
    },
    getCrystalCount() {
        return this.gameWorld.crystalCount;
    },
    updateCrystalCount(count) {
        this.gameWorld.crystalCount = count;
        this.gameWorld.crystalLabel.string = count.toString();
    },
});
