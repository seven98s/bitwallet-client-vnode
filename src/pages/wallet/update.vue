<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='修改名称'></titleBar>
		<view class="paramsList">
			<view class="paramsItem">
				<view class="paramsTitle">
					钱包名称
				</view>
				<view class="paramsInputBox">
					<input type="text" placeholder="请输入钱包名称" v-model="param.update.name"
						placeholder-class="textareaFont" />
				</view>
			</view>
		</view>
		</TermAndPrivacy>
		<view class="confirmButton" @click="confirm">
			确认
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { BitInstance } from '@/chain/bit/instance';
	import { CheckUtil } from '../../data/util/checkUtil';
	import { WalletData } from '../../data/wallet/walletData';
	import { UniUtil } from '../../data/util/uniUtil';
	import { CHAIN_TYPE } from '@/data/constants';

	export default Vue.extend({
		data() {
			return {
				param: {
					update: {
						name: '',
					},
				},
				statusBarHeight: 0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;

		},
		methods: {
			confirm() {
				const { name } = this.param.update;
				if (CheckUtil.isStrEmptyAndMessage(name, "请输入钱包名称")) return;

				try {
					WalletData.changeWalletName(CHAIN_TYPE.BIT, WalletData.account.address, name);
					UniUtil.toastSuccess("修改成功", () => {
						setTimeout(() => {
							uni.reLaunch({
								url: '../home/index'
							});
						}, 200);
					});
				} catch (e : any) {
					UniUtil.toastError(e.message);
				}
			}
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
		background-color: #fff;
		background-size: 100% 100%;
		box-sizing: border-box;

		.tipWordsBox {
			margin-top: 59rpx;
			width: 688rpx;
			height: 308rpx;
			background: #FFFFFF;
			border-radius: 25rpx;

			padding: 39rpx 32rpx;
			box-sizing: border-box;

			textarea {
				width: 100%;
				height: 100%;

			}
		}

		.paramsList {
			width: 100%;
			margin-top: 44rpx;
			// background-color: pink;

			.paramsItem {
				width: 100%;
				min-height: 86rpx;
				margin-bottom: 30rpx;
				// background-color: skyblue;

				.paramsTitle {
					width: 100%;
					height: 25rpx;
					line-height: 25rpx;
					font-family: PingFang;
					font-weight: 800;
					font-size: 25rpx;
					color: #000000;
					margin-bottom: 10rpx;
				}

				.paramsInputBox {
					width: 100%;
					height: 51rpx;
					// background-color: greenyellow;
					border-bottom: 1rpx dashed #A2A4B0;

					input {
						width: 100%;
						height: 50rpx;
						font-size: 22rpx;
					}
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

	.textareaFont {
		font-family: PingFang;
		font-weight: 500;
		font-size: 22rpx;
		color: #A2A4B0;
	}
</style>