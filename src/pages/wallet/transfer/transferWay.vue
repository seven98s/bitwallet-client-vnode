<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='发送转账'></titleBar>
		<view class="transferMethodBox">
			<view class="transferMethod" v-for="(item,index) in ways" :key="index" @click="gotoFun(index)">
				<image :src="item.icon" mode="aspectFill" class="transferMethodIcon"></image>
				<view class="transferMethodText">
					{{ item.title }}
				</view>
			</view>
		</view>
		<view class="titleBox">
			发送转账记录
		</view>
		<view class="transferRecordBox">
			<view class="recordHeader">
				<view class="recordHeaderItem">
					转出
				</view>
				<view class="recordHeaderItem">
					转入
				</view>
				<view class="recordHeaderItem">
					时间
				</view>
				<view class="recordHeaderItem">
					数量
				</view>
			</view>
			<view class="recordList">
				<block v-if="records.length>0">
				<view class="recordItem" v-for="(item,index) in records" :key="index">
					<view class="recordText">{{ item.from }}</view>
					<view class="recordText">{{ item.to }}</view>
					<view class="recordText">{{ item.time }}</view>
					<view class="recordText">{{ item.num }}</view>
				</view>
				</block>
				<block v-else>
					<view class='noMoreData'>暂无数据</view>
				</block>
			</view>
		</view>
	</view>

</template>

<script lang="ts">
	import Vue from 'vue';
	import Empty from "@/components/empty.vue";
	import { BitInstance } from '@/chain/bit/instance';
	import { WalletData } from '@/data/wallet/walletData';
	import { BitAccount } from '@/chain/bit/account/account';
	import { UniUtil } from "@/data/util/uniUtil";
	import { ShowUtil } from "@/data/util/showUtil";

	export default Vue.extend({
		components: { Empty },
		data() {
			return {
				param: {
					recordsEmpty: false,
				},
				ways: [
					{
						icon: require('@/static/newUI3/transaction/transfer.png'),
						title: '直接转账'
					},
					{
						icon: require('@/static/newUI3/transaction/addressBook.png'),
						title: '地址本转账'
					},
					{
						icon: require('@/static/newUI3/transaction/scan.png'),
						title: '扫码转账'
					},
					{
						icon: require('@/static/newUI3/transaction/multisignature Wallet.png'),
						title: '多签转账'
					},
				],
				records: new Array<{
					from : string;
					to : string;
					num : number;
					time : string;
				}>(),
				// [
				// 	{
				// 		from: 'Bsdfasdf',
				// 		to: 'Bsdfafsd',
				// 		num: 123,
				// 		time: '2024-02-03 16:55:55'
				// 	},
				// 	{
				// 		from: 'Bsdfasdf',
				// 		to: 'Bsdfafsd',
				// 		num: 123,
				// 		time: '2024-02-03 16:55:55'
				// 	},
				// ],
				statusBarHeight: 0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		async onShow() {
			UniUtil.loadShow();
			this.records = new Array<{
				from : string;
				to : string;
				num : number;
				time : string;
			}>();
			const account = WalletData.account;
			await BitAccount.getTransfers(account.address, "BIT", 1, 100).then((rs : any) => {
				// await BitAccount.getTransfers("BKPanM6mH57eQdccDHEgyrAqzrWzq7ziT9", 1, 100).then((rs: any) => {
				const datas = rs.data;

				datas.map((data : any) => {
					this.records.push({
						from: ShowUtil.omitAddress(data.from, 6, 8),
						to: ShowUtil.omitAddress(data.to, 6, 6),
						num: data.value,
						time: data.updateTime,
					})
				});
			}).catch((e : any) => {
				console.log(e);
				UniUtil.toastError('加载失败，请刷新重试');
			});
			this.param.recordsEmpty = this.records.length === 0;
			UniUtil.loadHide();
		},
		methods: {
			async gotoFun(index : number) {
				if (index === 0) {
					uni.navigateTo({
						url: './transfer'
					});
				} else if (index === 1) {
					uni.navigateTo({
						url: '../../my/addressBook/list'
					});
				} else if (index === 2) {
					await UniUtil.scanCollectCode().then((rs : any) => {
						uni.navigateTo({
							url: './transfer?address=' + rs
						});
					});
				} else if (index === 3) {
					uni.navigateTo({
						url: './transferMulti'
					});
				}
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

		.transferMethodBox {
			display: flex;
			justify-content: space-between;
			align-content: space-between;
			flex-wrap: wrap;
			flex-direction: column;
			width: 100%;
			height: 390rpx;
			margin-top: 55rpx;
			// ps
			// background-color: pink;

			.transferMethod {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				width: 333rpx;
				height: 185rpx;
				background: #FFFFFF;
				border-radius: 25rpx;
				padding: 19rpx 0rpx 23rpx 0rpx;
				box-sizing: border-box;

				.transferMethodIcon {
					display: block;
					width: 91rpx;
					height: 91rpx;
				}

				.transferMethodText {
					height: 25rpx;
					font-family: PingFang;
					font-weight: bold;
					font-size: 25rpx;
					color: #231815;
					line-height: 25rpx;
				}
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

		.transferRecordBox {
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
					font-weight: bold;
					font-size: 22rpx;
					color: #231815;
					line-height: 22rpx;
				}
			}

			.recordList {
				width: 100%;
				// height: 862rpx;
				height: 832rpx;
				overflow-y: auto;
				padding: 0rpx 17rpx;
				box-sizing: border-box;
				// ps
				// background-color: pink;

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
</style>