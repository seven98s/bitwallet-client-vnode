<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='收款'></titleBar>
		<view class='cards'>
			<image src="@/static/newUI3/index/bit.png" mode="aspectFill" class="logo"></image>
			<view class="title">
				BIT Network
			</view>
			<view class="introduce">
				# 仅向该地址转入BIT相关资产 #
			</view>
			<view class="scanBox">
				<image :src="qrCode" mode="a" class="qrCode"></image>
			</view>
			<view class="receivingAddress">
				收款地址
			</view>
			<view class="addressBox">
				{{address}}
			</view>
		</view>
		<view class="confirmButton" @click="copy">
			复制并分享
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import QRCode from 'qrcode';
	import { BitAccount } from '@/chain/bit/account/account';
	import { WalletData } from '@/data/wallet/walletData';
	import { UniUtil } from '@/data/util/uniUtil';

	export default Vue.extend({
		data() {
			return {
				address: '',
				qrCode: '',
				statusBarHeight: 0,
			}
		},
		async onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			UniUtil.loadShow();
			this.address = WalletData.account.address;

			const generateRs : any = await BitAccount.generateQrcode(this.address);
			this.qrCode = `data:image/png;base64,${generateRs.data}`;
			// console.log(this.qrCode)

			// const canvas = await QRCode.toCanvas(this.address, {
			// 	// width: 256,
			// 	errorCorrectionLevel: 'H',
			// 	color: {
			// 		dark: '#000000',
			// 		light: '#d3ad78'
			// 	}
			// });
			// this.qrCode = canvas.toDataURL('image/png');
			UniUtil.loadHide();
		},
		methods: {
			copy() {
				uni.setClipboardData({
					data: this.address,
					success: function () {
						uni.showToast({
							title: '复制成功',
							icon: 'success',
							duration: 2000
						});
					}
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
		min-height: 100vh;
		padding: 0rpx 31rpx 20rpx 31rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		.cards {
			display: flex;
			flex-direction: column;
			// justify-content: center;
			align-items: center;
			margin-top: 59rpx;
			width: 688rpx;
			height: 1108rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			padding: 47rpx 40rpx 45rpx 31rpx;
			box-sizing: border-box;

			.logo {
				display: block;
				width: 96rpx;
				height: 96rpx;
			}

			.title {
				margin-top: 26rpx;
				width: 100%;
				height: 23rpx;
				font-family: PingFang;
				font-weight: bold;
				font-size: 23rpx;
				color: #000000;
				line-height: 23rpx;
				text-align: center;
			}

			.introduce {
				margin-top: 27rpx;
				width: 100%;
				height: 23rpx;
				font-family: PingFang;
				font-weight: 500;
				font-size: 23rpx;
				color: #A2A4B0;
				line-height: 23rpx;
				text-align: center;
			}

			.scanBox {
				margin-top: 44rpx;
				width: 617rpx;
				height: 621rpx;
				background-image: url('@/static/newUI3/transaction/collectionBackground.png');
				background-size: 100% 100%;
				// border: 1rpx solid #ccc;
				// border-radius: 20rpx;
				// box-sizing: border-box;

				// background: pink;
				.qrCode {
					display: block;
					width: 617rpx;
					height: 621rpx;
				}
			}

			.receivingAddress {
				margin-top: 43rpx;
				width: 100%;
				height: 23rpx;
				font-family: PingFang;
				font-weight: 500;
				font-size: 23rpx;
				color: #A2A4B0;
				line-height: 23rpx;
				text-align: center;
			}

			.addressBox {
				margin-top: 17rpx;
				width: 617rpx;
				// height: 136rpx;
				background: #F7F7F7;
				border-radius: 25rpx;
				padding: 24rpx 43rpx;
				box-sizing: border-box;
				word-break: break-all;
				
				font-family: PingFang;
				font-weight: 500;
				font-size: 25rpx;
				color: #1D1F20;
				line-height: 25rpx;
			}
		}
		.confirmButton {
			margin-top: 41rpx;
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