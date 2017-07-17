/**
 * Created by kaiser on 2016/9/10.
 */
import * as Types from "./types"
import DateFormatter from 'vux/src/components/datetime/format'
Vue.use(Vuex);

const state = {
	header: {
		title: "佳盛环球交易系统",
		Rtitle: "登录",
		Rshow: true,
		RshowRegist: true,
		Lshow: false,
		Bshow: true
	},
	//链接状态,链接成功后为true
	marketState: false, //行情接口
	userState: false, // 交易接口
	//用户信息
	userInfo: {
		account: "",
		password: 　 "",
		nick: "",
		isLogin: false
	},
	//登录状态
	loginState: {
		isDisabledLoginBtn: false,
		isShowToast: false,
		toastTxt: "默认",
		loginCnt: 0
	},
	//账户资金接收
	userMoney: [],

	hotContract: {}, //热门合同
	fengkong: {}, //风控
	tradingHistory: [], //交易记录
	myHold: [], //客户持仓

	moneyInHistory: [], //入金流水
	moneyOutHistory: [], //出金流水

	openState: {
		isShow: false, //显示交易信息
	}, //开仓返回的结果
	pcState: {
		isShow: false, //显示平仓的信息
	},
	winLossState: {
		isShow: false, //显示止损赢修改的信息
	},

	moneyRate: {
		'z_rmb': "1",
		'z_gy': "1",
		'z_usa': "1",
		'rmb_z': "1",
		'gy_z': '1',
		'usa_z': '1'
	},
	MoneyTrans: {
		isShow: false, //显示资金划转的状态
	},

	resetPwd: {
		isShowToast: false,
		toastTxt: "默认",
		stateNo: 0
	},
	registInfo: {
		newAccount: "",
		stateNo: "",
		msg: "",
		time: 0,
	}
}
const mutations = {
	[Types.resetPwd](state, obj) {
		obj.hasOwnProperty("stateNo") && (state.resetPwd.stateNo = obj.stateNo);
		obj.hasOwnProperty("isShowToast") && (state.resetPwd.isShowToast = obj.isShowToast);
		obj.hasOwnProperty("toastTxt") && (state.resetPwd.toastTxt = obj.toastTxt);
	},
	[Types.SetHeadMsg](state, obj) {
		Object.assign(state.header, obj);
	},
	[Types.GetAllTrading](state, obj) {
		state.allTrading.data = obj;
	},
	[Types.SetUserInfo](state, obj) {
		obj.hasOwnProperty("account") && (state.userInfo.account = obj.account);
		obj.hasOwnProperty("password") && (state.userInfo.password = obj.password);
		obj.hasOwnProperty("nick") && (state.userInfo.nick = obj.nick);
		obj.hasOwnProperty("isLogin") && (state.userInfo.isLogin = obj.isLogin);
	},
	[Types.MarketState](state, val) {
		state.marketState = val;
	},
	[Types.UserState](state, val) {
		state.userState = val;
	},
	[Types.HotContract](state, obj) {
		state.hotContract = obj;

		for(let k in state.hotContract) {
			for(let j in state.fengkong) {
				if(k.substring(0, k.lastIndexOf(' ')) == j) {
					if(isNaN(state.hotContract[k].openCash)) {
						//						state.hotContract[k].openCashFK = state.fengkong[j].openCash;
						Vue.set(state.hotContract[k], 'openCashFK', state.fengkong[j].openCash);
					} else {
						//						state.hotContract[k].openCashFK = Math.max(state.hotContract[k].openCash, state.fengkong[j].openCash);
						Vue.set(state.hotContract[k], 'openCashFK', Math.max(state.hotContract[k].openCash, state.fengkong[j].openCash));
					}
					state.hotContract[k].holdCashFK = Math.max(state.hotContract[k].holdCash, state.fengkong[j].holdCash);
				}
			}
		}

	},
	[Types.UpdateMark](state, obj) {
		if(state.hotContract[obj.code]) {
			state.hotContract[obj.code].newPrice = parseFloat(obj.newPrice);
			state.hotContract[obj.code].upDown = obj.upDown;
			state.hotContract[obj.code].buyOnePri = obj.buyOnePri;
			state.hotContract[obj.code].saleOnePri = obj.saleOnePri;
			state.hotContract[obj.code].markePri = obj.markePri;
			state.hotContract[obj.code].time = obj.time;
		}
	},
	[Types.LoginState](state, obj) {
		obj.hasOwnProperty("isDisabledLoginBtn") && (state.loginState.isDisabledLoginBtn = obj.isDisabledLoginBtn);
		obj.hasOwnProperty("isShowToast") && (state.loginState.isShowToast = obj.isShowToast);
		obj.hasOwnProperty("toastTxt") && (state.loginState.toastTxt = obj.toastTxt);
		obj.hasOwnProperty("loginCnt") && (state.loginState.loginCnt = obj.loginCnt);
	},
	[Types.UserMoney](state, obj) {
		state.userMoney = obj;
	},
	[Types.TradingHistory](state, obj) {
		state.tradingHistory = obj;
	},
	[Types.MoneyInHistory](state, obj) {
		state.moneyInHistory = obj;
	},
	[Types.MoneyOutHistory](state, arr) {
		state.moneyOutHistory = arr;
	},
	[Types.myHold](state, obj) {
		state.myHold = obj;
	},
	[Types.openOrder](state, obj) {
		state.openState = obj;
	},
	[Types.pcOrder](state, obj) {
		state.pcState = obj;
	},
	[Types.winLoss](state, obj) {
		state.winLossState = obj;
	},
	[Types.moneyRate](state, obj, isNormal) {
		if(isNormal == true) {
			state.moneyRate = obj;
		} else {
			/*
			* obj.z_rmb = "1";
			 obj.z_gy = temp[2];
			 obj.z_usa = temp[0];
			 obj.rmb_z = "1";
			 obj.gy_z = temp[3];
			 obj.usa_z = temp[1];
			* */
			if(parseFloat(obj.z_gy) != 0) {
				state.moneyRate.z_gy = obj.z_gy;
			}
			if(parseFloat(obj.z_usa) != 0) {
				state.moneyRate.z_usa = obj.z_usa;
			}
			if(parseFloat(obj.gy_z) != 0) {
				state.moneyRate.gy_z = obj.gy_z;
			}
			if(parseFloat(obj.usa_z) != 0) {
				state.moneyRate.usa_z = obj.usa_z;
			}
		}
	},
	[Types.MoneyTrans](state, obj) {
		state.MoneyTrans = obj;
	},
	//登录后重置热门合约
	[Types.clearHot](state, flag) {
		if(flag == true) {
			state.hotContract = {};
		}
	},
	//返回开户信息
	[Types.registInfo](state, obj) {
		obj.hasOwnProperty("newAccount") && (state.registInfo.newAccount = obj.newAccount);
		obj.hasOwnProperty("status") && (state.registInfo.stateNo = obj.status);
		obj.hasOwnProperty("msg") && (state.registInfo.msg = obj.msg);
		state.registInfo.time = new Date().getTime();
	},
	//更新风控信息
	[Types.fengkongInfo](state, obj) {
		state.fengkong = obj;
		for(let k in state.hotContract) {
			if(state.hotContract[k].openCashFK) {
				let nowTime = DateFormatter(new Date(), 'HH:mm:ss');
				let startTime = state.hotContract[k].start;
				let endTime = state.hotContract[k].end;
				if(!((startTime > endTime && (nowTime >= startTime || nowTime <= endTime)) || ((startTime < endTime) && (nowTime > startTime && endTime > nowTime)))) {
					Vue.delete(state.hotContract[k], 'openCashFK');
					//					delete state.hotContract[k].openCashFK;
					delete state.hotContract[k].FKstart;
					delete state.hotContract[k].FKend;
				}
			}
		}
		for(let k in state.hotContract) {
			for(let j in obj) {
				if(k.substring(0, k.lastIndexOf(' ')) == j) {
					//					state.hotContract[k].openCashFK = obj[j].openCash;
					if(isNaN(state.hotContract[k].openCash)) {
						//						state.hotContract[k].openCashFK = obj[j].openCash;
						Vue.set(state.hotContract[k], 'openCashFK', obj[j].openCash);
					} else {
						//						state.hotContract[k].openCashFK = Math.max(state.hotContract[k].openCash, obj[j].openCash);
						Vue.set(state.hotContract[k], 'openCashFK', Math.max(state.hotContract[k].openCash, obj[j].openCash));
					}
					state.hotContract[k].FKstart = obj[j].start;
					state.hotContract[k].FKend = obj[j].end;
					state.hotContract[k].holdCashFK = obj[j].holdCash;
				}
			}
		}

		//		for(let k in state.hotContract) {
		//			state.hotContract[k].openCashFK = state.hotContract[k].openCashFK > state.hotContract[k].openCash ? parseFloat(state.hotContract[k].openCashFK).toFixed(2) : parseFloat(state.hotContract[k].openCash).toFixed(2);
		//			state.hotContract[k].holdCashFK = state.hotContract[k].holdCashFK > state.hotContract[k].holdCash ? parseFloat(state.hotContract[k].holdCashFK).toFixed(2) : parseFloat(state.hotContract[k].holdCash).toFixed(2);
		//		}
	}

}

export default new Vuex.Store({
	state,
	mutations
})