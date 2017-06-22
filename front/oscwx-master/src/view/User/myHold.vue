/* 我的持仓 */
<template>
	<div id="myHold">
		<div class="noTrading" v-show="endRes.length == 0">无持仓数据</div>
		<component v-show="endRes.length > 0" v-for="item in endRes">
			<acc :show="$index==index && isOpen==true">
				<div class="acc_left" slot="left">
					<span class="name">合约名称：{{item.tradName}}</span>
					<span class="winLoss">盈亏：{{item.direction == 1 ? (hotContract[item.tradName].newPrice!='none'?((hotContract[item.tradName].newPrice - item.price ) * hotContract[item.tradName].oneCost * item.holdNum - item.poundage).toFixed(2):item.winLoss):(hotContract[item.tradName].newPrice!='none'?((item.price - hotContract[item.tradName].newPrice) * hotContract[item.tradName].oneCost * item.holdNum - item.poundage).toFixed(2):item.winLoss)}}</span>
				</div>
				<div slot="body">
					<div class="firstRow">
						<span>持仓数量</span>
						<span>方向</span>
						<span>价格</span>
						<span>止损价</span>
						<span>止盈价</span>
					</div>
					<div class="firstRow" style="height: 23px; border-bottom: 1px solid #C3C3C3;">
						<span>{{item.holdNum}}</span>
						<span>{{item.direction == 1?'多':'空'}}</span>
						<span>{{item.price}}</span>
						<span>{{item.lowPrice==0?'--':item.lowPrice}}</span>
						<span>{{item.highPrice==0?'--':item.highPrice}}</span>
					</div>
					<div class="secondRow" style="padding-top: 3px;">
						<span style="padding-left: 15px;">成交时间</span>
						<span>持仓编号</span>
					</div>
					<div class="secondRow">
						<span style="padding-left: 15px;">{{localDate(item.time)}}</span>
						<span>{{item.id}}</span>
					</div>
					<div class="oper">
						<span class="operBtn weui_btn_primary" v-link="{ name: 'pingcang', params: { index: $index}}">平仓</span>
						<span class="operBtn weui_btn_primary" style="background-color:#268bf2;" v-link="{ name: 'editPrice', params: { index: $index}}">修改止损赢</span>
					</div>
					<!--<div class="name">
                        <span>持仓数量</span>
                        <span>方向</span>
                        <span>价格</span>
                        <span>止损价</span>
                        <span>止盈价</span>
                        <span>手续费</span>
                        <span>成交时间</span>
                        <span>持仓编号</span>
                    </div>
                    <div class="val">
                        <span>{{item.holdNum}}</span>
                        <span>{{item.direction == 1?'多':'空'}}</span>
                        <span>{{item.price}}</span>
                        <span>{{parseInt(item.lowPrice)==0?'--':item.lowPrice}}</span>
                        <span>{{parseInt(item.highPrice)==0?'--':item.highPrice}}</span>
                        <span>{{item.poundage}}</span>
                        <span>{{item.time}}</span>
                        <span>{{item.id}}</span>
                    </div>
                    <div class="oper">
                        <span class="operBtn weui_btn_primary" v-link="{ name: 'pingcang', params: { index: $index}}">平仓</span>
                        <span class="operBtn weui_btn_primary" style="background-color:#268bf2;" v-link="{ name: 'editPrice', params: { index: $index}}">修改止损赢</span>
                    </div>-->
				</div>
			</acc>
		</component>
	</div>
</template>
<style lang="less">
	#myHold .holdContent {
		background: #fff;
		width: 1160px;
		padding-bottom: 10px;
	}
	
	.holdContent ul {
		width: 100%;
		height: 40px;
		display: block;
	}
	
	.holdContent li {
		float: left;
		width: 100px;
		line-height: 40px;
		text-align: center;
		height: 40px;
		text-align: center;
	}
	
	ul.holdHd {
		background: #f8f8f8;
	}
	
	.holdContent li.big {
		width: 150px;
	}
	
	.acc_left {
		float: left;
		line-height: 40px;
	}
	
	.acc_left span.name {
		width: 190px;
		float: left;
		padding-left: 10px;
	}
	
	.acc_left span.winLoss {
		float: left;
	}
	
	.acc_body .oper {
		width: 100%;
		float: left;
		text-align: center;
		margin-top: 10px;
		line-height: 26px;
	}
	
	.acc_body .operBtn {
		width: 80px;
		height: 26px;
		border-radius: 7px;
		display: inline-block;
		margin: 0 7px;
		color: #fff;
		padding: 0;
	}
	
	.firstRow {
		width: 100%;
		height: 20px;
	}
	
	.firstRow span {
		display: inline-block;
		float: left;
		width: 20%;
		height: 20px;
		text-align: center;
		font-size: 12px;
		line-height: 20px;
		color: #565656;
		padding: 0;
	}
	
	.secondRow span {
		display: inline-block;
		float: left;
		width: 45%;
		height: 20px;
		font-size: 12px;
		line-height: 20px;
		color: #565656;
		padding: 0;
	}
</style>
<script>
	import { setMyHold } from "vuex/actions"
	import Acc from "component/Accordion"
	export default {
		vuex: {
			getters: {
				hotContract: (state) => state.hotContract,
				account: (state) => state.userInfo.account,
				endRes: (state) => state.myHold
			},
			actions: {
				setMyHold
			}
		},
		data() {
			return {
				pcShow: false,
				pc: { //平仓
					id: "",
					tradName: "",
					holdNum: 0
				},
				index: 0,
				isOpen: true
			}
		},
		ready() {
			this.setMyHold(this.account);
		},
		components: {
			Acc
		},
		computed: {
			duo() {
				return 1;
			},
			kong() {
				return 2;
			}
		},
		methods: {
			localDate(str) {
				return new Date(str.substr(0, 4), parseInt(str.substr(4, 2))-1, str.substr(6, 2), str.substr(8, 2), str.substr(10, 2), str.substr(12, 2)).toLocaleString();
			}
		},
		route: {
			data(res) {
				if(res.to.name == "myHold") {
					if(/user/.test(res.from.path) || /tradInfo/.test(res.from.path)) {
						this.isOpen = false;
					}
					this.index = parseInt(res.to.params.index);
				}
			}
		}
	}
</script>