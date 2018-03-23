import global from './global'
const TowerPosNodeState = {
    Invalid: -1,
    Null: 1,
    BuildMenu: 2,
    Tower: 3,
    UpdateMenu: 4
};
cc.Class({
    extends: cc.Component,
    properties: {
        buildMenuPrefab: {
            default: null,
            type: cc.Prefab
        },
        towerPrefabs: {
            default: [],
            type: cc.Prefab
        },
        updateMenuPrefab: {
            default: null,
            type: cc.Prefab
        },
        enemyPrefab: {
            default: null,
            type: cc.Prefab
        },
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    init (gameLayer) {
        this.gameLayer = gameLayer;
    },

    // use this for initialization
    onLoad: function () {
        cc.log("level onLoad begin");
        this.setTouchEvent();

        global.event.on("build_tower", this.buildTower.bind(this));
        global.event.on("update_tower", this.updateTower.bind(this));
        global.event.on("sell_tower",this.sellTower.bind(this));
        global.event.on("game_start", this.gameStart.bind(this));
        global.event.on("shoot_bullet", this.addBullet.bind(this));
        global.event.on("sell_tower", this.sellTower.bind(this));
        this.build_menu = cc.instantiate(this.buildMenuPrefab);
        this.build_menu.parent = this.node;
        this.build_menu.active = false;
        this.update_menu = cc.instantiate(this.updateMenuPrefab);
        this.update_menu.parent = this.node;
        this.update_menu.active = false;
        this.currentWaveCount = 0;
        this.currentEnemyCount = 0;
        this.addEnemyCurrentTime = 0;
        this.addWaveCurrentTime = 0;
        this.enemyPathPositions = [];
        this.enemyNodeList = [];
        this.towerRects = [];
        this.towerNodeList = [];
        this.bulletNodeList = [];
        this.tileSize = 80;
    },

    setTouchEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            var index = this.getTouchedTowerIdx(event.touch.getLocation().x - 960 * 0.5, event.touch.getLocation().y - 640 * 0.5);
            cc.log("touchend event:" + (event.touch.getLocation().x - 960 * 0.5) + "," + (event.touch.getLocation().y - 640 * 0.5) + ", index = " + index);
            if (index >= 0) {
                this.showUpdateMenu(this.towerNodeList[index]);
            } else if (this.isTouchEnable(event.touch.getLocation().x - 960 * 0.5, event.touch.getLocation().y - 640 * 0.5)) {
                this.showBuildMenu(event.touch.getLocation().x - 960 * 0.5, event.touch.getLocation().y - 640 * 0.5);
            }
        });
    },

    getTouchedTowerIdx: function(x, y) {
        for (let i = 0; i <  this.towerNodeList.length; i++) {
            let tower = this.towerNodeList[i];
            let towerRect = cc.rect(tower.x - tower.width * 0.5, tower.y - tower.height * 0.5, tower.width, tower.height);
            if (cc.rectContainsPoint(towerRect, cc.p(x, y))) {
                return i;
            }
        }

        return -1;
    },

    isTouchEnable: function(x, y) {
        for (let i = 0; i < this.towerRects.length; i++) {
            if (cc.rectContainsPoint(this.towerRects[i], cc.p(x, y))) {
                return true;
            }
        }

        return false;
    },

    // 暂时没用
    setTowerTouchEvent: function (node) {
        node.on(cc.Node.EventType.TOUCH_START, (event)=>{
            cc.log("touch node name = " + event.target.name);
            this.showUpdateMenu(event.target);
        });
    },

    showBuildMenu: function (x, y) {
        this.closeMenu();
        this.build_menu.active = true;
        this.build_menu.position = cc.p(x, y);
    },

    showUpdateMenu: function (node) {
        this.closeMenu();
        this.update_menu.active = true;
        this.update_menu.position = node.position;
        this.update_menu.tower = node;
    },

    closeMenu: function () {
        this.build_menu.active = false;
        this.update_menu.active = false;
        return this.update_menu.tower;
    },

    setState: function (node, state) {
        if (node.state === state){
            return;
        }
        switch (state){
            case TowerPosNodeState.Null:
                break;
            case TowerPosNodeState.BuildMenu:
                break;
            default:
                break;
        }
        node.state = state;
    },

    buildTower: function (data) {
        cc.log("build tower " + data);
        this.closeMenu();
        let tower = cc.instantiate(this.towerPrefabs[data]);
        tower.parent = this.node;
        tower.position = this.getTilePos(this.build_menu.position);
        tower.width = 80;
        tower.height = 80;
        // this.setTowerTouchEvent(tower);
        this.towerNodeList.push(tower);

    },

    onDestroy: function () {
        global.event.off("build_tower", this.buildTower);
    },

    updateTower: function () {
        let tower = this.closeMenu();
        tower.getComponent("tower").updateTower();
    },

    sellTower: function () {
        let tower = this.closeMenu();
        tower.getComponent("tower").sellTower();
        this.towerNodeList.splice(tower);
    },

    gameStart: function () {
        cc.loader.loadRes("./config/level_config",  (err, result)=> {
            if (err){
                cc.log("load config " + err);
            }else {
                cc.log("level config" + JSON.stringify(result));
            }
            let config = result["level_1"];
            this.levelConfig = config;
            // this.currentWaveConfig = wavesConfig[0];
        });
        this.enemyPathPositions = this.gameLayer.getPathPositions();
        this.towerRects = this.gameLayer.getObjRects();
        this.tileSize = this.gameLayer.getTileSize();
    },

    addEnemy: function (type) {
        // cc.log("add Enemy" + this.currentEnemyCount);
        // cc.log("add Wave " + this.currentWaveCount)
        let enemy = cc.instantiate(this.enemyPrefab);
        enemy.getComponent("enemy").initWithData(type, this.enemyPathPositions);
        enemy.parent = this.node;
        this.enemyNodeList.push(enemy);
    },

    update: function (dt) {
        if (this.currentWaveConfig){
            if (this.addEnemyCurrentTime > this.currentWaveConfig.dt){
                this.addEnemyCurrentTime = 0;
                this.currentEnemyCount ++;
                this.addEnemy(this.currentWaveConfig.type);
                if (this.currentEnemyCount === this.currentWaveConfig.count){
                    this.currentWaveConfig = undefined;
                    this.currentEnemyCount = 0;
                }
            }
            else {
                this.addEnemyCurrentTime += dt;
            }
        }else if (this.levelConfig) {
            if (this.addWaveCurrentTime > this.levelConfig.dt){
                this.currentWaveConfig = this.levelConfig.waves[this.currentWaveCount];
                if (this.currentWaveCount < this.levelConfig.waves.length ){
                    this.currentWaveCount ++;
                }else {
                    this.currentWaveConfig = undefined;
                }
                this.addWaveCurrentTime = 0;
            }else {
                this.addWaveCurrentTime += dt;
            }
        }

        for (let i = 0 ; i < this.towerNodeList.length ; i ++){
            let tower = this.towerNodeList[i];
            if (tower != undefined && tower.getComponent("tower").isFree()){
                for (let j = 0 ; j < this.enemyNodeList.length ; j ++){
                    let enemy = this.enemyNodeList[j];
                    if (enemy.getComponent("enemy").isLiving()){
                        // let distance = cc.pDistance(tower)
                       tower.getComponent("tower").setEnemy(enemy);
                    }else if (enemy.getComponent("enemy").isDead()){
                      cc.log("从列表里面删掉");
                      this.enemyNodeList.splice(j , 1);
                    }
                }
            }
        }

    },

    addBullet: function (tower, position) {

        let bullet = cc.instantiate(this.bulletPrefab);
        // bullet.position = tower.position;
        bullet.parent = this.node;
        bullet.getComponent("bullet").initWithData(tower, position, this.enemyNodeList);

    },

    getTilePos: function(posInPixel) {
        var mapSize = this.node.getContentSize();
        var tileSize = this.tileSize;
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor(posInPixel.y / tileSize.height);

        // 锚点在中心位置
        return cc.p((x + 0.5) * tileSize.width, (y + 0.5) * tileSize.height);
    },
});