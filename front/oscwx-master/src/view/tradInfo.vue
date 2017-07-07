<template>
	<div id="tradInfo">

		<div class="viewTxt" v-if="hotData[key]">
			<div class="row first" v-show="isLogin">
				<span class="yue">最新权益:{{balance}}</span>
				<span class="win">盈亏:{{yingkui}}</span>
			</div>
			<div class="row two">
				<span class="tradName">
                        <span class="cn">{{hotData[key].cn}}</span>
				<span class="code">{{hotData[key].code}}</span>
				</span>
				<span class="tradPrice" :class="{'price-red':hotData[key].upDown>0,'price-green':hotData[key].upDown<=0}">{{hotData[key].newPrice == 'none' ?'--':hotData[key].newPrice}}</span>
				<span class="tradupDown" :class="{'price-red':hotData[key].upDown>0,'price-green':hotData[key].upDown<=0}">{{hotData[key].upDown == 'no' ?'--':hotData[key].upDown}}</span>
			</div>
			<div class="row third">
				<template v-if="hotData[key].newPrice != 'none'">
					<span>卖价:{{hotData[key].saleOnePri}}</span>
					<span>买价:{{hotData[key].buyOnePri}}</span>
				</template>
			</div>
		</div>
		<div class="tradFooter">
			<span class="hold" @click="holdEvent">持仓</span>
			<span class="highBtn" @click="highEvent">买涨</span>
			<span class="lowBtn" @click="lowEvent">买跌</span>
		</div>
		<alert :show.sync="isAlert" title="提示" button-text="确定" @on-hide="onHide">
			<p style="text-align:center;">请先登录账户</p>
		</alert>

		<div id=container_char style='padding-top:10px;'></div>
		<div class=mh-group>
			<ul>
				<li>
					<a @click=fenshiChart>分时</a>
				</li>
				<li>
					<a @click=oneMinChart(1)>1分钟</a>
				</li>
				<li>
					<a @click=oneMinChart(5)>5分钟</a>
				</li>
				<li>
					<a @click=oneMinChart(30)>30分钟</a>
				</li>
			</ul>
		</div>

	</div>
</template>

<style lang="less">
	#tradInfo {
		height: 100%;
	}
	
	#tradInfo .view {
		width: 100%;
		height: 200px;
		background: #E9F2FA;
		margin-bottom: 10px;
	}
	
	#tradInfo .viewTxt {
		width: 100%;
		height: 130px;
		background: #fff;
		color: #484848;
	}
	
	#tradInfo .viewTxt .row {
		height: 40px;
		border-bottom: 1px solid #f0f0f0;
		padding: 0 10px;
	}
	
	#tradInfo .viewTxt .row.two {
		height: 50px;
	}
	
	#tradInfo .viewTxt .first span {
		width: 50%;
		display: inline-block;
		float: left;
		line-height: 40px;
	}
	
	#tradInfo .viewTxt .first span:last-child {
		text-align: right;
	}
	
	#tradInfo .viewTxt .two>span {
		line-height: 50px;
		display: inline-block;
		float: left;
	}
	
	#tradInfo .viewTxt .two .tradName {
		width: 30%;
	}
	
	#tradInfo .viewTxt .two .tradName>span {
		display: block;
	}
	
	#tradInfo .viewTxt .two .tradName .cn {
		height: 30px;
		line-height: 41px;
		font-size: 17px;
	}
	
	#tradInfo .viewTxt .two .tradName .code {
		height: 20px;
		line-height: 16px;
		font-size: 12px;
		color: #aaa;
	}
	
	#tradInfo .viewTxt .two .tradPrice {
		width: 40%;
		font-size: 24px;
		font-weight: 700;
		text-align: center;
	}
	
	#tradInfo .viewTxt .two .tradupDown {
		width: 30%;
		font-size: 17px;
		text-align: right;
	}
	
	#tradInfo .viewTxt .third span {
		width: 50%;
		display: inline-block;
		float: left;
		line-height: 40px;
	}
	
	#tradInfo .viewTxt .third span:first-child {
		border-right: 1px solid #f0f0f0;
	}
	
	#tradInfo .viewTxt .third span:last-child {
		padding-left: 10px;
	}
	
	#tradInfo .viewTxt .third .hint {
		text-align: center;
		line-height: 40px;
		font-size: 22px;
	}
	
	#tradInfo .tradFooter {
		width: 100%;
		height: 40px;
	}
	
	#tradInfo .tradFooter span {
		width: 35%;
		display: inline-block;
		float: left;
		line-height: 40px;
		text-align: center;
		font-size: 16px;
		color: #fff;
	}
	
	#tradInfo .tradFooter span:first-child {
		width: 30%;
		background: #BCBCBC;
	}
	
	#tradInfo .tradFooter .highBtn {
		background: #ee3800;
	}
	
	#tradInfo .tradFooter .lowBtn {
		background: green;
	}
	
	#tradInfo ul,
	li {
		list-style: none;
		padding: 0;
	}
	
	#tradInfo a {
		text-decoration: none;
	}
	
	.mh-group {
		padding-top: 6px;
	}
	
	.mh-group ul {
		overflow: hidden;
		background: #10162A;
		height: 40px;
		border-radius: 5px;
		border: 1px solid #1C4074;
	}
	
	.mh-group li {
		float: left;
		width: 25%;
		height: 40px;
		line-height: 40px;
	}
	
	.mh-group li a {
		color: #FFF;
		font-family: "微软雅黑";
		font-size: 14px;
		text-align: center;
		display: block;
		width: 100%;
		height: 100%;
		transition: all 0.3s;
		border-radius: 3px;
		opacity: 0.8;
	}
	
	.mh-group li a:hover {
		background: #0C206A;
		opacity: 1;
	}
