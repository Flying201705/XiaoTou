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
        return thePool.request();
    },

    returnBullet(type, obj) {
        let thePool = this.bulletPools[type];
        thePool.return(obj);
    },
});
