<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px' }">
		<view class="header">
			<view class="logoBox"></view>
			<view class="selectlanguageBox" @click.stop='isShowSelectLanguage = !isShowSelectLanguage'>
				<view class="selectlanguage">
					<image src="@/static/newUI3/index/languageIcon.png" mode="widthFix" class="languageIcon"></image>
					<view class="languageText">中文简体</view>
					<image src="@/static/newUI3/index/downArrow.png" mode="widthFix" class="downArrow"></image>
				</view>
				<view class='languageList' v-if='isShowSelectLanguage'>
					<view class="languageItem activeLanguageItem" @click.stop='isShowSelectLanguage = false'>
						中文简体
					</view>
				</view>
			</view>

		</view>
		<image src="@/static/newUI3/index/rocket.png" mode="widthFix" class="rocket"></image>
		<view class="welcomeBox">
			欢迎来到BIT Wallet！
		</view>
		<view class="introduce">
			BIT多链钱包，数字资产自我掌控
		</view>
		<view class="methodsBox">
			<view class="methods" @click="gotoImport">
				导入钱包
			</view>
			<view class="methods" @click="gotoCreate">
				创建钱包
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

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
const statusBarHeight = ref(0);
const isShowSelectLanguage = ref(false);

onLoad(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = (systemInfo.statusBarHeight || 0) + 15;
});
const gotoImport = () => {
	uni.navigateTo({
		url: '../wallet/importWay'
	});
}

const gotoCreate = () => {
	uni.navigateTo({
		url: '/pages/wallet/createWay'
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

	background-image: url('@/static/newUI3/index/index.png');
	background-size: 100% 100%;
	box-sizing: border-box;

	.header {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 60rpx;
		// background-color: skyblue;
		padding: 0px 30px;
		box-sizing: border-box;

		.logoBox {
			width: 184rpx;
			height: 60rpx;
			// background-color:greenyellow;
			background-image: url('@/static/newUI3/index/logo.png');
			background-size: 100% 100%;
		}

		.selectlanguageBox {
			position: relative;

			.selectlanguage {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 227rpx;
				height: 60rpx;
				border-radius: 30rpx;
				border: 1px solid #FFFFFF;
				padding: 0rpx 29rpx 0rpx 10rpx;
				box-sizing: border-box;

				.languageIcon {
					display: block;
					width: 40rpx;
					height: 40rpx;
				}

				.languageText {
					height: 23rpx;
					font-family: PingFang;
					font-weight: 500;
					font-size: 23rpx;
					line-height: 23rpx;
					color: #FFFFFF;
				}

				.downArrow {
					display: block;
					width: 22rpx;
					height: 12rpx;
				}
			}

			.languageList {
				position: absolute;
				top: 67rpx;
				left: 0;
				display: flex;
				justify-content: center;
				width: 222rpx;
				height: 148rpx;
				background-image: url('@/static/newUI3/index/languageList.png');
				background-size: 100% 100%;
				padding-top: 28rpx;
				box-sizing: border-box;

				.languageItem {
					font-family: SourceHanSansSC;
					font-weight: 400;
					font-size: 22rpx;
				}

				.activeLanguageItem {
					color: #e80300;
				}
			}
		}

	}


	.rocket {
		display: block;
		width: 615rpx;
		height: 575rpx;
		margin-top: 155rpx;
	}

	.welcomeBox {
		margin-top: 93rpx;
		height: 52rpx;
		font-family: PingFang;
		font-weight: bold;
		font-size: 52rpx;
		line-height: 52rpx;
		color: #000000;
	}

	.introduce {
		margin-top: 27rpx;
		height: 22rpx;
		font-family: PingFang;
		font-weight: 500;
		font-size: 22rpx;
		color: #000000;
	}

	.methodsBox {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-top: 80rpx;
		width: 617rpx;
		height: 208rpx;

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
		margin-top: 68rpx;
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