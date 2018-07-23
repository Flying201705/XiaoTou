export default {
    setRank: (currentLevel) => {
        cc.log('rank set currentLevel:' + currentLevel);
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                type: 'set',
                currentLevel: currentLevel
            })
        }
    },
    showRankList: () => {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                type: 'show'
            })
        }
    },
}