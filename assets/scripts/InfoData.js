/**
 * Created by zhangxx on 2018/04/26 1650.
 */
import UserData from './UserData';
import LevelData from './LevelData';
import GoodsData from './GoodsData';
import global from './global'

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
    /**
     * 数据下载状态，由以下token通过位或合成，使用FLAG_DATA_ALL_COMPLETE判断是否与之相等，相等则全部数据下载完成。
     */
    FLAG_DATA_DOWNLOAD_STATUS: 0,
    /**
     * 用户信息下载完成token
     * 二进制 0001
     */
    TOKEN_USER_INFO: 1,
    /**
     * 关数信息下载完成token
     *  二进制 0010
     */
    TOKEN_LEVEL: 2,
    /**
     * 物品信息下载完成token
     */
    TOKEN_GOODS: 4,
    /**
     * 全部信息下载完成token
     * 二进制 0111
     */
    FLAG_DATA_ALL_COMPLETE: 4 | 2 | 1,
};

const InfoHandle = cc.Class({
    init: function (openId) {
        InfoData.user = new UserData();
        InfoData.levels = [];
        InfoData.goods = [];
        this.loginForOpenId(openId);
    },

    getOpenId: function (code, appid, secret) {
        let url = http_head + get_openid + "code=" + code + "&appid=" + appid + "&appsecret=" + secret;
        this.sendRequest(url, null);
    },

    loginForOpenId: function (openid) {
        let url = http_head + login_openid + "openid=" + openid;
        this.sendRequest(url, this.handleUserInfo);
    },

    getUserInfoById: function (id) {
        let url = http_head + get_user_info + "id=" + id;
        this.sendRequest(url, this.handleUserInfo);
    },

    getLevelsById: function (id) {
        let url = http_head + get_levels + "id=" + id;
        this.sendRequest(url, this.handleLevels);
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
        let url = http_head + get_goods + "id=" + id;
        this.sendRequest(url, this.handleGoods);
    },

    handleUserInfo: function (self, obj) {
        InfoData.user.init(obj);

        new InfoHandle().getGoodsById(InfoData.user.id);
        new InfoHandle().getLevelsById(InfoData.user.id);

        InfoData.FLAG_DATA_DOWNLOAD_STATUS |= InfoData.TOKEN_USER_INFO;
        self.dataCompleteCallback(InfoData.TOKEN_USER_INFO);
    },

    handleLevels: function (self, obj) {
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
        InfoData.FLAG_DATA_DOWNLOAD_STATUS |= InfoData.TOKEN_LEVEL;
        self.dataCompleteCallback(InfoData.TOKEN_LEVEL);
    },

    handleGoods: function (self, obj) {
        for (let i = 0; i < obj.length; i++) {
            let goods = new GoodsData();
            goods.init(obj[i]);
            InfoData.goods[i] = goods;
            //检查更新英雄属性
            if (goods.goodsid === 100 && goods.number > 0 && InfoData.user.hero <= 0) {
                new InfoHandle().updateHero(1);
            }
        }
        InfoData.FLAG_DATA_DOWNLOAD_STATUS |= InfoData.TOKEN_GOODS;
        self.dataCompleteCallback(InfoData.TOKEN_GOODS);
    },

    updateLatestLevel: function (level) {
        let url = http_head + update_user_level + "id=" + InfoData.user.id + "&level=" + level;
        this.sendRequest(url, null);
    },

    updateHero: function (hero) {
        hero = hero > 0 ? 1 : 0;
        if (InfoData.user.hero === hero) {
            return;
        }

        InfoData.user.hero = hero;
        let url = http_head + update_user_hero + "id=" + InfoData.user.id + "&hero=" + hero;
        this.sendRequest(url, null);
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


        let url = http_head + update_level + "id=" + InfoData.user.id + "&lv=" + lv + "&score=" + score + "&stars=" + stars;
        this.sendRequest(url, null);
    },

    updateCrystal: function (crystal) {
        InfoData.user.crystal += crystal;
        let url = http_head + update_user_crystal + "id=" + InfoData.user.id + "&crys=" + crystal;
        this.sendRequest(url, null);
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
        let url = http_head + update_goods + "id=" + InfoData.user.id + "&goods=" + goods + "&num=" + num;
        this.sendRequest(url, callback);
        //检查更新英雄属性
        if (goods === 100 && num > 0 && InfoData.user.hero <= 0) {
            new InfoHandle().updateHero(1);
        }
    },

    sendRequest: function (url, method) {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log("<test> json str : " + response);
                if (method != null) {
                    var obj = JSON.parse(response);
                    cc.log("bunny-invoke callback");
                    method(self, obj.data);
                }
            }
        }
        xhr.open("GET", url, true);
        xhr.send();
    },
    dataCompleteCallback(token) {
        cc.log('xxx dataCompleteCallback token:' + token);
        global.event.fire("onDataDownloadCallback", token);
    },

});

export {
    InfoHandle,
    InfoData
};