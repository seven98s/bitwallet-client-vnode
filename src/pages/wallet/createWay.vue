<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='创建方式'></titleBar>
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

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from '@dcloudio/uni-app';

const importWays = ref([
  {
    icon: require("@/static/wallet/createWay/create.png"),
    title: "创建钱包",
    describe: "免费创建钱包",
    gotoPage: "./createWallet",
  },
  {
    icon: require("@/static/wallet/createWay/multiSign.png"),
    title: "多签钱包",
    describe: "创建多签钱包需要支付链上矿工费",
    gotoPage: "./multiSignWalletProcess",
  },
]);

const statusBarHeight = ref(0);

onLoad(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = (systemInfo.statusBarHeight || 0) + 15;
});

const gotoFun = (page: string) => {
  uni.navigateTo({
    url: page,
  });
};
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
			height: 394rpx;
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