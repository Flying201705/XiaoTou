const GAME_KEY = '小兵传奇';

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.Node,
        item: cc.Prefab,
        rankAxisContainer: cc.Node,
        rankAvatarPrefab: cc.Prefab,
    },
    onLoad() {
        console.log('wx-sub onLoad');
        let ratio = wx.getSystemInfoSync().pixelRatio;
        ratio = ratio == 1 ? 1 : ratio / 2;

        cc.view._convertPointWithScale = function (point) {
            let viewport = this._viewPortRect;
            point.x = (point.x - viewport.x) / (this._scaleX / ratio);
            point.y = (point.y - viewport.y) / (this._scaleY / ratio);
        };
        cc.view._convertTouchesWithScale = function (touches) {
            let viewport = this._viewPortRect,
                scaleX = this._scaleX / ratio,
                scaleY = this._scaleY / ratio, selTouch,
                selPoint,
                selPrePoint;
            for (let i = 0; i < touches.length; i++) {
                selTouch = touches[i];
                selPoint = selTouch._point;
                selPrePoint = selTouch._prevPoint;
                selPoint.x = (selPoint.x - viewport.x) / scaleX;
                selPoint.y = (selPoint.y - viewport.y) / scaleY;
                selPrePoint.x = (selPrePoint.x - viewport.x) / scaleX;
                selPrePoint.y = (selPrePoint.y - viewport.y) / scaleY;
            }
        };


    },
    start() {
        console.log('wx-sub start');
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.onMessage(data => {
                console.log('onMessage:', data);

                switch (data.type) {
                    case 'initRank':
                        console.log('initRank');
                        this.setStorage(data.level);
                        break;
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
                    case 'rankAxis':
                        this._drawRankAxis(data.openid);
                        break;
                }
            });
        }
    },
    _drawRankAxis(openid) {
        wx.getFriendCloudStorage({
            keyList: [GAME_KEY],
            success: (res) => {
                console.log('get friend success', res);
                let urList = this._getUserRankAxisList(res, openid);
                console.log('user rank list:', urList);
                // this.addToScrollView(urList);
                this._drawAvatars(urList);
            }
            ,
            fail: (res) => {
                console.log('get friend fail', res);
            },
        });
    },
    _getUserRankAxisList(res, openid) {
        let userData = null;
        let userRankAxisList = [];

        let urList = [];
        for (let i = 0; i < res.data.length; i++) {
            let data = res.data[i];
            let kvData = this.getLevel(data.KVDataList);

            let urData = {
                openid: data.openid,
                avatarUrl: data.avatarUrl,
                level: kvData.wxgame.score,
                time: kvData.wxgame.score.update_time
            };

            urList.push(urData);

            if (openid === data.openid) {
                userData = urData;
                userRankAxisList.push(urData)
            }
        }

        urList.sort((x, y) => {
            if (x.level > y.level) {
                return 1;
            } else if (x.level < y.level) {
                return -1;
            } else {
                return this._sortByTime(x, y);
            }
        });


        let userCount = 1;
        for (let i = 0; i < urList.length; i++) {
            let lastUrData = userRankAxisList[userRankAxisList.length - 1];
            let urData = urList[i];

            if (urData.level > lastUrData.level) {
                userCount++;
                userRankAxisList.push(urData);
            } else if (urData.level === lastUrData.level) {
                if (urData.time < lastUrData.level) {
                    // 保留自己不被替换。
                    if (userRankAxisList.length > 1) {
                        userRankAxisList.pop();
                        userCount--;
                    }
                    userRankAxisList.push(urData);
                    userCount++;
                }
            }

            if (userCount > 2) {
                break;
            }
        }

        return userRankAxisList;
    },
    _drawAvatars(urList) {
        let total = this.rankAxisContainer.width;

        for (let i = 0; i < urList.length; i++) {
            let info = urList[i];
            let item = cc.instantiate(this.rankAvatarPrefab).getComponent('avatar');
            item.setAvatar(info.avatarUrl);
            item.setLevel(info.level);

            // if (i == 0) {

                item.node.setPositionX(i * 60);
            // }

            this.rankAxisContainer.addChild(item.node);
        }
    },
    _setAvatarsPos(urList) {

        for (let i = 0; i < urList.length; i++) {
            if (i == 0) {
                item.node.setPositionX(i * 60);
            }

            this.rankAxisContainer.addChild(item.node);
        }
    },
    _set(currentLevel) {
        wx.getUserCloudStorage({
            keyList: [GAME_KEY],
            success: (res) => {
                console.log('get success', res);
                let storageLevel = this.getLevel(res.KVDataList).wxgame.score;
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
            return {};
        }

        for (let i = 0; i < KVDataList.length; i++) {
            let data = KVDataList[i];
            if (GAME_KEY == data.key) {
                return JSON.parse(data.value);
            }

        }

        return {};
    },
    setStorage(currentLevel) {
        let val = JSON.stringify({
            "wxgame": {
                "score": currentLevel,
                "update_time": new Date().getTime()
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
    _getRankList() {
        wx.getFriendCloudStorage({
            keyList: [GAME_KEY],
            success: (res) => {
                console.log('get friend success', res);
                let urList = this._getUserRankList(res);
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
            let info = urList[i];
            let item = cc.instantiate(this.item).getComponent('item');
            item.setRank(i + 1);
            item.setNickName(info.nickname);
            item.setLevel(info.level);
            item.setAvatar(info.avatarUrl);
            this.scrollView.addChild(item.node);
        }
    },
    _getUserRankList(res) {
        let urList = [];
        for (let i = 0; i < res.data.length; i++) {
            let data = res.data[i];
            let kvData = this.getLevel(data.KVDataList);
            urList.push({
                nickname: data.nickname,
                avatarUrl: data.avatarUrl,
                level: kvData.wxgame.score,
                time: kvData.wxgame.score.update_time
            });
        }

        return urList.sort((x, y) => {
            if (x.level < y.level) {
                return 1;
            } else if (x.level > y.level) {
                return -1;
            } else {
                return this._sortByTime(x, y);
            }
        });
    },
    _sortByTime(x, y) {
        if (x.time > y.time) {
            return 1;
        } else if (x.time < y.time) {
            return -1;
        } else {
            return 0;
        }
    },
    _show() {
        this._getRankList();
    },
    _hide() {
        this.scrollView.removeAllChildren();
    },
});