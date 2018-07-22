cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node
    },

    start() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.onMessage(data => {
                switch (data.message) {
                    case 'Show':
                        console.log('Show');
                        this._show();
                        break;
                    case 'Hide':
                        console.log('Hide');
                        this._hide();
                        break;
                }
            });
        }
    },

    _show() {
        // let moveTo = cc.moveTo(0.5, 0, 0);
        // this.content.runAction(moveTo);
        this.content.active = true;
    },

    _hide() {
        // let moveTo = cc.moveTo(0.5, 0, 1000);
        // this.content.runAction(moveTo);
        this.content.active = false;
    }

});
