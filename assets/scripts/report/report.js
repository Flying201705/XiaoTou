var report;
(function (report) {

  const version = '1.0';
  var showlog = true;

  window["report"] = report;

  var gameid = 0;
  var gamepath;
  var _sysPlatform = null;
  var _advType = "icon";//广告展示类型

  var _recommendLoading = false;
  var _recommenConfig = null;
  var _recommendCallback = null;
  var _recommendCallThis = null;

  var _shareLoading = false;
  var _shareConfig = null;
  var _shareCallback = null;
  var _shareCallThis = null;

  //const loginServer = 'http://192.168.5.38:8080'; //认证服务器

  //以下地址需要配置到微信后台request合法域名中
  //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  const loginServer = 'https://xyxcck-auth.raink.com.cn'; //认证服务器
  const reportServer1 = 'https://xyxcck-log.raink.com.cn'; //日志服务器
  const reportServer2 = 'https://xyxcck-log-ad.raink.com.cn'; //日志服务器2
  const friendServer = 'https://xyxcck-friend.raink.com.cn'; //好友和用户信息服务器
  const cdnServer = 'https://cdn-xyx.raink.com.cn'; //资源服务器
  //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
  //以上地址需要配置到微信后台request合法域名中
  
  /**
   * 关闭log答应
   */
  function stoplog() {
    showlog = false;
  }
  report.stoplog = stoplog;
	/**
	 * 初始化并调用wx.login获取openid，处理启动参数
	 * @调用时机 App.onLaunch,
   * @param gameId int 平台分配的gameid
   * @param gamePath string 平台分配的游戏配置地址
	 * @param options any 启动参数
	 * @param callback any 获取到用户id的回调,参数:{"openid": "***","unionid": "***"}
   * @param thisObject any 回调方法作用域
	 * autoInit,init,initWithAccount 三个方法三选一
	 */
  function autoInit(gameId, gamePath, options, callback = null, thisObject = null) {

    gameid = gameId;
    gamepath = gamePath;

    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::autoInit->未找到微信运行环境");
      callback.call(thisObject, getAccount());
      return;
    }
    wx.login({
      success: res => {
        this.init(gameid, gamePath, res.code, options, callback, thisObject);
      }
    });
  }

  report.autoInit = autoInit;

  /**
   * 初始化，获取openid，处理启动参数
   * @调用时机 App.onLaunch.login.success 得到code的时候
   * @param gameId int 平台分配的gameid
   * @param gamePath string 平台分配的游戏配置地址
   * @param code string 调用wx.login得到的code
   * @param options object 启动参数
   * @param callback Function 获取到openid的回调
   * @param thisObject any 回调方法作用域
   * autoInit,init,initWithAccount 三个方法三选一
     */
  function init(gameId, gamePath, code, options, callback = null, thisObject = null) {

    gameid = gameId;
    gamepath = gamePath;

    if (typeof (wx) != "undefined") {
      _sysPlatform = wx.getSystemInfoSync().platform;
    }

    this.loadShareInfoList();
    this.loadRecommendInfoList();

    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::init->未找到微信运行环境");
      callback.call(thisObject, getAccount());
      return;
    }
    if (showlog) console.log('mpsdk', 'SDK初始化/启动参数', JSON.stringify(options));
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) { //如果已经授权则尝试获取unionId
          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              let credentials = {
                code: code,
                encryptedData: res.encryptedData,
                iv: res.iv
              }
              this.getUserData(credentials, options, callback, thisObject);
            }
          });
        } else { //没有授权就只获取openId
          let credentials = {
            code: code,
            encryptedData: '',
            iv: ''
          }
          this.getUserData(credentials, options, callback, thisObject);
        }
      }
    });
  }

  report.init = init;


  /**
   * 初始化，适用于已经获得openId的情况
   * @调用时机 第三方获取到openid的时候
   * @param gameId int 平台分配的gameid
   * @param gamePath string 平台分配的游戏配置地址
   * @param openid string openid
   * @param options object 启动参数
   */
  function initWithAccount(gameId, gamePath, account, options) {
    gameid = gameId;
    gamepath = gamePath;

    if (typeof (wx) != "undefined") {
      _sysPlatform = wx.getSystemInfoSync().platform;
    }
    if (showlog) console.log('mpsdk', 'SDK初始化/启动参数', JSON.stringify(options));
    this.loadShareInfoList();
    this.loadRecommendInfoList();
    this.setAccount(account); //登记用户帐号
    let accountSource = this.parseAccountSource(options); //解析用户来源
    this.setAccountSource(accountSource.sourceType, accountSource.sourceId); //登记用户来源
    this.reportAppRun(options); //上报启动日志
  }

  report.initWithAccount = initWithAccount;

  /**
   * 向服务器请求用户openId和unionId
   * @自动调用
   * @param credentials object 用户信息凭据
   * @param options object 启动参数
   * @param callback any 获取到用户openId和unionId后通过回调函数返回
   */
  function getUserData(credentials, options, callback = null, thisObject = null) {
    let accountSource = this.parseAccountSource(options);
    wx.request({
      url: loginServer + '/MiniGame/data/getOpenId2.action',
      data: {
        gameId: gameid,
        code: credentials.code,
        encryptedData: credentials.encryptedData,
        iv: credentials.iv,
        unionId: credentials.encryptedData && credentials.iv ? 'true' : 'false',
        sourceType: accountSource.sourceType,
        sourceId: accountSource.sourceId,
      },
      success: res => {
        if (showlog) console.log('mpsdk', '上报用户来源成功', 'sourceType=', accountSource.sourceType, 'sourceId=', accountSource.sourceId);
        this.setAccount(res.data); //登记用户帐号
        this.reportAppRun(options); //上报启动日志
        callback && callback(res.data.openid);
      }
    });
  }

  report.getUserData = getUserData;

  function parseAccountSource(options) {
    let source = null;
    if (options.query.type == 'share') {
      source = {
        sourceType: options.query.type,
        sourceId: options.query.shareid
      }
    } else if (options.query.type == 'wxad') {
      source = {
        sourceType: options.query.type,
        sourceId: options.query.adid + '.' + options.query.weixinadinfo
      }
    } else if (options.query.type) {
      source = {
        sourceType: options.query.type,
        sourceId: options.query.adid
      }
    } else {
      source = {
        sourceType: 'std',
        sourceId: options.scene
      }
    }
    return source;
  }

  report.parseAccountSource = parseAccountSource;

  /**
 * 上报启动日志
 * @自动调用
 */
  function reportAppRun(options) {
    if (options.query.type == 'share') {
      this.reportShareIn(options.query.shareid, options.query.userid, options.shareTicket, options.query.shareinfoid || '');
    } else if (options.query.type == 'wxad') {
      this.reportAdIn(options.query.adid, options.query.gdt_vid, options.query.weixinadinfo);
    } else if (options.query.type) {
      this.reportLinkIn(options.query.adid, options.referrerInfo ? options.referrerInfo.appId : "");
    }
  }

  report.reportAppRun = reportAppRun;

  /**
   * 预加载分享配置
   */
  function loadShareInfoList() {

    if (_shareConfig != null) {
      if (showlog) console.log('mpsdk', "已经获得分享推荐配置表,无需重复加载");
      return;
    }

    if (_shareLoading) {
      if (showlog) console.log('mpsdk', "正在加载分享推荐配置表,无需重复加载");
      return;
    }

    _shareLoading = true;

    wx.request({
      url: cdnServer + '/ad/' + gamepath + '/share.json',
      success: (res) => {
        if (showlog) console.log('mpsdk', '加载分享配置表成功', res.data);
        _shareConfig = res.data;
        this.getShareInfo(_shareCallback, _shareCallThis);
      },
      fail: (res) => {
        if (showlog) console.log('mpsdk', '加载分享配置表失败,返回null', res);
        if (_shareConfig == null && _shareCallback) {
          _shareCallback.call(_shareCallThis, null);
        }
      },
      complete: () => {
        _shareLoading = false;
      }
    });
  }

  report.loadShareInfoList = loadShareInfoList;

  /**
   * 预加载推荐配置
   */
  function loadRecommendInfoList() {

    if (_recommenConfig != null) {
      if (showlog) console.log('mpsdk', "已经获得推荐配置表,无需重复加载");
      return;
    }

    if (_recommendLoading) {
      if (showlog) console.log('mpsdk', "正在加载推荐配置表,无需重复加载");
      return;
    }

    _recommendLoading = true;

    wx.request({
      url: cdnServer + '/ad/' + gamepath + '/advlist.json',
      success: (res) => {
        if (showlog) console.log('mpsdk', '加载推荐配置表成功', res.data);
        _recommenConfig = this.rejustAdvList(res.data);
        this.getRecommendInfo(_recommendCallback, _recommendCallThis);
      },
      fail: (res) => {
        if (showlog) console.log('mpsdk', '加载推荐配置表失败,返回null', res);
        if (_recommenConfig == null && _recommendCallback) {
          _recommendCallback.call(_recommendCallThis, null);
        }
      },
      complete: () => {
        _recommendLoading = false;
      }
    });
  }

  report.loadRecommendInfoList = loadRecommendInfoList;

  //修正adv列表
  function rejustAdvList(alist) {
    //修正资源路径为绝对路劲
    var advList = [];
    for (let item of alist) {
      if (item.platform && item.platform != _sysPlatform) { //不符合系统要求
        continue;
      } else if (_advType == 'banner' && item.category !== 2) { //横幅广告
        continue;
      } else if (_advType == 'icon' && item.category !== 2) { //浮标广告
        continue;
      } else if (_advType == 'video' && item.category !== 3) { //视频广告
        continue;
      }
      //添加参数
      item.page += (item.page.indexOf('?') == -1 ? '?' : '&') + 'type=link&adid=' + item.adid;
      //桥接
      let bridge_appid = this.getQueryString(item.page, 'bridge_appid');
      let bridge_path = this.getQueryString(item.page, 'bridge_path'); //bridge_path只能是纯路径或空
      if (bridge_appid) {
        // if (showlog) console.group(_advType + '广告发现桥接请求：' + item.title);
        // if (showlog) console.log('原始appid', item.appid);
        // if (showlog) console.log('原始URL', item.page);
        item.page = bridge_path + '?' + item.page
          .replace('bridge_appid=' + bridge_appid, 'bridge2appid=' + item.appid)
          .replace('bridge_path=' + bridge_path, 'bridge2path=' + item.page.split('?')[0])
          .split('?')[1];
        item.appid = bridge_appid;
        // if (showlog) console.log('桥接appid', item.appid);
        // if (showlog) console.log('桥接URL', item.page);
        // if (showlog) console.groupEnd();
      }
      //资源路径兼容
      if (item.ad_image.indexOf('http') != 0) {
        item.ad_image = cdnServer + '/ad/images/' + item.ad_image;
      }
      if (item.icon.indexOf('http') != 0) {
        item.icon = cdnServer + '/ad/images/' + item.icon;
      }
      //加入备选广告
      advList.push(item);
    }
    return advList;
  }

  report.rejustAdvList = rejustAdvList;

  function getQueryString(query, key) {
    let reg = new RegExp('(\\?|&)' + key + "=([^&]*)(&|$)");
    let r = query.match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return '';
  }

  report.getQueryString = getQueryString;

  /**
   * 设置用户帐号数据
   * @调用时机 请在获取到openid的第一时间设置帐号数据
   * @param account object 用户帐号对象{"openid":"","unionid":""}
   */
  function setAccount(account) {
    if (!account.openid) {
      console.error('设置用户帐号失败，请至少设置openid，account=', account);
      return false;
    }
    wx.setStorageSync('miniapp_user_account', account);
    console.log('mpsdk', '更新openid成功', account.openid);
    return true;
  }

  report.setAccount = setAccount;

  /**
  * 获取用户帐号数据
  * @return object 用户帐号对象{"openid":"","unionid":""}
  */
  function getAccount() {
    let account = wx.getStorageSync('miniapp_user_account');
    if (account.openid) {
      account.unionid = account.unionid || '';
      return account;
    }
    // console.error('获取用户帐号失败，未找到openid，account=', account);
    return {
      "openid": "",
      "unionid": ""
    };
  }

  report.getAccount = getAccount;

  /**
   * 获取用户帐号数据，返回Promise
   */
  function getAccountSafe() {
    return new Promise((resolve, reject) => {
      if (this.getAccount().openid) { //如果可以拿到帐号就直接返回
        // if(showlog)console.log('帐号已就绪，直接返回');
        resolve(this.getAccount());
      } else {
        // if(showlog)console.log('帐号未就绪，开始监控');
        //计时器
        let _timerInterval;
        let _timerTimeout;
        //循环监听帐号是否准备好
        _timerInterval = setInterval(() => {
          if (this.getAccount().openid) {
            // if(showlog)console.log('监控到帐号已就绪');
            clearInterval(_timerInterval);
            clearTimeout(_timerTimeout);
            resolve(this.getAccount());
            return;
          }
          // if(showlog)console.log('监控到帐号未就绪，继续监控');
        }, 200);
        //最长30秒放弃
        _timerTimeout = setTimeout(() => {
          // if(showlog)console.log('监控帐号就绪超时');
          clearInterval(_timerInterval);
          reject();
        }, 30000);
      }
    });
  }

  report.getAccountSafe = getAccountSafe;

  /**
     * 生成分享链接
     * @辅助函数
     * @param serial int 分享点序号
     * @param query string 其他自定义参数，如a=b&c=d，不要加问号
     * @param shareInfoId int 如果分享信息是通过getShareInfo()取得，则需要传入获取的分享信息ID
     */
  function getShareLink(serial, query = '', shareInfoId = '') {
    let link = 'type=share&shareid=share_' + gameid + '_' + serial + '&userid=' + this.getAccount().openid;
    if (shareInfoId) {
      link += '&shareinfoid=' + shareInfoId;
    }
    if (query) {
      link += '&' + query;
    }
    console.log('mpsdk', '生成分享链接成功', link);
    return link;
  }

  report.getShareLink = getShareLink;

  /**
   * 获取推荐信息
   * @param  {Function} callback 返回推荐数据
   * @param  {Function} thisObject callback的作用域
   * @param  {boolean}  sigle 是否只取一个,false返回推荐列表信息
   */
  function getRecommendInfo(callback, thisObject, sigle = true) {
    _recommendCallback = callback;
    _recommendCallThis = thisObject;
    if (_recommenConfig) {
      if (_recommendCallback) {
        var tablelist = tableAlgorithm(_recommenConfig, "table", sigle);
        console.log('mpsdk', '获取随机推荐成功', JSON.stringify(tablelist));
        _recommendCallback.call(_recommendCallThis, tablelist);
      }
    }
    else if (_recommendLoading == false) {
      this.loadRecommendInfoList();
      return;
    }
  }

  report.getRecommendInfo = getRecommendInfo;

  /**
   * 获取分享推荐信息
   * @param  {Function} callback 返回推荐数据
   * @param  {Function} thisObject callback的作用域
   * @param  {boolean}  sigle 是否只取一个,false返回推荐列表信息
   * @param  {string}   nickname 当前用户昵称，可以传空
   */
  function getShareInfo(callback, thisObject, sigle = true, nickname = null) {
    _shareCallback = callback;
    _shareCallThis = thisObject;
    if (_shareConfig) {
      if (_shareCallback) {
        var tablelist = tableAlgorithm(_shareConfig, "table", sigle);
        if (nickname) {
          tablelist.text = tablelist.text.replace('{nickname}', nickname);
        }
        console.log('mpsdk', '获取随机分享内容成功', JSON.stringify(tablelist));
        _shareCallback.call(_shareCallThis, tablelist);
      }
    }
    else if (_shareLoading == false) {
      this.loadShareInfoList();
      return;
    }
  }

  report.getShareInfo = getShareInfo;

  /**
  * 圆桌随机抽取/排序
  * @param dataList Array 数据列表
  * @param weightKey String 权重字段，权重值必须为正数
  * @param popOne Boolean true表示只抽取一个，false表示返回排序列表
  * @param thresholdUp Number 阀值上限，>=此阀值则必然被抽中，且排在首位；如果有多个超过阀值的数据，则各自按原数据顺序排序
  * @param thresholdLow Number 阀值下限，<=此阀值则无条件丢弃
  */
  function tableAlgorithm(dataList, weightKey, popOne = true, thresholdUp = Number.MAX_SAFE_INTEGER, thresholdLow = 0) {
    let headList = []; //上限优选列表
    let tableList = []; //桌面列表
    let tableCount = 0; //桌面大小
    for (let i = 0; i < dataList.length || 0; i++) {
      //剔除权重字段不正确的数据
      if (isNaN(dataList[i][weightKey])) {
        continue;
      }
      //规范数据类型
      dataList[i][weightKey] = Number(dataList[i][weightKey]);
      //下限过滤
      if (dataList[i][weightKey] <= thresholdLow) {
        continue;
      }
      //上限优选
      if (dataList[i][weightKey] >= thresholdUp) {
        headList.push(dataList[i]);
        continue;
      }
      //构造桌面
      tableList.push(dataList[i]);
      tableCount += dataList[i][weightKey];
    }
    //防止意外出现死循环
    if (!tableCount || !tableList.length) {
      return [];
    }

    //圆桌排序
    let sortList = []; //排序后的列表
    while (tableList.length) {
      let point = Math.random(); //指针
      let sectorStart = 0; //扇区起始位置

      for (let i = 0; i < tableList.length; i++) {
        let sectorEnd = sectorStart + tableList[i][weightKey] / tableCount; //扇区终止位置
        //转盘指针落入区间
        if (point >= sectorStart && point < sectorEnd) {
          sortList.push(tableList[i]);
          tableCount -= tableList[i][weightKey];
          tableList.splice(i, 1);
          break;
        }
        //移动扇区
        sectorStart = sectorEnd;
      }
    }
    //拼合结果列表
    let resultList = headList.concat(sortList);
    //返回数据
    if (popOne) {
      return resultList[0];
    } else {
      return resultList;
    }
  }

  report.tableAlgorithm = tableAlgorithm;

  /**
   * 上报用户来源信息
   * @自动调用
   */
  function setAccountSource(sourceType, sourceId) {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::setAccountSource->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      wx.request({
        url: friendServer + '/MiniFriend/data/setAccountLogin.action',
        data: {
          gameId: gameid,
          openId: account.openid,
          unionId: account.unionid,
          sourceType: sourceType, //来源类型
          sourceId: sourceId, //来源ID
        },
        success: (res) => {
          if (showlog) console.log('mpsdk', '上报用户来源成功', 'sourceType=', sourceType, 'sourceId=', sourceId);
        }
      });
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，上报用户来源失败');
    });
  }

  report.setAccountSource = setAccountSource;

  /**
  * 上报用户信息
  * @调用时机 获取到用户昵称、头像后
  * @param userInfo object 户信息对象
  */
  function setAccountInfo(userInfo) {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::setAccountInfo->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      wx.request({
        url: friendServer + '/MiniFriend/data/setAccountShow.action',
        data: {
          gameId: gameid,
          openId: account.openid,
          unionId: account.unionid,
          show: encodeURIComponent(JSON.stringify(userInfo)),
        },
        success: (res) => {
          if (showlog) console.log('mpsdk', '上报用户信息成功');
        }
      });
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，上报用户信息失败');
    });
  }

  report.setAccountInfo = setAccountInfo;


  /**
   * 上报登陆日志
   * @调用时机 App.onShow
   * @param gold int 当前金币余额
   * @param level int 当前最大关卡进度
   * @param leveltype int 关卡类型，如果一个小程序内有多个子项的话可以指明关卡进度属主ID，没有就不填
   * 属主ID：比如成语猜猜看当中包含【看图猜成语】和【成语接龙】两个游戏，那么可以依次编号为1和2，
   */
  function reportLogin(gold = 0, level = 0, leveltype = 0) {
    this.getAccountSafe().then(account => {
      let data = {
        gameid: gameid,
        userid: account.openid,
        gold: gold,
        level_kt: level,
        level_jl: leveltype,
      };
      wx.request({
        url: reportServer1 + '/MiniGameLog/log/login.action',
        data: data,
        success: (res) => {
          if (showlog) console.log('mpsdk', '上报login事件成功', JSON.stringify(data));
        }
      });
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，上报login事件失败');
    });
  }

  report.reportLogin = reportLogin;


  /**
   * 上报金币变化日志
   * @调用时机 金币发生变化
   * @param changeGold int 变动数量（减少时为负数）
   * @param newGold int 变化后的数量
   * @param param1 string 变化原因描述
   * @param reason int 变化原因码
   */
  function reportGold(changeGold, newGold, param1, reason) {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::reportGold->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      let data = {
        gameid: gameid,
        userid: account.openid,
        change_gold: changeGold, //变化值（增加是正数，减少是负数）
        new_gold: newGold, //变化后的值
        param1: param1, //根据变化原因码填写相应的值，没有为空
        reason: reason //变化原因码
      };
      wx.request({
        url: reportServer1 + '/MiniGameLog/log/gold.action',
        data: data,
        success: (res) => {
          if (showlog) console.log('mpsdk', '上报金币变化成功', JSON.stringify(data));
        }
      });
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，上报金币变化失败');
    });
  }

  report.reportGold = reportGold;

  /**
   * 上报事件日志
   * @调用时机 预定事件发生
   * @param eventId int 事件ID
   * @param param1 string 事件参数1
   * @param param2 string 事件参数2
   */
  function reportEvent(eventId, param1 = '', param2 = '') {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::reportEvent->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      let data = {
        gameid: gameid,
        userid: account.openid,
        eventid: eventId, //事件号
        param1: param1,
        param2: param2
      };
      wx.request({
        url: reportServer1 + '/MiniGameLog/log/event.action',
        data: data,
        success: (res) => {
          if (showlog) console.log('mpsdk', '上报事件日志成功', JSON.stringify(data));
        }
      });
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，上报事件日志失败');
    });
  }

  report.reportEvent = reportEvent;

  /**
   * 上报分享日志
   * 分享链接统一格式：/pages/index/index?type=share&shareid=share_${gameid}_${序号}&userid=getUserId()
   * @调用时机 分享成功或点击分享按钮时
   * @param serial int 分享点序号
   * @param param1 string 扩展参数
   * @param shareInfoId int 如果分享信息是通过getShareInfo()取得，则需要传入获取的分享信息ID
   * @param shareTicket string 分享到群时传shareTicket，分享到个人时传空
   */
  function reportShareOut(serial, param1 = '', shareInfoId = '', shareTicket = '') {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::reportShareOut->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      let data = {
        gameid: gameid,
        userid: account.openid,
        share_char_id: 'share_' + gameid + '_' + serial, //分享广告id（对应log_share_out的share_char_id）
        share_pic_id: shareInfoId,
        sing_or_group: shareTicket,
        param1: param1
      };
      wx.request({
        url: reportServer1 + '/MiniGameLog/log/shareOut.action',
        data: data,
        success: (res) => {
          if (showlog) console.log('mpsdk', '上报shareOut事件成功', JSON.stringify(data));
        }
      });
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，上报shareOut事件失败');
    });
  }

  report.reportShareOut = reportShareOut;

  /**
   * 上报分享转化日志
   * @自动调用
   */
  function reportShareIn(shareId, shareUser, shareTicket, param1 = '') {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::reportShareIn->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      let data = {
        gameid: gameid,
        userid: account.openid,
        from_share_id: shareId, //分享广告id（对应log_share_out的share_char_id）
        from_sing_or_group: shareTicket ? 1 : 0, //从个人(0)还是群(1)进来
        from_share_userid: shareUser, //从谁分享获得
        param1: param1
      };
      wx.request({
        url: reportServer1 + '/MiniGameLog/log/shareIn.action',
        data: data,
        success: (res) => {
          if (showlog) console.log('mpsdk', '上报shareIn事件', JSON.stringify(data));
        }
      });
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，上报shareIn事件失败');
    });
  }

  report.reportShareIn = reportShareIn;

  /**
   * 上报链入事件
   * 友情外链统一格式：/pages/index/index?type=link&adid=ad_${gameid}_${序号}
   * @自动调用
   */
  function reportLinkIn(adId, appId, param1 = '') {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::reportLinkIn->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      let data = {
        gameid: gameid,
        userid: account.openid,
        my_adid: adId, //来源跳转过来的时候，从我们这边分配的广告id
        from_appid: appId, //来源appid
        param1: param1
      };
      wx.request({
        url: reportServer2 + '/MiniGameLog/log/linkIn.action',
        data: data,
        success: (res) => {
          if (showlog) console.log('mpsdk', '上报linkIn事件', JSON.stringify(data));
        }
      });
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，上报linkIn事件失败');
    });
  }

  report.reportLinkIn = reportLinkIn;

  /**
   * 上报广告事件
   * 广告外链统一格式：/pages/index/index?type=wxad&adid=ad_${gameid}_${序号}
   * @自动调用
   */
  function reportAdIn(linkId, adId, adInfo, param1 = '') {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::reportAdIn->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      let data = {
        gameid: gameid,
        userid: account.openid,
        my_adid: linkId, //创建微信广告的时候，从我们这边分配的广告id
        gdt_vid: adId, //创建微信广告后的微信广告id
        weixinadinfo: adInfo, //进入我们的小程序启动时微信广告相关信息
        param1: param1
      };
      wx.request({
        url: reportServer2 + '/MiniGameLog/log/wxadIn.action',
        data: data,
        success: (res) => {
          if (showlog) console.log('mpsdk', '上报adIn事件', JSON.stringify(data));
        }
      });
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，上报adIn事件失败');
    });
  }

  report.reportAdIn = reportAdIn;

  /**
   * 上传排行榜数据
   * @param datakey string 排行数据名（可以支持多种排行）
   * @param value string 排行数据值
   * @param params string 附加参数（在获取排行列表时可返回该值，主要用于外观设置，如用户头像、昵称等；仅支持string，复杂数据用JSON.stringify序列化）
   */
  function rankUpload(datakey, value, params) {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::rankUpload->未找到微信运行环境");
      return;
    }
    if (!datakey || value == undefined || value == null) {
      return;
    }
    this.getAccountSafe().then(account => {
      let data = {
        gameId: gameid,
        openId: account.openid,
        unionId: account.unionid,
        show: params,
        dataKey: datakey,
        dataValue: value
      };
      wx.request({
        url: friendServer + "/MiniFriend/data/setData.action",
        data: data,
        success: (res) => {
          if (showlog) console.log('mpsdk', '上报排行榜数据成功', JSON.stringify(data));
        }
      })
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，上报排行榜数据失败');
    });
  }

  report.rankUpload = rankUpload;

  /**
   * 添加好友/绑定好友关系
   * @param friendOpenId string 对方的openid
   */
  function friendBind(friendOpenId) {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::friendBind->未找到微信运行环境");
      return;
    }
    if (!friendOpenId) {
      return;
    }
    this.getAccountSafe().then(account => {
      wx.request({
        url: friendServer + "/MiniFriend/data/addFriend.action",
        data: {
          gameId: gameid,
          openId1: friendOpenId,
          unionId1: "",
          openId2: account.openid,
          unionId2: account.unionid,
        },
        success: (res) => {
          if (showlog) console.log('mpsdk', '加好友结果', res.data);
        }
      })
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，加好友失败');
    });
  }

  report.friendBind = friendBind;

  /**
   * 获取好友列表/好友排行
   * @param dataKey string 排行数据名
   * @param callBack object 回调函数
   * @param callBack object 回调作用域
   */
  function friendList(dataKey, callBack, thisObject) {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::friendList->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      wx.request({
        url: friendServer + "/MiniFriend/data/getFriend.action",
        data: {
          gameId: gameid,
          openId: account.openid,
          unionId: account.unionid,
          dataKey: dataKey,
        },
        success: (res) => {
          if (showlog) console.log('mpsdk', '获取好友列表结果', res);
          callBack && callBack.call(thisObject, res.data);
        }
      })
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，获取好友列表失败');
    });
  }

  report.friendList = friendList;

  /**
   * 获取世界排行
   * @param dataKey string 排行数据名
   * @param callBack object 回调函数
   * @param callBack object 回调作用域
   */
  function rankList(dataKey, callBack, thisObject) {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::rankList->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      wx.request({
        url: friendServer + "/MiniFriend/data/getWorld.action",
        data: {
          gameId: gameid,
          openId: account.openid,
          unionId: account.unionid,
          dataKey: dataKey,
        },
        success: (res) => {
          if (showlog) console.log('mpsdk', '获取世界排行结果', res);
          callBack && callBack.call(thisObject, res.data);
        }
      })
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，获取世界排行失败');
    });
  }

  report.rankList = rankList;

  /**
   * 获取世界排行历史数据/上期排行数据
   * @param dataKey string 排行数据名
   * @param callBack object 回调函数
   * @param callBack object 回调作用域
   */
  function rankListHistory(dataKey, callBack, thisObject) {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::rankListHistory->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      wx.request({
        url: friendServer + "/MiniFriend/data/getRank.action",
        data: {
          gameId: gameid,
          openId: account.openid,
          unionId: account.unionid,
          dataKey: dataKey,
        },
        success: (res) => {
          if (showlog) console.log('mpsdk', '获取上期排行结果', res);
          callBack && callBack.call(thisObject, res.data);
        }
      })
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，获取上期排行失败');
    });
  }

  report.rankListHistory = rankListHistory;

  /**
   * 参与抽奖
   * @param condition1 string 抽奖条件1，>=此数值的账号可以抽奖
   * @param condition2 string 抽奖条件2，<=此数值的账号可以抽奖
   * @param params string 附加参数（在获取中奖结果时可返回该值，主要用于外观设置，如用户头像、昵称等；仅支持string，复杂数据用JSON.stringify序列化）
   */
  function joinLottery(condition1, condition2, params) {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::joinLottery->未找到微信运行环境");
      return;
    }
    if (!condition1 || !condition2) {
      return;
    }
    this.getAccountSafe().then(account => {
      wx.request({
        url: friendServer + "/MiniFriend/data/setAccount.action",
        data: {
          gameId: gameid,
          openId: account.openid,
          unionId: account.unionid,
          show: params,
          parameter1: condition1,
          parameter2: condition2
        },
        success: (res) => {
          if (showlog) console.log('mpsdk', '参与抽奖结果', res);
        }
      })
    }).catch(() => {
      if (showlog) console.log('mpsdk', 'openid超时未就绪，参与抽奖失败');
    });
  }

  report.joinLottery = joinLottery;

  /**
   * 点击推荐,广告等跳转到其他应用时调用
   * @param  {any} recommend_aid 在获取的recommendInfo中的aid
   * @param  {any} recommend_adid 在获取的recommendInfo中的adid
   */
  function linkEvent(recommend_aid, recommend_adid) {
    if (typeof (wx) == "undefined") {
      if (showlog) console.log("reprot::linkEvent->未找到微信运行环境");
      return;
    }
    this.getAccountSafe().then(account => {
      wx.request({
        url: reportServer2 + '/MiniGameLog/log/linkEvent.action',
        data: {
          gameid: gameid,
          userid: account.openid,
          link_to_game_id: recommend_aid,
          link_ad_id: recommend_adid,
          param1: _advType
        },
        success: (res) => {
          if (showlog) console.log("mpsdk", "点击推荐信息跳转上报成功,type:" + _advType + " adid:" + recommend_adid + " aid:" + recommend_aid);
        }
      });
    }).catch(() => {
      if (showlog) console.log('mpsdk', '上报广告点击日志失败');
    });
  }

  report.linkEvent = linkEvent;
  ////////////////////////////////////////
  //过时的方法，暂时保留一段时间
  ////////////////////////////////////////

  /**
   * 从缓存获取用户ID
   * @辅助函数
  * @deprecated 请使用getAccount
   */
  function getUserId() {
    if (getAccount().openid) {
      return getAccount().openid
    }
    else if (getAccount().unionid) {
      return getAccount().unionid;
    }
    return "";
  }

  report.getUserId = getUserId;

  /**
   * 检查账户ID是不是openid
   */
  function checkOpenId() {
    if (getAccount().openid) {
      return true;
    }
    return false;
  }

  report.checkOpenId = checkOpenId;


})(report || (report = {}));