const global = require("./../global");

const EnemyState = {
    Invalid: -1,
    //无敌状态
    Unbeatable: 0,
    Running: 1,
    EndPath: 2,
    Dead: 3
};

cc.Class({
    extends: cc.Component,

    properties: {
        spriteNode: {
            default: null,
            type: cc.Sprite
        },
        healthProgressBar: {
            default: null,
            type: cc.ProgressBar
        },
        anim: {
            default: null,
            type: cc.Animation
        },
        slowDebuff: {
            default: null,
            type: cc.Node
        },
        audioDead: {
            default: null,
            url: cc.AudioClip
        },
    },

    initWithData: function (gameWorld, type, config, pathPoints) {
        this.speed = config.speed; //速度

        this.currentHealthCount = config.health; //当前血量
        this.totalHealthCount = config.health; //总血量
        this.healthProgressBar.node.opacity = 0;

        this.isBoss = false; //是否BOSS
        if (config.boss !== undefined) {
            this.isBoss = config.boss > 0;
        }

        this.armor = 0; //护甲
        if (config.armor !== undefined) {
            this.armor = config.armor;
        }

        this.state = EnemyState.Invalid;
        this.node.opacity = 0;

        this.beStuned = false; //被眩晕
        this.slowRate = 0; //减速
        this.positionTag = 0; //位置标签，标签值越大越靠前
        this.invincible = 0; //无敌时间
        this.spriteNode.node.scaleX = 1; //复位节点方向

        this.gameWorld = gameWorld;

        this.type = type;
        if (this.type >= 1000) {
            this.spriteNode.spriteFrame = this.gameWorld.enemyMng.getBossSprite(this.type % 1000);
        } else {
            this.spriteNode.spriteFrame = this.gameWorld.enemyMng.getMonsterSprite(this.type);
        }

        this.currentPathPointCount = 0;
        this.pathPoints = pathPoints;
        this.node.position = pathPoints[0];

        this.setState(EnemyState.Unbeatable);
        // this.schedule(this.playAnim, 1);
        this.playAnim();
        this.doMove();
    },

    playAnim: function () {
        if (this.type >= 1000) {
            this.anim.play("boss_" + (this.type % 1000));
        } else {
            this.anim.play("enemy_" + (this.type));
        }
    },

    doMove: function () {
        if (this.isDead() || this.isEndPath()) {
            return;
        }

        this.currentPathPointCount++;
        if (this.currentPathPointCount === this.pathPoints.length) {
            this.setState(EnemyState.EndPath);
            return;
        }

        let pot = this.pathPoints[this.currentPathPointCount];
        // 根据行走的方向，修改节点的方向
        if (this.node.x - pot.x > 20) {
            this.spriteNode.node.scaleX = -1;
        } else {
            this.spriteNode.node.scaleX = 1;
        }

        let distance = cc.pDistance(this.node.position, pot);
        let move = cc.moveTo(distance / (this.speed * (1 - this.slowRate)), pot);
        this.moveAction = cc.sequence(move, cc.callFunc(() => {
            this.doMove();
        }));
        this.node.runAction(this.moveAction);
    },

    stopMove: function () {
        if (this.moveAction) {
            this.node.stopAction(this.moveAction);
        }
    },

    updateMove: function () {
        this.stopMove();
        this.currentPathPointCount--;
        this.doMove();
    },

    update: function (dt) {
        if (global.isPause()) {
            this.node.pauseAllActions();
            return;
        } else {
            this.node.resumeAllActions();
        }

        if (this.state === EnemyState.Unbeatable) {
            this.invincible += dt;
            if (this.invincible >= 0.1) {
                this.setState(EnemyState.Running);
            }
        }

        //位置标签 = 当前节点 * 10000 + distance
        if (this.node.position.active === true) {
            this.positionTag = this.currentPathPointCount * 10000 + cc.pDistance(this.node.position, this.pathPoints[this.currentPathPointCount]);
        }
    },

    setState: function (state) {
        if (this.state === state) {
            return;
        }

        this.state = state;
        switch (state) {
            case EnemyState.Unbeatable:
            case EnemyState.Running:
                this.node.opacity = 255;
                break;
            case EnemyState.Dead:
                cc.audioEngine.playEffect(this.audioDead, false);

                this.stopMove();
                let deadAction = cc.fadeOut(1);
                let deadSequence = cc.sequence(deadAction, cc.callFunc(() => {
                    this.dead();
                }));
                this.node.runAction(deadSequence);
                break;
            case EnemyState.EndPath:
                this.stopMove();
                let endAction = cc.fadeOut(0.5);
                let endSequence = cc.sequence(endAction, cc.callFunc(() => {
                    this.dead();
                }));
                this.node.runAction(endSequence);
                if (this.isBoss === true) {
                    this.gameWorld.detractLife(5);
                } else {
                    this.gameWorld.detractLife(1);
                }
                break;
            default:
                break;
        }
    },

    dead: function () {
        this.gameWorld.enemyMng.destroyEnemy(this.node);

        this.anim.stop();
        this.slowDebuff.opacity = 0;
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
    },

    beAttacked: function (bullet) {
        let damage = bullet.damage;
        if (this.beTriggerRate(bullet.stunRate)) {
            cc.log("触发眩晕！");
            this.handleStuned();
        }

        let beCrit = false;
        if (this.beTriggerRate(bullet.critRate)) {
            cc.log("触发暴击！");
            damage = damage * 2;
            beCrit = true;
        }

        this.handleDamage(damage, bullet.gainRate, beCrit);

        //减速代码
        if (bullet.slowRate > 0 && bullet.slowRate >= this.slowRate) {
            this.handleSlowed(bullet.slowRate, 1);
        }
    },

    handleDamage: function (damage, gainRate, beCrit) {
        //护甲减少伤害
        if (this.armor > 0) {
            let curDamageRate = this.getCutDamageRateByArmor(this.armor);
            damage = damage * (1 - curDamageRate);
        }
        damage = Math.round(damage);

        if (damage > this.currentHealthCount) {
            damage = this.currentHealthCount;
        }
        this.gainGold(damage * gainRate);
        this.currentHealthCount -= damage;

        /* 受过伤害后显示血条 */
        if (this.currentHealthCount < this.totalHealthCount) {
            this.healthProgressBar.node.opacity = 255;
            this.healthProgressBar.progress = this.currentHealthCount / this.totalHealthCount;
        }

        if (this.currentHealthCount <= 0) {
            this.currentHealthCount = 0;
            this.setState(EnemyState.Dead);
            // 普通英雄打死怪物不得金钱
            // this.gainGold(1);
            // 取消BOSS掉落，改为关卡掉落
            /*if (this.isBoss) {
                this.gameWorld.dropGoods('enemy_1000');
            }*/
        }

        this.damageAnimation(damage, beCrit);
    },

    handleStuned: function () {
        if (!this.beStuned) {
            this.beStuned = true;
            this.stopMove();
        } else {
            this.unschedule(this.cancelStuned);
        }
        this.scheduleOnce(this.cancelStuned, 2);
    },

    cancelStuned: function () {
        this.beStuned = false;
        this.updateMove();
    },

    handleSlowed: function (rate, duration) {
        if (this.slowRate > rate) {
            // 当前怪物减速 大于 新受到的减速，不覆盖
            return;
        }

        if (this.slowRate < rate) {
            if (this.slowRate > 0) {
                this.unschedule(this.cancelSlowed);
            }
            this.slowRate = rate;
            this.scheduleOnce(this.cancelSlowed, duration);
            this.slowDebuff.opacity = 255;
            this.updateMove();
        } else if (this.slowRate === rate && this.slowRate > 0) {
            this.unschedule(this.cancelSlowed);
            this.scheduleOnce(this.cancelSlowed, duration);
        }
    },

    cancelSlowed: function () {
        this.slowRate = 0;
        this.slowDebuff.opacity = 0;
        this.updateMove();
    },

    beTriggerRate: function (rate) {
        if (rate > 0) {
            let random = Math.random();
            if (random < rate) {
                return true;
            }
        }

        return false;
    },

    getCutDamageRateByArmor: function (armor) {
        if (armor <= 0) {
            return 0;
        }

        let curDamageRate = (armor * 6) / (100 + armor * 6);
        return curDamageRate;
    },

    gainGold: function (gold) {
        this.gameWorld.addGold(Math.floor(gold));
    },

    isLiving: function () {
        return this.state === EnemyState.Running;
    },

    isDead: function () {
        return this.state === EnemyState.Dead;
    },

    isEndPath: function () {
        return this.state === EnemyState.EndPath;
    },

    damageAnimation: function (num, beCrit) {
        if (num <= 0) {
            return;
        }

        let damage = this.gameWorld.damageMng.createDamage(this.node);
        let damageScript = damage.getComponent("Damage");
        damageScript.init(this.gameWorld.damageMng);
        damageScript.hit(num, beCrit);
    }
});