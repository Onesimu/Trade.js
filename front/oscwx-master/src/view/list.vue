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
		}
	}
</script>