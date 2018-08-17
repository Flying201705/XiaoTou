// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import {InfoHandle, InfoData} from './InfoData'
import * as util from "./common/util";

const global = require("global");

cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            default: null,
            type: cc.Node
        },
        container: {
            default: null,
            type: cc.Node
        },
        heroItemContainer: {
            default: null,
            type: cc.Layout
        },
        propItemContainer: {
            default: null,
            type: cc.Layout
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        heroSpriteFrame: cc.SpriteFrame,
        heroChipSprites: {
            default: [],
            type: [cc.SpriteFrame]
        },
        propSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame]
        },
        propChipSpriteFrames: {
            default: [],
            type: [cc.SpriteFrame]
        },
        descHero: cc.Node,
        descProp: cc.Node,
    },
    onLoad() {
        this.mask.getComponent('mask').onHide = this.onDialogHide.bind(this);
        this.descHero.getComponent('mask').onHide = this.onDescHide.bind(this);
        this.descProp.getComponent('mask').onHide = this.onDescHide.bind(this);
    },
    start() {
        // cc.director.pause();
        // global.pause = true;
        global.pause();
    },
    config(parentNode) {
        this.parentNode = parentNode;
        this.fillData();
        this.fetchData();
    },
    onDialogHide() {
        global.resume();
    },
    configHeroChips(opt) {
        let children = this.heroItemContainer.node.children;
        if (children.length > 0) {
            // cc.log('bunny-configHeroChips-1');
            for (let i = 0; i < children.length; ++i) {
                this._config(children[i], opt, this._showDescHero.bind(this));
            }
        } else {
            // cc.log('bunny-configHeroChips-2');
            for (let i = 0; i < 1; i++) {
                let item = cc.instantiate(this.itemPrefab);
                this._config(item, opt, this._showDescHero.bind(this));
                this.heroItemContainer.node.addChild(item);
                cc.log('add hero')
            }
        }

    },
    configPropChips(opts) {
        let propConfigArray = [];
        for (let e in opts) {
            propConfigArray.push(opts[e]);
        }

        let children = this.propItemContainer.node.children;
        if (children.length > 0) {
            for (let i = 0; i < children.length; ++i) {
                this._config(children[i], propConfigArray[i], this._showDescProp.bind(this));
            }
        } else {
            for (let i = 0; i < 3; i++) {
                let item = cc.instantiate(this.itemPrefab);
                this._config(item, propConfigArray[i], this._showDescProp.bind(this));
                this.propItemContainer.node.addChild(item);
            }
        }
    },
    _config(node, configOpt, callback) {
        let chipItem = node.getComponent('chipItem');
        chipItem.config(this, configOpt);
        chipItem.onItemClickCallback = callback;
    },
    fetchData() {
        cc.log('bunny fetchData()-2')
        var infoHandle = new InfoHandle();
        infoHandle.onDataLoaded = (type) => {
            cc.log('bunny dataUpdateComplete callback type:' + type)
            // 仅监听物品数据更新
            if (type != InfoData.TOKEN_GOODS) {
                return;
            }

            this.fillData();
        };

        infoHandle.getAllGoodsByUserId(InfoData.user.id);


    },
    fillData() {
        let heroConfig = {};
        let propConfigs = {};

        this._setHeroDefault(heroConfig);

        if (InfoData.user.level >= 20) {
            this._setPropDefault(propConfigs, 101, 0);
        }

        for (let i = 0; i < InfoData.goods.length; i++) {
            let goodsInfo = InfoData.goods[i];
            cc.log('fillData() id:' + goodsInfo.goodsid + " num:" + goodsInfo.number);

            // 过滤掉普通道具和数量为0的道具。仅显示英雄、英雄道具及碎片。
            if (goodsInfo.goodsid < 100 || goodsInfo.number <= 0) {
                continue;
            }

            let chipType = this._getChipType(goodsInfo.goodsid);
            cc.log('chipType:' + chipType)

            // 英雄碎片
            if (chipType == 100) {
                if (goodsInfo.goodsid === 100) {
                    heroConfig['composed'] = goodsInfo.number > 0;
                } else if (heroConfig['chipIds'].indexOf(goodsInfo.goodsid) < 0) {
                    heroConfig['chipIds'].push(goodsInfo.goodsid);
                }
            } else if (chipType > 100) {
                let config = this._getChipConfig(propConfigs, chipType);
                if (goodsInfo.goodsid < 1000) {
                    config['composed'] = goodsInfo.number > 0;
                } else if (config['chipIds'].indexOf(goodsInfo.goodsid) < 0) {
                    config['chipIds'].push(goodsInfo.goodsid);
                }
            }
        }

        this.configHeroChips(heroConfig);

        this.configPropChips(propConfigs);
    },
    /**
     * 获取碎片类型
     */
    _getChipType(goodsId) {
        return goodsId < 1000 ? goodsId : parseInt(goodsId / 10);
    },
    _getChipConfig(propConfigs, chipType) {
        if (util.isEmpty(propConfigs[chipType])) {
            propConfigs[chipType] = {
                chipIds: []
            };
        }
        return propConfigs[chipType];
    },
    _setHeroDefault(config) {
        config['propId'] = 100;
        config['chipIds'] = [];
        config['completeSpriteFrame'] = this.heroSpriteFrame;
        config['chipSpriteFrame'] = this.heroChipSprites[0];
    },
    _setPropDefault(config, propId, sprIndex) {
        if (util.isEmpty(config[propId])) {
            config[propId] = {
                chipIds: [],
                propId: propId
            };
        }
        config[propId]['completeSpriteFrame'] = this.propSpriteFrames[sprIndex];
        config[propId]['chipSpriteFrame'] = this.propChipSpriteFrames[sprIndex];
    },
    /**
     * 显示英雄介绍弹窗
     */
    _showDescHero() {
        this.descHero.active = true;
    },
    /**
     * 显示物品介绍弹窗
     */
    _showDescProp() {
        this.descProp.active = true;
    },
    onDescHide(){
        this.descHero.active = false;
        this.descProp.active = false;
    },
});