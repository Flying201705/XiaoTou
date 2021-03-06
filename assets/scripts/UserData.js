/**
 * Created by zhangxx on 2018/04/26 1650.
 */

const UserData = cc.Class({
    properties: {
        id: 0,
        openid: "",
        name: "",
        head: "",
        sex: 0,
        crystal: 0,
        level: 0,
        title: "",
        hero: 0,
        prop_boot: 0
    },

    init: function (obj) {
        this.id = obj.id;
        this.openid = obj.openid;
        this.name = obj.name;
        this.head = obj.image;
        this.sex = obj.sex;
        this.crystal = obj.crystal;
        this.level = obj.level < 1 ? 1 : obj.level;
        this.title = obj.title;
        this.hero = obj.hero;

        console.log("<test>user:id-" + this.id + " openid-" + this.openid + " 名称-" + this.name
            + " 头像-" + this.head + " 性别-" + this.sex + " 水晶-" + this.crystal + " 关卡-" + this.level
            + " 称号-" + this.title + " 英雄-" + this.hero);
    },
});

export default UserData;