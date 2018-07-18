import global from './global'

cc.Class({
    extends: cc.Component,

    properties: {
        timeCountDown: {
            default: null,
            type: cc.Node
        },
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
        },
        backPack: {
            default: null,
            type: cc.Prefab
        },
    },
    update() {
        if (global.isPause()) {
            this.timeCountDownAnim.pause();
        } else {
            this.timeCountDownAnim.resume();
        }
    },
    onLoad() {
        global.event.on("show_buy_prop_dialog", this.showBuyPropDialog.bind(this));
        global.event.on("get_crystal_count", this.getCrystalCount.bind(this));
        global.event.on("update_crystal_count", this.updateCrystalCount.bind(this));

        this.timeCountDownAnim = this.timeCountDown.getComponent(cc.Animation);
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
    showBackPack() {
        var backPackDialog = cc.instantiate(this.backPack);
        backPackDialog.getComponent('back-pack').config(this.node);
        backPackDialog.parent = this.node;
    }
});
