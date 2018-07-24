const GAME_KEY = '小兵传奇';

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.Node,
        item: cc.Prefab,
    },
    onLoad() {
        console.log('wx-sub onLoad');
    },
    start() {
        console.log('wx-sub start');
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.onMessage(data => {
                console.log('onMessage:', data);

                switch (data.type) {
                    case 'show':
                        console.log('Show');
                        this._show();
                        break;
                    case 'set':
                        console.log('currentLevel:' + data.currentLevel);
                        this._set(data.currentLevel);
                        break;
                }
            });
        }
    },
    _set(currentLevel) {
        wx.getUserCloudStorage({
            keyList: [GAME_KEY],
            success: (res) => {
                console.log('get success', res);
                var storageLevel = this.getLevel(res.KVDataList);
                console.log('storageLevel', storageLevel);
                if (currentLevel > storageLevel) {
                    this.setStorage(currentLevel);
                }
            },
            fail: (res) => {
                console.log('get fail', res);
            },
        });
    },
    getLevel(KVDataList) {
        if (KVDataList === null || KVDataList.length == 0) {
            return -1;
        }

        for (let i = 0; i < KVDataList.length; i++) {
            var data = KVDataList[i];
            if (GAME_KEY == data.key) {
                var val = JSON.parse(data.value);
                return val.wxgame.score;
            }

        }

        return -1;
    },
    setStorage(currentLevel) {
        var val = JSON.stringify({
            "wxgame": {
                "score": currentLevel,
                "update_time": 1513080573
            }
        });
        console.log('set:' + val);

        wx.setUserCloudStorage({
            KVDataList: [{
                key: GAME_KEY,
                value: val
            }],
            success: (res) => {
                console.log('set success', res);
            },
            fail: (res) => {
                console.log('set fail', res);
            }
        });
    },
    getRankList() {
        wx.getFriendCloudStorage({
            keyList: [GAME_KEY],
            success: (res) => {
                console.log('get friend success', res);
                var urList = this.getUserRankList(res);
                console.log('user rank list:', urList);
                this.addToScrollView(urList);
            }
            ,
            fail: (res) => {
                console.log('get friend fail', res);
            },
        });
    },
    addToScrollView(urList) {
        for (let i = 0; i < urList.length; i++) {
            var info = urList[i];
            let item = cc.instantiate(this.item).getComponent('item');
            item.setNickName(info.nickname);
            item.setLevel(info.level);

            this.scrollView.addChild(item.node);
        }
    },
    getUserRankList(res) {
        var urList = [];
        for (let i = 0; i < res.data.length; i++) {
            var data = res.data[i];

            urList.push({
                nickname: data.nickname,
                avatarUrl: data.avatarUrl,
                level: this.getLevel(data.KVDataList)
            });
        }

        return urList;
    },
    _show() {
        // let moveTo = cc.moveTo(0.5, 0, 0);
        // this.content.runAction(moveTo);
        // this.display.active = true;
        this.getRankList();
    },

    _hide() {
        // let moveTo = cc.moveTo(0.5, 0, 1000);
        // this.content.runAction(moveTo);
        // this.display.active = false;
    }

});
