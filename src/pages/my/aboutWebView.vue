<template>
	<view class="page">
		<web-view :src="param.url"></web-view>
	</view>
</template>

<script lang="ts">
  import Vue from 'vue';

	export default Vue.extend({
		data() {
			return {
				param: {
					url: '',
				}
			}
		},
		onLoad(query: any) {
			this.param.url = query.url;
		}
	});
</script>

<style lang="scss" scoped>
</style>