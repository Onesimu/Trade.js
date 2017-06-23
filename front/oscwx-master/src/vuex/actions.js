/**
 * Created by kaiser on 2016/9/11.
 */
import * as Types from "./types"
import { Srv } from "../Service/Srv"
import { TradeSrv } from "../Service/TradeSrv"

//登录按钮事件
var Account = "";
var Pwd = "";
export const setHeadMsg = ({
	dispatch
}, obj) => {
	dispatch(Types.SetHeadMsg, obj);
};
//获取全部交易
export const getAllTrading = ({
	dispatch
}) => {
	//获取交易信息
	//var obj = new Object();
	dispatch(Types.GetAllTrading, {});
}
// 设置用户信息
export const setUserInfo = ({
	dispatch
}, obj) => {
	dispatch(Types.SetUserInfo, obj);
}

var martSrv = null;
var userSrv = null;
//链接行情socket
export const LinkMarket = (store) => {
	// 测试
	//martSrv = new Srv("ws://139.196.8.49:8550",store);
	//生产
	//martSrv = new Srv("ws://139.196.218.86:8550",store);
	martSrv = new Srv("ws://" + getContextHostW() + "/app/market", store);
	martSrv.init(); //连接
}

//设置行情服务连接情况
export const setMarketState = ({
	dispatch
}, val) => {
	dispatch(Types.MarketState, val);
}
//接收热门合约
export const setMarkData = ({
	dispatch
}, str) => {
	str = str.substring(0, str.length - 1);
	var arrData = str.split("|");
	var data = {};
	var arr = [];
	for(var j = 0; j < arrData.length; j++) {
		var rowArr = arrData[j].split("-");
		var rowObj = {};
		//合约代码-合约中文-币种-最大交易手数-最小波动单位-一个波动点的价值-开仓保证金-持仓保证金
		//合约代码-合约中文-币种-最大交易手数-最小波动单位-一个波动点的价值-开仓保证金-持仓保证金|当前价|买一价|卖一价|
		//for(var i = 0;i<rowArr.length;i++){
		rowObj.code = rowArr[0]; //合约代码
		rowObj.cn = rowArr[1]; //合约中文
		rowObj.cur = rowArr[2]; //币种
		rowObj.maxTrans = rowArr[3]; //最大交易手数
		rowObj.oneCost = rowArr[4]; //一个波动点的价值
		rowObj.minUnit = parseFloat(rowArr[5]); //最小波动单位
		rowObj.openCash = rowArr[6]; //开仓保证金
		rowObj.holdCash = parseFloat(rowArr[7]); //持仓保证金
		rowObj.newPrice = rowArr[8] == "" ? "none" : parseFloat(rowArr[8]); //最新价格，以分为单位
		rowObj.upDown = "no"; //涨跌，以分为单位
		rowObj.buyOnePri = parseFloat(rowArr[9]); //买一价
		rowObj.saleOnePri = parseFloat(rowArr[10]); //卖一价
		rowObj.markePri = ""; //市价
		rowObj.time = ""; //时间
		//}
		arr.push(rowObj);
	}
	arr.sort(function(a, b) {
		//“CNY”->“USD”->“HKD”->“EUR”
		var t = {
			"CNY": 0,
			"USD": 1,
			"HKD": 2,
			"EUR": 3
		};
		return t[a.cur] - t[b.cur]
	});

	for(var i = 0; i < arr.length; i++) {
		data[arr[i].code] = arr[i];
	}
	dispatch(Types.HotContract, data);
}
//更新热门合约
export const updateMark = ({
	dispatch
}, obj) => {
	dispatch(Types.UpdateMark, obj);
}
//链接个人服务
export const LinkUser = (store) => {
	//测试
	//userSrv = new Srv("ws://139.196.8.49:8540",store);
	// 生产
	//userSrv = new Srv("ws://139.196.218.86:8540",store);
	userSrv = new Srv("ws://" + getContextHostW() + "/app/data", store);
	userSrv.init(); //连接
}
//设置链接个人服务是否登录上
export const setUserState = ({
	dispatch
}, val) => {
	dispatch(Types.UserState, val);
}
let loginCnt = 0;
//用户登录
export const LoginEvent = ({
	dispatch
}, {
	account,
	pwd
}) => {
	Account = account;
	Pwd = pwd;
	//	userSrv.loginUser(account, pwd);
	tradeSrv.loginUser(account, pwd);

}
//登录状态信息
export const LoginState = ({
	dispatch
}, obj) => {
	dispatch(Types.LoginState, obj);
}
//退出登录
export const logoutEvent = ({
	dispatch
}) => {
	dispatch(Types.SetUserInfo, {
		isLogin: false,
		account: "",
		password: 　 "",
		nick: ""
	});
	dispatch(Types.SetHeadMsg, {
		Rtitle: "登录", //右侧的登录
		RshowRegist: true //注册显示
	});
	dispatch(Types.LoginState, {
		isDisabledLoginBtn: false,
		loginCnt: 0
	});
	window.location.hash = "/default";
}
//接收到登录信息
export const getLoginInfo = (store, obj) => {
	if(obj.state == "00") {
		store.dispatch(Types.SetUserInfo, {
			isLogin: true,
			nick: obj.nick,
			account: Account,
			password: Pwd
		});
		store.dispatch(Types.SetHeadMsg, {
			Rtitle: "退出", //右侧的登录
			RshowRegist: false //注册显示
		});
		//用户登录后重置热门合约
		//				martSrv.close();
		//				LinkMarket(store);
		//				store.dispatch(Types.clearHot, true);
		//提示：缓存到本地
		window.localStorage.account = Account;
		window.localStorage.nick = obj.nick;
		window.localStorage.pwd = Pwd;
		window.location.hash = "user";
		//获取风控信息
		//		userSrv.setMarketFengKong(Account);
		tradeSrv.setMarketFengKong(Account);
	} else {
		loginCnt++;
		store.dispatch(Types.LoginState, {
			isDisabledLoginBtn: false,
			isShowToast: true,
			//			toastTxt: "用户名或者密码错误"
			toastTxt: obj.msg,
			loginCnt: loginCnt
		});

	}
}

