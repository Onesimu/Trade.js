<template>
	<div>
		<k-title>
			<span slot="title" style="color:#268bf2; font-weight: 700; font-size:12px;">重磅快讯</span>
		</k-title>
		<k-new></k-new>
	</div>
</template>
<script>
	import KTitle from "component/Title" //标题
	import KNew from "component/KNew" //重磅快讯
	export default {
		components: {
			KTitle,
			KNew
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