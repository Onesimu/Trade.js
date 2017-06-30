<template>
	<div id="User">
		<div class="userInfo">
			<div class="face">{{nick}}</div>
		</div>
		<group>
			<cell title="&nbsp;&nbsp;&nbsp;资金明细" is-link v-link="{path:'/moneyInfo'}">
				<span class="icon zjmx" slot="icon"></span>
			</cell>
			<cell title="&nbsp;&nbsp;&nbsp;我的持仓" is-link v-link="{ name: 'myHold', params: {index:0}}">
				<span class="icon kyzj" slot="icon"></span>
			</cell>
			<cell title="&nbsp;&nbsp;&nbsp;交易记录" is-link v-link="{path:'/userTrading'}">
				<span class="icon jyjl" slot="icon"></span>
			</cell>
			<cell title="&nbsp;&nbsp;&nbsp;资金划转" is-link v-link="{path:'/moneyTrans'}">
				<span class="icon zjhz" slot="icon"></span>
			</cell>
			<!--<cell title="&nbsp;&nbsp;&nbsp;入金记录" is-link v-link="{path:'/moneyInHis'}">
                <span class="icon jyjl" slot="icon"></span>
            </cell>-->
		</group>
	</div>
</template>
<style lang="less">
	.userInfo {
		width: 100%;
		height: 110px;
		background: url("../../img/bg_blue.png") no-repeat center 0;
		background-size: cover;
		overflow: hidden;
	}
	
	.face {
		width: 100%;
		height: 120px;
		background: url("../../img/face.png") no-repeat center top;
		background-size: 60px 60px;
		margin: 10px auto 0 auto;
		font-size: 18px;
		line-height: 155px;
		color: #fff;
		text-align: center;
		font-family: "微软雅黑";
	}
	
	#User .icon {
		width: 35px;
		height: 35px;
		display: block;
		background-size: cover;
	}
	
	.zjmx {
		background: url("../../img/cou_01.png") no-repeat 0 0;
	}
	
	.jyjl {
		background: url("../../img/cou_02.png") no-repeat 0 0;
	}
	
	.kyzj {
		background: url("../../img/cou_10.png") no-repeat 0 0;
	}
	
	.zjhz {
		background: url("../../img/cou_13.png") no-repeat 0 0;
	}
</style>
<script>
	import { setRate } from "vuex/actions"
	import Group from "vux/src/components/group"
	import Cell from "vux/src/components/cell"
	export default {
		vuex: {
			getters: {
				isLogin: (state) => state.userInfo.isLogin,
				account: (state) => state.userInfo.account,
				nick: (state) => state.userInfo.nick,
			},
			actions: {
				setRate
			}
		},
		components: {
			Group,
			Cell
		},
		ready() {
			this.setRate(this.account);
		}
	}
</script>