//请求风控持仓保证金信息数据
export const setMarketFengKong = ({
	dispatch
}, account) => {
	tradeSrv.setMarketFengKong(account);
}

//风控持仓保证金信息 接收
export const getMarketFengKong = (store, str) => {
	let cleanStr = str.substring(0, str.length - 1);
	let arrData = cleanStr.split(",");
	if(arrData.length == 0) {
		return;
	}

	let data = [];
	for(let j = 0; j < arrData.length; j++) {
		let rowArr = arrData[j].split("|");
		let rowObj = {};
		//合约代码|风控规则开始时间|风控规则结束时间|持仓保证金|开仓保证金
		rowObj.code = rowArr[0]; //合约代码
		rowObj.start = rowArr[1]; //start
		rowObj.end = rowArr[2]; //end
		rowObj.holdCash = parseFloat(rowArr[3]); //持仓保证金
		rowObj.openCash = parseFloat(rowArr[4]); //开仓保证金

		//		data[rowObj.code] = rowObj;
		data.push(rowObj);
	}

	data.sort(function(a, b) {
		if(b.code == a.code) {
			return a.start > b.start;
		}
		return b.code < a.code ? 1 : -1;
	});

	let tradeType = [];
	for(let item in data) {
		if(tradeType[data[item].code]) {
			tradeType[data[item].code].push(data[item]);
		} else {
			let timeList = [];
			timeList.push(data[item]);
			tradeType[data[item].code] = timeList;
		}
	}

	let fengKongInfo = {};
	for(let item in tradeType) {
		for(let timeItem = 0; timeItem < tradeType[item].length; timeItem++) {
			let nowTime = new Date().toTimeString().substring(0, 8);
			let startTime = tradeType[item][timeItem].start;
			let endTime = tradeType[item][timeItem].end;

			if((startTime > endTime && (nowTime >= startTime || nowTime <= endTime)) || ((startTime < endTime) && (nowTime > startTime && endTime > nowTime))) {

				if(fengKongInfo[tradeType[item][timeItem].code]) {

					let openCashMax = fengKongInfo[tradeType[item][timeItem].code].openCash;
					let openCashTmp = tradeType[item][timeItem].openCash;
					if(openCashMax < openCashTmp) {
						fengKongInfo[tradeType[item][timeItem].code].openCash = openCashTmp;
						fengKongInfo[tradeType[item][timeItem].code].openCashTime = tradeType[item][timeItem].start + '-' + tradeType[item][timeItem].end;
					}

					let holdCashMax = fengKongInfo[tradeType[item][timeItem].code].holdCash;
					let holdCashTmp = tradeType[item][timeItem].holdCash;
					if(holdCashMax < holdCashTmp) {
						fengKongInfo[tradeType[item][timeItem].code].holdCash = holdCashTmp;
						fengKongInfo[tradeType[item][timeItem].code].holdCashTime = tradeType[item][timeItem].start + '-' + tradeType[item][timeItem].end;
					}

				} else {
					fengKongInfo[tradeType[item][timeItem].code] = tradeType[item][timeItem];
				}

			}

		}
	}

	store.dispatch(Types.fengkongInfo, fengKongInfo);
};

