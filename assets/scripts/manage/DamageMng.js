cc.Class({
    extends: cc.Component,

    properties: {
        damagePrefab: cc.Prefab
    },

    onLoad() {
        this.damagePool = new cc.NodePool();
        let initCount = 20;
        for (let i = 0; i < initCount; ++i) {
            let damage = cc.instantiate(this.damagePrefab);
            this.damagePool.put(damage);
        }
    },

    onDestroy() {
        this.damagePool.clear();
    },

    createDamage: function (parentNode) {
        let damage = null;
        if (this.damagePool.size() > 0) {
            damage = this.damagePool.get();
        } else {
            damage = cc.instantiate(this.damagePrefab);
        }

        damage.parent = parentNode;

        return damage;
    },

    destroyDamage: function (damage) {
        this.damagePool.put(damage);
    },
});
