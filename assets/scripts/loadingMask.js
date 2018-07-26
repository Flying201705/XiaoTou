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
    },
    setStatus(type) {
        switch (type) {
            case 'load':
                this.loadHint.active = true;
                this.btnRetry.active = false;
                break;
            case 'error':
                this.loadHint.active = false;
                this.btnRetry.active = true;
                break;
        }
    }
});
