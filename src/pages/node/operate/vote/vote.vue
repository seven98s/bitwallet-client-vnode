<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='投票'></titleBar>
		<image src="@/static/newUI3/node/vote.png" mode="aspectFill" class="pledgeBox"></image>
		<view class="title">
			节点地址
		</view>
		<view class="inputBox">
			<input type="text" placeholder="请输入节点地址" v-model.number="param.srAddress" placeholder-class="textareaFont">
		</view>
		<view class="title">
			投票数量
		</view>
		<view class="inputBox">
			<input type="text" placeholder="请输入投票数量" v-model.number="param.bpNum" placeholder-class="textareaFont">
		</view>
		<view class="walletBalance">
			BP数量：{{ show.bpNum }} BP
		</view>
		<view class="walletBalance">
			网络费数：0.00271 BIT
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
	import { VoteInfo } from 'bitweb-ts/lib/esm/types/TransactionBuilder';

	export default Vue.extend({
		components: { PasswordPopup },
		data() {
			return {
				show: {
					bpNum: '',
				},
				param: {
					srAddress: '',
					bpNum: '',
				},
				statusBarHeight: 0,
			}
		},
		onLoad(query : any) {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			if (query.address != undefined) {
				this.param.srAddress = query.address;
			}
		},
		async onShow() {
			const chainAccount = await BitInstance.bitweb.trx.getUnconfirmedAccount(WalletData.account.address);
			this.show.bpNum = chainAccount.frozen !== undefined && chainAccount.frozen.length > 0 ? BitInstance.bitweb.fromBit(parseInt(chainAccount.frozen[0].frozen_balance)).toString() : '0';
			console.log(chainAccount)
		},
		methods: {
			async confirm() {
				UniUtil.loadShow();
				const { srAddress, bpNum } = this.param;
				// check
				if(!(srAddress.length>0)) {
					return   uni.showToast({
				                title: `请输入节点`, // 提示的内容
				                icon: 'none', // 图标，有效值 'success'、'loading'、'none'
				                duration: 2000, // 提示的延迟时间，单位毫秒，默认 1500
				                mask: false // 是否显示透明蒙层，防止触摸穿透，默认 false
				            });
				}
				if (CheckUtil.isStrEmptyAndMessage(bpNum, "请输入质押数量")) return;
				if (!CheckUtil.isStrNumberAndMessage(bpNum, "请输入数字")) return;

				if (BigInt(bpNum) > BigInt(this.show.bpNum)) {
					UniUtil.toastError('余额不足');
					return;
				}

				try {
					const chainAccount = await BitInstance.bitweb.trx.getUnconfirmedAccount(srAddress);
					if (!chainAccount || !chainAccount?.is_witness) {
						UniUtil.toastError('该账户不是节点');
						return;
					}
				} catch(e) {
					UniUtil.toastError('该账户不是节点');
					return;
				}
				

				const votes : any = {};
				votes[srAddress] = bpNum;
				await BitInstance.bitweb.transactionBuilder.vote(votes).then(async (rs : any) => {
					// console.log(rs)
					const sign = await BitInstance.bitweb.trx.sign(rs);
					// console.log(sign)
					await BitInstance.bitweb.trx.sendRawTransaction(sign).then((voteRs : any) => {
						console.log(voteRs)
						if (voteRs.result) {
							UniUtil.toastSuccess('投票交易发送成功', () => {
								setTimeout(() => {
									uni.redirectTo({
										url: './votePage'
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('投票交易发送失败，请重试');
						}
					}).catch((e : any) => {
						// console.log(e);
						UniUtil.toastError('投票交易发送失败');
					});


					// console.log(rs)
					// if(rs.result) {
					// 	UniUtil.toastSuccess('投票交易发送成功', () => {
					// 		setTimeout(() => {
					// 			uni.reLaunch({
					// 			  url: '../index'
					// 			});
					// 		}, 500);
					// 	});
					// }
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('投票交易发送失败');
				});
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
		padding: 0rpx 31rpx;
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
			width: 617rpx;
			height: 79rpx;
			background: #FFFFFF;
			border-radius: 39rpx;
			margin-top: 39rpx;

			input {
				width: 100%;
				height: 100%;
				padding-left: 36rpx;
				padding-right: 36rpx;
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