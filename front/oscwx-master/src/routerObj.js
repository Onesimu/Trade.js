/**
 * Created by kaiser on 2016/9/10.
 */
export default(router) => {
	router.map({
		"/default": {
			component: require("view/home")
		},
		"/list": {
			component: require("view/list")
		},
		'/tradInfo/:id/:name/:cur': {
			name: 'tradInfo',
			component: require("view/tradInfo")
		},
		'/login': {
			component: require("view/login")
		},
		'/regist': {
			component: require("view/regist")
		},
		'/user': {
			component: require("view/User/User")
		},
		'/reset': {
			component: require("view/resetPwd")
		},
		'/moneyInfo': {
			component: require("view/User/moneyInfo")
		},
		'/userTrading': {
			component: require("view/User/trading")
		},
		'/moneyInHis': {
			component: require('view/User/moneyInHis')
		},
		'/myHold/:index': {
			name: "myHold",
			component: require("view/User/myHold")
		},
		'/order/:type/:id': {
			name: 'order',
			component: require("view/order")
		},
		'/pingcang/:index': {
			name: 'pingcang',
			component: require("view/User/pingcang")
		},
		'/editPrice/:index': {
			name: 'editPrice',
			component: require("view/User/editPrice")
		},
		'/moneyTrans': {
			component: require("view/User/moneyTrans")
		}

	})
}