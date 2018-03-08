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

        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEvent, this);

        this._monsterLife = 100;
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

            if (this.towerNode != null) {
                var monsterPos = this._monster.getPosition();
                var towerPos = this.towerNode.getPosition();
                if (this._monsterLife <= 0) {
                    this._monster.active = false;
                } else if(Math.abs(towerPos.x - monsterPos.x) <= 100 && Math.abs(towerPos.y - monsterPos.y) <= 100) {
                    this._monsterLife--;
                }
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
        console.log("tile size:" + this._tileMap.getTileSize()+ ", mapsize : " + this.node.getContentSize()); 
    },

    _touchEvent: function (event) {
        console.log("touchend event:" + event.touch.getLocation().x + "," + event.touch.getLocation().y);
        this.towerNode = new cc.Node('sprite 1');
        var tower = this.towerNode.addComponent(cc.Sprite);
        var imgUrl = cc.url.raw('resources/tower/xiaotou.png');
        var texture = cc.textureCache.addImage(imgUrl);
        tower.spriteFrame = new cc.SpriteFrame();
        tower.spriteFrame.setTexture(texture);
        var position = this._getTilePos(cc.p(event.touch.getLocation().x - 960 / 2, event.touch.getLocation().y - 640 / 2));
        console.log("touchend position:" + position.x + "," + position.y);
        this.towerNode.setPosition(position.x, position.y);
        this.node.addChild(this.towerNode);
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
        var y = Math.floor(posInPixel.y / tileSize.height);

        return cc.p(x * tileSize.width, y * tileSize.height);
    },
});