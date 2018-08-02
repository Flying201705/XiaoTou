const global = require("./../global");

cc.Class({
    extends: cc.Component,

    properties: {},

    initWithData: function (tower, enemy, enemyNodeList) {
        this.speed = 800;

        // this.direction = cc.pNormalize(cc.pSub(position, tower.position));
        // this.node.position = cc.pAdd(tower.position, cc.pMult(this.direction, 100));

        this.node.position = tower.position;
        this.enemy = enemy;

        let angle = cc.pAngleSigned(cc.pSub(this.enemy.position, tower.position), cc.p(0, 1));
        this.node.rotation = cc.radiansToDegrees(angle);
        // this.enemyNodeList = enemyNodeList;

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
        //范围攻击
        // this.areaAtt = towerScript.isAreaAttack();
        //攻击列表
        // this.attList = towerScript.getAreaEnemyList();

        this.doMove();
    },

    doMove: function() {
        let distance = cc.pDistance(this.node.position, this.enemy.position);
        let move = cc.moveTo(distance / this.speed , this.enemy.position);
        this.moveAction = cc.sequence(move, cc.callFunc(() => {
            // if (this.areaAtt) {
            //     this.handleAreaAttack();
            // } else {
                this.enemy.getComponent("enemy").beAttacked(this);
            // }
            global.event.fire("destroy_bullet", this.type, this.node);
        }));
        this.node.runAction(this.moveAction);
    },

    // update: function (dt) {
    //     // cc.log("direction " + JSON.stringify(this.direction));
    //     this.node.position = cc.pAdd(this.node.position, cc.pMult(this.direction, this.speed * dt));
    //
    //     for (let i = 0; i < this.enemyNodeList.length; i++) {
    //         let enemy = this.enemyNodeList[i];
    //         if (enemy.getComponent("enemy").isLiving()) {
    //             let distance = cc.pDistance(enemy.position, this.node.position);
    //             if (distance < (enemy.width * 0.5 + this.node.width * 0.5)) {
    //                 if (this.areaAtt) {
    //                     this.handleAreaAttack();
    //                 } else {
    //                     enemy.getComponent("enemy").beAttacked(this);
    //                 }
    //                 global.event.fire("destroy_bullet", this.type, this.node);
    //             }
    //         }
    //     }
    //
    //     let windowSize = cc.view.getVisibleSize();
    //     if (this.node.position.x < -windowSize.width * 0.5 || this.node.position.x > windowSize.width * 0.5
    //         || this.node.position.y > windowSize.height * 0.5 || this.node.position.y < -windowSize.height * 0.5) {
    //         global.event.fire("destroy_bullet", this.type, this.node);
    //     }
    //
    // },

    // handleAreaAttack: function () {
    //     for (let i = 0; i < this.attList.length; i++) {
    //         let enemy = this.attList[i];
    //         enemy.getComponent("enemy").beAttacked(this);
    //     }
    // }
});
