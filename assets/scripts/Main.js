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
        rewardHint: cc.Label,
        gameHelp: require("GameHelp"),
        likeNode: cc.Node
    },

    onLoad() {
        WxHelper.showShareMenu();
        WxHelper.onShareAppMessage();
        global.event.on('onDataDownloadCallback', this.onDataDownloadCallback.bind(this));
        global.event.on("add_reward_hint", this.addRewardHint.bind(this));
        global.event.on("showAwardGotDialog", this.showAwardGotDialog.bind(this));
        this.rankListInit();
        this.checkSignIn();
        this.isRankListShow = false;
        let mask = this.rankList.getChildByName('bg_mask').getComponent('mask');
        mask.setSelf(this);
        mask.onHide = this.onRankListHide;

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            report.getRecommendInfo(function (tablelist) {
                this.recommend = tablelist;
                let that = this;
                cc.loader.load(this.recommend.icon, function (err, texture) {
                    if (err) {
                        return;
                    }
                    let icon = that.likeNode.getChildByName("icon");
                    console.log("recommend icon:" + that.recommend.icon + "; texture:" + texture);
                    icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                });
            }, this);
        } else {
            this.likeNode.active = false;
        }
    },
    onDestroy() {
        global.event.off('onDataDownloadCallback', this.onDataDownloadCallback);
        global.event.off("add_reward_hint", this.addRewardHint);
        global.event.off("showAwardGotDialog", this.showAwardGotDialog);
    },
    start() {
        this.tex = new cc.Texture2D();
        this._resizeShareCanvas();
        cc.info('main start');
        rank.hide();
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
        if (this.isRankListShow) {
            this._updateSubDomainCanvas();
        }
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
        rank.showRankList();
        this.isRankListShow = true;
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
    rankListInit() {
        if (InfoData.user.id > 0) {
            rank.initRank(InfoData.user.level);
        }
    },
    onDataDownloadCallback(token) {
        if (token === InfoData.TOKEN_USER_INFO) {
            this.checkSignIn();
            this.rankListInit();
        }
    },
    hideRewardHint: function () {
        this.rewardHint.string = "";
        this.rewardHint.node.active = false;
    },
    /**
     * 每日奖励水晶领取提示
     */
    addRewardHint: function (count) {
        this.rewardHint.string = "水晶+" + count;
        this.rewardHint.node.active = true;
        this.scheduleOnce(this.hideRewardHint, 3);
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
        WxHelper.showMoreGame();
    },
    onRankListHide(self) {
        self.isRankListShow = false;
        cc.info('onRankListHide');
    },
    showAwardGotDialog(){
        // let dialog = cc.instantiate();
    },

    onClickLikeBtn() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let recommendData = this.recommend;
            wx.getSystemInfo({
                success: function (system) {
                    if (system && system.SDKVersion >= "2.2.0") {
                        wx.navigateToMiniProgram({
                            appId: recommendData.appid,
                            path: recommendData.page,
                            extraData: null,
                            envVersion: "release",
                            success: (res) => {
                                report.linkEvent(recommendData.aid, recommendData.adid);
                            },
                            fail: (res) => {

                            },
                            complete: (res) => {
                            },
                        })
                    } else {
                        wx.previewImage({
                            urls: [recommendData.ad_image],
                            success: res => {
                                report.linkEvent(recommendData.aid, recommendData.adid);
                            },
                            fail: res => {
                            }
                        });
                    }
                }
            })
        }
    }
});
