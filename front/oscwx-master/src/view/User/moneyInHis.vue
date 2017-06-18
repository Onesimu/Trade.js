/* 入金记录 */

<template>
	<div id="moneyInHis">
		<group>
			<datetime title="开始日期" format="YYYY-MM-DD" :value="getDate" :min-year=2016 confirm-text="确认" cancel-text="取消" @on-change="startDate"></datetime>
			<datetime title="结束日期" format="YYYY-MM-DD" :value="getDate" :min-year=2016 confirm-text="确认" cancel-text="取消" @on-change="endDate"></datetime>
		</group>
		<div class="footer">
			<x-button type="primary" @click="btnEvent">查询</x-button>
		</div>
		<div class="noMoneyInHis" v-show="endRes.length == 0">暂无入金记录</div>
		<component v-show="endRes.length > 0" v-for="item in endRes">
			<acc :show="$index==0" :class="{'firstAcc':$index==0}">
				<div class="acc_left" slot="left">
					<span class="name">入金时间：{{item.time}}</span>
					<span class="val">金额：{{item.money}}</span>

				</div>
				<div slot="body">
					<div class="name">
						<span>客户ID</span>
						<span>入金渠道来源</span>
						<span>状态</span>

					</div>
					<div class="val">
						<span>{{item.accountId}}</span>
						<span>{{item.source}}</span>
						<span>{{item.state}}</span>
					</div>
				</div>
			</acc>
		</component>
		<alert :show.sync="isAlert" title="提示" button-text="确定">
			<p style="text-align:center;">查询时间的跨度不要超过30天</p>
		</alert>
	</div>
</template>
<style lang="less">
	.noMoneyInHis {
		height: 100px;
		background: #f8f8f8;
		line-height: 100px;
		text-align: center;
		color: #484848;
		border-bottom: 1px solid #d8d8d8;
		border-top: 1px solid #d8d8d8;
	}
	
	#moneyInHis .operation {
		height: 50px;
		border-bottom: 1px solid #d8d8d8;
		background: #f8f8f8;
	}
	
	#moneyInHis .footer {
		padding: 30px;
	}
	
	#moneyInHis .moneyInHisContent {
		background: #fff;
		width: 1050px;
		padding-bottom: 10px;
	}
	
	.moneyInHisContent ul {
		width: 100%;
		height: 40px;
		display: block;
	}
	
	.moneyInHisContent li {
		float: left;
		width: 100px;
		line-height: 40px;
		text-align: center;
		height: 40px;
		text-align: center;
	}
	
	ul.moneyInHisHd {
		background: #f8f8f8;
	}
	
	.moneyInHisContent li.big {
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
	import { setMoneyInHistory } from "vuex/actions"
	import Group from "vux/src/components/group"
	import Cell from "vux/src/components/cell"
	import xButton from "vux/src/components/x-button"
	import datetime from "vux/src/components/datetime"
	import Acc from "component/Accordion"
	import Alert from "vux/src/components/alert"
	export default {
		data() {
			return {
				start: 0,
				end: 0,
				isAlert: false
			}
		},
		vuex: {
			getters: {
				account: (state) => state.userInfo.account,
				res: (state) => state.moneyInHistory, //成交记录
			},
			actions: {
				setMoneyInHistory
			}
		},
		ready() {
			var date = this.nowDate();
			//this.setMoneyInHistory(this.account,start,end);
			this.getHistory(date, date);
		},
		methods: {
			getHistory(start, end) {
				this.setMoneyInHistory(this.account, start, end);
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
				return parseInt(Math.abs(e - s) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
			},
			btnEvent() {
				var start = this.start;
				var end = this.end;
				start = start == 0 ? this.nowDate() : start;
				end = end == 0 ? this.nowDate() : end;
				if(this.diff(end, start) > 30) {
					this.isAlert = !this.isAlert;
					return;
				}
				this.setMoneyInHistory(this.account, start, end);
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
				//				return this.nowDate();
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
			Alert
		}
	}
</script>