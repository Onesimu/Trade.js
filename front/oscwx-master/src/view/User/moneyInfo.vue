/* 资金明细 */
<template>
	<div id="moneyInfo">
		<div class="row" v-for="item in res">
			<span class="name">{{item.cur}}</span>
			<countup class="money" :end-val="item.val" :decimals="item.decimals" :duration="0.2" :options="options"></countup>
		</div>
	</div>
</template>
<style lang="less">
	#moneyInfo .row {
		height: 70px;
		border-bottom: 1px solid #d8d8d8;
		background: #f8f8f8;
		overflow: hidden;
	}
	
	#moneyInfo .row .name {
		font-size: 30px;
		line-height: 69px;
		color: #484848;
		margin-left: 30px;
		float: left;
	}
	
	#moneyInfo .row .money {
		font-size: 27px;
		float: right;
		margin-right: 53px;
		line-height: 77px;
		color: #ee3800;
	}
</style>
<script>
	import { getUserMoney } from "vuex/actions"
	import Countup from "vux/src/components/countup"
	export default {
		data() {
			return {
				options: {
					useGrouping: false
				}
			}
		},
		vuex: {
			getters: {
				userMoney: (state) => state.userMoney,
				account: (state) => state.userInfo.account,
				isLogin: (state) => state.userInfo.isLogin,
			},
			actions: {
				getUserMoney
			}
		},
		computed: {
			res() {
				var res = [];
				for(var key in this.userMoney) {
					if(this.userMoney[key].cur != 'PRE') {
						res.push(this.userMoney[key]);
					}
				}
				res.sort((before, after) => before.cur > after.cur);
				return res;
			}
		},
		components: {
			Countup
		},
		ready() {
			if(!this.isLogin) {
				this.$destroy(true);
			}
			this.getUserMoney(this.account);
		}
	}
</script>