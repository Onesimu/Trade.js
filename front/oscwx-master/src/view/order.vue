<template>
	<div id="order">
		<template v-if="hotData[key]">
			<group :title="tradName">
				<cell title="最新价格" :value="newPrice"></cell>
				<x-number title="购买手数" :value.sync="buyNum" :min=1 :max=10></x-number>
				<selector title="止盈止损" :value.sync="curSelect" :options="selectOptions"></selector>
				<radio v-show="curSelect=='template'" :options="radioData" :value.sync="selectRadioData"></radio>
				<switch v-show="curSelect=='point'" title="触发止损" :value.sync="isLow"></switch>
				<x-number v-show="isLow" title="止损价格" :width="120" :value.sync="lowPrice" :step="minUnit"></x-number>
				<switch v-show="curSelect=='point'" title="触发止盈" :value.sync="isWin"></switch>
				<x-number v-show="isWin" title="止盈价格" :width="120" :value.sync="winPrice" :step="minUnit"></x-number>
			</group>
			<div class="order_bottom">
				<x-button :disabled="isClick" :type="this.type==1?'warn':'primary'" @click="clickBtn">{{this.type==1?'确定买涨':'确定买跌'}}</x-button>
				<x-button type="default" @click="cancel">取消</x-button>
			</div>
			<loading :show="loadShow" text="">
				<p>请求处理中,请稍等......</p>
				<p>{{daojishi}}s</p>
			</loading>
			<alert :show.sync="openOrder.isShow" :title="openOrder.msg" button-text="确定" @on-hide="onHide">
				<div style="text-align:center;">
					<p>持仓编号:{{openOrder.id}}</p>
					<p>合约代码:{{openOrder.code}}</p>
					<p>成交价格:{{openOrder.price| currency '' '2'}}</p>
					<p>手续费:{{openOrder.poundage| currency '' '2'}}</p>
				</div>
			</alert>
			<alert :show.sync="errPrice" title="提示" button-text="确定">
				<div id="orderHint" style="text-align: center;"></div>
			</alert>
			<alert :show.sync="isAlter" title="提示" button-text="确定" @on-hide="onHide">
				<div style="text-align: center;">
					{{{alterContent}}}
				</div>
			</alert>
		</template>
	</div>
</template>
<style lang="less">
	#order .weui_cells {
		margin-top: 10px;
	}
	
	#order .order_bottom {
		margin-top: 10px;
		padding: 10px;
	}
	
	#order .vux-number-selector {
		height: 26px;
		font-size: 25px;
		/*	color: #268bf2;*/
	}
	
	#order .vux-number-input {
		height: 26px;
	}
