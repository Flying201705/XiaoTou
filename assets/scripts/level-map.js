cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this.pathPositions = [];
        this.objRects = [];
        this.tileSize = 80;
    },

    loadMap: function (url) {
        cc.loader.loadRes(url, cc.TiledMapAsset, (err, tmxAsset) => {
            if (err) {
                cc.error(err);
                return;
            }
            this.initDataFromMap(tmxAsset);
        });
    },

    initDataFromMap: function (tmxAsset) {
        let tileMap = this.node.getComponent(cc.TiledMap);
        tileMap.tmxAsset = tmxAsset;
        console.log("tile size:" + tileMap.getTileSize() + ", mapsize : " + this.node.getContentSize());
        this.tileSize = tileMap.getTileSize();
        let mapWidth = this.node.getContentSize().width;
        let mapHeight = this.node.getContentSize().height;
        let pathGroup = tileMap.getObjectGroup("path");
        for (let i = 0; i < 100; i++) {
            let pathPoint = pathGroup.getObject("P" + i);
            if (!pathPoint) {
                break;
            }
            cc.log("P" + i + ": x " + (pathPoint.sgNode.x - mapWidth * 0.5) + ", y " + (pathPoint.sgNode.y - mapHeight * 0.5));
            this.pathPositions[i] = cc.p(pathPoint.sgNode.x - mapWidth * 0.5, pathPoint.sgNode.y - mapHeight * 0.5);
        }

        for (let i = 0; i < 100; i++) {
            let objRect = pathGroup.getObject("O" + i);
            if (!objRect) {
                break;
            }
            cc.log("O" + i + ": x " + (objRect.sgNode.x - mapWidth * 0.5) + ", y " + (objRect.sgNode.y - objRect.sgNode.height - mapHeight * 0.5) + ", w " + objRect.sgNode.width + ", h " + objRect.sgNode.height);
            this.objRects[i] = cc.rect(objRect.sgNode.x - mapWidth * 0.5, objRect.sgNode.y - objRect.sgNode.height - mapHeight * 0.5, objRect.sgNode.width, objRect.sgNode.height);
        }
    },

    // update (dt) {},
    getPathPositions() {
        return this.pathPositions;
    },

    getObjRects() {
        return this.objRects;
    },

    getTileSize() {
        return this.tileSize;
    }
});
