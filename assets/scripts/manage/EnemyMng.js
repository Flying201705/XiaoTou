const global = require("../global");
const NodePool = require("../NodePool");

cc.Class({
    extends: cc.Component,

    properties: {
        enemyPool: NodePool,
        enemyFrames: [cc.SpriteFrame],
        bossFrames: [cc.SpriteFrame],
    },

    onLoad() {
        this.enemyPool.init(this.node);

        this.list = [];

        cc.loader.loadRes("./config/monster_config", (err, result) => {
            if (err) {
                cc.log(err);
            } else {
                this.enemyConfigs = result;
            }
        });
    },

    init: function (gameWorld) {
        this.gameWorld = gameWorld;
        this.currentWaveCount = 0;
        this.addEnemyCurrentTime = 0;
        this.addWaveCurrentTime = 0;
        this.currentEnemyCount = 0;
    },

    onDestroy() {
        cc.loader.release("./config/monster_config");
        this.enemyConfigs = null;
        this.list = null;
        this.enemyPool.clear();
    },

    startBuildMonster: function () {
        this.schedule(this.createMonsterUpdate, 0.5);
    },

    createMonsterUpdate: function (dt) {
        if (global.isPause()) {
            return;
        }
        if (this.currentWaveConfig) {
            this.addEnemyCurrentTime += dt;
            if (this.addEnemyCurrentTime >= this.currentWaveConfig.dt) {
                this.addEnemyCurrentTime = 0;
                this.currentEnemyCount++;
                this.addEnemy(this.currentWaveConfig.type, this.currentWaveConfig.lv);
                if (this.currentEnemyCount === this.currentWaveConfig.count) {
                    this.currentWaveConfig = undefined;
                    this.currentEnemyCount = 0;
                }
            }
        } else if (this.gameWorld.levelConfig) {
            this.addWaveCurrentTime += dt;
            if (this.addWaveCurrentTime >= this.gameWorld.levelConfig.dt) {
                this.currentWaveConfig = this.gameWorld.levelConfig.waves[this.currentWaveCount];
                if (this.currentWaveCount < this.gameWorld.levelConfig.waves.length) {
                    this.currentWaveCount++;
                    this.gameWorld.updateWaveDetails(this.currentWaveCount);
                } else {
                    this.currentWaveConfig = undefined;
                }
                this.addWaveCurrentTime = 0;
            }
        }
    },

    addEnemy: function (type, level) {
        let enemy = this.createEnemy();
        let configs = this.getEnemyConfigs();
        let config = configs["enemy_" + type][level];
        enemy.getComponent("enemy").initWithData(this.gameWorld, type, config, this.gameWorld.enemyPathPositions);
    },

    createEnemy: function () {
        let enemy = this.enemyPool.request();
        this.add(enemy);

        return enemy;
    },

    destroyEnemy: function (enemy) {
        this.remove(enemy);
        this.enemyPool.return(enemy);
    },

    add: function (enemy) {
        this.list.push(enemy);
    },

    remove: function (enemy) {
        let index = this.list.indexOf(enemy);
        if (index > -1) {
            this.list.splice(index, 1);
        }
    },

    getEnemyConfigs: function () {
        return this.enemyConfigs;
    },

    getMonsterSprite: function (type) {
        return this.enemyFrames[type];
    },

    getBossSprite: function (type) {
        return this.bossFrames[type];
    }
});
