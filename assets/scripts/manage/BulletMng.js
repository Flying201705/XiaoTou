const NodePool = require('../NodePool');

cc.Class({
    extends: cc.Component,

    properties: {
        bulletPools: {
            default: [],
            type: NodePool
        },
    },

    onLoad() {
        for (let i = 0; i < this.bulletPools.length; ++i) {
            this.bulletPools[i].init(this.node);
        }
    },

    onDestroy() {
        for (let i = 0; i < this.bulletPools.length; ++i) {
            this.bulletPools[i].clear();
        }
    },

    addBullet: function (tower, enemy) {
        let bullet = this.requestBullet(tower.getComponent("tower").bulletType);
        // bullet.parent = this.node;
        bullet.getComponent("bullet").initWithData(this, tower, enemy);
    },

    removeBullet: function (type, obj) {
        this.returnBullet(type, obj);
    },

    requestBullet(type) {
        let thePool = this.bulletPools[type];
        return thePool.request();
    },

    returnBullet(type, obj) {
        let thePool = this.bulletPools[type];
        thePool.return(obj);
    },
});
