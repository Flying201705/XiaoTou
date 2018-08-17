const global = require("global");

cc.Class({
    extends: cc.Component,

    properties: {
        timeCountDown: {
            default: null,
            type: cc.Animation
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
        crystalhint: {
            default: null,
            type: cc.Label
        },
        addCrystalDialog: cc.Prefab,
        noviceGift: {
            default: null,
            type: cc.Prefab
        },
        awardGotDialog: cc.Prefab,
    },

    onLoad() {
        this.gameWorld = this.gameNode.getComponent('GameWorld');

        global.event.on("show_buy_prop_dialog", this.showBuyPropDialog.bind(this));
        global.event.on("get_crystal_count", this.getCrystalCount.bind(this));
        global.event.on("update_crystal_count", this.updateCrystalCount.bind(this));
        global.event.on("get_one_chip_price", this.getOneChipPrice.bind(this));
        global.event.on("show_back_pack_dialog", this.showBackPack.bind(this));
        global.event.on("show_hint_dialog", this.showHintDialog.bind(this));
        global.event.on("add_crystal_hint", this.addCrystalHint.bind(this));
        global.event.on("show_gift_dialog", this.showGiftDialog.bind(this));

        cc.loader.loadRes("./config/description_config", this.loadDescConfigCallback.bind(this));
    },
    onDestroy() {
        global.event.off("show_buy_prop_dialog", this.showBuyPropDialog);
        global.event.off("get_crystal_count", this.getCrystalCount);
        global.event.off("update_crystal_count", this.updateCrystalCount);
        global.event.off("get_one_chip_price", this.getOneChipPrice);
        global.event.off("show_back_pack_dialog", this.showBackPack);
        global.event.off("show_hint_dialog", this.showHintDialog);
        global.event.off("add_crystal_hint", this.addCrystalHint);
        global.event.off("show_gift_dialog", this.showGiftDialog);

        cc.loader.release("./config/description_config");
    },

    loadDescConfigCallback(err, result) {
        if (err) {
            cc.log("load description_config " + err);
            this.startCountDown();
        } else {
            let config = result["level_" + global.currentLevel];
            if (config === undefined) {
                cc.log("level_" + global.currentLevel + " not exist");
                this.startCountDown();
            } else if (config.mode === undefined || config.mode === 0) {
                cc.log("mode undefined or 0 ");
                this.startCountDown();
            } else {
                this.showDescDialog(config);
            }
        }
    },

    startCountDown() {
        this.timeCountDown.play("time_count_down");
    },

    showDescDialog(config) {
        let descriptionDialog = cc.instantiate(this.description);
        descriptionDialog.getComponent('GameDescription').config(this, config);
        descriptionDialog.parent = this.node;
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
    showHintDialog: function (hint) {
        var hintDialog = cc.instantiate(this.gamehint);
        hintDialog.getComponent('HintDialog').config(this.node, hint);
        hintDialog.parent = this.node;
    },
    hideCrystalHint: function (count) {
        this.crystalhint.string = "";
        this.crystalhint.node.active = false;
    },
    addCrystalHint: function (count) {
        this.crystalhint.string = "水晶+" + count;
        this.crystalhint.node.active = true;
        this.scheduleOnce(this.hideCrystalHint, 3);
    },

    onClickAddCrystal() {
        let addCrystal = cc.instantiate(this.addCrystalDialog);
        addCrystal.parent = this.node;
    },

    showGiftDialog: function () {
        let giftDialog = cc.instantiate(this.noviceGift);
        let giftDialogController = giftDialog.getComponent('NoviceGiftDialog');
        giftDialogController.config(this.node);
        giftDialogController.onHideDialog = this._onGiftDialogHide.bind(this);
        giftDialog.parent = this.node;
    },
    _onGiftDialogHide(giftConfig) {
        let awardGotDialog = cc.instantiate(this.awardGotDialog);
        awardGotDialog.getComponent('awardGotDialog').config(giftConfig);
        awardGotDialog.parent = this.node;
    }
});