//账户资金请求
export const getUserMoney = (state, account) => {
	//	userSrv.getUserMoney(account);
	tradeSrv.getUserMoney(account);
}
export const setUserMoney = ({
	dispatch
}, str) => {
	str = str.substring(0, str.length - 1);
	var arr = str.split("|");
	var res = [];
	for(var i = 0; i < arr.length; i++) {
		var temp = arr[i].split(",");
		var obj = new Object();
		obj.cur = temp[0];
		obj.val = parseFloat(temp[1]);
		if(obj.val.toString().indexOf(".") == -1) {
			obj.decimals = 0;
		} else {
			obj.decimals = obj.val.toString().split(".")[1].length;
		}
		res.push(obj);
	}
	dispatch(Types.UserMoney, res);
}
//重设密码请求
export const setUserPwd = ({
	dispatch
}, account, oldPwd, newPwd) => {
	//	userSrv.setUserPwd(account, oldPwd, newPwd);
	tradeSrv.setUserPwd(account, oldPwd, newPwd);
}
export const getUserPwd = ({
	dispatch
}, obj) => {
	dispatch(Types.resetPwd, obj);
}

//交易记录
export const setTradingHistory = ({
	dispatch
}, account, start, end) => {
	//	userSrv.setTradingHistory(account, start, end);
	tradeSrv.setTradingHistory(account, start, end);
}
//接收交易记录的数据
export const getTradingHistory = ({
	dispatch
}, str, num) => {
	//100000038906|COMEX GC 1612|3|1|1338.40|20160926135715|开仓|90.00|0.00|USD|,100000038904|COMEX GC 1612|2|1|1338.40|20160926135620|开仓|60.00|0.00|USD|,100000038902|COMEX GC 1612|1|1|1337.90|20160926134554|开仓|30.00|0.00|USD|,
	//持仓编号|合约类型|成交手数|成交类型|价格|时间|状态|手续费|盈亏|
	str = str.substring(0, str.length - 1);
	var arrData = str.split(",");
	var data = [];
	if(num > 0) {
		for(var j = 0; j < arrData.length; j++) {
			var rowArr = arrData[j].split("|");
			var rowObj = {};
			//for(var i = 0;i<rowArr.length;i++){
			rowObj.code = rowArr[0]; //持仓编号
			rowObj.tradName = rowArr[1]; //合约
			rowObj.tradNum = rowArr[2]; //成交手数
			rowObj.makeType = rowArr[3]; //成交类型
			rowObj.price = rowArr[4]; //价格
			rowObj.time = rowArr[5]; //时间
			rowObj.state = rowArr[6]; //状态
			rowObj.poundage = rowArr[7]; //手续费
			rowObj.upDown = rowArr[8]; //盈亏
			//}
			data.push(rowObj);
		}
	}
	data.sort((a, b) => b.code - a.code);
	dispatch(Types.TradingHistory, data);
}
//请求入金流水
export const setMoneyInHistory = ({
	dispatch
}, account, start, end) => {
	//	userSrv.setMoneyInHistory(account, start, end);
	tradeSrv.setMoneyInHistory(account, start, end);
}
//接收到入金流水
export const getMoneyInHistory = ({
	dispatch
}, str, num) => {
	str = str.substring(0, str.length - 1);
	let arrData = str.split(',');
	let data = [];
	if(num > 0) {
		for(let i = 0; i < arrData.length; i++) {
			let rowArr = arrData[i].split('|');
			let rowObj = {};
			rowObj.accountId = rowArr[0];
			rowObj.money = rowArr[1];
			rowObj.time = rowArr[2];
			rowObj.state = rowArr[3];
			rowObj.source = rowArr[4];
			data.push(rowObj);
		}
	}
	data.sort((a, b) => b.time - a.time);
	dispatch(Types.MoneyInHistory, data);
}
//请求客户持仓的数据
export const setMyHold = ({
	dispatch
}, account) => {
	//	userSrv.setMyHold(account);
	tradeSrv.setMyHold(account);
}
//接收客户持仓的数据
export const getMyHold = (state, str, num) => {
	//100002259631|COMEX GC 1612|1|1|1344.40|20160926211752|0.00|0.00|30.00|-20.00|USD|,100002259671|COMEX GC 1612|1|-1|1344.40|20160926211815|0.00|0.00|30.00|-60.00|USD|,
	//持仓ID|合约代码|持仓数量|买入方向|买入价格|成交时间|止损价|止盈价|手续费|盈亏|币种|”
	// str = "100002259631|COMEX GC 1612|1|1|1344.40|20160926211752|0.00|0.00|30.00|-20.00|USD|,100002259671|COMEX GC 1612|1|-1|1344.40|20160926211815|0.00|0.00|30.00|-60.00|USD|,";
	// num = 1;
	//024803/100001////100002268247|COMEX GC 1612|1|1|1303.00000|20161104225222|0.00000|0.00000|30.00|-130.00|USD|,100002268248|HKEX HSI 1611|1|1|22490.00000|20161104225310|0.00000|0.00000|200.00|-1100.00|HKD|,///////////2/END/2///////////////00///////////0/

	str = str.substring(0, str.length - 1);
	//	var hotContract = state.state.hotContract;
	var arrData = str.split(",");
	var data = [];
	if(num > 0) {
		for(var j = 0; j < arrData.length; j++) {
			var rowArr = arrData[j].split("|");
			var rowObj = {};
			//for(var i = 0;i<rowArr.length;i++){
			rowObj.id = rowArr[0]; //持仓ID
			rowObj.tradName = rowArr[1]; //合约
			rowObj.holdNum = rowArr[2]; //持仓数量
			rowObj.direction = rowArr[3]; //买入方向
			rowObj.price = parseFloat(rowArr[4]); //买入价格
			rowObj.time = rowArr[5]; //成交时间
			rowObj.lowPrice = parseFloat(rowArr[6]); //止损价
			rowObj.highPrice = parseFloat(rowArr[7]); //止盈价
			rowObj.poundage = rowArr[8]; //手续费
			rowObj.winLoss = rowArr[9]; //盈亏
			rowObj.cur = rowArr[10]; //币种
			//}
			data.push(rowObj);
		}
	}
	data.sort(function(a, b) {
		return b.id - a.id;
	});
	state.dispatch(Types.myHold, data);
}

