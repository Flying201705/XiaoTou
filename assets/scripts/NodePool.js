let NodePool = cc.Class({
    name: 'NodePool',
    properties: {
        prefab: cc.Prefab,
        size: 0
    },

    ctor() {
        this.pool = new cc.NodePool();
    },

    init() {
        for (let i = 0; i < this.size; ++i) {
            let obj = cc.instantiate(this.prefab);
            this.pool.put(obj);
        }
    },

    clear() {
        this.pool.clear();
    },

    request() {
        let obj = null;
        if (this.pool.size() > 0) {
            obj = this.pool.get();
        } else {
            obj = cc.instantiate(this.prefab);
        }

        return obj;
    },

    return(obj) {
        this.pool.put(obj);
    }
});

module.exports = NodePool;