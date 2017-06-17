<template>
	<div id="loginPage">
		<div class="loginContent">
			<x-input title="账户" :value.sync="account" type="text"></x-input>
			<x-input title="密码" :value.sync="pwd" type="password"></x-input>
		</div>
		<div class="loginFooter">
			<x-button type="primary" :disabled="isClick" @click="login">登录</x-button>
			<x-button @click="reset">重设密码</x-button>
		</div>
		<loading :show="loadShow" text="">
			<p>请求处理中,请稍等......</p>
			<p>{{daojishi}}s</p>
		</loading>
		<toast :show.sync="isShow" type="text">{{toastTxt}}</toast>
		<alert :show.sync="isAlter" title="提示" button-text="确定">
			<div style="text-align: center;">
				{{{alterContent}}}
			</div>
		</alert>
	</div>
</template>
<style lang="less">
	.loginContent {
		margin-top: 10px;
		background: #fff;
		border-top: 1px solid #ddd;
		border-bottom: 1px solid #ddd;
	}
	
	.loginFooter {
		padding: 30px 20px;
	}
</style>
<script>
	import { LoginEvent, LoginState } from "vuex/actions"
	//vux
	import xInput from "vux/src/components/x-input"
	import xButton from "vux/src/components/x-button"
	import toast from "vux/src/components/toast"
	import loading from "vux/src/components/loading"
	import Alert from "vux/src/components/alert"
	export default {
		vuex: {
			getters: {
				//				isLogin: (state) => state.userInfo.isLogin,
				_isClick: (state) => state.loginState.isDisabledLoginBtn,
				_isShow: (state) => state.loginState.isShowToast,
				toastTxt: (state) => state.loginState.toastTxt,
				loginCnt: (state) => state.loginState.loginCnt,
				loginState: (state) => state.loginState
			},
			actions: {
				LoginEvent,
				LoginState
			}
		},
		data() {
			return {
				account: "",
				pwd: "",
				loadShow: false,
				timeHandle: null,
				time: 30,
				isAlter: false,
				alterContent: "网络超时"
			}
		},
		ready() {
			if(window.localStorage.account) {
				this.account = window.localStorage.account;
			}
			if(window.localStorage.pwd) {
				this.pwd = window.localStorage.pwd;
			}
		},
		methods: {
			login() {
				if(this.account == "" || this.pwd == "") {
					return;
				}
				this.LoginState({
					isDisabledLoginBtn: true,
					isShowToast: false
				});
				this.LoginEvent({
					account: this.account,
					pwd: this.pwd
				});
				this.loadShow = true;
				this.start = true;
				this.time = 30;
				//				this.isAlter = false;
			},
			reset() {
				window.location.hash = "reset";
			}
		},
		watch: {
			'loginCnt': {
				handler: function(val, oldVal) {
					this.start = false;
					this.time = 0;
					this.loadShow = false;
					//					this.isAlter = this._isShow;
					//					if(this.toastTxt != "") {
					//						this.alterContent = this.toastTxt;
					//					} else {
					//						this.alterContent = this.toastTxt;
					//					}
				},
				//				deep: true
			}
		},
		events: {
			"hide" () {
				this.LoginState({
					isShowToast: false
				})
			}
		},
		computed: {
			isClick() {
				return this._isClick;
			},
			isShow() {
				return this._isShow;
			},
			daojishi() {
				if(this.loadShow == false) {
					return;
				}
				var self = this;
				window.clearTimeout(this.timeHandle);
				if(this.time == -1) {
					//					this.time = 30;
					this.loadShow = false;
					this.isAlter = true;
					return;
				}
				this.timeHandle = window.setTimeout(function() {
					self.time--;
				}, 1000);
				return this.time;
			}
		},
		components: {
			xInput,
			xButton,
			toast,
			loading,
			Alert
		}
	}
</script>