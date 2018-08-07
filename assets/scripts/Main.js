import rank from './rank_list'
import global from "./global";
import {InfoData} from "./InfoData";
import * as WxHelper from "./common/WxHelper";

const remoteHelper = require("./common/RemoteHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        rankList: cc.Node,
        display: cc.Sprite,
        signIn: cc.Prefab,
        gameHelp: require("GameHelp")
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        global.event.on('onDataDownloadCallback', this.onDataDownloadCallback.bind(this));
        this.checkSignIn();
    },
    onDestroy() {
        global.event.off('onDataDownloadCallback', this.onDataDownloadCallback);
    },
    start() {
        this.tex = new cc.Texture2D();
        this._resizeShareCanvas();
    },
    _resizeShareCanvas() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        let ratio = 1;
        ratio = wx.getSystemInfoSync().pixelRatio;
        ratio = ratio == 1 ? 1 : ratio / 2;
        window.sharedCanvas.width = window.sharedCanvas.width * ratio;
        window.sharedCanvas.height = window.sharedCanvas.height * ratio;

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
    checkSignIn() {
        if (InfoData.user.id > 0) {
            remoteHelper.checkSignIn(InfoData.user.id, data => {
                let signIn = cc.instantiate(this.signIn);
                signIn.getComponent('sign_in').init(data.sign_days);
                signIn.parent = this.node;
            });
        }
    },
    onDataDownloadCallback(token) {
        if (token === InfoData.TOKEN_USER_INFO) {
            this.checkSignIn();
        }
    },
    /**
     * 显示游戏说明
     */
    showGameDesc() {
        cc.info('showGameDesc');
        this.gameHelp.show();
    },
    /**
     * 微信分享
     */
    share() {
        cc.info('share');
        WxHelper.share('normal');
    },
    /**
     * 跳转更多游戏
     */
    showMoreGame() {
        cc.info('showMoreGame');
    },
});
