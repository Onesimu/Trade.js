<template>
	<div id="registPage">
		<div class="loginContent">
			<x-input title="姓名" v-el:name :value.sync="name" type="text"></x-input>
			<x-input title="手机号码" :value.sync="tel" is-type="china-mobile" placeholder="请输入手机号" keyboard="number" :min=11 :max=11></x-input>
		</div>
		<div class="loginContent">
			<x-input title="银行卡开户行" :value.sync="blankName" type="text"></x-input>
			<x-input title="银行卡号" :value.sync="blankNum" type="text" keyboard="number"></x-input>
		</div>
		<div class="loginContent">
			<x-input title="推荐码" :value.sync="tuijianNum" type="text"></x-input>
		</div>
		<div class="loginFooter">
			<x-button type="primary" @click="regist">注册</x-button>
		</div>
		<loading :show="loadShow" text="">
			<p>注册中</p>
			<p>{{daojishi}}s</p>
		</loading>
		<alert :show.sync="isAlter" title="提示" button-text="确定">
			<div style="text-align: center;">
				{{{alterContent}}}
			</div>
		</alert>
	</div>
</template>
<style lang="less">

</style>
<script>
	//vux
	import xInput from "vux/src/components/x-input"
	import xButton from "vux/src/components/x-button"
	import loading from "vux/src/components/loading"
	import Alert from "vux/src/components/alert"
	import countdown from "vux/src/components/countdown"
	import { setRegistUser } from "vuex/actions"
	export default {
		vuex: {
			getters: {
				registInfo: (state) => state.registInfo
			},
			actions: {
				setRegistUser
			}
		},
		data() {
			return {
				name: "",
				tel: "",
				blankName: "",
				blankNum: "",
				tuijianNum: "",
				loadShow: false,
				hintText: "",
				isAlter: false,
				alterContent: "",
				timeHandle: null,
				time: 30
			}
		},
		watch: {
			'registInfo': {
				handler: function(val, oldVal) {
					this.start = false;
					this.time = 30;
					this.loadShow = false;
					this.isAlter = true;
					if(this.registInfo.stateNo == "00") {
						window.localStorage.account = this.registInfo.newAccount;
						window.localStorage.pwd = "";
						this.alterContent = '<p>登录账户：' + this.registInfo.newAccount + '</p><p>默认密码：123</p>';
					} else if(this.registInfo.msg && this.registInfo.msg != '') {
						this.alterContent = '<p>' + this.registInfo.msg + '</p>';
					} else {
						this.alterContent = '注册未成功';
					}
				},
				deep: true
			}
		},
		components: {
			xInput,
			xButton,
			loading,
			Alert,
			countdown
		},
		computed: {
			daojishi() {
				if(this.loadShow == false) {
					return;
				}
				var self = this;
				window.clearTimeout(this.timeHandle);
				if(this.time == -1) {
					this.alterContent = '网络超时';
					this.loadShow == false;
					this.isAlter = true;
					return;
					//					this.time = 30;
				}
				this.timeHandle = window.setTimeout(function() {
					self.time--;
				}, 1000);
				return this.time;
			}
		},
		methods: {
			regist() {
				if(!(this.name && this.blankName && this.blankNum && this.tel && this.tuijianNum)) {
					this.alterContent = '请填写完整的信息';
					this.isAlter = true;
					return;
				}
				this.setRegistUser({
					name: this.name,
					blankName: this.blankName,
					blankNum: this.blankNum,
					tel: this.tel,
					tuijianNum: this.tuijianNum
				});
				this.loadShow = true;
				this.start = true;
				this.time = 30;
			}
		}
	}
</script>