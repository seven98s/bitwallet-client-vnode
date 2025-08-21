<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='验证助记词'></titleBar>
		<view class="tips">
			请根据您抄写的助剂词，按顺序选择填充
		</view>
		<view class="keywordList">
			<view class="keywordItem" v-for="(item, index) in mnemonicsRes" :key="index" :style="active === index ? { border: '1px solid #e0e0e0' } : {}" @click="choose(index)">
				{{ item }}
			</view>
		</view>
		<view class="keywordList2" >
			<view v-for="(item, index) in mnemonics" :key="index" @click="fillChoose(index)" class="keywordItem">
				{{ item }}
			</view>
		</view>
		<view class="confirmButton" @click="verify">
			确认
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { ACCOUNT_TYPE, CHAIN_TYPE, STORAGE_TYPE } from '@/data/constants';
	import { CheckUtil } from '@/data/util/checkUtil';
	import { UniUtil } from '@/data/util/uniUtil';
	import { BitAccount } from '@/chain/bit/account/account';
	import { WalletData } from '@/data/wallet/walletData';

	export default Vue.extend({
		data() {
			return {
				active: 0,
				mnemonicsRes: ["", "", "", "", "", "", "", "", "", "", "", "",],
				mnemonics: new Array<string>(),
				mnemonicTmpData: {
					name: "",
					mnemonic: "",
					index: Number,
				},
				statusBarHeight: 0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			this.mnemonicTmpData = uni.getStorageSync(STORAGE_TYPE.MNEMONIC_TEMP_INFO);
			this.mnemonics = CheckUtil.shuffleArray(this.mnemonicTmpData.mnemonic.toString().split(' '));
		},
		methods: {
			choose(index : number) {
				this.active = index;
				this.fill("");
			},
			fillChoose(index : number) {
				this.fill(this.mnemonics[index]);

				if (this.active < 11) {
					this.active++;
				}
			},
			fill(mnemonic : string) {
				const temp = this.mnemonicsRes;
				this.mnemonicsRes = [];
				temp.map((mnemonics : string, i : number) => {
					if (i === this.active) {
						this.mnemonicsRes.push(mnemonic);
					} else {
						this.mnemonicsRes.push(temp[i]);
					}
				})
			},
			async verify() {
				if (this.mnemonicsRes.join(' ') != this.mnemonicTmpData.mnemonic) {
					UniUtil.toastError('验证失败，请按顺序选择填充');
					return;
				}

				// import
				const mnemonicTmp = this.mnemonicTmpData.mnemonic;
				const importParam : WalletBit.Account.ImportMnemonicDto = {
					mnemonic: mnemonicTmp
				}
				await BitAccount.importMnemonic(importParam).then(data => {
					const account : Wallet.Account = {
						name: this.mnemonicTmpData.name,
						address: data.address,
						secretInfo: {
							mnemonic: mnemonicTmp,
							privateKey: data.privateKey,
							path: data.path
						},
						type: ACCOUNT_TYPE.NORMAL,
					};

					WalletData.import(CHAIN_TYPE.BIT, account, false);

					// 缓存钱包index
					uni.setStorageSync(STORAGE_TYPE.WALLET_INDEX, this.mnemonicTmpData.index);

					uni.removeStorageSync(STORAGE_TYPE.MNEMONIC_TEMP_INFO);

					UniUtil.toastSuccess('验证成功', () => {
						setTimeout(() => {
							uni.reLaunch({
								url: '../home/index'
							});
						}, 200);
					});
				}).catch(e => {
					console.log(e);
					if (e.message.startsWith('invalid mnemonic length')) {
						UniUtil.toastError('助记词不匹配，请重新输入');
					} else {
						UniUtil.toastError(e.message);
					}
				});

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
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;
		.tips {
			margin-top: 59rpx;
			width: 100%;
			height: 25rpx;
			font-family: PingFang;
			font-weight: 500;
			font-size: 25rpx;
			color: #A2A4B0;
			line-height: 25rpx;
		}
		.keywordList {
			margin-top: 64rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			width: 688rpx;
			height: 370rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			padding: 33rpx 16rpx;
			box-sizing: border-box;
			.keywordItem {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 204rpx;
				height: 62rpx;
				background: #F7F7F7;
				border-radius: 19rpx;
			}
		}
		.keywordList2 {
			margin-top: 10rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			width: 688rpx;
			height: 370rpx;
			background: #f7f7f7;
			border-radius: 25rpx;
			padding: 33rpx 16rpx;
			box-sizing: border-box;
			.keywordItem {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 204rpx;
				height: 62rpx;
				background: #fff;
				border-radius: 19rpx;
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
</style>