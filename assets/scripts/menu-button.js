import {InfoData} from './InfoData'
import global from './global'

cc.Class({
    extends: cc.Component,

    properties: {
        adventureButtonClicked: false,
        loadingMaskPrefab: cc.Prefab,
        rootNode: cc.Node,
        selectAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    onLoad() {
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
        console.log('[page-main] onInitDataComplete token:' + token + ' currentStatus:' + InfoData.FLAG_DATA_DOWNLOAD_STATUS);
        if (this.adventureButtonClicked) {
            if (InfoData.FLAG_DATA_DOWNLOAD_STATUS === InfoData.FLAG_DATA_ALL_COMPLETE) {
                console.log('[page-main] loadScene stage.fire');
                cc.director.loadScene("stage.fire");
            } else if (token === InfoData.TOKEN_ERROR) {

            }
        }
    },
    clickAdventureButton: function (event, customEventData) {
        console.log('[page-main] clickAdventureButton adventureButtonClicked:' + this.adventureButtonClicked + ' currentStatus:' + InfoData.FLAG_DATA_DOWNLOAD_STATUS);
        this.adventureButtonClicked = true;
        this.loadingMask = cc.instantiate(this.loadingMaskPrefab);
        this.loadingMask.parent = this.rootNode;
        this.playSelectAudio();
        if (InfoData.FLAG_DATA_DOWNLOAD_STATUS === InfoData.FLAG_DATA_ALL_COMPLETE) {
            cc.director.loadScene("stage.fire");
        }

    },

    clickBossButton: function (event, customEventData) {
        this.playSelectAudio();
        cc.log("点击Boss按钮");
    },

    clickNestButton: function (event, customEventData) {
        this.playSelectAudio();
        cc.log("点击怪物窝按钮");
    },

    playSelectAudio: function () {
        cc.audioEngine.play(this.selectAudio, false, 1);
    }
});