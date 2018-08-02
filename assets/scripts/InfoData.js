/**
 * Created by zhangxx on 2018/04/26 1650.
 */
import UserData from './UserData';
import LevelData from './LevelData';
import GoodsData from './GoodsData';
import global from './global';

const net = require('./common/net');
const util = require('./common/util');

const http_head = "http://qyx18.com:1234/xiaotou/";
const get_user_info = "user/getUserInfoId";
const login = "user/login";
const update_user_level = "user/changeLevel";
const update_user_crystal = "user/changeCrystal";
// const get_openid = "user/getOpenId";
const update_user_hero = "user/changeHero";
const get_levels = "level/allLevels";
const update_level = "level/updateLevel";
const get_all_goods = "goods/allGoods";
const update_goods = "goods/updateGoods";
const compound_goods = "goods/compound";

const sync_user_info = "user/sync";

const InfoData = {
    user: UserData,
    levels: {
        default: [],
        type: LevelData
    },
    goods: {
        default: [],
        type: GoodsData
    },
    TOKEN_ERROR: -1,
    /**
     * 用户信息下载完成token
     * 十进制：1
     */
    TOKEN_USER_INFO: 0b0001,
    /**
     * 关数信息下载完成token
     * 十进制：2
     */
    TOKEN_LEVEL: 0b0010,
    /**
     * 物品信息下载完成token
     * 十进制：4
     */
    TOKEN_GOODS: 0b0100,
    /**
     * 全部信息下载完成token
     * 十进制：7
     */
    FLAG_DATA_ALL_COMPLETE: 0b0111,
    /**
     * 数据下载状态，由以下token通过位或合成，使用FLAG_DATA_ALL_COMPLETE判断是否与之相等，相等则全部数据下载完成。
     */
    FLAG_DATA_DOWNLOAD_STATUS: 0,
    FLAG_DATA_DOWNLOAD_ERROR: -1,
};

function _updateLocalLevel(lv, stars, score) {
    if (InfoData.levels[lv - 1] != null) {
        InfoData.levels[lv - 1].stars = stars;
    } else {
        let level = new LevelData();
        level.level = lv;
        level.score = score;
        level.stars = stars;
        InfoData.levels[lv - 1] = level;
    }
}

function _getGoodsInfoById(goodsId) {
    for (let i = 0; i < InfoData.goods.length; i++) {
        if (InfoData.goods[i].goodsid === goodsId) {
            return InfoData.goods[i];
        }
    }

    return null;
}

