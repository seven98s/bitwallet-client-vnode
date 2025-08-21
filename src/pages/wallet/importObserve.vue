<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='私钥导入' :isShowScanCode='true' @scanSuccess='scan'></titleBar>
		<view class="tipWordsBox">
			<textarea class="textarea" type="text" placeholder="请输入地址或扫描观察钱包二维码" v-model="param.importWallet.address"
				placeholder-class="textareaFont" />
		</view>
		<view class="tips">
			观察钱包不需要导入私钥，只导入地址，进行入场查看账号、交易记录和接收通知。
		</view>
		<view class="paramsList">
			<view class="paramsItem">
				<view class="paramsTitle">
					钱包名称
				</view>
				<view class="paramsInputBox">
					<input type="text" :placeholder="param.placeholderName" v-model="param.importWallet.name"
						placeholder-class="textareaFont" />
				</view>
			</view>
		</view>
		<TermAndPrivacy :termPrivacyAgree="termPrivacyStatus" @termPrivacyAgree="handleTermPrivacyAgree">
		</TermAndPrivacy>
		<view class="confirmButton" @click="importWallet">
			导入钱包
		</view>
	</view>
	<!-- 	<view class="page">
		<view class="main">
			<view class="mnemonic">
				<textarea type="text" placeholder="请输入地址或扫描观察钱包二维码" v-model="param.importWallet.address" />
			</view>
			
			<view class="tips">
				观察钱包不需要导入私钥，只导入地址，进行入场查看账号、交易记录和接收通知。
			</view>
			
			<view class="module">
				<view class="title">
					钱包名称
				</view>
				<view class="input">
					<input type="text" :placeholder="param.placeholderName" v-model="param.importWallet.name" />
				</view>
			</view>
			
			<TermAndPrivacy :termPrivacyAgree="termPrivacyStatus" @termPrivacyAgree="handleTermPrivacyAgree"></TermAndPrivacy>
			
			<view class="import" @click="importWallet">
				导入钱包
			</view>
		</view>
	</view> -->
</template>

<script lang="ts">
	import Vue from 'vue';
	import TermAndPrivacy from "../../components/termAndPrivacy.vue";
	import { ACCOUNT_TYPE, CHAIN_TYPE, STORAGE_TYPE } from '@/data/constants';
	import { UniUtil } from "@/data/util/uniUtil";
	import { CheckUtil } from '@/data/util/checkUtil';
	import { WalletData } from '@/data/wallet/walletData';

	export default Vue.extend({
		components: { TermAndPrivacy },
		data() {
			return {
				termPrivacyStatus: false,
				param: {
					placeholderIndex: '1',
					placeholderName: "",
					importWallet: {
						address: '',
						name: '',
					},
				},
				statusBarHeight: 0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			// 钱包名称索引加载
			const index = uni.getStorageSync(STORAGE_TYPE.WALLET_INDEX);
			this.param.placeholderIndex = index === '' ? '1' : (parseInt(index) + 1).toString();
			this.param.placeholderName = "WALLET-".concat(this.param.placeholderIndex);
		},
		methods: {
			handleTermPrivacyAgree(value : boolean) {
				this.termPrivacyStatus = value;
			},
			async importWallet() {
				UniUtil.loadShow();
				const { name, address } = this.param.importWallet;
				let nameTmp = name;
				if (CheckUtil.isStrEmpty(name)) {
					nameTmp = this.param.placeholderName;
				}

				// check
				if (CheckUtil.isStrEmptyAndMessage(nameTmp, "请输入钱包名称")) return;
				if (CheckUtil.isStrEmptyAndMessage(address, "请输入钱包地址")) return;
				if (!CheckUtil.checkAddressAndMessage(address)) return;

				if (!this.termPrivacyStatus) {
					UniUtil.toastError('请查看并同意条款');
					return;
				}

				// import
				try {
					const account : Wallet.Account = {
						name: nameTmp,
						address: address,
						secretInfo: {
							mnemonic: '',
							privateKey: '',
							path: ''
						},
						type: ACCOUNT_TYPE.OBSERVE,
					};

					WalletData.import(CHAIN_TYPE.BIT, account, true);

					// 缓存钱包index
					uni.setStorageSync(STORAGE_TYPE.WALLET_INDEX, this.param.placeholderIndex);

					UniUtil.loadHide();

					UniUtil.toastSuccess('导入成功', () => {
						setTimeout(() => {
							uni.reLaunch({
								url: '../home/index'
							});
						}, 200);
					});
				} catch (e : any) {
					UniUtil.toastError(e.message);
				}

			},
			scan(res : string) {
				// console.log(res);
				this.param.importWallet.address = res
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
		background-color: #f7f7f7;
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
				font-family: PingFang;
				font-weight: 500;
				font-size: 28rpx;

			}
		}
		.tips {
			width: 100%;
			line-height: 30rpx;
			margin-top: 44rpx;
			font-family: PingFang;
			font-weight: 500;
			font-size: 28rpx;
			color: #A2A4B0;
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
					height: 28rpx;
					line-height: 25rpx;
					font-family: PingFang;
					font-weight: 800;
					font-size: 28rpx;
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
						font-family: PingFang;
						font-weight: 500;
						font-size: 28rpx;
					}
				}
			}
		}

		.confirmButton {
			margin-top: 406rpx;
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
		font-size: 28rpx;
		color: #A2A4B0;
	}
</style>