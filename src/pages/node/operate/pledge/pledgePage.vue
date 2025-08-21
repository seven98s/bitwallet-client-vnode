<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='个人总质押'></titleBar>
		<view class="pledgeQuantity">
			<view class="header">
				个人总质押（BIT）
			</view>
			<view class="pledgeQuantityNumber">
				{{show.totalPersonPledgeNum}}
			</view>
		</view>
		<view class="titleBox">
			我的质押
		</view>
		<view class="recordBox">
			<view class="recordHeader">
				<view class="recordHeaderItem">
					序号
				</view>
				<view class="recordHeaderItem">
					质押数量
				</view>
				<view class="recordHeaderItem">
					到期时间
				</view>
				<view class="recordHeaderItem">
					操作
				</view>
			</view>
			<view class="recordList">
				<block v-if="records.length>0">
					<view class="recordItem" v-for="(item,index) in records" :key="index">
						<view class="recordText">{{index+1}}</view>
						<view class="recordText">{{ item.pledgeNum }}</view>
						<view class="recordText">{{ item.expireTimeStr }}</view>
						<view class="recordText red" @click="unlock(item.expireTime)">解锁</view>
						
					</view>
				</block>
				<block  v-else>
					<view class='noMoreData'>暂无数据</view>
				</block>
			</view>
		</view>
		<view class='confirmButton' @click="gotoPage('./pledge')">
			质押
		</view>
		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import NavBar from "@/components/navBar.vue";
	import Empty from "@/components/empty.vue";
	import PasswordPopup from "@/components/password/passwordPopup.vue";
	import { BitInstance } from '@/chain/bit/instance';
	import { UniUtil } from "@/data/util/uniUtil";
	import { ShowUtil } from "@/data/util/showUtil";
	import { WalletData } from '@/data/wallet/walletData';
	import { Frozen, Witness } from 'bitweb-ts/lib/esm/types/Trx';
	import { TimeUtil } from '@/data/util/timeUtil';

	export default Vue.extend({
		components: { NavBar, Empty, PasswordPopup },
		data() {
			return {
				show: {
					totalPersonPledgeNum: '',
				},
				param: {
					recordsEmpty: false,
				},
				records: new Array<{
					no : number;
					pledgeNum : string;
					expireTime : number;
					expireTimeStr : string;
				}>(),
				statusBarHeight: 0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		async onShow() {
			await this.init();
		},
		methods: {
			async init() {
				UniUtil.loadShow();

				this.records = new Array<{
					no : number;
					pledgeNum : string;
					expireTime : number;
					expireTimeStr : string;
				}>();

				let index = 1;
				const account = await BitInstance.bitweb.trx.getUnconfirmedAccount(WalletData.account.address);
				let totalPersonPledgeNum = BigInt(0);
				account?.frozen?.map((frozen : Frozen) => {
					totalPersonPledgeNum += BigInt(frozen.frozen_balance);
					this.records.push({
						no: index,
						pledgeNum: BitInstance.bitweb.fromBit(Number(frozen.frozen_balance)).toString(),
						expireTimeStr: TimeUtil.timestampToDate(frozen.expire_time),
						expireTime: frozen.expire_time,
					});
					index++;
				})
				this.show.totalPersonPledgeNum = BitInstance.bitweb.fromBit(Number(totalPersonPledgeNum)).toString();

				this.param.recordsEmpty = this.records.length === 0;

				UniUtil.loadHide();
			},
			gotoPage(url : string) {
				uni.navigateTo({
					url
				})
			},
			async unlock(expireTime : number) {
				UniUtil.loadShow();
				const now = new Date().getTime();
				if (expireTime >= now) {
					UniUtil.toastError('质押还未到期');
					return;
				}

				await BitInstance.bitweb.trx.unfreezeBalance('BANDWIDTH', {}, WalletData.account.address).then(async (rs : any) => {
					// console.log(rs)
					if (rs.result) {
						UniUtil.toastSuccess('解锁质押交易发送成功', () => {
							setTimeout(async () => {
								await this.init();
							}, 1000);
						});
					} else {
						UniUtil.toastError('解锁质押交易发送失败，请重试');
					}
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('解锁质押交易发送失败');
				});
				UniUtil.loadHide();
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

		.pledgeQuantity {
			margin-top: 63rpx;
			width: 688rpx;
			height: 179rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			padding: 19rpx 36rpx 25rpx 36rpx;
			box-sizing: border-box;

			.header {
				width: 100%;
				height: 24rpx;
				font-family: PingFang;
				font-weight: bold;
				font-size: 24rpx;
				color: #1D1F20;
				line-height: 24rpx;
			}

			.pledgeQuantityNumber {
				margin-top: 19rpx;
				width: 617rpx;
				height: 93rpx;
				background: #F7F7F7;
				border-radius: 25rpx;
				padding: 36rpx 16rpx 38rpx 16rpx;
				box-sizing: border-box;

				font-family: PingFang;
				font-weight: 500;
				font-size: 25rpx;
				color: #838383;
				line-height: 24rpx;
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
			height: 933rpx;
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
				height: 832rpx;
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
					// border-bottom: none;
				}
			}

		}
		.red {
			color: red !important;
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
		margin-top: 81rpx;
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