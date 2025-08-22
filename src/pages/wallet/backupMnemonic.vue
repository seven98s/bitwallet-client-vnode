<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px' }">
		<titleBar title='备份助记词'></titleBar>
		<view class="tips">
			助记词用于恢复钱包及重置钱包密码，请准确无误抄写助记词， 并存放在安全的地方
		</view>
		<view class="keywordList">
			<view class='keywordItem' v-for="(item, index) in mnemonics" :key="index">
				{{ item }}
			</view>
		</view>
		<view class="ruleBox">
			<view class="header">
				谨记:
			</view>
			<view class="rule">
				* 请勿将助记词透漏给任何人
			</view>
			* 遇到任何情况，请不要轻易卸载BIT钱包APP
			<view class="rule">
				* 助记词一旦丢失，资产将无法恢复
			</view>
			<view class="rule">
				* 请勿通过截屏、网络传输方式进行备份保存
			</view>
			<view class="rule">
				* 遇到任何情况，请不要轻易卸载BIT钱包APP
			</view>
		</view>
		<view class="confirmButton" @click="gotoPage('./verifyMnemonic')">
			备份完成，进行验证
		</view>
		<view class="copy" @click="copy">
			复制助记词
		</view>
	</view>
</template>

<script setup lang="ts">
import { BitAccount } from '@/chain/bit/account/account';
import { UniUtil } from '@/data/util/uniUtil';
import { STORAGE_TYPE } from '@/data/constants';
import { onLoad } from '@dcloudio/uni-app';
const mnemonics = ref([]);
const statusBarHeight = ref(0);

onLoad(async () => {
	const systemInfo = uni.getSystemInfoSync();
	statusBarHeight.value = (systemInfo.statusBarHeight || 0) + 15;
	await loadMnemonic();
});

const loadMnemonic = async () => {

	const importParam: WalletBit.Account.CreateByMnemonicDto = {};
	try {
		//通过助记词创建账户
		const data = await BitAccount.createByMnemonic(importParam);
		data.mnemonic.split(' ').map((tmp: String) => {
			mnemonics.value.push(tmp);
		});
		const tmpData = uni.getStorageSync(STORAGE_TYPE.MNEMONIC_TEMP_INFO);
		uni.setStorageSync(STORAGE_TYPE.MNEMONIC_TEMP_INFO, { ...tmpData, mnemonic: data.mnemonic });
	} catch (error) {
		console.log(error);
		UniUtil.toastError('创建钱包失败');
	}
}

const copy =  () => {
	UniUtil.copy(mnemonics.value.join(' '));
}

const gotoPage = (url: string) => {
	uni.navigateTo({ url });
};

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
	background-color: #f7f7f7;
	background-size: 100% 100%;
	box-sizing: border-box;

	.tips {
		margin-top: 59rpx;
		height: 60rpx;
		font-family: PingFang;
		font-weight: 500;
		font-size: 25rpx;
		color: #A2A4B0;
		line-height: 30rpx;
	}

	.keywordList {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 28rpx;
		width: 688rpx;
		height: 370rpx;
		background: #FFFFFF;
		border-radius: 25rpx;
		padding: 33rpx 16rpx;
		box-sizing: border-box;

		.keywordItem {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 204rpx;
			height: 62rpx;
			background: #F7F7F7;
			border-radius: 19rpx;
		}
	}

	.ruleBox {
		margin-top: 43rpx;
		width: 100%;

		line-height: 38rpx;

		// background-color: pink;
		.header {
			width: 100%;
			height: 25rpx;
			font-family: PingFang-SC-Medium;
			font-weight: bold;
			font-size: 25rpx;
			line-height: 25rpx;
			color: #231815;
			margin-bottom: 20rpx;
		}

		.rule {
			font-family: PingFang;
			font-size: 25rpx;
			line-height: 25rpx;
			color: #231815;
			margin-bottom: 10rpx;
		}
	}

	.confirmButton {
		margin-top: 300rpx;
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

	.copy {
		margin-top: 28rpx;
		height: 28rpx;
		font-family: PingFang;
		font-weight: 500;
		font-size: 28rpx;
		line-height: 28rpx;
		color: #1D1F20;
		text-decoration-line: underline;
	}
}
</style>