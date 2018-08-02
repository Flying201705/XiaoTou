cc.Class({
    extends: cc.Component,

    properties: {
        enemyPrefab: cc.Prefab,
        enemyFrames:  [cc.SpriteFrame],
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

    createEnemy: function (parentNode) {
        let enemy = null;
        if (this.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = this.enemyPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(this.enemyPrefab);
        }
        enemy.parent = parentNode; // 将生成的敌人加入节点树
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
