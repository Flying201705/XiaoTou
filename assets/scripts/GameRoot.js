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
        rankList: cc.Sprite,
    },
    update() {
        if (global.isPause()) {
            this.timeCountDownAnim.pause();
        } else {
            this.timeCountDownAnim.resume();
        }

        this._updaetSubDomainCanvas();
    },
    onLoad() {
        this.gameWorld = this.gameNode.getComponent('GameWorld');

        global.event.on("show_buy_prop_dialog", this.showBuyPropDialog.bind(this));
        global.event.on("get_crystal_count", this.getCrystalCount.bind(this));
        global.event.on("update_crystal_count", this.updateCrystalCount.bind(this));
        global.event.on("get_one_chip_price", this.getOneChipPrice.bind(this));
        global.event.on("show_back_pack_dialog", this.showBackPack.bind(this));

        this.timeCountDownAnim = this.timeCountDown.getComponent(cc.Animation);

        this._isShow = false;
        this.tex = new cc.Texture2D();
    },
    _updaetSubDomainCanvas() {
        if (!this.tex) {
            console.log('no tex');
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.rankList.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    onDestroy() {
        global.event.off("show_buy_prop_dialog", this.showBuyPropDialog);
        global.event.off("get_crystal_count", this.getCrystalCount);
        global.event.off("update_crystal_count", this.updateCrystalCount);
        global.event.off("get_one_chip_price", this.getOneChipPrice);
        global.event.off("show_back_pack_dialog", this.showBackPack);
    },
    start() {
        this.showDescDialog();
    },
    showDescDialog() {
        cc.loader.loadRes("./config/description_config", (err, result) => {
            if (err) {
                cc.error("load description_config " + err);
                // cc.director.resume();
                return;
            }

            var config = result["level_" + global.currentLevel];

            if (config === undefined) {
                cc.error("level_" + global.currentLevel + " not exist");
                return;
            }

            if (config.mode === undefined || config.mode === 0) {
                cc.error("mode undefined or 0 ");
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
    /**
     * 显示好友排行榜
     */
    showRankList() {
        this._isShow = !this._isShow;
        // 发消息给子域
        console.log('showRankList()');
        wx.postMessage({
            message: this._isShow ? 'Show' : 'Hide'
        })
    },
    getOneChipPrice() {
        return 50;
    },
});
