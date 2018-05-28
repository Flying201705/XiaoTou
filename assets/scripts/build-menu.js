import global from './global'
cc.Class({
    extends: cc.Component,

    properties: {
        menuPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    initWithData: function(towers) {
        for (let i = 0; i < towers.length; i++) {
            let towerMenu = cc.instantiate(this.menuPrefab);
            towerMenu.getComponent('tower-menu').initWithData(i);
            towerMenu.data = i;
            towerMenu.parent = this.node;
            towerMenu.position = cc.p(80 * i - (towers.length - 1) * 80 * 0.5, 80);
            towerMenu.on('click', this.buttonClick, this);
        }
    },

    buttonClick: function(event) {
        let customData = event.target.data;
        cc.log("click " + customData);
        global.event.fire("build_tower", customData);
    },
});
