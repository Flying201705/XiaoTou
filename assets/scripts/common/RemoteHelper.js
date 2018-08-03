import {http_head} from "../InfoData";

const net = require("./net");

module.exports = {
    checkSignIn: (userId, success) => {
        cc.info('query sign in status');
        net.request({
            url: http_head + `user/${userId}/check_sign_in`,
            success: data => {
                cc.info('checkSignIn success', data);
                success && success(data);
            },
            fail: res => {
                cc.info('checkSignIn fail', res);
            },
        });
    },
    signIn: (userId, success) => {
        net.request({
            url: http_head + `user/${userId}/sign_in`,
            success: data => {
                cc.info('signIn success', data);
                success && success(data);
            },
            fail: res => {
                cc.info('signIn fail', res);
            },
        });
    }
};