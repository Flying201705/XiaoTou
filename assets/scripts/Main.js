import rank from './rank_list'

cc.Class({
    extends: cc.Component,

    properties: {
        rankList: cc.Node,
        display: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.tex = new cc.Texture2D();
    },
    update() {
        this._updaetSubDomainCanvas();
    },
    _updaetSubDomainCanvas() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        if (!this.tex) {
            console.log('no tex');
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        // if (sharedCanvas) {
        //     sharedCanvas.width = cc.game.canvas.width * 2;
        //     sharedCanvas.height = cc.game.canvas.height * 2;
        // }
        // console.log('w:' + sharedCanvas.width + ' h:' + sharedCanvas.height);
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    /**
     * 显示好友排行榜
     */
    showRankList() {
        this.rankList.active = true;

        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }


        // 发消息给子域
        console.log('setRank');
        // wx.postMessage({
        //     message: this._isShow ? 'Show' : 'Hide'
        // })

        // rank.setRank(17);
        rank.showRankList();
    },
});
