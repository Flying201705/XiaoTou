module.exports = {
    /**
     *
     *  @param options ={
     *      url,
     *      success,
     *      fail,
     *      complete
     * }
     *
     */
    request: (options) => {
        if (options == null) {
            return;
        }

        if (options.url == null) {
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.ontimeout = () => {
            // console.log('xxx xml timeout');
            options.fail && options.fail();
            options.complete && options.complete();
        };
        xhr.onerror = (err) => {
            // console.log('xxx xml onerror');
            options.fail && options.fail(err);
            options.complete && options.complete();
        };
        xhr.onload = () => {
            // console.log('xxx xml onload readyState:' + xhr.readyState + ' xhr.status:' + xhr.status);
            if (xhr.readyState == 4 && xhr.status == 200) {
                let response = xhr.responseText;
                console.log("<test> json str : " + response);
                let obj = JSON.parse(response);
                // console.log("xxx xml success callback");
                if (obj && obj.respcode >= 0) {
                    options.success && options.success(obj.data);
                } else {
                    options.fail && options.fail('respcode:' + obj == null ? 'result null' : obj.respcode);
                }
            } else {
                options.fail && options.fail('readyState:' + xhr.readyState + ' status:' + xhr.status);
            }

            options.complete && options.complete();
        };
        // console.log('xxx url:' + options.url);
        xhr.open("POST", options.url, true);
        if (options.data == null) {
            xhr.send();
        } else {
            xhr.send(JSON.stringify(options.data));
        }

    }
};