const GAME_KEY = '小兵传奇';

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.Node,
        item: cc.Prefab,
    },
    onLoad() {
        console.log('wx-sub onLoad');
        // const ratio = wx.getSystemInfoSync().pixelRatio;
        // cc.view._convertPointWithScale = function (point) {
        //     var viewport = this._viewPortRect;
        //     point.x = (point.x - viewport.x) / (this._scaleX / ratio);
        //     point.y = (point.y - viewport.y) / (this._scaleY / ratio);
        // };
        // cc.view._convertTouchesWithScale = function (touches) {
        //     var viewport = this._viewPortRect, scaleX = this._scaleX / ratio, scaleY = this._scaleY / ratio, selTouch, selPoint,
        //         selPrePoint;
        //     for (var i = 0; i < touches.length; i++) {
        //         selTouch = touches[i];
        //         selPoint = selTouch._point;
        //         selPrePoint = selTouch._prevPoint;
        //         selPoint.x = (selPoint.x - viewport.x) / scaleX;
        //         selPoint.y = (selPoint.y - viewport.y) / scaleY;
        //         selPrePoint.x = (selPrePoint.x - viewport.x) / scaleX;
        //         selPrePoint.y = (selPrePoint.y - viewport.y) / scaleY;
        //     }
        // };
    },
    start() {
        console.log('wx-sub start');
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // console.log('xxx sw-:' + window.sharedCanvas.width + ' sh-:' + window.sharedCanvas.width);
            //
            // const ratio = wx.getSystemInfoSync().pixelRatio;
            // window.sharedCanvas.width = cc.game.canvas.width * ratio;
            // window.sharedCanvas.height = cc.game.canvas.height * ratio;
            //
            // console.log('xxx cw:' + cc.game.canvas.width + ' ch:' + cc.game.canvas.height + ' ratio:' + ratio);
            // console.log('xxx sw:' + window.sharedCanvas.width + ' sh:' + window.sharedCanvas.width);

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
                    case 'hide':
                        console.log('currentLevel:' + data.currentLevel);
                        this._hide();
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
            item.setAvatar(info.avatarUrl);
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

        return urList.sort((x, y) => {
            if (x.level < y.level) {
                return 1;
            } else if (x.level > y.level) {
                return -1;
            } else {
                return 0;
            }
        });
    },
    _show() {
        this.getRankList();
    },
    _hide() {
        this.scrollView.removeAllChildren();
    },
});
