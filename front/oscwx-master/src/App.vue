<template>
	<div id="wrap">
		<div style="height:100%">
			<view-box>
				<div slot="header" id="head">
					<x-header :left-options="{showBack:Lshow}" style="background-color:#268bf2;">
						{{title}}
						<div slot="right">
							<span @click="logInOut" v-show="Rshow">{{Rtitle}}</span>
							<span style="margin-left: 10px;" @click="registered" v-show="RshowRegist">注册</span>
						</div>
					</x-header>
				</div>
				<router-view></router-view>
				<loading :show="!loadingState" :text="loadingText"></loading>
				<tabbar slot="bottom" v-show="Bshow">
					<tabbar-item v-link="{path:'/default'}" :selected="title=='佳盛环球交易系统'">
						<i slot="icon" class="tabbarItem iconfont icon-wxbzhuye"></i>
						<span slot="label">首页</span>
					</tabbar-item>
					<tabbar-item v-link="{path:'/list'}" :selected="title=='实盘交易'">
						<i slot="icon" class="tabbarItem iconfont icon-wxbbaobiao"></i>
						<span slot="label">资讯</span>
					</tabbar-item>
					<tabbar-item v-link="{path:'/user'}">
						<i slot="icon" class="tabbarItem iconfont icon-account" :selected="title=='个人中心'"></i>
						<span slot="label">个人中心</span>
					</tabbar-item>
				</tabbar>
			</view-box>
		</div>
	</div>
</template>

<script>
	import viewBox from "vux/src/components/view-box"
	import xHeader from "vux/src/components/x-header"
	import tabbar from "vux/src/components/tabbar/tabbar"
	import tabbarItem from "vux/src/components/tabbar/tabbar-item"
	import loading from "vux/src/components/loading"
	//vux
	import store from "vuex/store"
	import { LinkMarket, LinkUser, LinkTrade, logoutEvent, setMarketFengKong } from "vuex/actions"

	export default {
		store,
		vuex: {
			getters: {
				isLogin: (state) => state.userInfo.isLogin,
				account: (state) => state.userInfo.account,
				hotData: (state) => state.hotContract,
				title: (state) => state.header.title, //标题
				Rshow: (state) => state.header.Rshow, //右面显示的内容
				RshowRegist: (state) => state.header.RshowRegist,
				Rtitle: (state) => state.header.Rtitle, //右面是否显示
				Lshow: (state) => state.header.Lshow,
				Bshow: (state) => state.header.Bshow, //底部tabber
				loadingState: (state) => {
					//return true;
					//					return state.marketState && state.userState;
					return state.marketState;
				},
				loadingText: (state) => {
					var text = [];
					if(state.marketState == false) {
						text.push("行情服务未链接...");
					}
					//					if(state.userState == false) {
					//						text.push("交易服务未链接,port:8540");
					//					}
					return text.join("\n");
				}
			},
			actions: {
				LinkMarket,
				LinkUser,
				LinkTrade,
				logoutEvent,
				setMarketFengKong
			}
		},
		methods: {
			logInOut() {
				if(this.isLogin) {
					this.logoutEvent();
				} else {
					window.location.hash = "/login";
				}
			},
			registered() {
				window.location.hash = "/regist";
			},
			queryFengKong() {
				if(this.isLogin) {
					this.setMarketFengKong(this.account);
				} else {
					this.setMarketFengKong(117069);
				}
			}
		},
		ready() {
			this.LinkMarket(); //行情
			//			this.LinkUser(); //交易
			this.LinkTrade();
//			this.queryFengKong();
//			clearInterval(window.getFengKong);
//			window.getFengKong = setInterval(this.queryFengKong, 1000 * 60 * 10);
		},
		components: {
			viewBox,
			xHeader,
			tabbar,
			tabbarItem,
			loading
		},
		events: {
			"hide" () {
				clearInterval(window.getFengKong);
			}
		},
		beforeRouteLeave(to, from, next) {
			clearInterval(window.getFengKong);
		}
	}
</script>

<style lang="less">
	@import '~vux/src/styles/reset';
	@import "style/iconfont.css";
	* {
		-webkit-box-sizing: border-box!important;
		box-sizing: border-box;
	}
	
	html,
	body {
		height: 100%;
		font: 14px/1.5 arial, tahoma, sans-serif, "\5B8B\4F53";
	}
	
	ul {
		list-style: none;
	}
	
	#wrap {
		height: 100%;
	}
	
	#head {
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 100;
	}
	
	.weui_tabbar_item {
		padding: 3px 0 0;
	}
	
	.weui_tabbar_icon+.weui_tabbar_label {
		margin-top: 1px
	}
	
	.weui_tab_bd {
		padding-top: 46px;
		background-color: #edf0f5;
		min-height: 100%;
	}
	
	.weui_tabbar_item.weui_bar_item_on .tabbarItem {
		color: #35495e;
	}
	
	.weui_tabbar_item.weui_bar_item_on .weui_tabbar_label {
		color: #35495e!important;
		font-weight: 700;
	}
	
	.tabbarItem.iconfont {
		font-size: 20px;
		position: absolute;
		top: -2px;
		color: #888;
	}
</style>