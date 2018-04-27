/**
 * Created by zhangxx on 2018/04/26 1650.
 */

const LevelData = cc.Class({
    properties: {
        level: 0,
        score: 0,
        stars: 0
    },

    init: function(obj) {
        this.level = obj.lv;
        this.score = obj.score;
        this.stars = obj.stars;
        console.log("<test>levels: 关卡-" + this.level + " 分数-" + this.score + " 星级-" + this.stars);
    }
 });

 export default LevelData;