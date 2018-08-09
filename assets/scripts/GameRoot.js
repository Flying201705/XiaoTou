const global = require("global");

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
        gamehint: {
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
        this.gameWorld = this.gameNode.getComponent('GameWorld');

        global.event.on("show_buy_prop_dialog", this.showBuyPropDialog.bind(this));
        global.event.on("get_crystal_count", this.getCrystalCount.bind(this));
        global.event.on("update_crystal_count", this.updateCrystalCount.bind(this));
        global.event.on("get_one_chip_price", this.getOneChipPrice.bind(this));
        global.event.on("show_back_pack_dialog", this.showBackPack.bind(this));
        global.event.on("show_hint_dialog", this.showHintDialog.bind(this));

        this.timeCountDownAnim = this.timeCountDown.getComponent(cc.Animation);

        global.resume();
    },
    onDestroy() {
        global.event.off("show_buy_prop_dialog", this.showBuyPropDialog);
        global.event.off("get_crystal_count", this.getCrystalCount);
        global.event.off("update_crystal_count", this.updateCrystalCount);
        global.event.off("get_one_chip_price", this.getOneChipPrice);
        global.event.off("show_back_pack_dialog", this.showBackPack);
        global.event.off("show_hint_dialog", this.showHintDialog);

        cc.loader.release("./config/description_config");
    },
    start() {
        this.showDescDialog();
    },
    showDescDialog() {
        cc.loader.loadRes("./config/description_config", (err, result) => {
            if (err) {
                cc.log("load description_config " + err);
                // cc.director.resume();
                return;
            }

            var config = result["level_" + global.currentLevel];

            if (config === undefined) {
                cc.log("level_" + global.currentLevel + " not exist");
                return;
            }

            if (config.mode === undefined || config.mode === 0) {
                cc.log("mode undefined or 0 ");
                return;
            }

            let descriptionDialog = cc.instantiate(this.description);
            descriptionDialog.getComponent('GameDescription').config(this.node, config);
            descriptionDialog.parent = this.node;

        });

    },
    showBuyPropDialog(propType) {
        var crystalCount = this.getCrystalCount();
        let buyPropDialog = cc.instantiate(this.buyProp);
        buyPropDialog.getComponent('GameBuyProp').config(this.node, propType, crystalCount);
        buyPropDialog.parent = this.node;
    },
    getCrystalCount() {
        return this.gameWorld.crystalCount;
    },
    updateCrystalCount(count) {
        this.gameWorld.updateCrystalCount(count);
    },
    showBackPack() {
        var backPackDialog = cc.instantiate(this.backPack);
        backPackDialog.getComponent('back-pack').config(this.node);
        backPackDialog.parent = this.node;
    },
    getOneChipPrice() {
        return 50;
    },
    showHintDialog: function(hint) {
        var hintDialog = cc.instantiate(this.gamehint);
        hintDialog.getComponent('HintDialog').config(this.node, hint);
        hintDialog.parent = this.node;
    },
});
