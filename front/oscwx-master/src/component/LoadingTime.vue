<template>
	<loading :show="loadShow" text="">
		<p>请求处理中,请稍等......</p>
		<p>{{daojishi}}s</p>
	</loading>
	<alert :show.sync="isAlter" title="提示" button-text="确定" @on-hide="onHide">
		<div style="text-align: center;">
			{{{alterContent}}}
		</div>
	</alert>
</template>

<script>
	import loading from "vux/src/components/loading"
	import Alert from "vux/src/components/alert"

	export default {
		props: {
			loadShow: {
				type: Boolean,
				default: false
			},
			title: String,
			buttonText: {
				type: String,
				default: 'OK'
			},
			maskTransition: {
				type: String,
				default: 'vux-fade'
			},
			dialogTransition: {
				type: String,
				default: 'vux-dialog'
			}
		},
		data() {
			return {
				//				loadShow: false,
				timeHandle: null,
				time: 30,
				isClick: false,
				isAlter: false,
				alterContent: '网络超时'
			}
		},
		components: {
			loading,
			Alert
		},
		computed: {
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
		methods: {
			sure() {
				this.isClick = true;
				this.loadShow = true;
				//				this.start = true;
				this.time = 30;
			},
			cancel() {
				window.location.hash = "/myHold/" + this.index;
			},
			onHide() {
				//				window.location.hash = "/myHold/" + index;
				//				window.history.go(-1);
			}
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

<style>

</style>