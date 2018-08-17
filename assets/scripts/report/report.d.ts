declare namespace report {


  /**
   * 关闭log打印
   */
  function stoplog();
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
  function autoInit(gameId: number, gamePath: string, options: any, callback?: Function, thisObject?: any);

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
  function init(gameId: number, gamePath: string, code: string, options: any, callback?: Function, thisObject?: any);

  /**
   * 初始化，适用于已经获得openId的情况
   * @调用时机 游戏获取到openid的时候
   * @param gameId int 平台分配的gameid
   * @param gamePath string 平台分配的游戏配置地址
   * @param account any {"openid": "***","unionid": "***"}
   * @param options object 启动参数
   * autoInit,init,initWithAccount 三个方法三选一
   */
  function initWithAccount(gameId: number, gamePath: string, account: any, options: any);

  /**
   * 获取用户帐号数据
   * @return object 用户帐号对象{"openid":"","unionid":""}
   */
  function getAccount();

  /**
   * 生成分享链接
   * @辅助函数
   * @param serial int 分享点序号
   * @param query string 其他自定义参数，如a=b&c=d，不要加问号
   * @param shareInfoId int 如果分享信息是通过getShareInfo()取得，则需要传入获取的分享信息ID
   */
  function getShareLink(serial: number, query?: string, shareInfoId?: string)

  /**
   * 获取分享参数
   * @param  {Function} callback 返回推荐数据,加载推荐配置失败则返回null
   * @param  {Function} thisObject callback的作用域
   * @param  {boolean}  sigle 是否只取一个,默认为true,false返回推荐列表信息
   * @param  {string}   nickname 当前用户昵称，可以传空
   */
  function getShareInfo(callback: Function, thisObject: any, sigle?: boolean, nickname?: string): void;

  /**
   * 获取推荐icon跳转二维码等信息
   * @param  {Function} callback 返回推荐数据,加载推荐配置失败则返回null
   * @param  {Function} thisObject callback的作用域
   * @param  {boolean}  sigle 是否只取一个,默认为true,false返回推荐列表信息
   */
  function getRecommendInfo(callback: Function, thisObject: any, sigle?: boolean): void;

  /**
   * 上报用户信息
   * @调用时机 获取到用户昵称、头像后
   * @param userInfo object 户信息对象
   */
  function setAccountInfo(userInfo: any);

  /**
   * 上报登陆日志
   * @调用时机 App.onShow
   * @param gold int 当前金币余额
   * @param level int 当前最大关卡进度
   * @param leveltype int 关卡类型，如果一个小程序内有多个子项的话可以指明关卡进度属主ID，没有就不填
   * 属主ID：比如成语猜猜看当中包含【看图猜成语】和【成语接龙】两个游戏，那么可以依次编号为1和2，
   */
  function reportLogin(gold?: number, level?: number, leveltype?: number): void;

  /**
   * 上报金币变化日志
   * @调用时机 金币发生变化
   * @param changeGold int 变动数量（减少时为负数）
   * @param newGold int 变化后的数量
   * @param param1 string 变化原因描述
   * @param reason int 变化原因码
   */
  function reportGold(changeGold: number, newGold: number, param1: string, reason: number): void;

  /**
   * 上报事件日志
   * @调用时机 预定事件发生
   * @param eventId int 事件ID
   * @param param1 string 事件参数1
   * @param param2 string 事件参数2
   */
  function reportEvent(eventId: number, param1?: string, param2?: string): void;

  /**
   * 上报分享日志
   * 分享链接统一格式：/pages/index/index?type=share&shareid=share_${gameid}_${序号}&userid=getUserId()
   * @调用时机 分享成功或点击分享按钮时
   * @param serial int 分享点序号
   * @param param1 string 扩展参数
   * @param shareInfoId int 如果分享信息是通过getShareInfo()取得，则需要传入获取的分享信息ID
   * @param shareTicket string 分享到群时传shareTicket，分享到个人时传空
   */
  function reportShareOut(serial: number, param1?: string, shareInfoId?: string, shareTicket?: string): void;

  /**
   * 上传排行榜数据
   * @param datakey string 排行数据名（可以支持多种排行）
   * @param value string 排行数据值
   * @param params string 附加参数（在获取排行列表时可返回该值，主要用于外观设置，如用户头像、昵称等；仅支持string，复杂数据用JSON.stringify序列化）
   */
  function rankUpload(datakey: string, value: string, params: string): void;

  /**
   * 添加好友/绑定好友关系
   * @param friendOpenId string 对方的openid
   */
  function friendBind(friendOpenId: string): void;

  /**
   * 获取好友列表/好友排行
   * @param dataKey string 排行数据名
   * @param callBack object 回调函数
   * @param callBack object 回调作用域
   */
  function friendList(dataKey: string, callBack: Function, thisObject: any): void;

  /**
   * 获取世界排行
   * @param dataKey string 排行数据名
   * @param callBack object 回调函数
   * @param callBack object 回调作用域
   */
  function rankList(dataKey: string, callBack: Function, thisObject: any): void;

  /**
   * 获取世界排行历史数据/上期排行数据
   * @param dataKey string 排行数据名
   * @param callBack object 回调函数
   * @param callBack object 回调作用域
   */
  function rankListHistory(dataKey: string, callBack: Function, thisObject: any): void;

  /**
   * 参与抽奖
   * @param condition1 string 抽奖条件1，>=此数值的账号可以抽奖
   * @param condition2 string 抽奖条件2，<=此数值的账号可以抽奖
   * @param params string 附加参数（在获取中奖结果时可返回该值，主要用于外观设置，如用户头像、昵称等；仅支持string，复杂数据用JSON.stringify序列化）
   */
  function joinLottery(condition1: string, condition2: string, params: string): void;

  /**
   * 点击推荐,广告等跳转到其他应用时调用
   * @param  {number} recommend_aid 在获取的recommendInfo中的aid
   * @param  {number} recommend_adid 在获取的recommendInfo中的adid
   */
  function linkEvent(recommend_aid:number,recommend_adid:number):void;

  ////////////////////////////////////////////////////////////
  ////以下是过时方法,为了兼容性暂且保留一段时间
  ///////////////////////////////////////////////////////////
  /**
   * 从缓存获取用户ID
   * @辅助函数
   * @deprecated 请使用getAccount替代
   */
  function getUserId(): string;

  /**
   * 检查账户ID是不是openid
   */
  function checkOpenId(): boolean

}