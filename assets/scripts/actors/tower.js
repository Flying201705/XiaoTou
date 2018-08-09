const global = require("./../global");

cc.Class({
    extends: cc.Component,

    properties: {
        // spriteFrames: {
        //     default: [],
        //     type: cc.SpriteFrame
        // },
        levelFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        // spriteNode: {
        //     default: null,
        //     type: cc.Sprite
        // },
        levelNode: {
            default: null,
            type: cc.Sprite
        },
        anim: {
            default: null,
            type: cc.Animation
        },
        upgradeNode: {
            default: null,
            type: cc.Node
        },
        shootAudio: {
            default: null,
            url: cc.AudioClip
        },
        towerType: "",
        bulletType: 0
    },

    // use this for initialization
    onLoad: function () {
        //当前级数，从0级开始
        this.currentLevel = 0;
        //当前级数塔升级所需金币
        this.currentUpgradeCost = 0;
        //当前攻击力
        this.currentDamage = 0;
        //当前偷钱比例
        this.currentGainRate = 0;
        //侦查范围（默认等于攻击范围）
        this.lookRange = 0;
        //当前攻击范围
        this.currentAttackRange = 0;
        //当前攻击间隔(攻速)
        this.shootBulletDt = 0;
        //当前塔的眩晕概率
        this.currentStunRate = 0;
        //当前塔的暴击概率
        this.currentCritRate = 0;
        //当前塔的减速比例
        this.currentSlowRate = 0;
        //当前塔提供的攻击buff比例
        this.currentAttackRate = 0;
        //当前塔提供的攻速buff比例
        this.currentSpeedRate = 0;
        //当前塔是否区域攻击（群攻）塔
        this.areaAttack = false;
        //当前塔是否为BUFF辅助塔
        this.buffAttack = false;
        //受到的攻击加成
        this.beAttackBuff = 0;
        //受到的攻速加成
        this.beSpeedBuff = 0;

        /**下为业务逻辑 */
        this.currentShootTime = 0;
        this.areaEnemyList = [];
        this.areaTowerList = [];
    },

    initWithData: function (gameWorld, towerConfig, maxLevel) {
        this.enemyMng = gameWorld.enemyMng;
        this.bulletMng = gameWorld.bulletMng;
        this.towers = gameWorld.towerGroup;

        this.towerConfig = towerConfig;
        this.maxLevel = maxLevel;
        this.updateTowerConfig();

        this.schedule(this.checkAtkTarget, 0.1);
        this.schedule(this.fire, 0.05);

        if (this.isBuffAttack()) {
            this.schedule(this.checkBuffTowers, 0.1);
            this.schedule(this.buff, 1);
        }
    },

    updateTowerConfig: function () {
        if (this.currentLevel < this.towerConfig.costs.length - 1) {
            this.currentUpgradeCost = this.towerConfig.costs[this.currentLevel + 1];
        }
        this.currentDamage = this.towerConfig.damages[this.currentLevel];
        if (this.towerConfig.gain_rates !== undefined && this.towerConfig.gain_rates.length > 0) {
            this.currentGainRate = this.towerConfig.gain_rates[this.currentLevel];
        }
        this.currentAttackRange = this.towerConfig.attack_ranges[this.currentLevel];
        //this.lookRange = this.towerConfig.look_range;
        this.lookRange = this.currentAttackRange;
        this.shootBulletDt = this.towerConfig.shoot_dts[this.currentLevel];
        if (this.towerConfig.area !== undefined) {
            this.areaAttack = this.towerConfig.area > 0;
        }
        if (this.towerConfig.stun_rates !== undefined && this.towerConfig.stun_rates.length > 0) {
            this.currentStunRate = this.towerConfig.stun_rates[this.currentLevel];
        }
        if (this.towerConfig.crit_rates !== undefined && this.towerConfig.crit_rates.length > 0) {
            this.currentCritRate = this.towerConfig.crit_rates[this.currentLevel];
        }
        if (this.towerConfig.slows !== undefined && this.towerConfig.slows.length > 0) {
            this.currentSlowRate = this.towerConfig.slows[this.currentLevel];
            //所有减速塔均为范围攻击
            this.areaAttack = true;
        }
        if (this.towerConfig.attack_rates !== undefined && this.towerConfig.attack_rates.length > 0) {
            this.currentAttackRate = this.towerConfig.attack_rates[this.currentLevel];
            //所有攻击加成的塔均为范围攻击的BUFF塔
            this.buffAttack = true;
            this.areaAttack = true;
        }
        if (this.towerConfig.speed_rates !== undefined && this.towerConfig.speed_rates.length > 0) {
            this.currentSpeedRate = this.towerConfig.speed_rates[this.currentLevel];
            //所有攻速加成的塔均为范围攻击的BUFF塔
            this.buffAttack = true;
            this.areaAttack = true;
        }
    },

    hasAtkTarget: function () {
        return !(this.enemy === undefined || this.enemy === null);
    },

    // missAtkTarget: function () {
    //     this.enemy = undefined;
    // },

    checkAtkTarget: function () {
        if (this.isAreaAttack()) {  //群体攻击
            this.chooseAtkTargets();
        } else {                    //单体攻击
            this.chooseAtkTarget();
            // if (!this.hasAtkTarget()) {
            //     this.chooseAtkTarget();
            // } else {
            //     if (!this.enemy.getComponent("enemy").isLiving()) {
            //         this.missAtkTarget();
            //         return;
            //     }
            //     this.checkTargetIsOutOfRange();
            // }
        }
    },

    chooseAtkTarget: function () {
        this.enemy = undefined;
        let enemyList = this.enemyMng.list;
        for (let i = 0; i < enemyList.length; i++) {
            let enemy = enemyList[i];
            if (this.isInAtkRange(enemy)) {
                this.enemy = enemy;
                break;
            }
        }
    },

    chooseAtkTargets: function () {
        this.areaEnemyList = [];
        let enemyList = this.enemyMng.list;
        for (let i = 0; i < enemyList.length; i++) {
            let enemy = enemyList[i];
            if (this.isInAtkRange(enemy)) {
                this.areaEnemyList.push(enemy);
            }
        }
    },

    isInAtkRange: function (enemy) {
        if (enemy.getComponent("enemy").isLiving()) {
            let distance = cc.pDistance(enemy.position, this.node.position);
            if (distance < this.lookRange) {
                return true;
            }
        }
        return false;
    },

    // checkTargetIsOutOfRange: function () {
    //     if (this.hasAtkTarget()) {
    //         if (!this.isInAtkRange(this.enemy)) {
    //             this.missAtkTarget();
    //         }
    //     }
    // },

    checkBuffTowers: function () {
        this.areaTowerList = [];
        let towerList = this.towers.children;
        for (let i = 0; i < towerList.length; i++) {
            let tower = towerList[i];
            let distance = cc.pDistance(tower.position, this.node.position);
            if (distance < this.lookRange) {
                this.areaTowerList.push(tower);
            }
        }
    },

    fire: function (dt) {
        if (global.isPause()) {
            return;
        }

        let shootDt = this.shootBulletDt * (1 - this.beSpeedBuff);
        if (this.currentShootTime <= shootDt) {
            this.currentShootTime += dt;
        }

        if (this.currentShootTime > shootDt) {
            if (this.isAreaAttack() && this.areaEnemyList.length > 0) {
                this.currentShootTime = 0;
                this.shootBullets();
            } else if (this.hasAtkTarget() && this.enemy.getComponent("enemy").isLiving()) {
                this.currentShootTime = 0;
                this.shootBullet();
            }
        }
    },

    shootBullet: function () {
        this.anim.play(this.towerType);
        cc.audioEngine.play(this.shootAudio, false, 1);
        this.bulletMng.addBullet(this.node, this.enemy);
    },

    shootBullets: function () {
        this.anim.play(this.towerType);
        cc.audioEngine.play(this.shootAudio, false, 1);
        for (let i = 0; i < this.areaEnemyList.length; i++) {
            let enemy = this.areaEnemyList[i];
            if (enemy && enemy.getComponent("enemy").isLiving()) {
                this.bulletMng.addBullet(this.node, this.enemy);
            }
        }
    },

    buff: function () {
        if (global.isPause()) {
            return;
        }

        this.anim.play(this.towerType);
        global.event.fire("shoot_buff", this.node, this.currentAttackRate, this.currentSpeedRate);
    },

    updateTower: function () {
        cc.log("update tower");
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            // this.spriteNode.spriteFrame = this.spriteFrames[this.currentLevel];
            this.levelNode.spriteFrame = this.levelFrames[this.currentLevel];
            this.updateTowerConfig();
        } else {
            cc.log("满级");
        }
    },

    sellTower: function () {
        cc.log("sell tower");

        this.node.destroy();
    },

    beBuffed: function (attackRate, speedRate) {
        if (attackRate >= this.beAttackBuff) {
            this.handleAttackBuff(attackRate);
        }
        if (speedRate >= this.beSpeedBuff) {
            this.handleSpeedBuff(speedRate);
        }
    },

    handleAttackBuff: function (attackRate) {
        this.unschedule(this.cancelAttackBuff);
        this.beAttackBuff = attackRate;
        this.scheduleOnce(this.cancelAttackBuff, 3);
    },

    cancelAttackBuff: function () {
        this.beAttackBuff = 0;
    },

    handleSpeedBuff: function (speedRate) {
        this.unschedule(this.cancelSpeedBuff);
        this.beSpeedBuff = speedRate;
        this.scheduleOnce(this.cancelSpeedBuff, 3);
    },

    cancelSpeedBuff: function () {
        this.beSpeedBuff = 0;
    },

    isAreaAttack: function () {
        return this.areaAttack === true;
    },

    isBuffAttack: function () {
        return this.buffAttack === true;
    },

    // getAreaEnemyList: function () {
    //     return this.areaEnemyList;
    // },

    getAreaTowerList: function () {
        return this.areaTowerList;
    },

    getDamage: function () {
        return this.currentDamage * (1 + this.beAttackBuff);
    },

    canUpgrade: function () {
        return this.currentLevel < this.maxLevel;
    },

    getGainRate: function () {
        if (this.currentGainRate !== undefined) {
            return this.currentGainRate;
        }
        return 0;
    },

    getStunRate: function () {
        if (this.currentStunRate !== undefined) {
            return this.currentStunRate;
        }
        return 0;
    },

    getCritRate: function () {
        if (this.currentCritRate !== undefined) {
            return this.currentCritRate;
        }
        return 0;
    },

    getSlowRate: function () {
        if (this.currentSlowRate !== undefined) {
            return this.currentSlowRate;
        }
        return 0;
    },

    getUpgradeCost: function () {
        return this.currentUpgradeCost;
    },

    getSelledGold: function () {
        let gold = 0;
        for (let i = 0; i <= this.currentLevel; i++) {
            gold += this.towerConfig.costs[i];
        }
        return Math.floor(gold / 2);
    },

    showGradeMark: function () {
        this.upgradeNode.active = true;
    },

    hideGradeMark: function () {
        this.upgradeNode.active = false;
    }
});