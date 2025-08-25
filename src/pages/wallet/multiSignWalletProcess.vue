<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='创建多签钱包'></titleBar>
		<view class="tips">
			多签钱包创建流程
		</view>
		<view class="introduce">
			请根据以下指引，创建您的多签钱包，创建多签钱包需要您支付链上 网络费，该网络费不是由BIT Wallet收取
		</view>
		<view class="tipList">
			<view class="tipItem" v-for="(item, index) in tips" :key="index">
				<image :src="item.icon" mode="aspectFill" class="tipIcon"></image>
				<view class="tipInfo">
						{{ item.describe }}
				</view>
			</view>
		</view>
		<view class="confirmButton" @click="gotoPage('./multiSignWallet')">
			下一步
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'



const tips = ref([
  {
    icon: require('@/static/newUI3/index/process1.png'),
    describe: '选择需要形成多签的钱包，然后点创建钱包-创建多签钱包',
  },
  {
    icon: require('@/static/newUI3/index/process2.png'),
    describe: '依次输入控制授权钱包地址',
  },
  {
    icon: require('@/static/newUI3/index/process3.png'),
    describe: '输入阈值(阈值代表需要多少数量的授权钱包确认)',
  },
  {
    icon: require('@/static/newUI3/index/process4.png'),
    describe: '确认形成多签的钱包中有足够的BIT作为GAS费，支付创建多签钱包的链上费用',
  },
  {
    icon: require('@/static/newUI3/index/process5.png'),
    describe: '创建成功，开始使用',
  },
])

const statusBarHeight = ref(0)

onLoad(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = (systemInfo.statusBarHeight || 0) + 15
})

function gotoPage(url: string) {
  uni.navigateTo({ url })
}
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
		height: 123rpx;
		background: #F7F7F7;
		border-radius: 12rpx;
		padding: 31rpx 21rpx;
		box-sizing: border-box;
		
		font-family: PingFang;
		font-weight: bold;
		font-size: 22rpx;
		color: #9E2922;
		line-height: 37rpx;
	}
	.tipList {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		height: 690rpx;
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
				width: 86rpx;
				height: 83rpx;
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
		margin-top: 253rpx;
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