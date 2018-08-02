const NodePool = require('NodePool');

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
            this.bulletPools[i].init();
        }
    },

    requestBullet(type) {
        let thePool = this.bulletPools[type];
        if (thePool.idx >= 0) {
            return thePool.request();
        } else {
            return null;
        }
    },

    returnBullet(type, obj) {
        let thePool = this.bulletPools[type];
        if (thePool.idx < thePool.size) {
            thePool.return(obj);
        } else {
            cc.log('Return obj to a full pool, something has gone wrong');
        }
    },
});
