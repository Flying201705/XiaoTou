cc.Class({
    extends: cc.Component,

    properties: {
        loadHint: cc.Label,
        btnRetry: cc.Button
    },

    start() {

    },
    retry() {
        this.setStatus('load');
        this.onRetry && this.onRetry();
    },
    setStatus(type) {
        switch (type) {
            case 'load':
                this.loadHint.node.active = true;
                this.btnRetry.node.active = false;
                break;
            case 'error':
                this.loadHint.node.active = false;
                this.btnRetry.node.active = true;
                break;
        }
    },
    onRetry() {
        // 通过直接赋值方式，设置回调函数。
        console.log('onRetry');
    }
});
