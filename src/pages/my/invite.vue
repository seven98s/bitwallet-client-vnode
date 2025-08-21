<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='邀请好友'></titleBar>
		<image src="@/static/newUI3/my/invite.png" mode="aspectFill" class="invite"></image>
		<view class="promotionSlogan">
			邀请好友，轻松赚币
		</view>
		<view class="tips">
			邀请好友参与BIT Network生态，轻松获取海量奖励
		</view>
		<!-- 邀请记录 -->
		<view class="invitationRecord">
			<view class="title">
				邀请链接
			</view>
			<view class="inviteBox">
				{{apkUrl}}
			</view>
		</view>
		<view class="methodsBox">
			<view class="methods" @click="copy">
				复制邀请链接
			</view>
		</view>
		<view class="loginBox">
			<image src="@/static/newUI3/index/telegram.png" mode="scaleToFill" class="loginMethodsIcon"></image>
			<image src="@/static/newUI3/index/twitter.png" mode="scaleToFill" class="loginMethodsIcon"></image>
			<image src="@/static/newUI3/index/facebook.png" mode="scaleToFill" class="loginMethodsIcon"></image>
			<image src="@/static/newUI3/index/camera.png" mode="scaleToFill" class="loginMethodsIcon"></image>
			<image src="@/static/newUI3/index/Weibo.png" mode="scaleToFill" class="loginMethodsIcon"></image>

		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { UniUtil } from '@/data/util/uniUtil';
	import { VersionData } from '@/data/version/versionData';
	import { BitAccount } from '@/chain/bit/account/account';

	export default Vue.extend({
		data() {
			return {
				qrCode: '',
				statusBarHeight: 0,
				apkUrl: ''
			}
		},
		async onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 22;
			UniUtil.loadShow();

			await VersionData.load().then(async (rs : any) => {
				const { apkUrl } = rs;
				this.apkUrl = apkUrl
				// console.log(apkUrl,'apkUrl');
				const generateRs : any = await BitAccount.generateQrcode(apkUrl);
				this.qrCode = `data:image/png;base64,${generateRs.data}`;
			})
			UniUtil.loadHide();
		},
		methods: {
			copy() {
				uni.setClipboardData({
					data: this.apkUrl,
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
		padding-left: 31rpx;
		padding-right: 31rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-image: url('@/static/newUI3/my/index.png');
		background-size: 100%;
		background-repeat: no-repeat;
		box-sizing: border-box;


		.invite {
			margin-top: 68rpx;
			display: block;
			width: 493rpx;
			height: 556rpx;
		}

		.promotionSlogan {
			margin-top: 22rpx;
			height: 64rpx;
			line-height: 64rpx;
			font-family: PingFang;
			font-weight: bold;
			font-size: 64rpx;
			color: #000000;
		}

		.tips {
			margin-top: 21rpx;
			height: 22rpx;
			line-height: 22rpx;
			font-family: PingFang;
			font-weight: 500;
			font-size: 22rpx;
			color: #000000;
		}

		.invitationRecord {
			width: 617rpx;
			// height: 366rpx;
			margin-top: 83rpx;
			// background-color: skyblue;

			.title {
				width: 100%;
				height: 32rpx;
				line-height: 32rpx;
				font-family: PingFang;
				font-weight: bold;
				font-size: 32rpx;
				color: #000000;
			}

			.describe {
				width: 100%;
				height: 22rpx;
				line-height: 22rpx;
				padding-left: 38rpx;
				margin-top: 36rpx;
				box-sizing: border-box;
				font-family: PingFang;
				font-weight: 500;
				font-size: 22rpx;
				color: #A2A4B0;
			}

			.inviteTotal {
				display: flex;
				align-items: center;
				width: 100%;
				height: 79rpx;
				padding-left: 38rpx;
				margin-top: 15rpx;
				margin-bottom: 52rpx;
				box-sizing: border-box;
				background: #F7F7F7;
				border-radius: 39rpx;
			}

			.inviteBox {
				// display: flex;
				// align-items: center;
				width: 100%;
				height: 79rpx;
				line-height: 79rpx;
				margin-top: 21rpx;
				padding-left: 38rpx;
				box-sizing: border-box;
				background: #F7F7F7;
				border-radius: 39rpx;

				font-family: PingFang;
				font-weight: 500;
				font-size: 22rpx;
				color: #010101;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		.methodsBox {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-top: 54rpx;
			width: 617rpx;


			.methods {
				display: flex;
				justify-content: center;
				align-items: center;
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

		.loginBox {
			display: flex;
			justify-content: space-between;
			margin-top: 44rpx;
			width: 278rpx;
			height: 37rpx;
			margin-bottom: 20rpx;

			// background-color: skyblue;
			.loginMethodsIcon {
				display: block;
				width: 37rpx;
				height: 37rpx;
			}
		}
	}
</style>