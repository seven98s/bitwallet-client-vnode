<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
			<titleBar title='红皮书'></titleBar>
			<view class="tab" v-for="(item, index) in redBooks" :key="index">
				<image :src="item" mode=""></image>
			</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		data() {
			return {
				redBooks: new Array<string>(),
				statusBarHeight:0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			for(let i = 1; i <= 51; i++) {
				// this.redBooks.push('http://47.236.254.203:6007/redbook/'+i+'.jpg');
				this.redBooks.push('http://download.bitnetworkbc.com/redbook/'+i+'.jpg');
			}
		}
	});
</script>

<style lang="scss" scoped>
	.home-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		height: 100vh;
		padding: 0rpx 31rpx;
		box-sizing: border-box;
		background-color: #fff;
		background-size: 100% 100%;
		box-sizing: border-box;
		
		.tab {
			margin-top: 20rpx;
			image{
				width: 750rpx;
				height: 1000rpx;
			}
		}
		
		}
</style>