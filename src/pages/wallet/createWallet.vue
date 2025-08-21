<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='创建钱包'></titleBar>

		<view class="paramsList">
			<view class="paramsItem">
				<view class="paramsTitle">
					钱包名称
				</view>
				<view class="paramsInputBox">
					<input type="text" :placeholder="param.placeholderName" v-model="param.createWallet.name"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="paramsItem" v-if="param.isExistsWallet">
				<view class="paramsTitle">
					钱包密码
				</view>
				<view class="paramsInputBox">
					<input type="password" placeholder="请输入密码,至少8位数" v-model="param.createWallet.password"
						placeholder-class="textareaFont" />
				</view>
				<view class="paramsInputBox">
					<input type="password" placeholder="重复密码" v-model="param.createWallet.rePassword"
						placeholder-class="textareaFont" />
				</view>
			</view>

			<view class="paramsItem" v-if="param.isExistsWallet">
				<view class="paramsTitle">
					提示信息(选填)
				</view>
				<view class="paramsInputBox">
					<input type="text" placeholder="密码提示信息" v-model="param.createWallet.tips"
						placeholder-class="textareaFont" />
				</view>
			</view>
		</view>
		<TermAndPrivacy :termPrivacyAgree="termPrivacyStatus" @termPrivacyAgree="handleTermPrivacyAgree">
		</TermAndPrivacy>
		<view class="confirmButton" @click="createWallet">
			创建钱包
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import TermAndPrivacy from "../../components/termAndPrivacy.vue";
	import { ACCOUNT_TYPE, CHAIN_TYPE, STORAGE_TYPE } from '@/data/constants';
	import { UniUtil } from "@/data/util/uniUtil";
	import { CheckUtil } from '@/data/util/checkUtil';
	import { BitAccount } from '@/chain/bit/account/account';
	import { WalletData } from '@/data/wallet/walletData';
	import { CryptoUtil } from '@/data/util/cryptoUtil';

	export default Vue.extend({
		components: { TermAndPrivacy },
		data() {
			return {
				termPrivacyStatus: false,
				param: {
					isExistsWallet: false,
					placeholderIndex: '1',
					placeholderName: "",
					createWallet: {
						name: "",
						password: "",
						rePassword: "",
						tips: "",
					}
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

			// 是否需要输入密码
			this.param.isExistsWallet = WalletData.account.address === undefined;
		},
		methods: {
			handleTermPrivacyAgree(value : boolean) {
				this.termPrivacyStatus = value;
			},
			async createWallet() {
				UniUtil.loadShow();
				const { name, password, rePassword, tips } = this.param.createWallet;
				let nameTmp = name;
				if (CheckUtil.isStrEmpty(name)) {
					nameTmp = this.param.placeholderName;
				}

				// check
				if (CheckUtil.isStrEmptyAndMessage(nameTmp, "请输入钱包名称")) return;
				if (this.param.isExistsWallet && CheckUtil.isStrEmptyAndMessage(password, "请输入钱包密码")) return;
				if (this.param.isExistsWallet && !CheckUtil.lengthRangeEqAndMessage(password, "密码至少需要8位数", 8)) return;
				if (this.param.isExistsWallet && CheckUtil.isStrEmptyAndMessage(rePassword, "请输入钱包重复密码")) return;
				if (this.param.isExistsWallet && !CheckUtil.isStrSameAndMessage(password, rePassword, "密码不一致")) return;

				if (!this.termPrivacyStatus) {
					UniUtil.toastError('请查看并同意条款');
					return;
				}

				// if(!this.param.isExistsWallet) {
				if (WalletData.existsWalletMnemonic()) {
					const storageMnemonicInfo = uni.getStorageSync(STORAGE_TYPE.MNEMONIC_INFO);
					// create account
					const createByWalletRs = await BitAccount.createByWallet({
						mnemonic: CryptoUtil.aesDecrypted(WalletData.user.password, storageMnemonicInfo.mnemonic),
						path: storageMnemonicInfo.path,
					});

					// update mnemonic path
					storageMnemonicInfo.path = createByWalletRs.path;
					uni.setStorageSync(STORAGE_TYPE.MNEMONIC_INFO, storageMnemonicInfo);

					// add account
					const account : Wallet.Account = {
						name: nameTmp,
						address: createByWalletRs.address,
						secretInfo: {
							mnemonic: storageMnemonicInfo.mnemonic,
							privateKey: createByWalletRs.privateKey,
							path: createByWalletRs.path
						},
						type: ACCOUNT_TYPE.NORMAL,
					};

					WalletData.import(CHAIN_TYPE.BIT, account, false);

					// update wallet index
					uni.setStorageSync(STORAGE_TYPE.WALLET_INDEX, this.param.placeholderIndex);

					UniUtil.loadHide();

					uni.reLaunch({
						url: '../home/index'
					});

				} else {
					// save user
					if (!CheckUtil.isStrEmpty(password)) {
						const user : Wallet.UserInfo = { password, tips };
						WalletData.saveOrUpdUser(user);
					}

					// save wallet temp name
					uni.setStorageSync(STORAGE_TYPE.MNEMONIC_TEMP_INFO, { name: nameTmp, index: this.param.placeholderIndex });

					UniUtil.loadHide();

					uni.navigateTo({
						url: './backupTip'
					});

					// // import
					// const importParam: WalletBit.Account.CreateByMnemonicDto = {}
					// await BitAccount.createByMnemonic(importParam).then(data => {
					// 	const account: Wallet.Account = {
					// 		name: nameTmp,
					// 		address: data.address,
					// 		secretInfo: {
					// 			mnemonic: data.mnemonic,
					// 			privateKey: data.privateKey,
					// 			path: data.path
					// 		},
					// 		type: ACCOUNT_TYPE.NORMAL,
					// 	};
					// 	const user: Wallet.UserInfo = { password, tips };

					// 	WalletData.import(CHAIN_TYPE.BIT, account, false, user);

					// 	// 缓存钱包index
					// 	uni.setStorageSync(STORAGE_TYPE.WALLET_INDEX, this.param.placeholderIndex);
					// 	console.log(WalletData.account);
					// 	UniUtil.toastSuccess('创建钱包成功');

					// }).catch((e: any) => {
					// 	console.log(e);
					// 	UniUtil.toastError('创建钱包失败');
					// 	return;
					// });

					// uni.switchTab({
					// 	url: '../home/index'
					// });
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
		min-height: 100vh;
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

		.tips {
			width: 100%;
			line-height: 30rpx;
			margin-top: 44rpx;
			font-family: PingFang;
			font-weight: 500;
			font-size: 25rpx;
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
					line-height: 28rpx;
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
						font-size: 28rpx;
					}
				}
			}
		}

		.confirmButton {
			margin-top: 400rpx;
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