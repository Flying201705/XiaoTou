cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.pathPositions = [];
        this.objRects = [];
        this.tileSize = 80;
        this.loadLevelMap('map/BG-hd');
    },

    loadLevelMap: function (url) {
        cc.loader.loadRes(url, cc.TiledMapAsset, (err, tmxAsset) => {
            if (err) {
                cc.error(err);
                return;
            }
            this.initDataFromMap(tmxAsset);
        });
    },

    initDataFromMap (tmxAsset) {
        var node = new cc.Node();
        var tileMap = node.addComponent(cc.TiledMap);
        tileMap.tmxAsset = tmxAsset;
        var pathGroup = tileMap.getObjectGroup("path");
        for (let i = 0; i < 100; i++) {
            var pathPoint = pathGroup.getObject("P" + i);
            if (!pathPoint) {
                break;
            }
            cc.log("P" + i + ": x " + (pathPoint.sgNode.x - 960 * 0.5) + ", y " + (pathPoint.sgNode.y - 640 * 0.5));
            this.pathPositions[i] = cc.p(pathPoint.sgNode.x - 960 * 0.5, pathPoint.sgNode.y - 640 * 0.5);
        }

        for (let i = 0; i < 100; i++) {
            var objRect = pathGroup.getObject("O" + i);
            if (!objRect) {
                break;
            }
            cc.log("O" + i + ": x " + (objRect.sgNode.x - 960 * 0.5) + ", y " + (objRect.sgNode.y - objRect.sgNode.height - 640 * 0.5) + ", w " + objRect.sgNode.width + ", h " + objRect.sgNode.height);
            this.objRects[i] = cc.rect(objRect.sgNode.x - 960 * 0.5, objRect.sgNode.y - objRect.sgNode.height - 640 * 0.5, objRect.sgNode.width, objRect.sgNode.height);
        }
        cc.log("tile size:" + tileMap.getTileSize() + ", mapsize : " + this.node.getContentSize()); 
        this.tileSize = tileMap.getTileSize();
    },

    getPathPositions () {
        return this.pathPositions;
    },

    getObjRects() {
        return this.objRects;
    },

    getTileSize() {
        return this.tileSize;
    }
});