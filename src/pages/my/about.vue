<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='关于BIT Network'></titleBar>
		<image src="@/static/newUI3/my/bitNetwork.png" mode="aspectFill" class="bitNetwork"></image>
		<view class="appName">
			BIT WALLET
		</view>
		<view class="version">
			当前版本：{{ show.currentVersion }}
		</view>
		<view class="methodsList">
			<view class="methodBox" @click="upgrade">
				<view class="left">
					版本更新
				</view>
				<view class="right">
					<view class="versionNumber">
						最新版本：{{ show.newVersion }}
					</view>
					<image src="@/static/newUI3/my/more.png" mode="aspectFill" class="more"></image>
				</view>
			</view>
			<view class="methodBox" @click="showToast('BIT开源代码')">
				<view class="left">
					BIT开源代码
				</view>
				<view class="right">
					<image src="@/static/newUI3/my/more.png" mode="aspectFill" class="more"></image>
				</view>
			</view>
			<view class="methodBox" @click="gotoPage('./redBook')">
				<view class="left">
					BIT红皮书
				</view>
				<view class="right">
					<image src="@/static/newUI3/my/more.png" mode="aspectFill" class="more"></image>
				</view>
			</view>
		</view>
		<view class='title'>
			官方渠道
		</view>
		<view class="contactChannels">
			<view class="channel" @click="copy('http://bitnetworkbc.com')">
				<image src="@/static/newUI3/my/officialWebsite.png" mode="aspectFill" class="channelIcon"></image>
				<view class="channelName">
					官网
				</view>
			</view>
			<view class="channel"   @click="copy('https://x.com/b_incubator')">
				<image src="@/static/newUI3/my/twittwe.png" mode="aspectFill" class="channelIcon"></image>
				<view class="channelName">
					Twitter
				</view>
			</view>
			<view class="channel" @click="copy('https://t.me/+kBo2NuSmbeY4ZDQ9htt')">
				<image src="@/static/newUI3/my/telegram.png" mode="aspectFill" class="channelIcon"></image>
				<view class="channelName">
					Telegram 
				</view>
			</view>
			<view class="channel"  @click="copy('BIT-network@outlook.com')">
				<image src="@/static/newUI3/my/email.png" mode="aspectFill" class="channelIcon"></image>
				<view class="channelName">
					Email
				</view>
			</view>
		</view>
		<VersionPopup :show="param.versionShow" @versionPopupshow="versionPopupshow" :refresh="param.refresh">
		</VersionPopup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import VersionPopup from '@/components/versionPopup.vue';
	import { UniUtil } from '@/data/util/uniUtil';
	import { VersionData } from '@/data/version/versionData';

	export default Vue.extend({
		components: { VersionPopup },
		data() {
			return {
				show: {
					currentVersion: '',
					newVersion: '',
				},
				param: {
					refresh: 0,
					versionShow: false,
				},
				statusBarHeight: 0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		async onShow() {
			UniUtil.loadShow();
			this.param.refresh += 1;

			const systemInfo = uni.getSystemInfoSync();
			const appVersion = systemInfo.appVersion;
			this.show.currentVersion = appVersion;

			const versionData : any = await VersionData.load();
			this.show.newVersion = versionData.version;

			UniUtil.loadHide();
		},
		methods: {
			versionPopupshow(show : boolean) {
				this.param.versionShow = show;
			},
			upgrade() {
				if (this.show.currentVersion === this.show.newVersion) {
					UniUtil.toastError('已是最新版本');
					return;
				}
				this.param.versionShow = true;
			},
			gotoPage(url : string) {
				uni.navigateTo({
					url
				});
			},
			toWebView(url : string) {
				uni.navigateTo({
					url: './aboutWebView?url=' + url
				});
			},
			copy(url : string) {

				UniUtil.copy(url);
			},
			showToast(tips : string) {
				uni.showToast({
					title: `${tips}功能待定`, // 提示的内容
					icon: 'none', // 图标，有效值 'success'、'loading'、'none'
					duration: 2000, // 提示的延迟时间，单位毫秒，默认 1500
					mask: false // 是否显示透明蒙层，防止触摸穿透，默认 false
				});
			}
		}
	});
</script>

<style>
</style>
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

		.bitNetwork {
			margin-top: 244rpx;
			display: block;
			width: 166rpx;
			height: 166rpx;
		}

		.appName {
			margin-top: 27rpx;
			font-family: PingFang;
			font-weight: 600;
			font-size: 37rpx;
			color: #231815;
			line-height: 37rpx;
		}

		.version {
			margin-top: 15rpx;
			font-family: PingFang;
			font-weight: 500;
			font-size: 22rpx;
			color: #838383;
			line-height: 22rpx;
		}

		.methodsList {
			margin-top: 55rpx;
			width: 688rpx;
			height: 280rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			padding: 5rpx 36rpx;
			box-sizing: border-box;

			.methodBox {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: 90rpx;
				border-bottom: 1rpx solid #ccc;

				.left {
					font-family: PingFang;
					font-weight: bold;
					font-size: 30rpx;
					color: #231815;
				}

				.right {
					display: flex;
					height: 21rpx;

					.versionNumber {
						font-family: PingFang;
						font-weight: 500;
						font-size: 21rpx;
						color: #9E2922;
						line-height: 21rpx;
						margin-right: 20rpx;
					}

					.more {
						display: block;
						width: 12rpx;
						height: 21rpx;
					}
				}
			}

			& .methodBox:last-child {
				border: none;
			}
		}

		.title {
			width: 100%;
			height: 30rpx;
			font-family: PingFang;
			font-weight: bold;
			font-size: 30rpx;
			color: #231815;
			line-height: 30rpx;
			margin-top: 35rpx;
			padding-left: 36rpx;
			box-sizing: border-box;
		}
		.contactChannels {
			display: flex;
			justify-content: space-between;
			width: 688rpx;
			height: 204rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			margin-top: 20rpx;
			padding: 35rpx 36rpx;
			box-sizing: border-box;
			.channel{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 95rpx;
				height: 132rpx;
				// background-color: pink;
				.channelIcon {
					display: block;
					width: 95rpx;
					height: 95rpx;
				}
				.channelName {
					width: 95rpx;
					height: 21rpx;
					font-family: PingFang;
					font-weight: 500;
					font-size: 21rpx;
					color: #231815;
					line-height: 21rpx;
					text-align: center;
				}
			}
		}
	}
</style>