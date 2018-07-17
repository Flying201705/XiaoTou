import global from "./global";

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function () {
        this.type = -1;
        this.direction = cc.p(0, 0);
        this.speed = 600;
    },
    initWithData: function (tower, position, enemyNodeList) {
        this.direction = cc.pNormalize(cc.pSub(position, tower.position));
        this.node.position = cc.pAdd(tower.position, cc.pMult(this.direction, 100));

        let angle = cc.pAngleSigned(this.direction, cc.p(0, 1));
        this.node.rotation = (180 / Math.PI) * angle;
        this.enemyNodeList = enemyNodeList;

        let towerScript = tower.getComponent("tower");
        if (towerScript) {
            this.type = towerScript.bulletType;
            //伤害
            this.damage = towerScript.getDamage();
            //抢钱比例
            this.gainRate = towerScript.getGainRate();
            //眩晕率
            this.stunRate = towerScript.getStunRate();
            //暴击率
            this.critRate = towerScript.getCritRate();
            //减速率
            this.slowRate = towerScript.getSlowRate();
            //范围攻击
            this.areaAtt = towerScript.isAreaAttack();
            //攻击列表
            this.attList = towerScript.getAreaEnemyList();
        }
    },

    update: function (dt) {
        // cc.log("direction " + JSON.stringify(this.direction));
        this.node.position = cc.pAdd(this.node.position, cc.pMult(this.direction, this.speed * dt));

        for (let i = 0; i < this.enemyNodeList.length; i++) {
            let enemy = this.enemyNodeList[i];
            if (enemy.getComponent("enemy").isLiving()) {
                let distance = cc.pDistance(enemy.position, this.node.position);
                if (distance < (enemy.width * 0.5 + this.node.width * 0.5)) {
                    if (this.areaAtt) {
                        this.handleAreaAttack();
                    } else {
                        enemy.getComponent("enemy").beAttacked(this);
                    }
                    global.event.fire("destroy_bullet", this.type, this.node);
                }
            }
        }

        if (this.node.position.x < -960 * 0.5 || this.node.position.x > 960 * 0.5
            || this.node.position.y > 640 * 0.5 || this.node.position.y < -640 * 0.5) {
            global.event.fire("destroy_bullet", this.type, this.node);
        }

    },
    handleAreaAttack: function () {
        for (let i = 0; i < this.attList.length; i++) {
            let enemy = this.attList[i];
            enemy.getComponent("enemy").beAttacked(this);
        }
    }
});
