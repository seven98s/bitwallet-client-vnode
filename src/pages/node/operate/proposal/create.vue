<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='发起提案'></titleBar>
		<image src="@/static/newUI3/node/vote.png" mode="aspectFill" class="pledgeBox"></image>
		<view class="title">
			提案类型
			
		</view>
		<view class="inputBox">
			<picker mode="selector" :range="show.proposalNameList" @change="onChange">
				{{show.proposalNameList[show.selectedValue]}}
			</picker>
		</view>
		<view class="title">
			原有值
		</view>
		<view class="textareaBox">
			<textarea type="text" v-model="param.oldValue" disabled="true" placeholder-class="textareaFont" />
		</view>
		<view class="title">
			变更为
		</view>
		<view class="textareaBox">
			<textarea type="text" placeholder="请输入提案建议内容" v-model="param.newValue"  :adjust-position="false" placeholder-class="textareaFont" />
		</view>
		<view class='confirmButton' @click="confirm">
			确定
		</view>
		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import TermAndPrivacy from "@/components/termAndPrivacy.vue";
	import PasswordPopup from "@/components/password/passwordPopup.vue";
	import { BitInstance } from '@/chain/bit/instance';
	import { BitAccount } from '@/chain/bit/account/account';
	import { CheckUtil } from '@/data/util/checkUtil';
	import { UniUtil } from '@/data/util/uniUtil';
	import { WalletData } from '@/data/wallet/walletData';
	import { PROPOSAL_MAP } from '@/data/constants';
	import { ChainParameter } from 'bitweb-ts/lib/esm/types/Trx';

	export default Vue.extend({
		components: { PasswordPopup },
		data() {
			return {
				show: {
					proposalNameList: new Array(),
					selectedValue: 0,
					chainParameters: new Array<ChainParameter>(),
					currentProposal: {
						no: 0
					},
				},
				param: {
					oldValue: '',
					newValue: '',
				},
				statusBarHeight: 0,
				screenHeight:0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			this.screenHeight = systemInfo.windowHeight; 
			console.log(this.screenHeight,'this.screenHeight');
		},
		async onShow() {
			this.show.proposalNameList = new Array();
			this.show.proposalNameList.push('请选择');
			PROPOSAL_MAP.map((proposal : any) => {
				this.show.proposalNameList.push(proposal.describe);
			})

			this.show.chainParameters = await BitInstance.bitweb.trx.getChainParameters();
			console.log(this.show.chainParameters);
		},
		methods: {
			onChange(e : any) {
				this.show.selectedValue = e.detail.value;
				// load old value
				this.param.oldValue = '';
				if (this.show.selectedValue !== 0) {
					const describe = this.show.proposalNameList[this.show.selectedValue];
					PROPOSAL_MAP.map((proposal : any) => {
						if (proposal.describe === describe) {
							this.show.currentProposal = proposal;
							this.show.chainParameters.map((chainParameter) => {
								if (chainParameter.key === proposal.key) {
									this.param.oldValue = chainParameter.value === undefined ? '' : chainParameter.value.toString();
								}
							})
						}
					})
				}
			},
			async confirm() {
				UniUtil.loadShow();
				console.log(this.show.currentProposal)
				const { no } = this.show.currentProposal;
				const { newValue } = this.param;
				if (!(newValue.length > 0)) {
					return uni.showToast({
						title: `请输入变更后的新值`,
						icon: 'none',
						duration: 2000,
						mask: false
					});
				}
				await BitInstance.bitweb.transactionBuilder.createProposal([{ "key": no, "value": newValue }], WalletData.account.address).then(async (rs : any) => {
					// console.log(rs)
					const sign = await BitInstance.bitweb.trx.sign(rs);
					// console.log(sign)
					await BitInstance.bitweb.trx.sendRawTransaction(sign).then((voteRs : any) => {
						console.log(voteRs)
						if (voteRs.result) {
							UniUtil.toastSuccess('创建提案交易发送成功', () => {
								setTimeout(() => {
									uni.redirectTo({
										url: './page'
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('创建提案交易发送失败，请重试');
						}
					}).catch((e : any) => {
						// console.log(e);
						UniUtil.toastError('创建提案交易发送失败');
					});
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('创建提案交易发送失败');
				});


				// const { pledgeNum } = this.param;
				// // check
				// if(CheckUtil.isStrEmptyAndMessage(pledgeNum, "请输入质押数量")) return;
				// if(!CheckUtil.isStrNumberAndMessage(pledgeNum, "请输入数字")) return;

				// const pledgeAmount = BitInstance.bitweb.toBit(Number(pledgeNum));
				// const chainAccount = await BitInstance.bitweb.trx.getAccount(WalletData.account.address);
				// // console.log(chainAccount)
				// if(chainAccount.address === undefined || BigInt(chainAccount.balance) <= BigInt(pledgeAmount)) {
				// 	UniUtil.toastError('余额不足');
				// 	return;
				// }

				// await BitInstance.bitweb.trx.freezeBalance(pledgeAmount).then(async(rs: any) => {
				// 	console.log(rs)
				// 	if(rs.result) {
				// 		UniUtil.toastSuccess('质押交易发送成功', () => {
				// 			setTimeout(() => {
				// 				uni.reLaunch({
				// 				  url: '../index'
				// 				});
				// 			}, 500);
				// 		});
				// 	}
				// }).catch((e: any) => {
				// 	console.log(e);
				// 	UniUtil.toastError('质押交易发送失败');
				// });

				UniUtil.loadHide();
			},
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
		overflow-y: auto;
		padding: 0rpx 31rpx 20rpx 31rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		.pledgeBox {
			display: block;
			width: 363rpx;
			height: 342rpx;
			margin-top: 46rpx;
		}

		.title {
			width: 617rpx;
			height: 26rpx;
			font-family: PingFang;
			font-weight: bold;
			font-size: 26rpx;
			color: #1D1F20;
			line-height: 26rpx;
			margin-top: 44rpx;
			padding-left: 36rpx;
			box-sizing: border-box;
		}

		.inputBox {
			display: flex;
			align-items: center;
			width: 617rpx;
			height: 79rpx;
			background: #FFFFFF;
			border-radius: 39rpx;
			margin-top: 39rpx;
			padding-left: 36rpx;
			box-sizing: border-box;
			font-family: PingFang;
			font-weight: 500;
			font-size: 25rpx;
			color: #A2A4B0;

			picker {
				width: 100%;
			}

		}

		.textareaBox {
			margin-top: 31rpx;
			width: 617rpx;
			height: 247rpx;
			background: #FFFFFF;
			border-radius: 25rpx;

			textarea {
				width: 100%;
				height: 100%;
				padding: 28rpx 36rpx;
				box-sizing: border-box;
			}
		}

		.walletBalance {
			width: 617rpx;
			height: 24rpx;
			font-family: PingFang;
			font-weight: 500;
			font-size: 24rpx;
			color: #838383;
			line-height: 24rpx;
			margin-top: 28rpx;
			padding-left: 36rpx;
			box-sizing: border-box;
		}

		.textareaFont {
			font-family: PingFang;
			font-weight: 500;
			font-size: 25rpx;
			color: #A2A4B0;
		}

	}





	.confirmButton {
		margin-top: 64rpx;
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
</style>