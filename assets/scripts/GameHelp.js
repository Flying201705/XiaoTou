cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        mask: cc.Node,
        text: cc.RichText
    },

    onLoad() {
        this.text.string = "<b><color=#00ff00>玩法介绍</c></b>\n1.小兵和神秘英雄，攻击怪物会获得金币\n2.开局先造小兵，有金币时优化升级小兵\n3.注意英雄搭配，不同的英雄组合有不同的效果哦~\n" + 
        "<b><color=#00ff00>英雄介绍</c></b>\n1.小兵\n<color=#ffff80>打钱能手</c>，前期唯一的金钱来源，每次攻击都会获取一定比例金钱\n2.剑士\n高攻击，攻击速度快，带<color=#ffff80>概率爆击</c>，主要的攻击英雄\n" + 
        "3.武士\n高攻击，攻击速度慢，带<color=#ffff80>概率眩晕</c>，打<color=#ffff80>BOSS</c>必备\n4.女巫\n范围攻击，<color=#ffff80>减慢怪物移动速度，减少怪物护甲</c>\n" + 
        "5.射手\n攻击高，攻击速度慢，<color=#ffff80>群攻英雄</c>，主要的攻击英雄\n6.男巫\n非攻击英雄，给其他英雄<color=#ffff80>增加攻击力，增加攻击速度</c>\n" + 
        "★神秘英雄\n集齐三个英雄碎片可合成<color=#ff00ff>小兵之神</c>，攻击打钱样样精通，打怪自动升级，全屏移动，可携带装备和技能\n合成英雄后，满足<color=#ffff80>小兵升到顶级+500金币</c>的条件，方可召唤";
    },

    show() {
        this.anim.play("help_in");
        this.mask.on(cc.Node.EventType.TOUCH_START, this.stopTouch);
        this.mask.on(cc.Node.EventType.TOUCH_END, this.stopTouch);
    },

    hide() {
        this.anim.play("help_out");
        this.mask.off(cc.Node.EventType.TOUCH_START, this.stopTouch);
        this.mask.off(cc.Node.EventType.TOUCH_END,this.stopTouch);
    },

    stopTouch(event) {
        event.stopPropagation();
    },

    onClickCancelBtn() {
        this.hide();
    }

});
