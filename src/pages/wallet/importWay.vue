<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='导入钱包'></titleBar>
		<view class="importWayList">
			<view class="importWayItem" v-for="(item,index) in importWays" :key="index" @click="gotoFun(item.gotoPage)">
				<image :src="item.icon" mode="widthFix" class="importWayIcon"></image>
				<view class="importWayInfo">
					<view class="importWayTitle">
						{{ item.title }}
					</view>
					<view class="importWayIntroduce">
						{{ item.describe }}
					</view>
				</view>
				<image src="@/static/newUI3/index/rightArrow.png" mode="widthFix" class="rightArrow"></image>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		data() {
			return {
				importWays: [
					{
						icon: require('@/static/wallet/importWay/mnemonic.png'),
						title: '助记词导入',
						describe: '通过输入助记词或扫描二维码进行导入',
						gotoPage: './importMnemonic',
					},
					{
						icon: require('@/static/wallet/importWay/privateKey.png'),
						title: '私钥导入',
						describe: '通过输入明文私钥或扫描二维码进行导入',
						gotoPage: './importPrivateKey',
					},
					{
						icon: require('@/static/wallet/importWay/observe.png'),
						title: '观察钱包导入',
						describe: '无需导入私钥，输入账号或对应公钥即可导入',
						gotoPage: './importObserve',
					},
				],
				statusBarHeight: 0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		methods: {
			gotoFun(page : string) {
				uni.navigateTo({
					url: page
				});
			},

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
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		.importWayList {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
			height: 604rpx;
			margin-top: 54rpx;
			// background-color: pink;

			.importWayItem {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: 185rpx;
				// background-color: skyblue;
				background-color: #fff;
				border-radius: 20rpx;
				padding: 51rpx 27rpx 52rpx 26rpx;
				box-sizing: border-box;

				.importWayIcon {
					display: block;
					width: 82rpx;
					height: 82rpx;
					margin-right: 19rpx;
					
				}

				.importWayInfo {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					// width: 430rpx;
					flex: 1;
					height: 68rpx;

					.importWayTitle {
						color: #231815;
						font-family: PingFang;
						font-weight: 700;
						font-size: 32rpx;
						line-height: 32rpx;
					}

					.importWayIntroduce {
						color: #A2A4B0;
						font-family: PingFang;
						font-weight: bold;
						font-size: 22rpx;
						line-height: 22rpx;
					}

				}
			}
		}

		.rightArrow {
			display: block;
			width: 20rpx;
		}
	}
</style>