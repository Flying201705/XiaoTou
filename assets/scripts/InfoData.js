/**
 * Created by zhangxx on 2018/04/26 1650.
 */
import UserData from './UserData';
import LevelData from './LevelData';
import GoodsData from './GoodsData';

const http_head = "http://zhang395295759.xicp.net:30629/xiaotou/";
const get_user_info = "user/getUserInfoId.do?";
const update_user_level = "user/changeLevel.do?";
const update_user_crystal = "user/changeCrystal.do?";
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
};

const InfoHandle = cc.Class({
    init: function () {
        InfoData.user = new UserData();
        InfoData.levels = [];
        InfoData.goods = [];
        this.getUserInfoById(100);
    },

    getUserInfoById: function (id) {
        let url = http_head + get_user_info + "id=" + id;
        this.sendRequest(url, this.handleUserInfo);
    },

    getLevelsById: function (id) {
        let url = http_head + get_levels + "id=" + id;
        this.sendRequest(url, this.handleLevels);
    },

    getGoodsById: function (id) {
        let url = http_head + get_goods + "id=" + id;
        this.sendRequest(url, this.handleGoods);
        this.dataCompleteCallback();
    },

    handleUserInfo: function (self, obj) {
        InfoData.user.init(obj);

        new InfoHandle().getGoodsById(InfoData.user.id);
        new InfoHandle().getLevelsById(InfoData.user.id);
        self.dataCompleteCallback(1);
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
        self.dataCompleteCallback(2);
    },

    handleGoods: function (self, obj) {
        for (let i = 0; i < obj.length; i++) {
            let goods = new GoodsData();
            goods.init(obj[i]);
            InfoData.goods[i] = goods;
        }
        self.dataCompleteCallback(3);
    },

    updateLatestLevel: function (level) {
        let url = http_head + update_user_level + "id=" + InfoData.user.id + "&level=" + level;
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

    updateCrystal: function(crystal) {
        InfoData.user.crystal = crystal;
        //let url = http_head + update_user_crystal + "id=" + InfoData.user.id + "&crystal=" + crystal;
        //this.sendRequest(url, null);
    },

    updateLocalGoods: function(goodsId, num) {
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
    },

    sendRequest: function (url, method) {
        var xhr = new XMLHttpRequest();
        var self  = this;
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
    dataCompleteCallback() {
        cc.log('bunny do callback')
    },

});

export {
    InfoHandle,
    InfoData
};