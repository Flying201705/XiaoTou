import rank from './rank_list'
import global from "./global";
import {InfoData} from "./InfoData";
import * as WxHelper from "./common/WxHelper";

const remoteHelper = require("./common/RemoteHelper");
const qmHelper = require("./common/QmHelper");

cc.Class({
    extends: cc.Component,

    properties: {
        signIn: cc.Prefab,
        rewardHint: cc.Label,
        gameHelp: require("GameHelp"),
        likeNode: cc.Node,
        rankListDialog: cc.Prefab,
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

        this.updateLikeBtn();
        this.schedule(this.updateLikeBtn, 60);
    },
    onDestroy() {
        global.event.off('onDataDownloadCallback', this.onDataDownloadCallback);
        global.event.off("add_reward_hint", this.addRewardHint);
        global.event.off("showAwardGotDialog", this.showAwardGotDialog);
        this.unschedule(this.updateLikeBtn, this);
    },
    start() {
        rank.hide();
    },
    /**
     * 显示好友排行榜
     */
    showRankList() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        let rankListDialog = cc.instantiate(this.rankListDialog);
        rankListDialog.parent = this.node;
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
    showAwardGotDialog() {
        // let dialog = cc.instantiate();
    },

    updateLikeBtn() {
        let that = this;
        qmHelper.updateRecommend(function (recommend) {
            if (recommend) {
                let url = recommend.icon.replace(/\s+/g, "");
                cc.loader.load(url, function (err, texture) {
                    if (err) {
                        return;
                    }
                    that.likeNode.active = true;
                    let icon = that.likeNode.getChildByName("icon");
                    icon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                });
            } else {
                this.likeNode.active = false;
            }
        });
    },

    onClickLikeBtn() {
        qmHelper.goToRecommend();
        this.updateLikeBtn();
    }
});
