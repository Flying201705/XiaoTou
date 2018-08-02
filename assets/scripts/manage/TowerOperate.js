cc.Class({
    extends: cc.Component,

    properties: {
        buildMenuPrefab: {
            default: null,
            type: cc.Prefab
        },
        updateMenuPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad() {
        this.build_menu = cc.instantiate(this.buildMenuPrefab);
        this.update_menu = cc.instantiate(this.updateMenuPrefab);
    },

    initBuildMenu: function (towers) {
        this.build_menu.getComponent("build-menu").initWithData(towers);
    },

    showBuildMenu: function (pos) {
        this.build_menu.position = pos;
        this.build_menu.parent = this.node;
        this.build_menu.getComponent("build-menu").updatePosition();
    },

    showUpdateMenu: function(tower, gold, index) {
        this.update_menu.getComponent('update-menu').setTower(tower, gold);
        this.update_menu.position = tower.position;
        this.update_menu.index = index;
        this.update_menu.parent = this.node;
    },

    closeMenu: function () {
        this.node.removeChild(this.build_menu);
        this.node.removeChild(this.update_menu);
    },

    getBuildMenuPosition: function () {
        return this.build_menu.position;
    },

    getUpdateMenuIndex: function () {
        return this.update_menu.index;
    }

});
