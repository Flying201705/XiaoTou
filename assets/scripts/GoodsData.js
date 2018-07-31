/**
 * Created by zhangxx on 2018/04/26 1650.
 */

const GoodsData = cc.Class({
    properties: {
        goodsid: 0,
        number: 0,
        invalidtime: ""
    },

    init: function(obj) {
        this.goodsid = obj.goods_id;
        this.number = obj.num;
        this.invalidtime = obj.invalid_time;
        console.log("<test>goods: 道具-" + this.goodsid + " 数量-" + this.number + " 失效时间-" + this.invalidtime);
    }
 });

 export default GoodsData;