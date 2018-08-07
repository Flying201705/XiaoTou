// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import {InfoData} from "../InfoData";

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        level: cc.Label,
        props: [cc.Sprite],
        propIcons: [cc.SpriteFrame]
    },

    onLoad() {
        this.title.string = '小兵之神';
    },
    start() {
        this._showProp();
    },
    setLevel(level) {
        this.level.string = `Lv${level}`;
    },
    _showProp() {
        if (InfoData.user.prop_boot > 0) {
            this.props[0].spriteFrame = this.propIcons[0];
        }
    }
});
