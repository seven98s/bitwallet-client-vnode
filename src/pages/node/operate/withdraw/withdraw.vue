<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='提取'></titleBar>
		<image src="@/static/newUI3/node/extract.png" mode="aspectFill" class="pledgeBox"></image>
		<view class="title">
			可提取收益（BIT）
		</view>
		<view class="inputBox">
			<input type="text" placeholder="请输入质押数量" v-model.number="show.reward" placeholder-class="textareaFont"
				disabled="">
		</view>
		<view class="walletBalance">
			预估费用：0.00246 BIT
		</view>
		<view class="walletBalance">
			累计收益：{{show.totalReward}} BIT
		</view>
		<view class="confirmButton" @click="withdraw">
			提取
		</view>
		<view class="titleBox">
			提取记录
		</view>
		<view class="recordBox">
			<view class="recordHeader">
				<view class="recordHeaderItem">
					序号
				</view>
				<view class="recordHeaderItem">
					交易哈希
				</view>
				<view class="recordHeaderItem">
					数量
				</view>
				<view class="recordHeaderItem">
					时间
				</view>
			</view>
			<view class="recordList">
				<block v-if="records.length>0">
					<view class="recordItem" v-for="(item,index) in records" :key="index">
						<view class="recordText">{{index+1}}</view>
						<view class="recordText">{{ item.transactionIdShow }}</view>
						<view class="recordText">{{ item.amount }}</view>
						<view class="recordText">{{ item.time }}</view>
					</view>
				</block>
				<block v-else>
					<view class='noMoreData'>暂无数据</view>
				</block>
			</view>
		</view>
		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import Empty from "@/components/empty.vue";
	import { BitInstance } from '@/chain/bit/instance';
	import { UniUtil } from "@/data/util/uniUtil";
	import { ShowUtil } from "@/data/util/showUtil";
	import { Witness } from 'bitweb-ts/lib/esm/types/Trx';
	import { WalletData } from '@/data/wallet/walletData';
	import PasswordPopup from "@/components/password/passwordPopup.vue";
	import { BitAccount } from '@/chain/bit/account/account';

	export default Vue.extend({
		components: { PasswordPopup, Empty },
		data() {
			return {
				show: {
					totalReward: '',
					reward: '',
				},
				param: {
					recordsEmpty: false,
				},
				records: new Array<{
					transactionId : string;
					transactionIdShow : string;
					amount : string;
					time : string;
				}>(),
				witnesses: new Array<Witness>(),
				statusBarHeight: 0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		async onShow() {
			UniUtil.loadShow();
			this.show.reward = (await BitInstance.bitweb.trx.getUnconfirmedReward(WalletData.account.address)).toString();
			this.show.reward = BitInstance.bitweb.fromBit(parseInt(this.show.reward)).toString();

			const totalWithdrawRs : any = await BitAccount.getTotalWithdraw(WalletData.account.address);
			this.show.totalReward = totalWithdrawRs.data;
			this.show.totalReward = BitInstance.bitweb.fromBit(parseInt(this.show.totalReward)).toString();
			this.show.totalReward = (parseFloat(this.show.totalReward) + parseFloat(this.show.reward)).toString();

			await this.page();
			UniUtil.loadHide();
		},
		methods: {
			async withdraw() {
				UniUtil.loadShow();
				if (this.show.reward === '0') {
					UniUtil.toastError('暂无收益可提取');
					return;
				}

				// 24h
				if (this.records.length != 0) {
					const now = new Date().getTime();
					const nextTime = new Date(this.records[this.records.length - 1].time).getTime() + 24 * 60 * 60 * 1000;
					if (now <= nextTime) {
						UniUtil.toastError('收益为24小时可提取一次');
						return;
					}
				}

				await BitInstance.bitweb.transactionBuilder.withdrawBlockRewards(WalletData.account.address).then(async (rs : any) => {
					// console.log(rs)
					const sign = await BitInstance.bitweb.trx.sign(rs);
					// console.log(sign)
					await BitInstance.bitweb.trx.sendRawTransaction(sign).then((withdrawRs : any) => {
						console.log(withdrawRs)
						if (withdrawRs.result) {
							UniUtil.toastSuccess('提取交易发送成功', () => {
								setTimeout(() => {
									uni.redirectTo({
										url: './withdraw'
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('提取交易发送失败，请重试');
						}
					}).catch((e : any) => {
						// console.log(e);
						UniUtil.toastError('提取交易发送失败');
					});
				});
				UniUtil.loadHide();
			},
			async page() {
				this.records = new Array<{
					transactionId : string;
					transactionIdShow : string;
					amount : string;
					time : string;
				}>();

				await BitAccount.getWithdrawPage(WalletData.account.address, 1, 100).then((records : any) => {
					records.data.map((record : any) => {
						this.records.push({
							transactionId: record.transactionId,
							transactionIdShow: ShowUtil.omitAddress(record.transactionId, 8, 8),
							amount: BitInstance.bitweb.fromBit(parseInt(record.amount)).toString(),
							time: record.createTime,
						});
					});
				});
				this.param.recordsEmpty = this.records.length === 0;
			},
			gotoPage(url : string) {
				uni.navigateTo({
					url
				})
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
		min-height: 100vh;
		padding: 0rpx 31rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		.pledgeBox {
			display: block;
			width: 479rpx;
			height: 332rpx;
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

	.titleBox {
		margin-top: 58rpx;
		width: 100%;
		height: 29rpx;
		font-family: PingFang;
		font-weight: bold;
		font-size: 29rpx;
		text-align: start;
		color: #231815;
		line-height: 29rpx;
	}

	.recordBox {
		margin-top: 35rpx;
		width: 688rpx;
		// height: 933rpx;
		background: #FFFFFF;
		border-radius: 25rpx;

		.recordHeader {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 93rpx;
			padding: 0rpx 17rpx;
			border-bottom: 1rpx solid #e6e6e6;
			box-sizing: border-box;

			// ps
			// background-color: pink;
			.recordHeaderItem {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 158rpx;
				height: 93rpx;
				font-family: PingFang;
				font-weight: 800;
				font-size: 22rpx;
				color: #231815;
				line-height: 22rpx;
			}
		}

		.recordList {

			width: 100%;
			height: 412rpx;
			overflow-y: auto;
			padding: 0rpx 17rpx;
			box-sizing: border-box;


			.recordItem {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 105rpx;
				border-bottom: 1rpx dashed #e6e6e6;
				box-sizing: border-box;

				.recordText {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 158rpx;
					height: 104rpx;

					font-size: 26rpx;
					color: #8b8b8b;
					text-align: center;
					line-height: 30rpx;

					font-family: XiQuejuzhenti-regular;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					text-overflow: ellipsis;
					word-break: break-all;
				}
			}

			& .recordItem:last-child {
				border-bottom: none;
			}
		}

	}

	.noMoreData {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		// height: 25rpx;
		text-align: center;
		font-family: PingFang;
		font-weight: 500;
		font-size: 25rpx;
		color: #A2A4B0;
		line-height: 25rpx;
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