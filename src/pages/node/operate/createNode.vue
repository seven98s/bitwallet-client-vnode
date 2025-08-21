<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='创建节点'></titleBar>

		<view class="paramsList">
			<view class="paramsItem">
				<view class="paramsTitle">
					节点名称
				</view>
				<view class="paramsInputBox">
					<input type="text" placeholder="请输入节点名称" v-model="param.createNode.name"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="paramsItem">
				<view class="paramsTitle">
					节点官方网址
				</view>
				<view class="paramsInputBox">
					<input type="text" placeholder="请输入节点https官方网址" v-model="param.createNode.url"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="paramsItem">
				<view class="paramsTitle">
					创建费用(BIT)
				</view>
				<view class="paramsInputBox">
					<input type="text" placeholder="1000" disabled placeholder-class="textareaFont" />
				</view>
			</view>
		</view>
		<TermAndPrivacy :termPrivacyAgree="termPrivacyStatus" @termPrivacyAgree="handleTermPrivacyAgree">
		</TermAndPrivacy>
		<view class="confirmButton" @click="confirm">
			确认
		</view>
		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import TermAndPrivacy from "@/components/termAndPrivacy.vue";
	import PasswordPopup from "@/components/password/passwordPopup.vue";
	import { BitInstance } from '@/chain/bit/instance';
	import { CheckUtil } from '@/data/util/checkUtil';
	import { UniUtil } from '@/data/util/uniUtil';
	import { WalletData } from '@/data/wallet/walletData';
	import { BitAccount } from '@/chain/bit/account/account';

	export default Vue.extend({
		components: { TermAndPrivacy, PasswordPopup },
		data() {
			return {
				termPrivacyStatus: false,
				param: {
					createNode: {
						name: '',
						url: '',
					},
				},
				statusBarHeight: 0,
			}
		},
		async onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		methods: {
			handleTermPrivacyAgree(value : boolean) {
				this.termPrivacyStatus = value;
			},
			async confirm() {
				const { name, url } = this.param.createNode;
				// check
				if (CheckUtil.isStrEmptyAndMessage(name, "请输入节点名称")) return;
				const checkWitnessNameRs : any = await BitAccount.checkWitnessName(name);
				if (!checkWitnessNameRs) {
					UniUtil.toastError('该节点名称已存在，请重新输入');
					return;
				}
				if (CheckUtil.isStrEmptyAndMessage(url, "请输入节点官方网址")) return;
				if (!url.startsWith('https://') && !url.startsWith('http://')) {
					UniUtil.toastError('请输入正确节点官方网址');
					return;
				}
				if (!this.termPrivacyStatus) {
					UniUtil.toastError('请查看并同意条款');
					return;
				}

				const chainAccount = await BitInstance.bitweb.trx.getUnconfirmedAccount(WalletData.account.address);
				// console.log(chainAccount)
				if (chainAccount.address === undefined || BigInt(chainAccount.balance) < BigInt('10000000000000000')) {
					UniUtil.toastError('余额不足');
					return;
				}

				if (chainAccount.address != undefined && chainAccount.is_witness) {
					UniUtil.toastError('账户已是节点，请勿重复操作');
					return;
				}

				const hexAccount = BitInstance.bitweb.address.toHex(WalletData.account.address);
				console.log(WalletData.account.address)
				console.log(hexAccount)
				// console.log(BitInstance.bitweb.toHex(url))
				console.log(this.utf8ToHex(url))
				// return;
				await BitInstance.bitweb.transactionBuilder.applyForSR(WalletData.account.address, url).then(async (rs : any) => {
					// console.log(rs)
					const sign = await BitInstance.bitweb.trx.sign(rs);
					// console.log(sign)
					await BitInstance.bitweb.trx.sendRawTransaction(sign).then(async (applyForSrRs : any) => {
						// console.log(applyForSrRs)
						if (applyForSrRs.result) {
							await BitAccount.setWitnessName(name, WalletData.account.address);
							UniUtil.toastSuccess('创建成功', () => {
								setTimeout(() => {
									uni.reLaunch({
										url: '../index'
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('创建失败，请重试');
						}
					}).catch((e : any) => {
						// console.log(e);
						UniUtil.toastError('创建失败');
					});
				}).catch((e : any) => {
					// console.log(e);
					UniUtil.toastError('创建失败');
				});

				// this.decode58(WalletData.account.address);
			},
			// decode58(string: string) {
			//     if (string.length === 0) return [];

			//     let i;
			//     let j;

			// 	const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
			// 	const ALPHABET_MAP = {} as Record<string, number>;

			// 	for (let i = 0; i < ALPHABET.length; i++) ALPHABET_MAP[ALPHABET.charAt(i)] = i;

			//     for (i = 0; i < string.length; i++) {
			//         const c: string = string[i];
			// 		console.log('--------'+c)
			//         if (!(c in ALPHABET_MAP)) {
			// 			console.log(c);
			// 		}
			//     }
			// },
			utf8ToHex(str : string) {
				let result = '';
				for (let i = 0; i < str.length; i++) {
					let code = str.charCodeAt(i);
					if (code <= 0xff) {
						result += code.toString(16).padStart(2, '0');
					} else {
						// 对于非ASCII字符，需要进行编码转换
						if (0xd800 <= code && code <= 0xdfff) {
							// 对于UTF-16中的代理对，需要合并surrogate pair
							const nextCode = str.charCodeAt(i + 1);
							const surrogatePairCode = (code - 0xd800) * 0x400 + nextCode - 0xdc00 + 0x10000;
							result += surrogatePairCode.toString(16).padStart(8, '0');
							i++; // 跳过下一个字符
						} else {
							result += code.toString(16).padStart(4, '0');
						}
					}
				}
				return result;
			},
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
				min-height: 90rpx;
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
						line-height: 28rpx;
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
		line-height: 28rpx;
		color: #A2A4B0;
	}
</style>