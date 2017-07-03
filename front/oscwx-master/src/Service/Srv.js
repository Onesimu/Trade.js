import {
	LinkMarket, //连接行情服务器
	setMarketState, //设置行情连接状态,
	LinkUser, //链接到交易服务器
	setUserState, //设置交易链接状态
	setMarkData, //从srv端返回热门合约
	updateMark, //更新热门合约的数据
	getLoginInfo, //接收登录信息
	setUserMoney, // 返回用户资金状况
	getUserPwd, //返回修改密码结果
	getTradingHistory, //返回交易记录
	getMoneyInHistory, //返回入金流水
	getMyHold, //客户持仓
	getOpenOrder, //客户开仓返回的信息
	getPingCang, //平仓返回的信息
	getWinLoss, //修改止盈价格返回的信息
	getRate, //接收汇率
	getMoneyTrans, //接收资金划转返回信息,
	getRegistUser, // 接收开户返回的信息
	getMarketFengKong //风控持仓保证金信息获取
} from "vuex/actions";
//import { md5 } from 'vux'

export class Srv {
	constructor(ws, store) {
		this.ws = ws;
		this.store = store; //vuex
		this.repeat = 3; //连接失败后重复连接三次
		this.startTime = Date.parse(new Date());
		this.num = 0;
		this.oldData = []; //因为行情数据太大，只让产生变化的数据走vue
		this.key = "yishenglong123";
		this.TradingHistoryStr = "";
		this.myHoldStr = "";
		this.moneyInHistoryStr = '';
	}
	//连接服务器
	init() {
		this.socket = new ReconnectingWebSocket(this.ws);
		this.socket.maxReconnectAttempts = this.repeat;
		//		this.socket = new WebSocket(this.ws);
		this.state();
	}
	state() {
		var _this = this;
		this.socket.onopen = function(evt) {
			//          this.repeat = 3;
			//          if(evt.currentTarget.url.indexOf("8550") >= 0){
			//              setMarketState(_this.store,true);
			//              _this.getMarketData(_this.store.state.userInfo.account);
			//          }
			//          if(evt.currentTarget.url.indexOf("8540") >= 0){
			//              setUserState(_this.store,true);
			//          }
			this.repeat = 3;
			//				this.url.indexOf("market") >= 0 && ((0, setMarketState)(_this.store, true),
			//				_this.getMarketData(_this.store.state.userInfo.account)),
			//				this.url.indexOf("data") >= 0 && (0, setUserState)(_this.store, true)
			//行情
			if(this.url.indexOf("market") >= 0) {
				setMarketState(_this.store, true);
				_this.getMarketData(_this.store.state.userInfo.account);
			}
			//交易
			if(this.url.indexOf("data") >= 0) {
				setUserState(_this.store, true);
			}

		};
		this.socket.onerror = function(evt) {

		};
		this.socket.onclose = function(evt) {
			//行情
			if(this.url.indexOf("market") >= 0) {
				setMarketState(_this.store, true);
			}
			//交易
			if(this.url.indexOf("data") >= 0) {
				setUserState(_this.store, true);
			}
			if(_this.repeat >= 0) {
				//				_this.repeat--;
				//				_this.init();
			}
		};
		this.socket.onmessage = function(evt) {
			var arr = evt.data.split("/");
			var typeNum = arr[0].substr(4);
			switch(typeNum) {
				//登录用户名密码校验接口
				case "01":
					getLoginInfo(_this.store, {
						state: arr[33],
						nick: arr[43]
					});
					break;
				case "03":
					_this.myHoldStr += arr[5];
					if(arr[17] == "END") {
						getMyHold(_this.store, _this.myHoldStr, parseInt(arr[16]));
						_this.myHoldStr = "";
					}
					break;
					//成交明细查询
				case "05":
					_this.TradingHistoryStr += arr[8];
					if(arr[17] == "END") {
						getTradingHistory(_this.store, _this.TradingHistoryStr, parseInt(arr[16]));
						_this.TradingHistoryStr = "";
					}
					break;
					//获取账户资金信息
				case "06":
					setUserMoney(_this.store, arr[7]);
					break;
					//普通汇率
				case "07":
					getRate(_this.store, arr[9]);
					break;
					//接收返回的入金流水
				case '08':
					_this.moneyInHistoryStr += arr[8];
					if(arr[17] === 'END') {
						getMoneyInHistory(_this.store, _this.moneyInHistoryStr, parseInt(arr[16]));
						_this.moneyInHistoryStr = '';
					}
					//风控持仓保证金信息获取
				case "10":
					getMarketFengKong(_this.store, arr[9]);
					break;
					//机构汇率
				case "11":
					getRate(_this.store, arr[9], false);
					break;
				case "13":
					getRegistUser(_this.store, {
						'newAccount': arr[55],
						'status': arr[33],
						'msg': arr[34]
					});
					break;
					//开仓返回的数据
				case "20":
					getOpenOrder(_this.store, {
						code: arr[3], //合约代码
						id: arr[6], //持仓编号
						price: arr[26], //成交价格
						poundage: arr[27], //手续费
						state: arr[33], //返回结果，00 为成功
						msg: arr[34], //返回中文描述
					});
					break;
					//平仓返回
				case "21":
					getPingCang(_this.store, {
						code: arr[3], //合约代码
						id: arr[6], //持仓编号
						num: arr[20], //平仓数量
						price: arr[26], //平仓成交价格
						poundage: arr[27], //手续费
						winLoss: arr[31], //盈亏
						state: arr[33], //返回结果，00 为成功
						msg: arr[34], //返回中文描述
					});
					break;
					//止损返回
				case "22":
					getWinLoss(_this.store, {
						code: arr[3], //合约代码
						lossPri: arr[21], //止损价
						winPri: arr[22], //止盈价
						state: arr[33], //返回结果，00 为成功
						msg: arr[34], //返回中文描述
					});
					break;
				case "23":
					var cn = arr[33] == "00" ? "修改成功" : "修改失败";
					getUserPwd(_this.store, {
						account: arr[1],
						stateNo: arr[33],
						toastTxt: cn,
						isShowToast: true
					});
					break;
					//客户行情信息查询
				case "30":
					setMarkData(_this.store, arr[3]);
					break;
					//行情推送接口
				case "31":

					if(!_this.oldData[arr[3]]) {
						_this.oldData[arr[3]] = 0;
					}
					if(_this.oldData[arr[3]] != arr[10]) {
						_this.oldData[arr[3]] = arr[10];

						updateMark(_this.store, {
							code: arr[3],
							cn: arr[4],
							newPrice: parseFloat(arr[10]),
							upDown: parseFloat(arr[11]),
							cur: arr[32],
							buyOnePri: parseFloat(arr[12]),
							saleOnePri: parseFloat(arr[13]),
							markePri: parseFloat(arr[14]),
							time: arr[15]
						});
					}
					break;
					//划转资金
				case "50":
					getMoneyTrans(_this.store, {
						state: arr[33],
						msg: arr[34]
					});
					break;
			}
		}
	}
	createData() {
		var data = new Array(56);
		data[41] = "phone";
		return data;
	}
	sendMsg(data) {
		var str = data.join("/");
		//console.info("待加密字符串>>"+(str+this.key))
		var md5_str = md5(str + this.key);
		str = str + md5_str;
		var len = str.length;
		var temp = Array(4 - ('' + len).length + 1).join(0) + len;
		var start = temp + str;
		//var end = md5(start+this.key);
		//console.info("拼接结尾加密>>"+str);
		//console.info("长度>>"+temp);
		//console.info("加密结果>>"+start);
		//console.info(end);
		return start;
	}

