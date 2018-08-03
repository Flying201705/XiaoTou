const global = require("../global");

cc.Class({
    extends: cc.Component,

    properties: {
        enemyPrefab: cc.Prefab,
        enemyFrames: [cc.SpriteFrame],
        bossFrames: [cc.SpriteFrame],
    },

    onLoad() {
        this.enemyPool = new cc.NodePool();
        let initCount = 20;
        for (let i = 0; i < initCount; ++i) {
            let enemy = cc.instantiate(this.enemyPrefab); // 创建节点
            this.enemyPool.put(enemy); // 通过 putInPool 接口放入对象池
        }

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
        let enemy = null;
        if (this.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = this.enemyPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(this.enemyPrefab);
        }
        enemy.parent = this.node; // 将生成的敌人加入节点树
        // enemy.getComponent('enemy').init(); //接下来就可以调用 enemy 身上的脚本进行初始化

        this.add(enemy);

        return enemy;
    },

    destroyEnemy: function (enemy) {
        // enemy 应该是一个 cc.Node
        this.enemyPool.put(enemy); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
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