</style>
<script>
	import { setOpenOrder } from "vuex/actions"
	import Group from "vux/src/components/group"
	import Cell from "vux/src/components/cell"
	import xNumber from "vux/src/components/x-number"
	import xInput from "vux/src/components/x-input"
	import Radio from "vux/src/components/radio"
	import xButton from "vux/src/components/x-button"
	import Alert from "vux/src/components/alert"
	import Switch from "vux/src/components/switch"
	import Selector from "vux/src/components/selector"
	import loading from "vux/src/components/loading"
	export default {
		data() {
			return {
				type: 0, //买多（1）还是买空（-1）
				key: 0,
				buyNum: 1, //购买手数
				isLow: false, //止损是否显示
				lowPrice: "", //止损价
				isWin: false, //止盈是否显示
				winPrice: "", //止盈价
				options: ['即时买入'],
				errPrice: false,
				minUnit: 0.5,
				isClick: false,
				selectOptions: [{
						key: 'template',
						value: "模板止损"
					},
					{
						key: 'point',
						value: "点位止损"
					}
				],
				curSelect: "",
				//                radioData:[
				//                    {key:"0.5",value : "0.5倍保证金"},
				//                    {key:"1",value : "1倍保证金"},
				//                    {key:"2",value : "2倍保证金"}
				//                ],
				selectRadioData: "0.5",
				loadShow: false,
				timeHandle: null,
				time: 30,
				isAlter: false,
				alterContent: '网络超时'
			}
		},
		vuex: {
			getters: {
				hotData: (state) => state.hotContract,
				account: (state) => state.userInfo.account,
				openOrder: (state) => state.openState
			},
			actions: {
				setOpenOrder
			}
		},
		components: {
			Group,
			Cell,
			xNumber,
			xInput,
			Radio,
			xButton,
			Alert,
			Switch,
			Selector,
			loading
		},
		methods: {
			clickBtn() {
				this.isClick = true;
				//				var _this = this;
				//				clearTimeout(window.orderClickTime);
				//				window.orderClickTime = setTimeout(function() {
				//					_this.isClick = false;
				//				}, 1500);
				if(this.curSelect == "point") {
					if(this.type == 1) {
						if(this.winPrice <= this.newPrice && this.isWin) {
							$("#orderHint").html("止盈价必须大于最新价");
							this.errPrice = true;
							return;
						} else if(this.lowPrice >= this.newPrice && this.isLow) {
							$("#orderHint").html("止损价必须小于最新价");
							this.errPrice = true;
							return;
						}
					} else {
						if(this.winPrice >= this.newPrice && this.isWin) {
							$("#orderHint").html("止盈价必须小于最新价");
							this.errPrice = true;
							return;
						} else if(this.lowPrice <= this.newPrice && this.isLow) {
							$("#orderHint").html("止损价必须大于最新价");
							this.errPrice = true;
							return;
						}
					}

				} else if(this.curSelect == 'template') {
					var curData = this.hotData[this.key];
					if(this.type == 1) { //买多
						//this.lowPrice = 当前价 - 保证金 * 倍数 / （第5个字段*第6个字段）* 最小波动单位
						//this.winPrice = 当前价 + 保证金 * 倍数 * 2 / （第5个字段*第6个字段） * 最小波动单位
						this.lowPrice =
							this.newPrice - curData.holdCash * this.selectRadioData / (curData.minUnit * curData.oneCost) * curData.minUnit;
						this.winPrice =
							this.newPrice + curData.holdCash * this.selectRadioData * 2 / (curData.minUnit * curData.oneCost) * curData.minUnit;
					} else {
						this.lowPrice =
							this.newPrice + curData.holdCash * this.selectRadioData / (curData.minUnit * curData.oneCost) * curData.minUnit;
						this.winPrice =
							this.newPrice - curData.holdCash * this.selectRadioData * 2 / (curData.minUnit * curData.oneCost) * curData.minUnit;
					}
				}
				var myDate = new Date();
				var ymd = "" + myDate.getFullYear() + (myDate.getMonth() + 1) + myDate.getDate();
				var hms = "" + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds();
				var lowPri = this.lowPrice;
				var winPri = this.winPrice;

				if(this.curSelect == "") {
					lowPri = "";
					winPri = "";
				}

				if(this.curSelect == 'point') {
					if(this.isLow == false) {
						lowPri = "";
					}
					if(this.isWin == false) {
						winPri = "";
					}
				}

				this.setOpenOrder({
					account: this.account,
					name: this.key,
					type: this.type,
					buyNum: this.buyNum,
					lowPrice: lowPri,
					winPrice: winPri,
					ymd: ymd,
					hms: hms,
					isClick: true
				});
				this.loadShow = true;
				this.start = true;
				this.time = 30;
			},
			onHide() {
				//				window.history.go(-1);
				window.location.hash = "/tradInfo/" + this.key + "/" + this.hotData[this.key].cn + "/" + this.hotData[this.key].cur;
				//				this.cancel();
				//				v-link="{ name: 'tradInfo', params: { id: item.code,name:item.cn,cur:item.cur}}"
			},
			cancel() {
				window.location.hash = "/tradInfo/" + this.key + "/" + this.hotData[this.key].cn + "/" + this.hotData[this.key].cur;
			}
		},
		ready() {
			//买多（1）还是买空（-1）
			this.lowPrice = this.winPrice = this.hotData[this.key].newPrice;
			if(this.hotData[this.key].minUnit != 0) {
				this.minUnit = this.hotData[this.key].minUnit;
			}
		},
		computed: {
			tradName() {
				return this.hotData[this.key].cn + " -- " + this.key;
			},
			newPrice() {
				return this.hotData[this.key].newPrice;
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
			},
			radioData() {
				//                if(this.type == 1){ //买多
				//                    //止盈点差 = 持仓保证金 * 倍数 * 2 / （第5个字段*第6个字段）
				//                    //止损点差 = 持仓保证金 * 倍数 / （第5个字段*第6个字段）
				//                }else{
				//                    //止盈点差 = 持仓保证金 * 倍数 * 2 / （第5个字段*第6个字段）
				//                }
				let curData = this.hotData[this.key],
					// d =    curData.holdCash / (curData.minUnit * curData.oneCost);
					d = curData.holdCash;
				let curs = {
					CNY: '人民币',
					USD: '美元',
					EUR: '欧元',
					HKD: '港币'
				};
				let cur = curs[curData.cur];
				return [{
						key: "0.5",
						value: "止损" + d * 0.5 + cur + ",止盈" + d * 0.5 * 2 + cur
					},
					{
						key: "1",
						value: "止损" + d * 1 + cur + ",止盈" + d * 1 * 2 + cur
					},
					{
						key: "2",
						value: "止损" + d * 2 + cur + ",止盈" + d * 2 * 2 + cur
					}
				];
			}
		},
		watch: {
			'openOrder': {
				handler: function(val, oldVal) {
					this.start = false;
					this.time = 30;
					this.loadShow = false;
					//					this.isClick = false;
					//					this.isAlter = true;
					if(this.openOrder.state == "00") {
						this.alterContent = '';
					} else {
						this.alterContent = '';
					}
				},
				deep: true
			}
		},
		route: {
			data(res) {
				if(res.to.name == "order") {
					this.type = res.to.params.type;
					this.key = res.to.params.id;
				}
			}
		}
	}
</script>