	//获取行情数据
	getMarketData(account) {
		var data = this.createData();
		data[0] = "30";
		if(account != undefined) {
			data[1] = account;
		}
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//风控持仓保证金信息获取
	setMarketFengKong(account) {
		var data = this.createData();
		data[0] = "10";
		if(account != undefined) {
			data[1] = account;
		}
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	/*******************************************************/
	/*
	 *  个人服务
	 * */
	/*******************************************************/
	//个人登录
	loginUser(account, pwd) {
		var data = this.createData();
		data[0] = "01";
		data[1] = account;
		data[2] = md5(pwd);
		// if(__SiteTitle__ == '弈生隆交易系统'){
		//    data[56] = '001';
		// }else if(__SiteTitle__ == '期盈外盘交易系统'){
		//     data[56] = '002';
		// }
		data[56] = '001';
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//账户资金获取
	getUserMoney(account) {
		var data = this.createData();
		data[0] = "06";
		data[1] = account;
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//重设密码
	setUserPwd(account, oldPwd, newPwd) {
		var data = this.createData();
		data[0] = "23";
		data[1] = account;
		data[25] = md5(oldPwd);
		data[29] = newPwd;
		data[30] = md5(newPwd);
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//交易记录
	setTradingHistory(account, start, end) {
		var data = this.createData();
		data[0] = "05";
		data[1] = account;
		data[35] = start;
		data[36] = end;
		data[44] = this.num++;
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//请求入金流水
	setMoneyInHistory(account, start, end) {
		var data = this.createData();
		data[0] = '08';
		data[1] = account;
		data[35] = start;
		data[36] = end;
		data[44] = this.num++;
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//我的持仓
	setMyHold(account) {
		var data = this.createData();
		data[0] = "03";
		data[1] = account;
		data[44] = this.num++;
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//开仓
	setOpenOrder(obj) {
		var data = this.createData();
		data[0] = "20";
		data[1] = obj.account;
		data[3] = obj.name;
		data[19] = obj.type;
		data[20] = obj.buyNum;
		data[21] = obj.lowPrice;
		data[22] = obj.winPrice;
		data[23] = obj.ymd;
		data[24] = obj.hms;
		data[42] = "01";
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//平仓
	setPingCangOrder(obj) {
		var data = this.createData();
		data[0] = "21";
		data[1] = obj.account;
		data[3] = obj.code;
		data[6] = obj.id;
		data[19] = obj.dir;
		data[20] = obj.num;
		data[23] = obj.ymd;
		data[24] = obj.hms;
		data[42] = "02";

		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//修改损赢
	setWinLoss(obj) {
		var data = this.createData();
		data[0] = "22";
		data[1] = obj.account;
		data[3] = obj.code;
		data[6] = obj.id;
		data[21] = obj.lossPri;
		data[22] = obj.winPri;
		data[23] = obj.ymd;
		data[24] = obj.hms;
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//机构汇率信息获取
	setRate(account, isNormal) {
		var data = this.createData();
		data[0] = isNormal == true ? '07' : '11';
		data[1] = account;
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//划转资金
	setMoneyTrans(obj) {
		var data = this.createData();
		data[0] = '50';
		data[1] = obj.account;
		data[37] = obj.dir;
		data[38] = obj.price;
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//开户申请
	setRegistUser(obj) {
		var data = this.createData();
		data[0] = '13';
		data[1] = '66666';
		data[50] = obj.name;
		data[51] = obj.blankName;
		data[52] = obj.blankNum;
		data[53] = obj.tel;
		data[54] = obj.tuijianNum;
		var str = this.sendMsg(data);
		this.socket.send(str);
	}
	//断开
	close() {
		this.socket.close();
	}
}