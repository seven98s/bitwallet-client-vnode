<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px' }">
		<titleBar title='备份钱包'></titleBar>
		<view class="tips">
			请谨记以下安全要点
		</view>
		<view class="introduce">
			私钥、助记词一旦泄露，资产即可被他人掌控
		</view>
		<view class="tipList">
			<view class="tipItem" v-for="(item, index) in tips" :key="index">
				<image :src="item.icon" mode="aspectFill" class="tipIcon"></image>
				<view class="tipInfo">
					{{ item.describe }}
				</view>
			</view>
		</view>
		<view class="confirmButton" @click="gotoPage('./backupMnemonic')">
			下一步
		</view>
	</view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
const tips = ref([
	{
		icon: require('@/static/newUI3/index/tip1.png'),
		describe: '任何人，只要持有私钥、助记词，即可将资产转走',
	},
	{
		icon: require('@/static/newUI3/index/tip2.png'),
		describe: '钱包密码仅用于私钥的加密和解密，密码只存储在手机上，请做好密码备份',
	},
	{
		icon: require('@/static/newUI3/index/tip3.png'),
		describe: '请勿对私钥、助记词做截图备份，避免被恶意软件截取',
	},
	{
		icon: require('@/static/newUI3/index/tip4.png'),
		describe: '请正确抄写并保存在安全的地方，勿进行网络传输或存储',
	},
]);

const statusBarHeight = ref(0);

onLoad(() => {
	const systemInfo = uni.getSystemInfoSync();
	statusBarHeight.value = systemInfo.statusBarHeight!;

})

const gotoPage(url: string) {
	uni.navigateTo({
		url
	});
}
</script>

<style lang="scss" scoped>
.home-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100vw;
	min-height: 100vh;
	padding: 0rpx 31rpx;
	box-sizing: border-box;
	background-color: #fff;
	background-size: 100% 100%;
	box-sizing: border-box;

	.tips {
		margin-top: 54rpx;
		display: flex;
		justify-content: center;
		width: 100%;
		height: 30rpx;
		line-height: 30rpx;
		font-family: PingFang;
		font-weight: bold;
		font-size: 30rpx;
		color: #231815;
	}

	.introduce {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 25rpx;
		width: 688rpx;
		height: 62rpx;
		background: #F7F7F7;
		border-radius: 12rpx;

		font-family: PingFang;
		font-weight: bold;
		font-size: 22rpx;
		color: #9E2922;
		line-height: 22rpx;
	}

	.tipList {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		height: 643rpx;
		margin-top: 71rpx;
		padding: 0rpx 57rpx;
		box-sizing: border-box;

		// background-color: pink;
		.tipItem {
			display: flex;
			align-items: center;
			width: 100%;
			height: 141rpx;

			// ps
			// background-color: skyblue;
			.tipIcon {
				display: block;
				width: 123rpx;
				height: 141rpx;
				margin-right: 54rpx;
			}

			.tipInfo {
				width: 396rpx;
				font-family: PingFang;
				font-weight: 500;
				font-size: 22rpx;
				color: #A2A4B0;
				line-height: 27rpx;
			}
		}
	}

	.confirmButton {
		margin-top: 200rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 617rpx;
		height: 79rpx;
		background: #1D1F20;
		border-radius: 39rpx;
		font-family: PingFang;
		font-weight: 800;
		font-size: 28rpx;
		color: #FFFFFF;
	}
}
</style>