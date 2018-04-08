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
        towerType: ""
    },

    // use this for initialization
    onLoad: function () {
        //当前级数从0级开始
        this.currentLevel = 0;
        this.currentUpgradeCost = 0;
        this.currentDamage = 0;
        this.currentGainRate = 0;
        this.lookRange = 0;
        this.currentAttackRange = 0;
        this.shootBulletDt = 0;
        this.currentShootTime = 0;
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
    setEnemy: function (enemy) {

        let distance = cc.pDistance(enemy.position, this.node.position);
        if (distance < this.lookRange) {
            this.enemy = enemy;
        }

    },
    update: function (dt) {
        //人物添加级数说明
        this.node.getChildByName("lv").getComponent(cc.Label).string = "LV" + (this.currentLevel + 1);

        if (this.enemy !== undefined) {
            let direction = cc.pSub(this.node.position, this.enemy.position);
            let angle = cc.pAngleSigned(direction, cc.p(0, -1));
            // cc.log("angle = " + angle);
            //塔旋转
            //this.node.rotation = (180 / Math.PI) * angle;

            if (this.currentShootTime > this.shootBulletDt) {
                this.currentShootTime = 0;
                this.shootBullet();
            } else {
                this.currentShootTime += dt;
            }

            let distance = cc.pDistance(this.enemy.position, this.node.position);
            if (distance > this.currentAttackRange || this.enemy.getComponent("enemy").isLiving() === false) {
                this.enemy = undefined;
            }
        }
    },
    shootBullet: function () {
        /*if (this.currentLevel === 0) {
            this.anim.play("tower_1");
        } else if (this.currentLevel === 1) {
            this.anim.play("tower_2");
        } else if (this.currentLevel === 2) {
            this.anim.play("tower_3");
        }*/
        this.anim.play(this.towerType);
        global.event.fire("shoot_bullet", this.node, this.enemy.position);
    },
    getDamage: function () {
        return this.currentDamage;
    },
    canUpgrade: function() {
        return this.currentLevel < this.maxLevel;
    },
    getGainRate: function() {
        return this.currentGainRate;
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