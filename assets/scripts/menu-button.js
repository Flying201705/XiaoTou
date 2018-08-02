import {InfoData} from './InfoData'
const global = require("global");

const login = require('./common/login');
var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        adventureButtonClicked: false,
        loadingMaskPrefab: cc.Prefab,
        rootNode: cc.Node,
        hintLabel: cc.Label,
        selectAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    onLoad() {
        self = this;
        global.event.on("onDataDownloadCallback", this.onDataDownloadCallback.bind(this));
        console.log('[page-main] data complete status:' + InfoData.FLAG_DATA_DOWNLOAD_STATUS);
    },
    onDestroy() {
        global.event.off("onDataDownloadCallback", this.onDataDownloadCallback);
        this.adventureButtonClicked = false;
        if (this.loadingMask != null) {
            this.rootNode.removeChild(this.loadingMask);
        }
    },
    onDataDownloadCallback(token) {
        console.log('[page-main] onDataDownloadCallback token:' + token + ' currentStatus:' + InfoData.FLAG_DATA_DOWNLOAD_STATUS);
        if (this.adventureButtonClicked) {
            // this.adventureButtonClicked = false;
            if (InfoData.FLAG_DATA_DOWNLOAD_STATUS === InfoData.FLAG_DATA_ALL_COMPLETE) {
                console.log('[page-main] loadScene stage.fire');
                cc.director.loadScene("stage.fire");
            } else if (InfoData.FLAG_DATA_DOWNLOAD_STATUS === InfoData.FLAG_DATA_DOWNLOAD_ERROR) {
                this.loadingMaskController.setStatus('error');
            }
        }
    },
    clickAdventureButton: function (event, customEventData) {
        console.log('[page-main] clickAdventureButton adventureButtonClicked:' + this.adventureButtonClicked + ' currentStatus:' + InfoData.FLAG_DATA_DOWNLOAD_STATUS);
        this.adventureButtonClicked = true;
        this.showLoadingMask();
        this.playSelectAudio();
        if (InfoData.FLAG_DATA_DOWNLOAD_STATUS === InfoData.FLAG_DATA_ALL_COMPLETE) {
            cc.director.loadScene("stage.fire");
        } else if (InfoData.FLAG_DATA_DOWNLOAD_STATUS === InfoData.FLAG_DATA_DOWNLOAD_ERROR) {
            //点击按钮前，load界面发起的初始化已返回网络错误，此处重新加载。
            login.login();
        }
    },
    showLoadingMask() {
        this.loadingMask = cc.instantiate(this.loadingMaskPrefab);
        this.loadingMaskController = this.loadingMask.getComponent('loadingMask');
        this.loadingMaskController.onRetry = login.login;
        this.loadingMask.parent = this.rootNode;
    },

    showHint: function (hint) {
        this.hintLabel.node.active = true;
        this.hintLabel.string = hint;
        this.scheduleOnce(this.hideHint, 2);
    },

    hideHint: function () {
        this.hintLabel.string = "";
        this.hintLabel.node.active = false;
    },

    clickBossButton: function (event, customEventData) {
        this.playSelectAudio();
        cc.log("点击Boss按钮");
        this.showHint("50关之后解锁荣誉之战");
    },

    clickNestButton: function (event, customEventData) {
        this.playSelectAudio();
        cc.log("点击怪物窝按钮");
    },

    playSelectAudio: function () {
        cc.audioEngine.play(this.selectAudio, false, 1);
    }
});