/**
 * Created by zhangxx on 2018/04/26 1650.
 */
import UserData from './UserData';
import LevelData from './LevelData';
import GoodsData from './GoodsData';
import global from './global';

const net = require('./common/net');

const http_head = "http://zhang395295759.xicp.net:30629/xiaotou/";
const get_user_info = "user/getUserInfoId.do?";
const login_openid = "user/loginForOpenId.do?";
const update_user_level = "user/changeLevel.do?";
const update_user_crystal = "user/changeCrystal.do?";
const get_openid = "user/getOpenId.do?";
const update_user_hero = "user/changeHero.do?";
const get_levels = "level/allLevels.do?";
const update_level = "level/updateLevel.do?";
const get_goods = "goods/allGoods.do?";
const update_goods = "goods/updateGoods.do?";

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

const InfoHandle = cc.Class({
    init: function (openId) {
        InfoData.FLAG_DATA_DOWNLOAD_STATUS = 0;
        InfoData.user = new UserData();
        InfoData.levels = [];
        InfoData.goods = [];
        this.loginForOpenId(openId);
    },

    getOpenId: function (code, appid, secret) {
        net.request({
            url: http_head + get_openid + "code=" + code + "&appid=" + appid + "&appsecret=" + secret
        })
    },

    loginForOpenId: function (openid) {
        console.log('[InfoHandle] request user info');
        net.request({
            url: http_head + login_openid + "openid=" + openid,
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

    getUserInfoById: function (id) {
        console.log('[InfoHandle] request user info2');
        net.request({
            url: http_head + get_user_info + "id=" + id,
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

    getLevelsById: function (id) {
        console.log('[InfoHandle] request level');
        net.request({
            url: http_head + get_levels + "id=" + id,
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

    getGoodsById: function (id) {
        console.log('[InfoHandle] request goods');
        net.request({
            url: http_head + get_goods + "id=" + id,
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

    handleUserInfo: function (obj) {
        InfoData.user.init(obj);

        this.getGoodsById(InfoData.user.id);
        this.getLevelsById(InfoData.user.id);
    },

    handleLevels: function (obj) {
        for (let i = 0; i < obj.length; i++) {
            let level = new LevelData();

            //服务器关卡数据异常，跳关
            if (i < obj[i].lv - 1) {
                for (let j = i; j < obj[i].lv - 1; j++) {
                    let templevel = new LevelData();
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
                new InfoHandle().updateHero(1);
            }
        }
    },

    updateLatestLevel: function (level) {
        net.request({
            url: http_head + update_user_level + "id=" + InfoData.user.id + "&level=" + level
        })
    },

    updateHero: function (hero) {
        hero = hero > 0 ? 1 : 0;
        if (InfoData.user.hero === hero) {
            return;
        }

        InfoData.user.hero = hero;

        net.request({
            url: http_head + update_user_hero + "id=" + InfoData.user.id + "&hero=" + hero
        })
    },

    updateLevel: function (lv, score, stars) {
        if (InfoData.user.level <= lv) {
            InfoData.user.level = lv + 1;
            this.updateLatestLevel(InfoData.user.level);
        }

        if (InfoData.levels[lv - 1] != null) {
            if (InfoData.levels[lv - 1].stars >= stars) {
                return;
            }
            InfoData.levels[lv - 1].stars = stars;
        } else {
            let level = new LevelData();
            level.level = lv;
            level.score = score;
            level.stars = stars;
            InfoData.levels[lv - 1] = level;
        }

        net.request({
            url: http_head + update_level + "id=" + InfoData.user.id + "&lv=" + lv + "&score=" + score + "&stars=" + stars
        })
    },

    updateCrystal: function (crystal) {
        InfoData.user.crystal += crystal;
        net.request({
            url: http_head + update_user_crystal + "id=" + InfoData.user.id + "&crys=" + crystal
        })
    },

    updateLocalGoods: function (goodsId, num) {
        let isUpdated = false;
        for (let i = 0; i < InfoData.goods.length; i++) {
            if (InfoData.goods[i].goodsid === goodsId) {
                InfoData.goods[i].number += num;
                isUpdated = true;
                break;
            }
        }

        if (isUpdated !== true) {
            let goods = new GoodsData();
            goods.goodsid = goodsId;
            goods.number = num;
            InfoData.goods[InfoData.goods.length] = goods;
        }
    },

    updateGoods: function (goods, num, callback) {
        this.updateLocalGoods(goods, num);

        net.request({
            url: http_head + update_goods + "id=" + InfoData.user.id + "&goods=" + goods + "&num=" + num,
            success: (ret) => {
                callback && callback.success && callback.success(ret);
            },
            fail: () => {
                callback && callback.fail && callback.fail();
            }
        })


        //检查更新英雄属性
        if (goods === 100 && num > 0 && InfoData.user.hero <= 0) {
            new InfoHandle().updateHero(1);
        }
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