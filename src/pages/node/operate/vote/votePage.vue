<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='个人总投票'></titleBar>
		<view class="pledgeQuantity">
			<view class="header">
				个人总投票
			</view>
			<view class="pledgeQuantityNumber">
				{{show.totalVoteNum}}
			</view>
		</view>
		<view class="titleBox">
			我的投票
		</view>
		<view class="recordBox">
			<view class="recordHeader">
				<view class="recordHeaderItem">
					序号
				</view>
				<view class="recordHeaderItem">
					节点
				</view>
				<view class="recordHeaderItem">
					投票数
				</view>
				<view class="recordHeaderItem">
					时间
				</view>
			</view>
			<view class="recordList">
				<block v-if="records.length>0">
					<view class="recordItem" v-for="(item,index) in records" :key="index">
						<view class="recordText">{{index+1}}</view>
						<view class="recordText">{{ item.srAddressShow }}</view>
						<view class="recordText">{{ item.voteCount }}</view>
						<view class="recordText">{{ item.time }}</view>
					</view>
				</block>
				<block  v-else>
					<view class='noMoreData'>暂无数据</view>
				</block>
			</view>
		</view>
		<view class='confirmButton' @click="gotoPage('./vote')">
			投票
		</view>
	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import NavBar from "@/components/navBar.vue";
import Empty from "@/components/empty.vue";
import { BitInstance } from '@/chain/bit/instance';
import { UniUtil } from "@/data/util/uniUtil";
import { ShowUtil } from "@/data/util/showUtil";
import { Witness } from 'bitweb-ts/lib/esm/types/Trx';
import { WalletData } from '@/data/wallet/walletData';
import { BitAccount } from '@/chain/bit/account/account';

export default Vue.extend({
	components: { NavBar, Empty },
	data() {
		return {
			show: {
				totalVoteNum: '',
			},
			param: {
				recordsEmpty: false,
			},
			records: new Array<{
				srAddress: string;
				srAddressShow: string;
				voteCount: string;
				time: number;
			}>(),
			witnesses: new Array<Witness>(),
			statusBarHeight:0,
		}
	},
	async onLoad() {
		const systemInfo = uni.getSystemInfoSync();
		this.statusBarHeight = systemInfo.statusBarHeight! + 15;
	},
	async onShow() {
		UniUtil.loadShow();
		
		// load statistic data
		const totalVoteNumRs: any = await BitAccount.getTotalVote(WalletData.account.address);
		this.show.totalVoteNum = totalVoteNumRs.data;
		// this.show.totalVoteNum = BitInstance.bitweb.fromBit(parseInt(this.show.totalVoteNum));
		
		await this.page();
		UniUtil.loadHide();
	},
	methods: {
		async page() {
			this.records = new Array<{
				srAddress: string;
				srAddressShow: string;
				voteCount: string;
				time: number;
			}>();
			
			await BitAccount.getVotePage(WalletData.account.address, 1, 100).then((records: any) => {
				records.data.map((record: any) => {
					this.records.push({
						srAddress: record.srAddress,
						srAddressShow: ShowUtil.omitAddress(record.srAddress, 5, 5),
						voteCount: record.votes,
						time: record.createTime,
					});
				});
			});
			
			this.param.recordsEmpty = this.records.length === 0;
		},
		gotoPage(url: string) {
			uni.navigateTo({
				url
			})
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