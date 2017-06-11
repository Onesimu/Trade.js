import App from "./App"
import routerObj from "./routerObj"
import store from "vuex/store"
import { setHeadMsg } from "vuex/actions"

window.router = new VueRouter();

routerObj(router);

router.redirect({
	"*": "/default"
});

router.beforeEach(function(trans) {
	var path = trans.to.path;
	if(path == "/default") {
		setHeadMsg(store, {
			title: "佳盛环球交易系统",
			//title:"期盈外盘交易系统",
			Lshow: false, //左侧返回箭头
			Bshow: true, //底部的tabber
			Rshow: true, //右侧的登录
			RshowRegist: !store.state.userInfo.isLogin
		});
		trans.next();
	} else if(path == "/list") {
		setHeadMsg(store, {
			title: "重磅资讯",
			Lshow: false, //左侧返回箭头
			Bshow: true, //底部的tabber
			Rshow: true //右侧的登录
		});
		trans.next();
	} else if(/tradInfo/.test(path)) {
		setHeadMsg(store, {
			title: trans.to.params.name,
			Lshow: true,
			Bshow: true
		});
		candle(trans.to.params.id, 1);
		trans.next();
	} else if(path == "/login") {
		setHeadMsg(store, {
			title: "登录",
			Lshow: true,
			Bshow: true,
			Rshow: false
		});
		trans.next();
	} else if(path == "/regist") {
		setHeadMsg(store, {
			title: "注册",
			Lshow: true,
			Bshow: true,
			Rshow: false,
			RshowRegist: false
		});
		trans.next();
	} else if(path == "/user") {
		if(!store.state.userInfo.isLogin) {
			router.go("/login");
			return;
		}
		setHeadMsg(store, {
			title: "个人中心",
			Lshow: false,
			Bshow: true,
			Rshow: true
		});
		trans.next();
	} else if(path == "/moneyInfo") {
		if(!store.state.userInfo.isLogin) {
			router.go("/login");
			return;
		}
		setHeadMsg(store, {
			title: "资金明细",
			Lshow: true,
			Bshow: true,
			Rshow: false
		});
		trans.next();
	} else if(path == "/userTrading") {
		if(!store.state.userInfo.isLogin) {
			router.go("/login");
			return;
		}
		setHeadMsg(store, {
			title: "交易记录",
			Lshow: true,
			Bshow: true,
			Rshow: false
		});
		trans.next();
	} else if(path == "/moneyInHis") {
		if(!store.state.userInfo.isLogin) {
			router.go("/login");
			return;
		}
		setHeadMsg(store, {
			title: "入金记录",
			Lshow: true,
			Bshow: true,
			Rshow: false
		});
		trans.next();
	} else if(trans.to.name == "myHold") {
		if(!store.state.userInfo.isLogin) {
			router.go("/login");
			return;
		}
		setHeadMsg(store, {
			title: "我的持仓",
			Lshow: true,
			Bshow: true,
			Rshow: false
		});
		trans.next();
	} else if(path == "/moneyTrans") {
		if(!store.state.userInfo.isLogin) {
			router.go("/login");
			return;
		}
		setHeadMsg(store, {
			title: "资金划转",
			Lshow: true,
			Bshow: true,
			Rshow: false
		});
		trans.next();
	} else if(trans.to.name == "order") {
		if(!store.state.userInfo.isLogin) {
			router.go("/login");
			return;
		}
		setHeadMsg(store, {
			title: "确认下单",
			Lshow: true, //左侧返回箭头
			Bshow: false, //底部的tabber
			Rshow: true //右侧的登录
		});
		trans.next();
	} else if(trans.to.name == "pingcang") {
		if(!store.state.userInfo.isLogin) {
			router.go("/login");
			return;
		}
		setHeadMsg(store, {
			title: "平仓",
			Lshow: false,
			Bshow: false,
			Rshow: false
		});
		trans.next();
	} else if(trans.to.name == "editPrice") {
		if(!store.state.userInfo.isLogin) {
			router.go("/login");
			return;
		}
		setHeadMsg(store, {
			title: "修改止损赢价",
			Lshow: false,
			Bshow: false,
			Rshow: false
		});
		trans.next();
	} else if(path == "/reset") {
		setHeadMsg(store, {
			title: "重设密码",
			Lshow: true,
			Bshow: true,
			Rshow: false
		});
		trans.next();
	}
});

router.start(Vue.extend(App), "#app");