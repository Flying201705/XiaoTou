cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        var node = new cc.Node();
        this.node.addChild(node);
        this._tileMap = node.addComponent(cc.TiledMap);
        var url = 'map/BG-hd';
        this.onLoadTileMap(url);
        this._monster = this.node.getChildByName('monster');
        this._refreshDuration = 0;
        this._positionIndex = 0;
        this._gameOver = false;
    },

    start () {

    },

    update (dt) {
        if (!this._gameOver) {
            this._refreshDuration++;
            if (this._refreshDuration >= 0) {
                this._refreshDuration = 0;
                this._refreshEndPosition();
                this._refreshCurPosition();
                this._updateMonsterPosition();
            }
        }
    },

    onLoadTileMap (url) {
        cc.loader.loadRes(url, cc.TiledMapAsset, (err, tmxAsset) => {
            if (err) {
                cc.error(err);
                return;
            }
            this.onCreateTileMap(tmxAsset);
        });
    },

    onCreateTileMap (tmxAsset) {
        this._tileMap.tmxAsset = tmxAsset;
        this._pathGroup = this._tileMap.getObjectGroup("path");
        this._curPoint = this._pathGroup.getObject("PATH_0" + this._positionIndex);
        this._endPoint = this._pathGroup.getObject("PATH_0" + (this._positionIndex + 1));
        this._direct = this._curPoint.getProperties().direct;
        this._gameOver = false;
        this._updateMonsterPosition();
    },

    _updateMonsterPosition: function() {
        var pos = cc.p(this._curPoint.sgNode.x - 960 / 2, this._curPoint.sgNode.y - 640 / 2);
        this._monster.setPosition(pos);
    },

    _refreshCurPosition: function() {
        if (this._direct == 0) {
            this._curPoint.sgNode.y--;
        } else if (this._direct == 1) {
            this._curPoint.sgNode.x++;
        } else if (this._direct == 2) {
            this._curPoint.sgNode.y++;
        } else {

        }
    },

    _refreshEndPosition: function() {
        if (this._endPoint == null) {
            this._gameOver = true;
            return;
        }
        var isRefresh = false;
        if (this._direct == 0) {
            isRefresh = this._endPoint.sgNode.y >= this._curPoint.sgNode.y;
        } else if (this._direct == 1) {
            isRefresh = this._endPoint.sgNode.x <= this._curPoint.sgNode.x;
        } else if (this._direct == 2) {
            isRefresh = this._endPoint.sgNode.y <= this._curPoint.sgNode.y;
        } else {

        }

        if (isRefresh) {
            this._curPoint = this._endPoint;
            this._direct = this._curPoint.getProperties().direct;
            this._positionIndex++;
            this._endPoint = this._pathGroup.getObject("PATH_0" + (this._positionIndex + 1));
        }
    },

    _getTilePos: function(posInPixel) {
        var mapSize = this.node.getContentSize();
        var tileSize = this._tileMap.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);

        return cc.p(x, y);
    },
});