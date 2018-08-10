let NodePool = cc.Class({
    name: 'NodePool',
    properties: {
        prefab: cc.Prefab,
        size: 0
    },

    ctor() {
        this.pool = [];
    },

    init(parentNode) {
        for (let i = 0; i < this.size; ++i) {
            let obj = cc.instantiate(this.prefab);
            obj.parent = parentNode;
            obj.position = cc.p(0, 1000);
            this.pool.push(obj);
        }
        this.parentNode = parentNode;
    },

    clear() {
        let count = this.pool.length;
        for (let i = 0; i < count; ++i) {
            this.pool[i].destroy();
        }
        this.pool.length = 0;
    },

    request() {
        let obj = null;
        let last = this.pool.length-1;
        if (last < 0) {
            obj = cc.instantiate(this.prefab);
            obj.parent = this.parentNode;
        } else {
            obj = this.pool[last];
            this.pool.length = last;
        }

        return obj;
    },

    return(obj) {
        if (obj && this.pool.indexOf(obj) === -1) {
            // obj.removeFromParent(false);
            obj.position = cc.p(0, 1000);
            this.pool.push(obj);
        }
    }
});

module.exports = NodePool;