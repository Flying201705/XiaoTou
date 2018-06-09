import global from './global'

cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        spriteNode: {
            default: null,
            type: cc.Sprite
        },
        anim: {
            default: null,
            type: cc.Animation
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

    initWithData: function(towerConfig, maxLevel) {
        this.towerConfig = towerConfig;
        this.maxLevel = maxLevel;
        this.updateTowerConfig();
    },

    updateTowerConfig: function() {
        if (this.currentLevel < this.towerConfig.costs.length - 1) {
            this.currentUpgradeCost = this.towerConfig.costs[this.currentLevel + 1];
        }
        this.currentDamage = this.towerConfig.damages[this.currentLevel];
        if (this.towerConfig.gain_rates != undefined && this.towerConfig.gain_rates.length > 0) {
            this.currentGainRate = this.towerConfig.gain_rates[this.currentLevel];
        }
        this.currentAttackRange = this.towerConfig.attack_ranges[this.currentLevel];
        //this.lookRange = this.towerConfig.look_range;
        this.lookRange = this.currentAttackRange;
        this.shootBulletDt = this.towerConfig.shoot_dts[this.currentLevel];
        if (this.towerConfig.area != undefined) {
            this.areaAttack = this.towerConfig.area > 0;
        }
        if (this.towerConfig.stun_rates != undefined && this.towerConfig.stun_rates.length > 0) {
            this.currentStunRate = this.towerConfig.stun_rates[this.currentLevel];
        }
        if (this.towerConfig.crit_rates != undefined && this.towerConfig.crit_rates.length > 0) {
            this.currentCritRate = this.towerConfig.crit_rates[this.currentLevel];
        }
        if (this.towerConfig.slows != undefined && this.towerConfig.slows.length > 0) {
            this.currentSlowRate = this.towerConfig.slows[this.currentLevel];
            //所有减速塔均为范围攻击
            this.areaAttack = true;
        }
        if (this.towerConfig.attack_rates != undefined && this.towerConfig.attack_rates.length > 0) {
            this.currentAttackRate = this.towerConfig.attack_rates[this.currentLevel];
            //所有攻击加成的塔均为范围攻击的BUFF塔
            this.buffAttack = true;
            this.areaAttack = true;
        }
        if (this.towerConfig.speed_rates != undefined && this.towerConfig.speed_rates.length > 0) {
            this.currentSpeedRate = this.towerConfig.speed_rates[this.currentLevel];
            //所有攻速加成的塔均为范围攻击的BUFF塔
            this.buffAttack = true;
            this.areaAttack = true;
        }
    },

    updateTower: function () {
        cc.log("update tower");
        if (this.currentLevel < this.spriteFrames.length - 1) {
            this.currentLevel++;
            this.spriteNode.spriteFrame = this.spriteFrames[this.currentLevel];
            this.updateTowerConfig();
        } else {
            cc.log("满级");
        }


    },
    sellTower: function () {
        cc.log("sell tower");

        this.node.destroy();
    }
    ,
    isFree: function () {
        if (this.enemy === undefined) {
            return true;
        }
        return false;
    },
    setTowerList: function(towerList) {
        if (this.buffAttack != true) {
            return;
        }

        this.areaTowerList = [];
        for (let i = 0; i < towerList.length; i++) {
            let tower = towerList[i];
            let distance = cc.pDistance(tower.position, this.node.position);
            if (distance < this.lookRange) {
                this.areaTowerList.push(tower);
            }
        }
    },
    /*setEnemy: function (enemy) {

        let distance = cc.pDistance(enemy.position, this.node.position);
        if (distance < this.lookRange) {
            this.enemy = enemy;
        }
    },*/
    setEnemyList: function(enemyList) {
        this.areaEnemyList = [];
        for (let i = 0; i < enemyList.length; i++) {
            if (this.isFree() != true && this.areaAttack != true) {
                break;
            }
            let enemy = enemyList[i];
            if (enemy.getComponent("enemy").isLiving()) {
                let distance = cc.pDistance(enemy.position, this.node.position);
                if (distance < this.lookRange) {
                    if (this.isFree() == true) {
                        this.enemy = enemy;
                    }

                    if (this.areaAttack == true && this.buffAttack != true) {
                        this.areaEnemyList.push(enemy);
                    }
                }
            }
        }
    },
    beBuffed: function(attackRate, speedRate) {
        if (attackRate >= this.beAttackBuff) {
            this.handleAttackBuff(attackRate);
        }
        if (speedRate >= this.beSpeedBuff) {
            this.handleSpeedBuff(speedRate);
        }
    },
    handleAttackBuff: function(attackRate) {
        this.unschedule(this.cancelAttackBuff);
        this.beAttackBuff = attackRate;
        this.scheduleOnce(this.cancelAttackBuff, 3);
    },
    cancelAttackBuff: function() {
        this.beAttackBuff = 0;
    },
    handleSpeedBuff: function(speedRate) {
        this.unschedule(this.cancelSpeedBuff);
        this.beSpeedBuff = speedRate;
        this.scheduleOnce(this.cancelSpeedBuff, 3);
    },
    cancelSpeedBuff: function() {
        this.beSpeedBuff = 0;
    },
    update: function (dt) {
        //人物添加级数说明
        this.node.getChildByName("lv").getComponent(cc.Label).string = "LV" + (this.currentLevel + 1);

        let shootDt = this.shootBulletDt * (1 - this.beSpeedBuff);
        if (this.currentShootTime <= shootDt) {
            this.currentShootTime += dt;
        }

        if (this.enemy !== undefined) {
            let direction = cc.pSub(this.node.position, this.enemy.position);
            let angle = cc.pAngleSigned(direction, cc.p(0, -1));
            // cc.log("angle = " + angle);
            //塔旋转
            //this.node.rotation = (180 / Math.PI) * angle;

            if (this.currentShootTime > shootDt) {
                this.currentShootTime = 0;
                this.shootBullet();
            }

            let distance = cc.pDistance(this.enemy.position, this.node.position);
            if (distance > this.currentAttackRange || this.enemy.getComponent("enemy").isLiving() === false) {
                this.enemy = undefined;
            }
        }
    },
    shootBullet: function () {
        this.anim.play(this.towerType);
        if (this.buffAttack === true) {
            global.event.fire("shoot_buff", this.node, this.currentAttackRate, this.currentSpeedRate);
        } else {
            cc.audioEngine.play(this.shootAudio, false, 1);
            global.event.fire("shoot_bullet", this.node, this.enemy.position);
        }
    },
    isAreaAttack: function() {
        if (this.areaAttack !== undefined) {
            return this.areaAttack;
        }
        return false;
    },
    ifBuffAttack: function() {
        if (this.buffAttack !== undefined) {
            return this.buffAttack;
        }
        return false;
    },
    getAreaEnemyList: function() {
        return this.areaEnemyList;
    },
    getAreaTowerList: function() {
        return this.areaTowerList;
    },
    getDamage: function () {
        return this.currentDamage * (1 + this.beAttackBuff);
    },
    canUpgrade: function() {
        return this.currentLevel < this.maxLevel;
    },
    getGainRate: function() {
        if (this.currentGainRate !== undefined) {
            return this.currentGainRate;
        }
        return 0;
    },
    getStunRate: function() {
        if (this.currentStunRate !== undefined) {
            return this.currentStunRate;
        }
        return 0;
    },
    getCritRate: function() {
        if (this.currentCritRate !== undefined) {
            return this.currentCritRate;
        }
        return 0;
    },
    getSlowRate: function() {
        if (this.currentSlowRate !== undefined) {
            return this.currentSlowRate;
        }
        return 0;
    },
    getUpgradeCost: function() {
        return this.currentUpgradeCost;
    },
    getSelledGold: function() {
        var gold = 0;
        for (let i = 0; i <= this.currentLevel; i++) {
            gold += this.towerConfig.costs[i];
        }
        return Math.floor(gold / 2);
    },
});