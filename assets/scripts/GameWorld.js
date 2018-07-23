import global from './global'
import {InfoHandle} from './InfoData'
import {InfoData} from './InfoData'

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
        towerGroup: {
            default: null,
            type: cc.Node
        },
        towerOperate: {
            default: null,
            type: cc.Node
        },
        enemyGroup: {
            default: null,
            type: cc.Node
        },
        heroLayer: {
            default: null,
            type: cc.Node
        },
        bulletLayer: {
            default: null,
            type: cc.Node
        },
        heroPrefab: {
            default: null,
            type: cc.Prefab
        },
        effectPrefab: {
            default: null,
            type: cc.Prefab
        },
        goldLabel: {
            default: null,
            type: cc.Label
        },
        crystalLabel: {
            default: null,
            type: cc.Label
        },
        waveDetails: {
            default: null,
            type: cc.Label
        },
        lifeNode: {
            default: null,
            type: cc.Node
        },
        summonHintLabel: {
            default: null,
            type: cc.Label
        },
        gameOverUI: {
            default: null,
            type: cc.Node
        },
        audioMng: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        cc.log("GameWorld onLoad");

        this.setTouchEvent();

        //当前关卡
        this.currentLevel = global.currentLevel;

        this.currentWaveCount = 0;
        this.totalWaveCount = 0;
        this.currentEnemyCount = 0;

        this.tileSize = 80;
        this.goldCount = 0;
        this.crystalCount = InfoData.user.crystal;
        if (this.crystalCount === undefined) {
            this.crystalCount = 0;
        }
        this.lifeCount = 10;
        this.addEnemyCurrentTime = 0;
        this.addWaveCurrentTime = 0;

        this.selectBox.active = false;

        this.enemyPathPositions = [];
        this.towerRects = [];

        this.initEvent();

        this.towerMng = this.towerGroup.getComponent('TowerMng');
        this.towerOp = this.towerOperate.getComponent('TowerOperate');
        this.enemyMng = this.enemyGroup.getComponent('EnemyMng');
        this.bulletMng = this.bulletLayer.getComponent('BulletMng');
        this.hero = cc.instantiate(this.heroPrefab);
        this.hero.active = false;

        //加载地图
        this.level_map = this.node.getChildByName('level_map').getComponent("level-map");
        this.level_map.loadMap("map/level_" + this.currentLevel);

        //音频
        this.audioMng = this.audioMng.getComponent("GameAudio");
    },

    initEvent: function () {
        global.event.on("build_tower", this.buildTower.bind(this));
        global.event.on("update_tower", this.updateTower.bind(this));
        global.event.on("sell_tower", this.sellTower.bind(this));
        global.event.on("game_start", this.gameStart.bind(this));
        global.event.on("shoot_bullet", this.addBullet.bind(this));
        global.event.on("destroy_bullet", this.removeBullet.bind(this));
        global.event.on("shoot_buff", this.addBuff.bind(this));
        global.event.on("summon_hero", this.summonHero.bind(this));
        global.event.on("release_slow", this.handleSlow.bind(this));
        global.event.on("release_stun", this.handleStun.bind(this));
        global.event.on("release_damage", this.handleDamage.bind(this));
        global.event.on("buy_slow", this.buySlow.bind(this));
        global.event.on("buy_stun", this.buyStun.bind(this));
        global.event.on("buy_damage", this.buyDamage.bind(this));
    },

    onDestroy: function () {
        global.event.off("build_tower", this.buildTower);
        global.event.off("update_tower", this.updateTower);
        global.event.off("sell_tower", this.sellTower);
        global.event.off("game_start", this.gameStart);
        global.event.off("shoot_bullet", this.addBullet);
        global.event.off("destroy_bullet", this.removeBullet);
        global.event.off("shoot_buff", this.addBuff);
        global.event.off("summon_hero", this.summonHero);
        global.event.off("release_slow", this.handleSlow);
        global.event.off("release_stun", this.handleStun);
        global.event.off("release_damage", this.handleDamage);
        global.event.off("buy_slow", this.buySlow);
        global.event.off("buy_stun", this.buyStun);
        global.event.off("buy_damage", this.buyDamage);
    },

    setTouchEvent: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (cc.director.isPaused()) {
                return;
            }

            let windowSize = cc.view.getVisibleSize();
            let x = event.touch.getLocation().x - windowSize.width * 0.5;
            let y = event.touch.getLocation().y - windowSize.height * 0.5;
            console.log("x = " + event.touch.getLocation().x + ", y = " + event.touch.getLocation().y);

            // 处理英雄操作
            if (this.hero !== undefined && this.hero.active === true) {
                let isHeroHandle = this.hero.getComponent("hero").handleTouched(x, y);
                if (isHeroHandle === true) {
                    if (this.selectBox.active === true) {
                        this.closeMenu();
                        this.audioMng.playTowerDeselect();
                    }
                    return;
                }
            }

            // 处理塔操作
            let index = this.getTouchedTowerIdx(x, y);
            cc.log("touched event:" + x + "," + y + ", index = " + index);
            if (index >= 0) {
                this.showUpdateMenu(index);
            } else if (this.selectBox.active === true) {
                this.closeMenu();
                this.audioMng.playTowerDeselect();
            } else if (this.isTouchEnable(x, y)) {
                this.showBuildMenu(x, y);
            }
        });
    },

    getTouchedTowerIdx: function (x, y) {
        for (let i = 0; i < this.towerGroup.childrenCount; i++) {
            let tower = this.towerGroup.children[i];
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

        this.towerOp.showBuildMenu(centerPos);

        this.audioMng.playTowerSelect();
    },

    showUpdateMenu: function (index) {
        this.closeMenu();
        let tower = this.towerGroup.children[index];
        if (tower !== undefined) {
            this.selectBox.active = true;
            this.selectBox.parent = this.node;
            this.selectBox.position = tower.position;

            this.towerOp.showUpdateMenu(tower, this.goldCount, index);

            this.audioMng.playTowerSelect();
        }
    },

    closeMenu: function () {
        this.towerOp.closeMenu();
        this.selectBox.active = false;
        return this.towerOp.getUpdateMenuIndex();
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

        let tower = this.towerMng.createTower(this.towerGroup, data);
        tower.position = this.getTilePos(this.towerOp.getBuildMenuPosition());
        // this.setTowerTouchEvent(tower);
        tower.getComponent("tower").initWithData(this.towerConfigs[tower_type], this.levelConfig.towers[data].level);

        this.detractGold(create_cost);
        this.audioMng.playTowerBuild();
    },

    updateTower: function () {
        let tower = this.towerGroup.children[this.closeMenu()];
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

            this.audioMng.playTowerUpdate();
        }
    },

    sellTower: function () {
        let index = this.closeMenu();
        let tower = this.towerGroup.children[index];
        if (tower !== undefined) {
            this.addGold(tower.getComponent("tower").getSelledGold());
            // tower.getComponent("tower").sellTower();
            this.towerGroup.removeChild(tower);
            this.towerMng.destroyTower(tower);

            this.audioMng.playTowerSell();
        }
    },

    gameStart: function () {
        this.loadLevelConfig();
        this.loadTowerConfig();
        this.loadRewardConfig();
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
            this.isTowerCanUpgrade();
            this.towerOp.initBuildMenu(this.levelConfig.towers);
            this.totalWaveCount = this.levelConfig.waves.length;
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

    loadRewardConfig: function () {
        cc.loader.loadRes("./config/reward_config", (err, result) => {
            if (err) {
                cc.log("load config = " + err);
            } else {
                this.rewardConfigs = result;
            }
        });
    },

    update: function (dt) {
        if (global.isPause()) {
            return;
        }

        this.goldLabel.string = this.goldCount.toString();
        this.crystalLabel.string = this.crystalCount.toString();
        this.lifeNode.getComponent("Life").setLife(this.lifeCount);
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
                    this.updateWaveDetails();
                } else {
                    this.currentWaveConfig = undefined;
                }
                this.addWaveCurrentTime = 0;
            } else {
                this.addWaveCurrentTime += dt;
            }
        }

        this.sortEnemyList(this.enemyMng.list);
        // 处理英雄操作
        if (this.hero !== undefined && this.hero.active === true) {
            this.hero.getComponent("hero").setEnemyList(this.enemyMng.list);
        }

        // 处理塔操作
        for (let i = 0; i < this.towerGroup.childrenCount; i++) {
            let tower = this.towerGroup.children[i];
            if (tower !== undefined) {
                if (tower.getComponent("tower").ifBuffAttack()) {
                    tower.getComponent("tower").setTowerList(this.towerGroup.children);
                }
                tower.getComponent("tower").setEnemyList(this.enemyMng.list);
            }
        }

        if (this.levelConfig && this.currentWaveCount >= this.levelConfig.waves.length
            && this.currentWaveConfig === undefined
            && this.enemyGroup.childrenCount <= 0) {
            //游戏结束--赢了
            this.gameOver(true);
        }
    },

    updateWaveDetails: function () {
        this.waveDetails.string = this.prefixInteger(this.currentWaveCount, 2) + "/" + this.prefixInteger(this.totalWaveCount, 2);
    },

    addEnemy: function (type, level) {
        let enemy = this.enemyMng.createEnemy(this.enemyGroup);
        enemy.getComponent("enemy").initWithData(this, type, level, this.enemyPathPositions);
    },

    addBullet: function (tower, position) {
        let bullet = this.bulletMng.requestBullet(tower.getComponent("tower").bulletType);
        bullet.parent = this.bulletLayer;
        bullet.getComponent("bullet").initWithData(tower, position, this.enemyMng.list);
    },

    removeBullet: function(type, obj) {
        this.bulletMng.returnBullet(type, obj);
    },

    addBuff: function (tower, attackRate, speedRate) {
        let buffList = tower.getComponent("tower").getAreaTowerList();
        for (let i = 0; i < buffList.length; i++) {
            buffList[i].getComponent("tower").beBuffed(attackRate, speedRate);
        }
    },

    hasXiaoBinMaxLevel: function() {
        for (let i = 0; i < this.towerGroup.childrenCount; i++) {
            let tower = this.towerGroup.children[i];
            if (tower !== undefined) {
                let t = tower.getComponent("tower");
                if (t.towerType == "tower_a" && t.currentLevel >= 4) {
                    return true;
                }
            }
        }
        return false;
    },

    showSummonHint: function (hint) {
        this.summonHintLabel.node.active = true;
        this.summonHintLabel.string = hint;
        this.scheduleOnce(this.hideSummonHint, 2);
    },

    hideSummonHint: function () {
        this.summonHintLabel.string = "";
        this.summonHintLabel.node.active = false;
    },

    summonHero: function () {
        if (this.currentLevel < 21) {
            this.showSummonHint("21关解锁神秘英雄，加油哦~");
        } else if (InfoData.user.hero !== 1) {
            global.event.fire("show_back_pack_dialog");
        } else if (this.hasXiaoBinMaxLevel() !== true) {
            this.showSummonHint("召唤英雄需要小兵升到顶级");
        } else if (this.goldCount < 500) {
            this.showSummonHint("召唤英雄需要500金币");
        } else {
            this.goldCount -= 500;
            let x = this.node.getChildByName('bottomBar').x;
            let y = this.node.getChildByName('bottomBar').y + this.hero.height;
            this.hero.position = cc.p(x, y);
            this.hero.parent = this.heroLayer;
            this.hero.active = true;
            this.hero.getComponent("hero").initWithData(this.towerConfigs["hero"], 1000);
            this.hero.getComponent("hero").showHero();
        }
    },

    handleSlow: function () {
        for (let j = 0; j < this.enemyMng.list.length; j++) {
            let enemy = this.enemyMng.list[j];
            enemy.getComponent("enemy").hanleSlowed(0.5);
        }
    },

    handleStun: function () {
        for (let j = 0; j < this.enemyMng.list.length; j++) {
            let enemy = this.enemyMng.list[j];
            enemy.getComponent("enemy").handleStuned();
        }
    },

    handleDamage: function () {
        let effectNode = cc.instantiate(this.effectPrefab);
        effectNode.position = cc.p(0, 0);
        effectNode.parent = this.node;
        effectNode.getComponent("Effect").playAnim();
        var animationCom = effectNode.getComponent("Effect").getComponent(cc.Animation);
        animationCom.onEffectEnd = this.onEffectEnd.bind(this);
    },

    onEffectEnd: function (prop) {
        console.log("gameworld onEffectEnd~~" + prop);
        if (prop === "bomb") {
            for (let j = 0; j < this.enemyMng.list.length; j++) {
                let enemy = this.enemyMng.list[j];
                enemy.getComponent("enemy").handleDamage(100, 0);
            }
        }
    },

    //购买减速
    buySlow: function (count) {
        this.node.getChildByName('bottomBar').getComponent("PropsControl").addProp(1, count);
    },

    //购买眩晕
    buyStun: function (count) {
        this.node.getChildByName('bottomBar').getComponent("PropsControl").addProp(2, count);
    },

    //购买炸弹
    buyDamage: function (count) {
        this.node.getChildByName('bottomBar').getComponent("PropsControl").addProp(3, count);
    },

    addGold: function (gold) {
        this.goldCount += gold;
        this.isTowerCanUpgrade();
    },

    detractGold: function (gold) {
        this.goldCount -= gold;
        if (this.goldCount < 0) {
            this.goldCount = 0;
        }
        this.isTowerCanUpgrade();
    },

    isTowerCanUpgrade: function () {
        for (let i = 0; i < this.towerGroup.childrenCount; i++) {
            let tower = this.towerGroup.children[i];
            if (tower !== undefined) {
                let t = tower.getComponent("tower");
                if (t.canUpgrade() && this.goldCount >= t.getUpgradeCost()) {
                    t.showGradeMark();
                } else {
                    t.hideGradeMark();
                }
            }
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

    hasGoods: function(goodsId) {
        if (goodsId < 1000) {
            return false;
        }

        if (InfoData.goods === undefined || InfoData.goods.length <= 0) {
            return false;
        }

        for (let i = 0; i < InfoData.goods.length; i++) {
            if (InfoData.goods[i].goodsid === goodsId && InfoData.goods[i].number > 0) {
                return true;
            }
        }

        return false;
    },

    dropGoods: function (level) {
        let log = "通关获取奖励";
        let rewards = [];
        if (this.rewardConfigs[level] != undefined) {
            for (let i = 0; i < this.rewardConfigs[level].length; i++) {
                let goods = this.rewardConfigs[level][i].goods;
                let rate = this.rewardConfigs[level][i].rate;
                // 碎片只需要获取一次
                if (goods >= 1000 && this.hasGoods(goods) === true) {
                    continue;
                }
                let random = Math.random();
                if (random < rate) {
                    rewards[rewards.length] = goods + "-" + 1;
                    new InfoHandle().updateGoods(goods, 1);
                }
            }
            
            if (rewards.length < 2) {
                // 掉落道具数少于两个，奖励水晶
                // 两个星-1水晶，三个星-2水晶
                let crystalNum = this.getStarsForWin() - 1;
                if (crystalNum > 0) {
                    rewards[rewards.length] = 0 + "-" + crystalNum;
                    new InfoHandle().updateCrystal(crystalNum);
                }                    
            }
        } else {
            // 普通关卡，奖励水晶
            // 两个星-1水晶，三个星-2水晶
            let crystalNum = this.getStarsForWin() - 1;
            if (crystalNum > 0) {
                rewards[rewards.length] = 0 + "-" + crystalNum;
                new InfoHandle().updateCrystal(crystalNum);
            }
        }
        
        // 打LOG测试奖励
        if (rewards.length > 0) {
            for (let i = 0; i < rewards.length; i++) {
                let reward = rewards[i].split("-");
                log = log + ", 掉落<道具" + reward[0] + ">" + reward[1] + "个";
            }
        }
        cc.log(log);

        return rewards;
    },

    gameOver: function (win) {
        this.gameover = this.gameOverUI.getComponent("GameOver");

        if (win === true) {
            let rewards = this.dropGoods("level_" + this.currentLevel);
            this.audioMng.playWin();
            this.gameover.showWinUI(this.getStarsForWin(), rewards);

            new InfoHandle().updateLevel(this.currentLevel, 100, this.getStarsForWin());
        } else {
            this.audioMng.playLose();
            this.gameover.showLoseUI(
                this.prefixInteger(this.currentWaveCount - 1, 2) + "/" + this.prefixInteger(this.totalWaveCount, 2));
        }
    },

    updateCrystalCount(count) {
        let crystalNum = count - this.crystalCount;
        this.crystalCount = count;
        this.crystalLabel.string = count.toString();
        new InfoHandle().updateCrystal(crystalNum);
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

    getStarsForWin: function () {
        if (this.lifeCount >= 10) {
            return 3;
        } else if (this.lifeCount >= 5) {
            return 2;
        } else if (this.lifeCount >= 1) {
            return 1;
        }
        return 0;
    },

    sortEnemyList: function (enemyList) {
        for (let i = 0; i < enemyList.length; i++) {
            for (let j = i + 1; j < enemyList.length; j++) {
                //位置标签值越大位置越靠前
                if (enemyList[j].getComponent("enemy").positionTag > enemyList[i].getComponent("enemy").positionTag) {
                    let enemy = enemyList[i];
                    enemyList[i] = enemyList[j];
                    enemyList[j] = enemy;
                }
            }
        }
    },
});