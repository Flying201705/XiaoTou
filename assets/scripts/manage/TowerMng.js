cc.Class({
    extends: cc.Component,

    properties: {
        towerPrefabs: {
            default: [],
            type: cc.Prefab
        }
    },

    createTower: function (parentNode, data) {
        let tower = cc.instantiate(this.towerPrefabs[data]);
        tower.width = 80;
        tower.height = 80;
        tower.parent = parentNode;
        return tower;
    },

    destroyTower: function (tower) {
        tower.destroy();
    },

    onDestroy() {
        this.node.destroyAllChildren();
    }
});