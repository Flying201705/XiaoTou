const GAME_KEY = '小兵传奇';
const AVATAR_WIDTH = 50;
const TOTAL_LEVEL = 50;

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.Node,
        item: cc.Prefab,
        rankAxisContainer: cc.Node,
        rankAvatarPrefab: cc.Prefab,
        rankDesc: cc.RichText,
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
                //temp code
                // res = {
                //     data: [
                //         {
                //             KVDataList: [{
                //                 key: "小兵传奇",
                //                 value: "{\"wxgame\":{\"score\":48,\"update_time\":1533896085812}}"
                //             }],
                //             avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/hrTPJATib69FAmkOIpVVLq8R5D33gO2QuOHibU3yuQV7gLVWgZqmyH8o0LuJxLTVYibXglqzIPictvgMaL835P6iaDA/132",
                //             nickname: "在路上",
                //             openid: "oVL0X0Usze9sx5PVrryp9hcWccY0",
                //         },
                //         {
                //             KVDataList: [{
                //                 key: "小兵传奇",
                //                 value: "{\"wxgame\":{\"score\":48,\"update_time\":1533899202161}}"
                //             }],
                //             avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/a1nDkic8T3LQ53tPuXBF1VsoSaiauNJOlKU6hWPES7s9badBmzGOsibW1WesVibaRNeR7C2q37GX5fGUsqZVRon0EQ/132",
                //             nickname: "浩S",
                //             openid: "oVL0X0a5g1anxIss_WVtmRdb3G2c",
                //         },
                //         {
                //             KVDataList: [{
                //                 key: "小兵传奇",
                //                 value: "{\"wxgame\":{\"score\":48,\"update_time\":1533903450362}}"
                //             }],
                //             avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/2CTFQ6kHnAccby5NLOsaKfhDnicJ23p0k0AD7tv9q6vmq7ZcXibEZwicN1yxKmoRgV9o7BeXbQ0RhXMicAIUMibGbnQ/132",
                //             nickname: "HotBunny",
                //             openid: "oVL0X0bnObYaYWxhAkyBQdXliMa0",
                //         },
                //     ]
                // };
                //temp code


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
                time: kvData.wxgame.update_time
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
        let userLevel = userRankAxisList[0].level;
        for (let i = 0; i < urList.length; i++) {
            let lastUrData = userRankAxisList[userRankAxisList.length - 1];
            let urData = urList[i];

            if (urData.level > lastUrData.level) {
                userCount++;
                userRankAxisList.push(urData);
            } else if (urData.level === lastUrData.level) {
                if (urData.level <= userLevel) {
                    continue;
                }
                if (urData.openid === lastUrData.openid) {
                    continue;
                }
                // cc.info('urData.time:' + urData.time + ' lastUrData.time:' + lastUrData.time);
                if (urData.time < lastUrData.time) {
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
        cc.info('total width:' + total);

        this.avatarList = [];
        for (let i = 0; i < urList.length; i++) {
            let info = urList[i];
            let item = cc.instantiate(this.rankAvatarPrefab).getComponent('avatar');
            item.setAvatar(info.avatarUrl);
            item.setLevel(info.level);
            this.rankAxisContainer.addChild(item.node);
            this.avatarList.push(item.node);

        }

        this.rankDesc.string = '';

        if (urList.length == 1) {
            let first = urList[0];
            let pos = total * first.level / TOTAL_LEVEL;
            pos = Math.max(AVATAR_WIDTH * 0.5, pos);
            pos = Math.min(total - AVATAR_WIDTH * 0.5, pos);
            this.avatarList[0].setPositionX(pos);

            let percent = first.level / TOTAL_LEVEL * 100;
            percent = Math.min(percent, 90);
            percent = percent + Math.floor(Math.random() * 6);
            this.rankDesc.string = `<color=f412305>您已超越<color=#0f43e7d>${percent}%</color>的玩家</color>`;
        } else if (urList.length == 2) {
            let first = urList[0];
            let last = urList[1];

            let pos = total * first.level / TOTAL_LEVEL;
            pos = Math.max(AVATAR_WIDTH * 0.5, pos);
            pos = Math.min(total - AVATAR_WIDTH * 1.5, pos);
            this.avatarList[0].setPositionX(pos);

            let lastPos = total * last.level / TOTAL_LEVEL;
            lastPos = Math.max(pos + AVATAR_WIDTH, lastPos);
            lastPos = Math.min(total - AVATAR_WIDTH * 0.5, lastPos);
            this.avatarList[1].setPositionX(lastPos);
        } else if (urList.length == 3) {
            let first = urList[0];
            let second = urList[1];
            let last = urList[2];

            let firstPos = total * first.level / TOTAL_LEVEL;
            firstPos = Math.max(AVATAR_WIDTH * 0.5, firstPos);
            firstPos = Math.min(total - AVATAR_WIDTH * 2.5, firstPos);
            this.avatarList[0].setPositionX(firstPos);

            let secondPos = total * second.level / TOTAL_LEVEL;
            secondPos = Math.max(firstPos + AVATAR_WIDTH, secondPos);
            secondPos = Math.min(total - AVATAR_WIDTH * 1.5, secondPos);
            this.avatarList[1].setPositionX(secondPos);

            let lastPos = total * last.level / TOTAL_LEVEL;
            lastPos = Math.max(secondPos + AVATAR_WIDTH, lastPos);
            lastPos = Math.min(total - AVATAR_WIDTH * 0.5, lastPos);
            this.avatarList[2].setPositionX(lastPos);
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
                time: kvData.wxgame.update_time
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