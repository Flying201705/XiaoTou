const global = require("./../global");

const HeroState = {
    Invalid: -1,
    //召唤
    Summon: 0,
    Attack: 1,
    LeftMove: 2,
    RightMove: 3
};

cc.Class({
    extends: require("tower"),

    properties: {
        selectedNode: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.speed = 200;
        //英雄是否选中
        this.heroSelected = false;
        // 英雄是否可以闪现
        this.flashMove = false;
        this.state = HeroState.Invalid;
        this.targetPosition = this.node.position;
        //当前英雄级别，从0级开始
        this.currentHeroLevel = 0;

        //当前级数，从0级开始
        this.currentLevel = 0;
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
        //受到的攻击加成
        this.beAttackBuff = 0;
        //受到的攻速加成
        this.beSpeedBuff = 0;

        /**下为业务逻辑 */
        this.currentShootTime = 0;
        this.AttackCount = 0;
    },

    fire: function (dt) {
        if (this.state === HeroState.Attack) {
            let shootDt = this.shootBulletDt * (1 - this.beSpeedBuff);
            if (this.currentShootTime <= shootDt) {
                this.currentShootTime += dt;
            }

            if (this.currentShootTime > shootDt) {
                if (this.hasAtkTarget() && this.enemy.getComponent("enemy").isLiving()) {
                    this.currentShootTime = 0;
                    this.shootBullet();
                }
            }
        }
    },

    update: function (dt) {
        if (this.state === HeroState.LeftMove || this.state === HeroState.RightMove) {
            let distance = cc.pDistance(this.node.position, this.targetPosition);
            if (distance < 10) {
                this.unschedule(this.playHeroAnim);
                this.state = HeroState.Attack;
                this.playHeroAnim();
            } else {
                let direction = cc.pNormalize(cc.pSub(this.targetPosition, this.node.position));
                this.node.position = cc.pAdd(this.node.position, cc.pMult(direction, this.speed * dt));
            }
        }
    },

    shootBullet: function () {
        this.playHeroAnim();
        cc.audioEngine.play(this.shootAudio, false, 1);
        global.event.fire("shoot_bullet", this.node, this.enemy);
        //英雄自升级，临时：当前等级的十倍攻击次数升一级
        this.AttackCount++;
        if (this.AttackCount > (this.currentHeroLevel + 1) * 10) {
            this.AttackCount = 0;
            this.currentHeroLevel++;
        }
    },

    handleTouched: function (x, y) {
        if (y > 240 || y < -240) {
            return false;
        }
        if (this.heroSelected === true) {
            this.heroSelected = false;
            this.onHeroSelected(false);
            this.hideSelectedMark();
            if (this.flashMove === true) {
                // 有飞鞋的情况下，英雄瞬间移动
                this.node.position = cc.p(x, y);
                return true;
            }

            if (x <= this.node.x) {
                this.state = HeroState.LeftMove;
            } else {
                this.state = HeroState.RightMove;
            }
            //进行移动动画
            this.playHeroAnim();
            this.schedule(this.playHeroAnim, 0.3);
            // this.moveTo(x, y);
            this.targetPosition = cc.p(x, y);
            return true;
        }

        if (this.isTouchedHero(x, y)) {
            this.heroSelected = true;
            this.onHeroSelected(true);
            this.showSelectedMark();
            return true;
        }

        return false;
    },

    isTouchedHero: function (x, y) {
        let heroRect = cc.rect(this.node.x - this.node.width * 0.5, this.node.y - this.node.height * 0.5, this.node.width, this.node.height);
        if (cc.rectContainsPoint(heroRect, cc.p(x, y))) {
            return true;
        }

        return false;
    },

    getDamage: function () {
        console.log("hero getDamage " + this.currentDamage * Math.pow(1.1, this.currentHeroLevel) * (1 + this.beAttackBuff));
        return this.currentDamage * Math.pow(1.1, this.currentHeroLevel) * (1 + this.beAttackBuff);
    },

    moveTo: function (x, y) {
        if (x <= this.node.x) {
            this.state = HeroState.LeftMove;
        } else {
            this.state = HeroState.RightMove;
        }
        //进行移动动画
        this.schedule(this.playHeroAnim, 1);
        //计算英雄移动的时间
        var playTime = cc.pDistance(cc.p(x, y), this.node.getPosition()) / this.speed;
        //让英雄移动到点击位置
        var action = cc.moveTo(playTime, cc.p(x, y));
        //进行移动
        this.node.runAction(action);
        //移动完成过后。使英雄进入站立状态
        let moveSequence = cc.sequence(action, cc.callFunc(() => {
            this.node.state = HeroState.Attack;
        }));
        this.node.runAction(moveSequence);
    },

    playHeroAnim: function () {
        this.anim.play("hero_" + this.state);
    },

    showHero: function () {
        this.node.active = true;
        this.state = HeroState.Summon;
        this.playHeroAnim();
        this.state = HeroState.Attack;
    },

    showSelectedMark: function () {
        this.selectedNode.active = true;
    },

    hideSelectedMark: function () {
        this.selectedNode.active = false;
    },
    /**
     * 英雄被选中时的回调方法
     */
    onHeroSelected(selected) {
        console.log('onHeroSelected selected:' + selected);
    }
});