const InfoHandle = cc.Class({
    init: function (wxCode) {
        InfoData.FLAG_DATA_DOWNLOAD_STATUS = 0;
        InfoData.user = new UserData();
        InfoData.levels = [];
        InfoData.goods = [];
        this.login(wxCode);
    },
    login: function (wxCode) {
        console.log('[InfoHandle] request user info');
        net.request({
            url: http_head + login,
            data: {
                code: wxCode
            },
            success: (ret) => {
                this.handleUserInfo(ret);
                InfoData.FLAG_DATA_DOWNLOAD_STATUS |= InfoData.TOKEN_USER_INFO;
                this.onDataLoaded(InfoData.TOKEN_USER_INFO);
            },
            fail: () => {
                console.log('[InfoHandle] get user info fail');
                InfoData.FLAG_DATA_DOWNLOAD_STATUS = -1;
                this.onDataLoadError();
            }
        })
    },
    handleUserInfo: function (obj) {
        InfoData.user.init(obj);

        this.getAllGoodsByUserId(InfoData.user.id);
        this.getLevelsByUserId(InfoData.user.id);
    },
    getAllGoodsByUserId: function (id) {
        console.log('[InfoHandle] request goods');
        net.request({
            url: http_head + get_all_goods,
            data: {
                id: id
            },
            success: (ret) => {
                this.handleGoods(ret);
                InfoData.FLAG_DATA_DOWNLOAD_STATUS |= InfoData.TOKEN_GOODS;
                this.onDataLoaded(InfoData.TOKEN_GOODS);
            },
            fail: () => {
                console.log('[InfoHandle] get goods fail');
                InfoData.FLAG_DATA_DOWNLOAD_STATUS = -1;
                this.onDataLoadError();
            }
        })
    },
    getLevelsByUserId: function (id) {
        console.log('[InfoHandle] request level');
        net.request({
            url: http_head + get_levels,
            data: {
                id: id
            },
            success: (ret) => {
                this.handleLevels(ret);
                InfoData.FLAG_DATA_DOWNLOAD_STATUS |= InfoData.TOKEN_LEVEL;
                this.onDataLoaded(InfoData.TOKEN_LEVEL);
            },
            fail: () => {
                console.log('[InfoHandle] get level fail');
                InfoData.FLAG_DATA_DOWNLOAD_STATUS = -1;
                this.onDataLoadError();
            }
        })
    },
    hasHero: function () {
        if (InfoData.user.hero > 0) {
            return true;
        }

        for (let i = 0; i < InfoData.goods.length; i++) {
            if (InfoData.goods[i].goodsid === 100 && InfoData.goods[i].number > 0) {
                return true;
            }
        }

        return false;
    },
    handleLevels: function (obj) {
        for (let i = 0; i < obj.length; i++) {
            let level = new LevelData();

            //服务器关卡数据异常，跳关
            if (obj[i].lv > InfoData.levels.length) {
                for (let j = InfoData.levels.length; j < obj[i].lv; j++) {
                    let templevel = new LevelData();
                    templevel.level = j + 1;
                    InfoData.levels[j] = templevel;
                }
            }

            level.init(obj[i]);
            InfoData.levels[obj[i].lv - 1] = level;
        }
    },
    handleGoods: function (obj) {
        for (let i = 0; i < obj.length; i++) {
            let goods = new GoodsData();
            goods.init(obj[i]);
            InfoData.goods[i] = goods;
            //检查更新英雄属性
            if (goods.goodsid === 100 && goods.number > 0 && InfoData.user.hero <= 0) {
                new InfoHandle().updateLocalHero(1);
            }
        }
    },
    updateLocalHero: function (hero) {
        InfoData.user.hero = hero > 0 ? 1 : 0;
    },
    updateLevel: function (lv, score, stars) {
        if (InfoData.levels[lv - 1] != null && InfoData.levels[lv - 1].stars >= stars) {
            return;
        }

        net.request({
            url: http_head + update_level,
            data: {
                id: InfoData.user.id,
                lv: lv,
                score: score,
                stars: stars,
                crystal: InfoData.user.crystal,
                goods: InfoData.goods
            },
            success: () => {
                _updateLocalLevel(lv, stars, score);
                if (lv >= InfoData.user.level) {
                    InfoData.user.level = lv + 1;
                }
            },
            fail: () => {
                cc.info('update user level fail');
            }
        })
    },
    syncUserInfo() {
        net.request({
            url: http_head + sync_user_info,
            data: {
                userId: InfoData.user.id,
                crystal: InfoData.user.crystal,
                goods: InfoData.goods
            },
            success: () => {
                cc.info('update user success');
            },
            fail: () => {
                cc.info('update user fail');
            }
        });
    },
    updateLocalCrystal: function (crystal) {
        InfoData.user.crystal += crystal;
    },
    /**
     * 更新本地物品数量。
     * @param goodsId
     * @param num 待更新数量，正数增加，负数减少。
     * @returns {更新成功，返回物品ID；失败返回-1}
     */
    updateLocalGoods: function (goodsId, num) {

        //检查更新英雄属性
        if (goodsId === 100 && num > 0 && InfoData.user.hero <= 0) {
            new InfoHandle().updateLocalHero(1);
        }

        let goodsInfo = _getGoodsInfoById(goodsId);
        if (util.isEmpty(goodsInfo)) {
            if (num > 0) {
                let goods = new GoodsData();
                goods.goodsid = goodsId;
                goods.number = num;
                InfoData.goods[InfoData.goods.length] = goods;
                return goodsId;
            }
        } else {
            let newNum = goodsInfo.number + num;
            newNum = newNum > 0 ? newNum : 0;
            goodsInfo.number = newNum;
            return goodsId;
        }

        return -1;
    },
    onDataLoaded(token) {
        // cc.log('xxx onDataLoaded token:' + token);
        global.event.fire("onDataDownloadCallback", token);
    },
    onDataLoadError() {
        global.event.fire("onDataDownloadCallback", InfoData.TOKEN_ERROR);
    },
});

export {
    InfoHandle,
    InfoData
};