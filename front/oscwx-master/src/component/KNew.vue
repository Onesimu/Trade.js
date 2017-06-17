<template>
	<div id="news">
		<ul>
			<li v-for="item in news" track-by="$index">
				<div v-if="$index==0" class="day">
					<p>{{day}}</p>
					<p>{{month}}月</p>
				</div>
				<div class="timeLine">
					<div class="dogbg">
						<div class="dog"></div>
					</div>
					<div class="time">{{item.time}}</div>
				</div>
				<div class="newContent">{{{item.val}}}</div>
			</li>
		</ul>
	</div>
</template>

<style lang="less">
	#news {
		background: #fff;
		padding: 20px 0 10px 20px;
	}
	
	#news ul {
		border-left: 1px solid #d8e6f2;
	}
	
	#news li {
		position: relative;
	}
	
	#news li .day {
		background: #fff;
		position: absolute;
		width: 28px;
		height: 30px;
		border: 1px solid #1B7ECC;
		display: block;
		top: -11px;
		left: -13px;
		z-index: 1;
	}
	
	#news li .day p {
		font-size: 12px;
		line-height: 14px;
		color: #1B7ECC;
		text-align: center;
	}
	
	#news li .day p:first-child {
		font-weight: 700;
	}
	
	#news li .timeLine {
		border-top: 1px solid #d8e6f2;
		width: 77px;
		height: 15px;
		position: relative;
	}
	
	#news li .dogbg {
		position: absolute;
		left: -5px;
		top: -5px;
		width: 10px;
		height: 10px;
		background-color: #e9eff4;
		border-radius: 50%;
	}
	
	#news .dog {
		width: 4px;
		height: 4px;
		margin: 3px;
		background-color: #1b7ecc;
		border-radius: 50%;
	}
	
	#news .time {
		position: absolute;
		right: -6px;
		top: -11px;
		font-size: 11px;
		width: 60px;
		height: 18px;
		line-height: 19px;
		border-radius: 11px;
		text-align: center;
		color: #1b7ecc;
		background-color: #E9F2FA;
	}
	
	#news li .newContent {
		padding: 0 15px 20px 26px;
		color: #555555;
		font-size: 12px;
		line-height: 20px;
	}
</style>

<script>
	export default {
		data() {
			return {
				news: []
			}
		},
		methods: {
			getNews() {
				var t = this;
				$.ajax({
					url: '//m.jin10.com/flash',
					data: {
						maxId: 0,
						count: 30
					},
					dataType: 'jsonp',
					jsonp: 'jsonpCallback',
					success: function(json) {
						var datas = new Array();
						for(var i = 0; i < json.length; i++) {
							var v_d = json[i];
							if(v_d.indexOf("image") != -1) continue;
							if(v_d.indexOf(".png") != -1) continue;
							datas.push(v_d);

						}
						for(var n = [], i = 0; i < datas.length; i++) {
							var v_data = datas[i];
							var v_dataArr = v_data.split("#");
							var o = new Object;
							o.val = v_dataArr[3], o.time = t.initTime(v_dataArr[2]), n.push(o)
						}
						t.news = n
					}
				})
			},
			initTime: function(t) {
				return t.split(" ")[1]
			}
		},
		computed: {
			month() {
				var date = new Date();
				return date.getMonth() + 1;
			},
			day() {
				var date = new Date();
				return date.getDate();
			}
		},
		ready() {
			this.getNews();
			//			clearTimeout(window.getNewTime);
			//			window.getNewTime = setInterval(this.getNews, 1000 * 60);
		},
		events: {
			"hide" () {
				clearTimeout(window.getNewTime);
			}
		},
		beforeRouteLeave(to, from, next) {
			// 导航离开该组件的对应路由时调用
			// 可以访问组件实例 `this`
			clearTimeout(window.getNewTime);
		}
	}
</script>