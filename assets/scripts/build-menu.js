const global = require("global");

cc.Class({
    extends: cc.Component,

    properties: {
        towersGroup: cc.Node,
        menuPrefab: cc.Prefab,
        towerSprites: [cc.SpriteFrame],
    },

    initWithData: function (towers) {
        let len = towers.length > this.towerSprites.length ? this.towerSprites.length : towers.length;
        for (let i = 0; i < len; i++) {
            let towerMenu = cc.instantiate(this.menuPrefab);
            towerMenu.getComponent(cc.Sprite).spriteFrame = this.towerSprites[i];
            towerMenu.data = i;
            towerMenu.parent = this.towersGroup;
            towerMenu.on('click', this.buttonClick, this);
        }
    },

    onDisable() {
        this.towersGroup.position = cc.p(0, 0);
    },

    updatePosition: function () {
        this.towersGroup.getComponent(cc.Layout).updateLayout();

        let pos = this.towersGroup.position;
        let wordPos = this.towersGroup.convertToWorldSpace(this.towersGroup.position);
        if (wordPos.x < 0) {
            wordPos.x = 0;
            pos = this.towersGroup.convertToNodeSpace(wordPos);
        } else if (wordPos.x + this.towersGroup.width > cc.winSize.width) {
            wordPos.x -= (wordPos.x + this.towersGroup.width - cc.winSize.width);
            pos = this.towersGroup.convertToNodeSpace(wordPos);
        }

        if (wordPos.y < 0) {
            pos.y = -80;
        } else {
            pos.y = 80;
        }

        this.towersGroup.position = cc.p(pos.x, pos.y);
    },

    buttonClick: function (event) {
        let customData = event.target.data;
        cc.log("click " + customData);
        global.event.fire("build_tower", customData);
    },
});
