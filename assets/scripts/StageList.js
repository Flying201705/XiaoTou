import {InfoData} from './InfoData'

let self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        rootNode: cc.Node,
        loadingMaskPrefab: cc.Prefab,
        itemPrefab: cc.Prefab,
        itemCount: 0,
        scrollView: cc.ScrollView,
        display: cc.Sprite,
    },

    onLoad() {
        self = this;
        this.firstLockLevel = -1;
        this.itemWidth = 0;
        this.itemHeight = 0;
        this.initList();
    },
    _resizeShareCanvas() {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        let ratio = 1;
        ratio = wx.getSystemInfoSync().pixelRatio;
        // ratio = ratio == 1 ? 1 : ratio / 2;
        window.sharedCanvas.width = window.sharedCanvas.width * ratio;
        window.sharedCanvas.height = window.sharedCanvas.height * ratio;

    },
    start() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.tex = new cc.Texture2D();
            this._resizeShareCanvas();
            wx.postMessage({
                type: 'rankAxis',
                openid: InfoData.user.openid
            });
            // this._updaetSubDomainCanvas();
            this.scheduleOnce(this._updaetSubDomainCanvas, 1);
            this.scheduleOnce(this._updaetSubDomainCanvas, 3);
            this.scheduleOnce(this._updaetSubDomainCanvas, 5);
        }
    },
    update(dt) {
        // this._updaetSubDomainCanvas();
    },
    _updaetSubDomainCanvas() {
        cc.info('_updaetSubDomainCanvas');
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        if (!this.tex) {
            console.log('no tex');
            return;
        }

        this.tex.initWithElement(wx.getOpenDataContext().canvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    initList: function () {
        for (let i = 0; i < this.itemCount; ++i) {
            let item = cc.instantiate(this.itemPrefab).getComponent('StageItem');
            if (item !== null) {
                item.preOnClick = this.showLoadingMask;
                item.onFail = this.startItemFail;
                if (i < InfoData.user.level) {
                    if (i < InfoData.levels.length) {
                        item.init(i + 1, false, InfoData.levels[i].stars);
                    } else {
                        item.init(i + 1, false, 0);
                    }
                } else {
                    item.init(i + 1, true, 0);
                    if (this.firstLockLevel < 0) {
                        this.firstLockLevel = i;
                        this.itemWidth = item.node.width;
                        this.itemHeight = item.node.height;
                    }
                }
                // 测试代码开始
                // 放开所有关卡
                // item.init(i + 1, false, 1);
                //测试代码结束
                this.node.addChild(item.node);
            }
        }
    },
    showLoadingMask() {
        self.loadingMask = cc.instantiate(self.loadingMaskPrefab);
        self.loadingMask.parent = self.rootNode;
    },
    startItemFail() {
        cc.info('startItemFail');
        self.rootNode.removeChild(self.loadingMask);
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.showToast({
                title: '无法连接服务器',
                icon: 'none'
            })
        }
    },
    onEnable() {
        this.initScrollViewPos();
    },

    onDestroy() {
        this.node.destroyAllChildren();
    },

    initScrollViewPos: function () {
        let layout = this.getComponent(cc.Layout);
        layout.updateLayout();

        let column = Math.floor(layout.node.width / (this.itemWidth + layout.spacingX));
        let moveStep = Math.floor(this.firstLockLevel / column);
        // let visibleRow = Math.floor(layout.node.parent.height / (this.itemHeight + layout.spacingY));
        if (moveStep > 0) {
            moveStep -= 1;
        }
        let offsetY = moveStep * (this.itemHeight + layout.spacingY);

        this.scrollView.scrollToOffset(cc.p(0, offsetY), 0.1);
    }
});