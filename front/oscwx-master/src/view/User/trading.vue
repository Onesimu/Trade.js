/* 交易记录 */

<template>
	<div id="trading">
		<group>
			<datetime title="开始日期" format="YYYY-MM-DD" :value="getDate" :min-year=2016 confirm-text="确认" cancel-text="取消" @on-change="startDate"></datetime>
			<datetime title="结束日期" format="YYYY-MM-DD" :value="getDate" :min-year=2016 confirm-text="确认" cancel-text="取消" @on-change="endDate"></datetime>
		</group>
		<div class="footer">
			<x-button type="primary" @click="btnEvent">查询</x-button>
		</div>
		<div class="noTrading" v-show="endRes.length == 0">暂无成交记录</div>
		<component v-show="endRes.length > 0" v-for="item in endRes">
			<acc :show="$index==0" :class="{'firstAcc':$index==0}">
				<div class="acc_left" slot="left">
					<span class="name">合约名称：{{item.tradName}}</span>
					<span class="winLoss">盈亏：{{item.upDown}}</span>
				</div>
				<div slot="body">
					<div class="name">
						<span>持仓数量</span>
						<span>方向</span>
						<span>价格</span>
						<span>手续费</span>
						<span>状态</span>
						<span>时间</span>
					</div>
					<div class="val">
						<span>{{item.tradNum}}</span>
						<span>{{item.makeType == 1?'多':'空'}}</span>
						<span>{{parseFloat(item.price)}}</span>
						<span>{{item.poundage}}</span>
						<span>{{item.state}}</span>
						<span>{{localDate(item.time)}}</span>
					</div>
				</div>
			</acc>
		</component>
		<alert :show.sync="isAlert" title="提示" button-text="确定">
			<p style="text-align:center;">{{alertMsg}}</p>
		</alert>
		<loading-time :load-show.sync="loadingShow"></loading-time>
	</div>
</template>
<style lang="less">
	.noTrading {
		height: 100px;
		background: #f8f8f8;
		line-height: 100px;
		text-align: center;
		color: #484848;
		border-bottom: 1px solid #d8d8d8;
		border-top: 1px solid #d8d8d8;
	}
	
	#trading .operation {
		height: 50px;
		border-bottom: 1px solid #d8d8d8;
		background: #f8f8f8;
	}
	
	#trading .footer {
		padding: 30px;
	}
	
	#trading .tradingContent {
		background: #fff;
		width: 1050px;
		padding-bottom: 10px;
	}
	
	.tradingContent ul {
		width: 100%;
		height: 40px;
		display: block;
	}
	
	.tradingContent li {
		float: left;
		width: 100px;
		line-height: 40px;
		text-align: center;
		height: 40px;
		text-align: center;
	}
	
	ul.tradingHd {
		background: #f8f8f8;
	}
	
	.tradingContent li.big {
		width: 150px;
	}
	
	.firstAcc .acc_head {
		border-top: 1px solid #d8d8d8;
	}
	
	.acc_body .name {
		float: left;
		width: 30%;
		padding-right: 10px;
		text-align: right;
		border-right: 1px solid #b7b7b7;
	}
	
	.acc_body span {
		display: block;
		color: #484848;
		padding: 5px 0;
	}
	
	.acc_body .val {
		float: left;
		width: 70%;
		padding-left: 10px;
	}
</style>

<script>
	import { setTradingHistory } from "vuex/actions"
	import Group from "vux/src/components/group"
	import Cell from "vux/src/components/cell"
	import xButton from "vux/src/components/x-button"
	import datetime from "vux/src/components/datetime"
	import Acc from "component/Accordion"
	import Alert from "vux/src/components/alert"
	import LoadingTime from "component/LoadingTime"
	import DateFormatter from 'vux/src/components/datetime/format'
	export default {
		data() {
			return {
				start: 0,
				end: 0,
				isAlert: false,
				loadingShow: false,
				alertMsg: '查询时间的跨度不要超过7天'
			}
		},
		vuex: {
			getters: {
				account: (state) => state.userInfo.account,
				res: (state) => state.tradingHistory, //成交记录
			},
			actions: {
				setTradingHistory
			}
		},
		ready() {
			let date = this.nowDate();
			//			this.getTrading(date, date);
		},
		methods: {
			getTrading(start, end) {
				this.setTradingHistory(this.account, start, end);
			},
			startDate(val) {
				if(val.length > 0) {
					val = val.replace(/-/g, "");
					this.start = val;
				}
			},
			endDate(val) {
				if(val.length > 0) {
					val = val.replace(/-/g, "");
					this.end = val;
				}
			},
			diff(end, start) {
				var e = new Date(end.substr(0, 4), end.substr(4, 2), end.substr(6, 2));
				var s = new Date(start.substr(0, 4), start.substr(4, 2), start.substr(6, 2));
				//				return parseInt(Math.abs(e - s) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
				return parseInt((e - s) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
			},
			btnEvent() {
				var start = this.start;
				var end = this.end;
				start = start == 0 ? this.nowDate() : start;
				end = end == 0 ? this.nowDate() : end;
				if(this.diff(end, start) > 7) {
					this.alertMsg = '查询时间的跨度不要超过7天!'
					this.isAlert = !this.isAlert;
					return;
				}
				if(this.diff(end, start) < 0) {
					this.alertMsg = '结束日期早于开始日期!'
					this.isAlert = !this.isAlert;
					return;
				}
				//				if(this.diff(end, start) > 5) {
				//					this.alertMsg = '查询时间段较长时,部分数据可能显示不全'
				//					this.isAlert = !this.isAlert;
				//					return;
				//				}
				this.loadingShow = true;
				this.setTradingHistory(this.account, start, end);
				return;
			},
			nowDate() {
				var myDate = new Date();
				var month = myDate.getMonth() + 1;
				var day = myDate.getDate();
				if(month < 10) {
					month = '0' + month.toString();
				}
				if(day < 10) {
					day = '0' + day.toString();
				}
				var res = myDate.getFullYear() + "" + month + "" + day;
				return res;
			},
			localDate(str) {
				//				return DateFormatter(new Date(str.substr(0, 4), parseInt(str.substr(4, 2)) - 1, str.substr(6, 2), str.substr(8, 2), str.substr(10, 2), str.substr(12, 2)), 'YYYY-MM-DD HH:mm:ss');
				return str.substr(0, 4) + '年' + str.substr(4, 2) + '月' + str.substr(6, 2) + '日 ' + str.substr(8, 2) + ':' + str.substr(10, 2) + ':' + str.substr(12, 2);
			}
		},
		computed: {
			getDate() {
				var myDate = new Date();
				var month = myDate.getMonth() + 1;
				var day = myDate.getDate();
				if(month < 10) {
					month = '0' + month.toString();
				}
				if(day < 10) {
					day = '0' + day.toString();
				}
				return myDate.getFullYear() + "-" + month + "-" + day;
			},
			endRes() {
				return this.res;
			}
		},
		components: {
			Group,
			Cell,
			xButton,
			datetime,
			Acc,
			Alert,
			LoadingTime
		},
		watch: {
			'res': {
				handler: function(val, oldVal) {
					this.loadingShow = false;
					//					this.isClick = false;
					//					this.isAlter = true;
					
					//					if(this.res.length > 90) {
					//						this.alertMsg = '查询数据量较大时,部分数据可能显示不全'
					//						this.isAlert = !this.isAlert;
					//					}
				},
				deep: true
			}
		}
	}
</script>