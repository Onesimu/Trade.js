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

export class TradeSrv {
	constructor(store) {
		this.store = store; //vuex
		this.repeat = 3; //连接失败后重复连接三次
		this.startTime = Date.parse(new Date());
		this.num = 0;
		this.key = "yishenglong123";
		this.TradingHistoryStr = "";
		this.myHoldStr = "";
		this.moneyInHistoryStr = '';
	}

	createData() {
		var data = new Array(56);
		data[41] = "phone";
		return data;
	}
	sendMsg(data) {
		var str = data.join("/");
		var len = str.length + 32;
		var temp = Array(4 - ('' + len).length + 1).join(0) + len;
		//var start = temp + str;
		var end = md5(str + this.key);
		let newStr = temp + str + end;
		return newStr;
	}

	//用户登录
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
		//      this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {
			var arr = data.split("/");
			var typeNum = arr[0].substr(4);
			if(typeNum = '01') {
				getLoginInfo(this.store, {
					state: arr[33],
					nick: arr[43],
					msg: arr[34]
				});
			}
		});
	}

	//获取行情数据
	getMarketData(account) {
		var data = this.createData();
		data[0] = "30";
		if(account != undefined) {
			data[1] = account;
		}
		var str = this.sendMsg(data);
		//		this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {
			var arr = data.split("/");
			var typeNum = arr[0].substr(4);
			if(typeNum = '30') {
				setMarkData(this.store, arr[3]);
			}
		});
	}
	//我的持仓
	setMyHold(account) {
		var data = this.createData();
		data[0] = "03";
		data[1] = account;
		data[44] = this.num++;
		var str = this.sendMsg(data);
		//		this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {

			let msgs = data.split('~');
			//			msgs.pop();
			for(let i in msgs) {
				let eachMsg = msgs[i].split('/');
				let typeNum = eachMsg[0].substr(4);
				if(typeNum == '03' && eachMsg[33] == '00') {
					this.myHoldStr += eachMsg[5];
					if(eachMsg[17] == "END" || i == msgs.length - 1) {
						getMyHold(this.store, this.myHoldStr, eachMsg[16] ? parseInt(eachMsg[16]) : msgs.length);
						this.myHoldStr = "";
					}
				}
			}

			//			var arr = data.split("/");
			//			var typeNum = arr[0].substr(4);
			//			if(typeNum = '03') {
			//				this.myHoldStr += arr[5];
			//				if(arr[17] == "END") {
			//					getMyHold(this.store, this.myHoldStr, parseInt(arr[16]));
			//					this.myHoldStr = "";
			//				}
			//			}

		});
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
		//this.socket.send(str);
		$.post(getContextHost() + "/app/service/trade", {
			val: str
		}, (data) => {
			var arr = data.split("/");
			var typeNum = arr[0].substr(4);
			if(typeNum = '20') {
				getOpenOrder(this.store, {
					code: arr[3], //合约代码
					id: arr[6], //持仓编号
					price: arr[26], //成交价格
					poundage: arr[27], //手续费
					state: arr[33], //返回结果，00 为成功
					msg: arr[34], //返回中文描述
				});
			}
		});
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
		//		this.socket.send(str);
		$.post(getContextHost() + "/app/service/trade", {
			val: str
		}, (data) => {
			var arr = data.split("/");
			var typeNum = arr[0].substr(4);
			if(typeNum = '21') {
				getPingCang(this.store, {
					code: arr[3], //合约代码
					id: arr[6], //持仓编号
					num: arr[20], //平仓数量
					price: arr[26], //平仓成交价格
					poundage: arr[27], //手续费
					winLoss: arr[31], //盈亏
					state: arr[33], //返回结果，00 为成功
					msg: arr[34], //返回中文描述
				});
			}
		});
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
		//		this.socket.send(str);
		$.post(getContextHost() + "/app/service/trade", {
			val: str
		}, (data) => {
			var arr = data.split("/");
			var typeNum = arr[0].substr(4);
			if(typeNum = '22') {
				getWinLoss(this.store, {
					code: arr[3], //合约代码
					lossPri: arr[21], //止损价
					winPri: arr[22], //止盈价
					state: arr[33], //返回结果，00 为成功
					msg: arr[34], //返回中文描述
				});
			}
		});
	}

	//账户资金获取
	getUserMoney(account) {
		var data = this.createData();
		data[0] = "06";
		data[1] = account;
		var str = this.sendMsg(data);
		//		this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {
			var arr = data.split("/");
			var typeNum = arr[0].substr(4);
			if(typeNum = '06') {
				setUserMoney(this.store, arr[7]);
			}
		});
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
		//		this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {
			var arr = data.split("/");
			var typeNum = arr[0].substr(4);
			if(typeNum = '23') {
				var cn = arr[33] == "00" ? "修改成功" : "修改失败";
				getUserPwd(this.store, {
					account: arr[1],
					stateNo: arr[33],
					toastTxt: cn,
					isShowToast: true
				});
			}
		});
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
		//		this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {
			let msgs = data.split('~');
			//			msgs.pop();
			for(let i in msgs) {
				let eachMsg = msgs[i].split('/');
				let typeNum = eachMsg[0].substr(4);
				if(typeNum == '05' && eachMsg[33] == '00') {
					this.TradingHistoryStr += eachMsg[8];
					if(eachMsg[17] == "END" || i == msgs.length - 1) {
						getTradingHistory(this.store, this.TradingHistoryStr, eachMsg[16] ? parseInt(eachMsg[16]) : msgs.length);
						this.TradingHistoryStr = "";
					}
				}
			}
			//			if(i == msgs.length - 1) {
			//				getTradingHistory(this.store, this.TradingHistoryStr, msgs.length);
			//				this.TradingHistoryStr = "";
			//			}

			//			var arr = data.split("/");
			//			var typeNum = arr[0].substr(4);
			//			if(typeNum == '05') {
			//				this.TradingHistoryStr += arr[8];
			//				if(arr[17] == "END") {
			//					getTradingHistory(this.store, this.TradingHistoryStr, parseInt(arr[16]));
			//					this.TradingHistoryStr = "";
			//				}
			//			}
		});
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
		//		this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {
			let msgs = data.split('~');
			//			msgs.pop();
			for(let i in msgs) {
				let eachMsg = msgs[i].split('/');
				let typeNum = eachMsg[0].substr(4);
				if(typeNum == '08' && eachMsg[33] == '00') {
					this.moneyInHistoryStr += eachMsg[8];
					if(eachMsg[17] == "END" || i == msgs.length - 1) {
						getMoneyInHistory(this.store, this.moneyInHistoryStr, eachMsg[16] ? parseInt(eachMsg[16]) : msgs.length);
						this.moneyInHistoryStr = "";
					}
				}
			}

			//			var arr = data.split("/");
			//			var typeNum = arr[0].substr(4);
			//			if(typeNum = '08') {
			//				this.moneyInHistoryStr += arr[8];
			//				if(arr[17] === 'END') {
			//					getMoneyInHistory(this.store, this.moneyInHistoryStr, parseInt(arr[16]));
			//					this.moneyInHistoryStr = '';
			//				}
			//			}
		});
	}

	//风控持仓保证金信息获取
	setMarketFengKong(account) {
		var data = this.createData();
		data[0] = "10";
		if(account != undefined) {
			data[1] = account;
		}
		var str = this.sendMsg(data);
		//      this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {
			let msgs = data.split('~');
			let fengKongStr = '';
			for(let i in msgs) {
				let eachMsg = msgs[i].split('/');
				let typeNum = eachMsg[0].substr(4);
				if(typeNum == '10' && eachMsg[33] == '00') {
					fengKongStr += eachMsg[9];
					if(eachMsg[17] == "END" || i == msgs.length - 1) {
						let num = eachMsg[16] ? parseInt(eachMsg[16]) : msgs.length;
						if(num > 0) {
							getMarketFengKong(this.store, fengKongStr);
						}
					}
				}
			}

			//			var arr = data.split("/");
			//			var typeNum = arr[0].substr(4);
			//			if(typeNum = '10') {
			//				getMarketFengKong(this.store, arr[9]);
			//			}
		});
	}

	//汇率信息获取
	setRate(account, isNormal) {
		var data = this.createData();
		data[0] = isNormal == true ? '07' : '11';
		data[1] = account;
		var str = this.sendMsg(data);
		//      this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {
			var arr = data.split("/");
			var typeNum = arr[0].substr(4);
			if(typeNum = '07') {
				getRate(this.store, arr[9]);
			} else if(typeNum = '11') {
				getRate(this.store, arr[9], false);
			}
		});
	}

	//划转资金
	setMoneyTrans(obj) {
		var data = this.createData();
		data[0] = '50';
		data[1] = obj.account;
		data[37] = obj.dir;
		data[38] = obj.price;
		var str = this.sendMsg(data);
		//      this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {
			var arr = data.split("/");
			var typeNum = arr[0].substr(4);
			if(typeNum = '50') {
				getMoneyTrans(this.store, {
					state: arr[33],
					msg: arr[34]
				});
			}
		});
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
		//		this.socket.send(str);
		$.post(getContextHost() + "/app/service/info", {
			val: str
		}, (data) => {
			var arr = data.split("/");
			var typeNum = arr[0].substr(4);
			if(typeNum = '13') {
				getRegistUser(this.store, {
					'newAccount': arr[55],
					'status': arr[33],
					'msg': arr[34]
				});
			}
		});
	}
}