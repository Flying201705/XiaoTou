export default {
    initRank: (level) => {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                type: 'initRank',
                level: level
            });
        }
    },
    setRank: (currentLevel) => {
        cc.log('rank set currentLevel:' + currentLevel);
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                type: 'set',
                currentLevel: currentLevel
            });
        }
    },
    showRankList: () => {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                type: 'show'
            });
            cc.info('showRankList');
        }
    },
    hide: () => {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                type: 'hide'
            });
        }
    }
}