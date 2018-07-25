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
        cc.log('xxx data complete status:' + InfoData.FLAG_DATA_DOWNLOAD_STATUS);
    },
    onDestroy() {
        global.event.off("onDataDownloadCallback", this.onDataDownloadCallback);
        this.adventureButtonClicked = false;
        if (this.loadingMask != null) {
            this.rootNode.removeChild(this.loadingMask);
        }
    },
    onDataDownloadCallback(token) {
        cc.log('xxx main onInitDataComplete token:' + token);
        if (this.adventureButtonClicked && (InfoData.FLAG_DATA_DOWNLOAD_STATUS === InfoData.FLAG_DATA_ALL_COMPLETE)) {
            cc.director.loadScene("stage.fire");
        }
    },
    clickAdventureButton: function (event, customEventData) {
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