let tradeSrv = null;
export const LinkTrade = (store) => {
	tradeSrv = new TradeSrv(store);
}

var openClick = false;
//请求开仓的数据
export const setOpenOrder = ({
	dispatch
}, obj) => {
	openClick = obj.isClick;
	//userSrv.setOpenOrder(obj);
	tradeSrv.setOpenOrder(obj);
}
//接收开仓的数据
export const getOpenOrder = (state, obj) => {
	obj.isShow = true && openClick;
	openClick = false;
	state.dispatch(Types.openOrder, obj);
	//请求下持仓数据
	if(obj.state === "00") {
		setMyHold(state, Account);
	}
}
//请求平仓的数据
var pcId = "";
export const setPingCang = ({
	dispatch
}, obj) => {
	pcId = obj.id;
	//	userSrv.setPingCangOrder(obj);
	tradeSrv.setPingCangOrder(obj);
}
//接收平仓的数据
export const getPingCang = (state, obj) => {
	//	obj.isShow = true && (pcId == obj.id);
	if(obj.state === "00" && pcId !== obj.id) {
		obj = {
			msg: "网络异常"
		};
		pcId = "";
	}
	obj.isShow = true;
	state.dispatch(Types.pcOrder, obj);
	//请求下持仓数据
	if(obj.state === "00" && pcId == obj.id) {
		setMyHold(state, Account);
	}
}
//请求修改止盈
export const setWinLoss = ({
	dispatch
}, obj) => {
	//	userSrv.setWinLoss(obj);
	tradeSrv.setWinLoss(obj);
}
//接收修改止盈
export const getWinLoss = ({
	dispatch
}, obj) => {
	obj.isShow = true;
	dispatch(Types.winLoss, obj);
}
//请求汇率信息获取
export const setRate = ({
	dispatch
}, account, isNormal = true) => {
	//	userSrv.setRate(account, isNormal);
	tradeSrv.setRate(account, isNormal);
}
//接收汇率信息
export const getRate = ({
	dispatch
}, str, isNormal = true) => {
	// 6.70000|6.60000|0.00000|0.00000
	/*
	* 人民币到美元|美元到人民币|人民币到港元|港元到人民币|
	* 人民币到美元|美元到人民币|人民币到港元|港元到人民币|人民到欧元|欧元到人民币|
	*
	*'z_rmb':"",
	 'z_gy':"",
	 'z_usa':"",
	 'z_eur':"",
	 'rmb_z':"",
	 'gy_z':'',
	 'usa_z':''
	* */
	str = str.substring(0, str.length - 1);
	var temp = str.split("|");
	var obj = new Object();
	obj.z_rmb = "1";
	obj.z_gy = temp[2];
	obj.z_usa = temp[0];
	obj.z_eur = temp[4];
	obj.rmb_z = "1";
	obj.gy_z = temp[3];
	obj.usa_z = temp[1];
	obj.eur_z = temp[5];
	dispatch(Types.moneyRate, obj, isNormal);
}
//划转资金
var moneyTransClick = false;
export const setMoneyTrans = ({
	dispatch
}, obj) => {
	moneyTransClick = obj.isClick;
	//	userSrv.setMoneyTrans(obj);
	tradeSrv.setMoneyTrans(obj);
}
//接收资金划转返回信息
export const getMoneyTrans = (state, obj) => {
	obj.isShow = true && moneyTransClick;
	moneyTransClick = false;
	state.dispatch(Types.MoneyTrans, obj);
	getUserMoney(state, Account);
}
//开户申请
export const setRegistUser = ({
	dispatch
}, obj) => {
	//	userSrv.setRegistUser(obj);
	tradeSrv.setRegistUser(obj);
}
//接收开户申请返回数据
export const getRegistUser = (state, obj) => {
	state.dispatch(Types.registInfo, obj);
}