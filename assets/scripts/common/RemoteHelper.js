import {http_head} from "../InfoData";

const net = require("./net");

module.exports = {
    checkSignIn: (userId, success) => {
        cc.info('query sign in status');
        net.request({
            url: http_head + `user/${userId}/sign_in`,
            success: data => {
                cc.info('success', data);
                success && success(data);
            },
            fail: res => {
                cc.info('fail', res);
            },
        });
    }
};