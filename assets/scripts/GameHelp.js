cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        mask: cc.Node,
        text: cc.RichText
    },

    show() {
        this.anim.play("help_in");
        this.mask.on(cc.Node.EventType.TOUCH_START, this.stopTouch);
        this.mask.on(cc.Node.EventType.TOUCH_END, this.stopTouch);
    },

    hide() {
        this.anim.play("help_out");
        this.mask.off(cc.Node.EventType.TOUCH_START, this.stopTouch);
        this.mask.off(cc.Node.EventType.TOUCH_END,this.stopTouch);
    },

    stopTouch(event) {
        event.stopPropagation();
    },

    onClickCancelBtn() {
        this.hide();
    }

});
