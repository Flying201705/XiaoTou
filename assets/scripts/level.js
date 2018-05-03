import global from './global'
import {InfoHandle} from './InfoData'

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
        //选中背景框
        selectBox: {
            default: null,
            type: cc.Node
        },
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
        },
        goldLabel: {
            default: null,
            type: cc.Label
        },
        currentWaveLabel: {
            default: null,
            type: cc.Label
        },
        totalWaveLabel: {
            default: null,
            type: cc.Label
        },
        lifeLabel: {
            default: null,
            type: cc.Label
        },
        gameOverUI: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        cc.log("level onLoad begin");
        this.setTouchEvent();
        //当前关卡
        this.currentLevel = global.currentLevel;
        global.event.on("build_tower", this.buildTower.bind(this));
        global.event.on("update_tower", this.updateTower.bind(this));
        global.event.on("sell_tower", this.sellTower.bind(this));
        global.event.on("game_start", this.gameStart.bind(this));
        global.event.on("shoot_bullet", this.addBullet.bind(this));
        global.event.on("shoot_buff", this.addBuff.bind(this));
        global.event.on("release_slow", this.handleSlow.bind(this));
        global.event.on("release_stun", this.handleStun.bind(this));
        global.event.on("release_damage", this.handleDamage.bind(this));
        this.build_menu = cc.instantiate(this.buildMenuPrefab);
        this.update_menu = cc.instantiate(this.updateMenuPrefab);
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

        this.selectBox.active = false;

        this.goldCount = 0;
        this.lifeCount = 10;

        //加载地图
        this.level_map = this.node.getChildByName('level_map').getComponent("level-map");
        this.level_map.loadMap("map/level_" + this.currentLevel);
    },

    setTouchEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            let index = this.getTouchedTowerIdx(event.touch.getLocation().x - 960 * 0.5, event.touch.getLocation().y - 640 * 0.5);
            cc.log("touchend event:" + (event.touch.getLocation().x - 960 * 0.5) + "," + (event.touch.getLocation().y - 640 * 0.5) + ", index = " + index);
            if (index >= 0) {
                this.showUpdateMenu(index);
            } else if (this.isTouchEnable(event.touch.getLocation().x - 960 * 0.5, event.touch.getLocation().y - 640 * 0.5)) {
                this.showBuildMenu(event.touch.getLocation().x - 960 * 0.5, event.touch.getLocation().y - 640 * 0.5);
            }
        });
    },

    getTouchedTowerIdx: function (x, y) {
        for (let i = 0; i < this.towerNodeList.length; i++) {
            let tower = this.towerNodeList[i];
            let towerRect = cc.rect(tower.x - tower.width * 0.5, tower.y - tower.height * 0.5, tower.width, tower.height);
            if (cc.rectContainsPoint(towerRect, cc.p(x, y))) {
                return i;
            }
        }

        return -1;
    },

    isTouchEnable: function (x, y) {
        for (let i = 0; i < this.towerRects.length; i++) {
            if (cc.rectContainsPoint(this.towerRects[i], cc.p(x, y))) {
                return true;
            }
        }

        return false;
    },

    // 暂时没用
    setTowerTouchEvent: function (node) {
        node.on(cc.Node.EventType.TOUCH_START, (event) => {
            cc.log("touch node name = " + event.target.name);
            this.showUpdateMenu(event.target);
        });
    },

    showBuildMenu: function (x, y) {
        this.closeMenu();
        let centerPos = this.getTilePos(cc.p(x, y));

        this.selectBox.active = true;
        this.selectBox.position = centerPos;
        this.selectBox.parent = this.node;

        this.build_menu.position = centerPos;
        this.build_menu.parent = this.node;
    },

    showUpdateMenu: function (index) {
        this.closeMenu();
        let tower = this.towerNodeList[index];
        if (tower !== undefined) {
            this.selectBox.active = true;
            this.selectBox.parent = this.node;
            this.selectBox.position = tower.position;

            this.update_menu.position = tower.position;
            this.update_menu.index = index;
            this.update_menu.parent = this.node;
        }
    },

    closeMenu: function () {
        this.node.removeChild(this.build_menu);
        this.node.removeChild(this.update_menu);
        this.selectBox.active = false;
        return this.update_menu.index;
    },

    setState: function (node, state) {
        if (node.state === state) {
            return;
        }
        switch (state) {
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
        let tower_type = this.levelConfig.towers[data].type;
        let create_cost = this.towerConfigs[tower_type].costs[0];
        if (this.goldCount < create_cost) {
            return;
        }

        this.goldCount -= create_cost;
        let tower = cc.instantiate(this.towerPrefabs[data]);
        tower.parent = this.node;
        tower.position = this.getTilePos(this.build_menu.position);
        tower.width = 80;
        tower.height = 80;
        // this.setTowerTouchEvent(tower);
        tower.getComponent("tower").initWithData(this.towerConfigs[tower_type], this.levelConfig.towers[data].level);
        this.towerNodeList.push(tower);
    },

    onDestroy: function () {
        global.event.off("build_tower", this.buildTower);
    },

    updateTower: function () {
        let tower = this.towerNodeList[this.closeMenu()];
        if (tower !== undefined) {
            let cost = tower.getComponent("tower").getUpgradeCost();
            if (this.goldCount < cost) {
                cc.log("金钱不够!!");
                return;
            }
            if (!tower.getComponent("tower").canUpgrade()) {
                cc.log("满级!!");
                return;
            }
            this.detractGold(cost);
            tower.getComponent("tower").updateTower();
        }
    },

    sellTower: function () {
        let index = this.closeMenu();
        let tower = this.towerNodeList[index];
        if (tower !== undefined) {
            this.addGold(tower.getComponent("tower").getSelledGold());
            tower.getComponent("tower").sellTower();
            this.towerNodeList.splice(index, 1);
        }
    },

    isLevelMax: function (level, maxlevel) {

    },

    gameStart: function () {
        this.loadLevelConfig();
        this.loadTowerConfig();
        this.enemyPathPositions = this.level_map.getPathPositions();
        this.towerRects = this.level_map.getObjRects();
        this.tileSize = this.level_map.getTileSize();
    },

    loadLevelConfig: function () {
        cc.loader.loadRes("./config/level_config", (err, result) => {
            if (err) {
                cc.log("load config " + err);
            } else {
                //cc.log("level config" + JSON.stringify(result));
            }
            this.levelConfig = result["level_" + this.currentLevel];
            // this.currentWaveConfig = wavesConfig[0];
            this.goldCount = this.levelConfig.gold;
            this.build_menu.getComponent("build-menu").initWithData(this.levelConfig.towers);
            this.totalWaveLabel.string = this.levelConfig.waves.length.toString();
        });
    },

    loadTowerConfig: function () {
        cc.loader.loadRes("./config/tower_config", (err, result) => {
            if (err) {
                cc.log("load config = " + err);
            } else {
                //cc.log("load config = " + JSON.stringify(result));
                this.towerConfigs = result;
            }
        });
    },

    loadBossConfig: function () {
        cc.loader.loadRes("./config/boss_config", (err, result) => {
            if (err) {
                cc.log("load config = " + err);
            } else {
                //cc.log("load config = " + JSON.stringify(result));
                this.bossConfigs = result;
            }
        });
    },

    addEnemy: function (type, level) {
        // cc.log("add Enemy" + this.currentEnemyCount);
        // cc.log("add Wave " + this.currentWaveCount)
        let enemy = cc.instantiate(this.enemyPrefab);
        enemy.getComponent("enemy").initWithData(type, level, this.enemyPathPositions);
        enemy.parent = this.node;
        this.enemyNodeList.push(enemy);
    },

    update: function (dt) {
        this.goldLabel.string = this.goldCount.toString();
        this.lifeLabel.string = this.lifeCount.toString();
        if (this.currentWaveConfig) {
            if (this.addEnemyCurrentTime > this.currentWaveConfig.dt) {
                this.addEnemyCurrentTime = 0;
                this.currentEnemyCount++;
                this.addEnemy(this.currentWaveConfig.type, this.currentWaveConfig.lv);
                if (this.currentEnemyCount === this.currentWaveConfig.count) {
                    this.currentWaveConfig = undefined;
                    this.currentEnemyCount = 0;
                }
            }
            else {
                this.addEnemyCurrentTime += dt;
            }
        } else if (this.levelConfig) {
            if (this.addWaveCurrentTime > this.levelConfig.dt) {
                this.currentWaveConfig = this.levelConfig.waves[this.currentWaveCount];
                if (this.currentWaveCount < this.levelConfig.waves.length) {
                    this.currentWaveCount++;
                    this.currentWaveLabel.string = this.prefixInteger(this.currentWaveCount, 2);//this.currentWaveCount.toString();
                } else {
                    this.currentWaveConfig = undefined;
                }
                this.addWaveCurrentTime = 0;
            } else {
                this.addWaveCurrentTime += dt;
            }
        }

        for (let j = 0; j < this.enemyNodeList.length; j++) {
            let enemy = this.enemyNodeList[j];
            if (enemy.getComponent("enemy").isDead() || enemy.getComponent("enemy").isEndPath()) {
                //cc.log("从列表里面删掉");
                this.enemyNodeList.splice(j, 1);
            }
        }

        for (let i = 0; i < this.towerNodeList.length; i++) {
            let tower = this.towerNodeList[i];
            /*if (tower !== undefined && tower.getComponent("tower").isFree()) {
                for (let j = 0; j < this.enemyNodeList.length; j++) {
                    let enemy = this.enemyNodeList[j];
                    if (enemy.getComponent("enemy").isLiving()) {
                        tower.getComponent("tower").setEnemy(enemy);
                    }
                }
            }*/
            if (tower !== undefined) {
                if (tower.getComponent("tower").ifBuffAttack()) {
                    tower.getComponent("tower").setTowerList(this.towerNodeList);
                }
                tower.getComponent("tower").setEnemyList(this.enemyNodeList);
            }
        }

        if (this.levelConfig && this.currentWaveCount >= this.levelConfig.waves.length
            && this.currentEnemyCount >= this.currentWaveConfig.count
            && this.enemyNodeList.length <= 0) {
                //游戏结束--赢了
                this.gameOver(true);
            }
    },

    addBullet: function (tower, position) {
        let bullet = cc.instantiate(this.bulletPrefab);
        // bullet.position = tower.position;
        bullet.parent = this.node;
        bullet.getComponent("bullet").initWithData(tower, position, this.enemyNodeList);
    },

    addBuff: function (tower, attackRate, speedRate) {
        let buffList = tower.getComponent("tower").getAreaTowerList();
        for (let i = 0; i < buffList.length; i++) {
            buffList[i].getComponent("tower").beBuffed(attackRate, speedRate);
        }
    },

    handleSlow: function() {
        for (let j = 0; j < this.enemyNodeList.length; j++) {
            let enemy = this.enemyNodeList[j];
            enemy.getComponent("enemy").hanleSlowed(0.5);
        }
    },

    handleStun: function() {
        for (let j = 0; j < this.enemyNodeList.length; j++) {
            let enemy = this.enemyNodeList[j];
            enemy.getComponent("enemy").handleStuned();
        }
    },

    handleDamage: function() {
        for (let j = 0; j < this.enemyNodeList.length; j++) {
            let enemy = this.enemyNodeList[j];
            enemy.getComponent("enemy").handleDamage(100, 0);
        }
    },

    addGold: function (gold) {
        this.goldCount += gold;
    },

    detractGold: function (gold) {
        this.goldCount -= gold;
        if (this.goldCount < 0) {
            this.goldCount = 0;
        }
    },

    detractLife: function (life) {
        this.lifeCount -= life;
        if (this.lifeCount <= 0) {
            this.lifeCount = 0;
            //游戏结束--输了
            this.gameOver(false);
        }
    },

    dropGoods: function(boss_type) {
        let log = "击败BOSS";
        for (let i = 0; i < this.bossConfigs[boss_type].length; i++) {
            let goods = this.bossConfigs[boss_type][i].goods;
            let rate = this.bossConfigs[boss_type][i].rate;
            let random = Math.random();
            if (random < rate) {
                log = log + ", 掉落<道具" + goods + ">";
                new InfoHandle().updateGoods(goods, 1);
            }
        }
        cc.log(log);
    },

    gameOver: function(win) {
        this.gameover = this.gameOverUI.getComponent("GameOver");
        this.gameover.showUI(win);
    },

    getTilePos: function (posInPixel) {
        // let mapSize = this.node.getContentSize();
        let tileSize = this.tileSize;
        let x = Math.floor(posInPixel.x / tileSize.width);
        let y = Math.floor(posInPixel.y / tileSize.height);

        // 锚点在中心位置
        return cc.p((x + 0.5) * tileSize.width, (y + 0.5) * tileSize.height);
    },
    prefixInteger: function (num, length) {
        return (Array(length).join('0') + num).slice(-length);
    },
});