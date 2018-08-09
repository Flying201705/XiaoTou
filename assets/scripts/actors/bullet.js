const global = require("./../global");

cc.Class({
    extends: cc.Component,

    properties: {},

    initWithData: function (mng, tower, enemy) {
        this.speed = 800;

        this.bulletMng = mng;
        this.node.position = tower.position;
        this.enemy = enemy;

        let angle = cc.pAngleSigned(cc.pSub(this.enemy.position, tower.position), cc.p(0, 1));
        this.node.rotation = cc.radiansToDegrees(angle);

        let towerScript = tower.getComponent("tower");
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

        this.doMove();
    },

    doMove: function() {
        let distance = cc.pDistance(this.node.position, this.enemy.position);
        let move = cc.moveTo(distance / this.speed , this.enemy.position);
        this.moveAction = cc.sequence(move, cc.callFunc(() => {
            this.enemy.getComponent("enemy").beAttacked(this);
            this.bulletMng.removeBullet(this.type, this.node);
        }));
        this.node.runAction(this.moveAction);
    }
});
