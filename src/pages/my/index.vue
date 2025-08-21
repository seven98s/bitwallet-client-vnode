<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<view class='navigationBar'>
			<view class="text">
				我的
			</view>
			<view class="serviceBox">
				<image src="@/static/newUI3/my/customerService.png" mode="heightFix" class="service" @click="gotoPage('/pages/my/about')"></image>
				<image src="@/static/newUI3/my/scanCode.png" mode="heightFix" class="service2" @click="scan"></image>
				<view class="notice" @click="gotoPage('/pages/node/operate/messageCenter')">
					<image src="@/static/newUI3/index/newsTips.png" class="newsTips" v-if="this.$store.state.hasNewMessage" ></image>
				</view>
				<!-- <image src="@/static/newUI3/my/notice.png" mode="heightFix" class="service" @click="showToast"></image> -->
			</view>
		</view>
		<!-- 资产相关 -->
		<view class="methodsList">
			<view class="methodsItem" @click="gotoPage('./manageWallet')">
				<view class="left">
					<image src="@/static/newUI3/my/manageWallet.png" mode="widthFix" class="methodsIcon"></image>
				</view>
				<view class="right">
					<view class="methodsName">
						管理钱包
					</view>
					<view class="more">
						<image src="@/static/newUI3/my/more.png" mode="widthFix" class="moreIcon"></image>
					</view>
				</view>
			</view>
			<view class="methodsItem" @click="gotoPage('./update')">
				<view class="left">
					<image src="@/static/newUI3/my/update.png" mode="widthFix" class="methodsIcon"></image>
				</view>
				<view class="right">
					<view class="methodsName">
						修改密码
					</view>
					<view class="more">
						<image src="@/static/newUI3/my/more.png" mode="widthFix" class="moreIcon"></image>
					</view>
				</view>
			</view>


		</view>
		<!-- 节点相关 -->
		<view class="methodsList">
			<view class="methodsItem" @click="showToast">
				<view class="left">
					<image src="@/static/newUI3/my/languageSettings.png" mode="widthFix" class="methodsIcon"></image>
				</view>
				<view class="right">
					<view class="methodsName">
						语言设置
					</view>
					<view class="more">
						<view class="value">中文简体</view>
						<image src="@/static/newUI3/my/more.png" mode="widthFix" class="moreIcon"></image>
					</view>
				</view>
			</view>
			<view class="methodsItem" @click="gotoPage('./setNode')">
				<view class="left">
					<image src="@/static/newUI3/my/nodeSetting.png" mode="widthFix" class="methodsIcon"></image>
				</view>
				<view class="right">
					<view class="methodsName">
						节点速度
					</view>
					<view class="more">
						<view class="value">BIT01</view>
						<image src="@/static/newUI3/my/more.png" mode="widthFix" class="moreIcon"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 其他 -->
		<view class="methodsList">
			<view class="methodsItem" @click="gotoPage('./invite')">
				<view class="left">
					<image src="@/static/newUI3/my/inviteFriends.png" mode="widthFix" class="methodsIcon"></image>
				</view>
				<view class="right">
					<view class="methodsName">
						邀请好友
					</view>
					<view class="more">
						<image src="@/static/newUI3/my/more.png" mode="widthFix" class="moreIcon"></image>
					</view>
				</view>
			</view>
			<view class="methodsItem" @click="gotoPage('./about')">
				<view class="left">
					<image src="@/static/newUI3/my/about.png" mode="widthFix" class="methodsIcon"></image>
				</view>
				<view class="right">
					<view class="methodsName">
						关于我们
					</view>
					<view class="more">
						<view class="value">{{ show.currentVersion }}</view>
						<image src="@/static/newUI3/my/more.png" mode="widthFix" class="moreIcon"></image>
					</view>
				</view>
			</view>
		</view>
		<wallet-tabbar :currentIndex='3'></wallet-tabbar>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { CheckUtil } from '@/data/util/checkUtil';
	import { UniUtil } from "@/data/util/uniUtil";
	export default Vue.extend({
		data() {
			return {
				show: {
					currentVersion: '',
				},
				statusBarHeight: 0,
				
			}
		},
		onShow() {
			CheckUtil.checkInitWallet();
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 19;
			const appVersion = systemInfo.appVersion;
			// console.log(appVersion,'appVersion');
			this.show.currentVersion = appVersion;
		},
		onLoad() {
			uni.hideTabBar();
		},
		methods: {
			gotoPage(url : string) {
				uni.navigateTo({
					url: url
				});
			},
			async scan() {
				await UniUtil.scanCollectCode().then((rs) => {
					uni.navigateTo({
						url: '/pages/wallet/transfer/transfer?address=' + rs
					});
				});
			},
			showToast() {
				uni.showToast({
					title: '功能待定', // 显示的消息内容
					icon: 'none', // 图标，可选值有'success'、'loading'、'none'

				});
			},
		},
		
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
		min-height: 100vh;
		padding-bottom: 180rpx;
		background-color: #f7f7f7;

		box-sizing: border-box;

		.navigationBar {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 39rpx;
			// ps
			// background-color: pink;
			padding-left: 340rpx;
			padding-right: 31rpx;
			margin-bottom: 58rpx;
			box-sizing: border-box;

			.text {
				height: 39rpx;
				line-height: 39rpx;
				font-family: PingFang;
				font-weight: bold;
				font-size: 37rpx;
				color: #1D1F20;
			}

			.serviceBox {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 163rpx;
				height: 39rpx;
				// background-color: skyblue;

				.service {
					display: block;
					height: 39rpx;
				}

				.service2 {
					display: block;
					height: 32rpx;
				}
				.notice {
					position: relative;
					width: 34rpx;
					height: 39rpx;
					background-image: url('@/static/newUI3/node/notice.png');
					background-size: 100% 100%;
					.newsTips {
						position: absolute;
						top: 0;
						right: -6rpx;
						display: block;
						width: 20rpx;
						height: 20rpx;
					}
				}
			}
		}

		.methodsList {
			width: 100%;
			background: #FFFFFF;
			margin-bottom: 16rpx;
			padding-top: 23rpx;
			box-sizing: border-box;

			.methodsItem {
				display: flex;
				width: 100%;
				height: 90rpx;

				// ps
				// background-color: pink;
				.left {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 98rpx;
					height: 90rpx;

					.methodsIcon {
						display: block;
						width: 44rpx;
						height: 44rpx;

					}
				}

				.right {
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex: 1;
					height: 90rpx;
					margin-right: 31rpx;
					border-bottom: 1rpx solid #A2A4B0;
					box-sizing: border-box;

					.methodsName {
						height: 90rpx;
						line-height: 90rpx;
						font-family: PingFang;
						font-weight: bold;
						font-size: 32rpx;
						color: #1D1F20;
					}

					.more {
						display: flex;

						.value {
							height: 22rpx;
							line-height: 22rpx;
							margin-right: 41rpx;
							font-family: PingFang;
							font-weight: 500;
							font-size: 22rpx;
							color: #A2A4B0;
						}

						.moreIcon {
							display: block;
							width: 14rpx;
							height: 25rpx;
						}
					}


				}
			}

			& .methodsItem:last-child .right {
				border: 0px;
			}
		}
	}
</style>