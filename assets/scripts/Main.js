// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        rankList: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this._isShow = false;
        this.tex = new cc.Texture2D();
    },
    update() {
        this._updaetSubDomainCanvas();
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
    /**
     * 显示好友排行榜
     */
    showRankList() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        this._isShow = !this._isShow;

        // 发消息给子域
        console.log('showRankList()');
        wx.postMessage({
            message: this._isShow ? 'Show' : 'Hide'
        })
    },
});
