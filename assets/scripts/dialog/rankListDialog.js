import rank from "../rank_list";

cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node,
        display: cc.Sprite
    },

    onLoad() {
        this.mask.getComponent('mask').onHide = this._onDialogHide.bind(this);
    },
    start() {
        this.tex = new cc.Texture2D();
        this._resizeShareCanvas();
        cc.info('ranklistDialog start');

        rank.showRankList();
    },
    onDestroy() {
        cc.info('ranklistDialog onDestroy');
        rank.hide();
        this.tex.destroy();
    },
    _resizeShareCanvas() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        cc.info('display node w:' + this.display.node.width + ' h:' + this.display.node.height);
        cc.info('this node w:' + this.node.width + ' h:' + this.node.height);

        let sysInfo = wx.getSystemInfoSync();
        let ratio = sysInfo.pixelRatio == 1 ? 1 : sysInfo.pixelRatio / 2;

        window.sharedCanvas.width = sysInfo.screenWidth * ratio;
        window.sharedCanvas.height = sysInfo.screenHeight * ratio;

        this.display.node.width = this.display.node.height * (sysInfo.screenWidth / sysInfo.screenHeight);
    },
    update() {
        this._updateSubDomainCanvas();
    },
    _updateSubDomainCanvas() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        if (!this.tex) {
            console.log('no tex');
            return;
        }
        let openDataContext = wx.getOpenDataContext();
        let sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    _onDialogHide() {
        rank.hide();
    }
});