</style>

<script>
	import Alert from "vux/src/components/alert"
	import { getUserMoney, setMyHold } from "vuex/actions"
	export default {
		data() {
			return {
				key: "", //传送来的key,
				cur: "", //币种
				isAlert: false
			}
		},
		methods: {
			onHide() {
				window.location.hash = "/login";
			},
			holdEvent() {
				//v-link="{path:'/myHold/0'}"
				if(!this.isLogin) {
					this.isAlert = true;
					return;
				}
				window.location.hash = "/myHold/0/";
			},
			highEvent() {
				//v-link="{name:'order',params:{type:1,id:key}}"
				if(!this.isLogin) {
					this.isAlert = true;
					return;
				}
				window.location.hash = "/order/1/" + this.key;
			},
			lowEvent() {
				//v-link="{name:'order',params:{type:-1,id:key}}"
				if(!this.isLogin) {
					this.isAlert = true;
					return;
				}
				window.location.hash = "/order/-1/" + this.key;
			},
			fenshiChart() {
				//				var v_min = $("[name='charSelectName']").val();
				//				var v_code = $("#tradInfo .viewTxt .row.two .tradName span:eq(1)").text();
				let v_code = this.key;
				tickChart(v_code);
			},
			oneMinChart(v_min) {
				//				var v_code = $("#tradInfo .viewTxt .row.two .tradName span:eq(1)").text();
				let v_code = this.key;
				candle(v_code, v_min);
			}
		},
		components: {
			Alert
		},
		vuex: {
			getters: {
				hotData: (state) => state.hotContract,
				isLogin: (state) => state.userInfo.isLogin,
				account: (state) => state.userInfo.account,
				userMoney: (state) => state.userMoney, //客户资金
				myHold: (state) => state.myHold //客户持仓
			},
			actions: {
				getUserMoney,
				setMyHold
			}
		},
		ready() {
			if(this.isLogin) {
				this.getUserMoney(this.account);
				this.setMyHold(this.account);
			};
			candle(this.key, 5);
		},
		computed: {
			yingkui() {
				if(!this.isLogin) {
					return;
				}
				var sum = 0;
				for(let v in this.myHold) {
					var myHold = this.myHold[v];
					if(myHold.cur == this.cur && this.hotData[myHold.tradName]) {
						if(myHold.direction == 1) {
							if(this.hotData[myHold.tradName].newPrice != 'none') {
								sum += parseFloat((this.hotData[myHold.tradName].newPrice - myHold.price) * this.hotData[myHold.tradName].oneCost * myHold.holdNum - myHold.poundage);
							} else {
								sum += parseFloat(myHold.winLoss);
							}
						} else {
							if(this.hotData[myHold.tradName].newPrice != 'none') {
								sum += parseFloat((myHold.price - this.hotData[myHold.tradName].newPrice) * this.hotData[myHold.tradName].oneCost * myHold.holdNum - myHold.poundage);
							} else {
								sum += parseFloat(myHold.winLoss);
							}
						}
					}
				}
				return sum.toFixed(2);
			},
			balance() {
				//未登陆的时候不计算
				if(!this.isLogin) {
					return;
				}
				var sum = 0;
				for(let v of this.userMoney) {
					if(v.cur == this.cur) {
						sum = v.val;
						break;
					}
				}
				//计算该币种的盈亏
				/*
				 * {{item.direction == 1 ? ((hotContract[item.tradName].newPrice - item.price ) * hotContract[item.tradName].oneCost * item.holdNum - item.poundage).toFixed(2):((item.price - hotContract[item.tradName].newPrice) * hotContract[item.tradName].oneCost * item.holdNum - item.poundage).toFixed(2)}}
				 * */
				for(let v in this.myHold) {
					var myHold = this.myHold[v];
					if(myHold.cur == this.cur && this.hotData[myHold.tradName]) {
						if(myHold.direction == 1) {
							if(this.hotData[myHold.tradName].newPrice != 'none') {
								sum += parseFloat((this.hotData[myHold.tradName].newPrice - myHold.price) * this.hotData[myHold.tradName].oneCost * myHold.holdNum - myHold.poundage);
							} else {
								sum += parseFloat(myHold.winLoss);
							}
						} else {
							if(this.hotData[myHold.tradName].newPrice != 'none') {
								sum += parseFloat((myHold.price - this.hotData[myHold.tradName].newPrice) * this.hotData[myHold.tradName].oneCost * myHold.holdNum - myHold.poundage);
							} else {
								sum += parseFloat(myHold.winLoss);
							}
						}
					}
				}
				return sum.toFixed(2);
			}
		},
		route: {
			data({
				to: {
					params: {
						id,
						name,
						cur
					}
				}
			}) {
				this.key = id;
				this.cur = cur;
				//				candle(this.key, 1);
			}
			//			activate(transition) {
			//				candle(transition.to.params.id, 1);
			//			}
		},
		//		created() {
		//			// 组件创建完后获取数据，
		//			// 此时 data 已经被 observed 了
		//			candle(this.key, 1);
		//		},
		events: {
			"hide" () {
				clearInterval(window.interval);
			}
		},
		beforeRouteLeave(to, from, next) {
			// 导航离开该组件的对应路由时调用
			// 可以访问组件实例 `this`
			clearInterval(window.interval);
		}
	}
</script>