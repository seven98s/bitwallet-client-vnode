<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='提案'></titleBar>
		<view class="transferMethodBox">
			<view class="transferMethod" v-for="(item,index) in ways" :key="index" @click="gotoPage(item.url)">
				<image :src="item.icon" mode="aspectFill" class="transferMethodIcon"></image>
				<view class="transferMethodText">
					{{ item.title }}
				</view>
			</view>
		</view>
		<!-- <view class="titleBox">
			提案记录
		</view> -->
		<!-- <view class="transferRecordBox">
			<view class="recordHeader">
			
				<view class="recordHeaderItem">
					编号
				</view>
				<view class="recordHeaderItem">
					提议者
				</view>
				<view class="recordHeaderItem">
					内容
				</view>
			</view>
			<view class="recordList">
				<block v-if="records.length>0">
					<view class="recordItem" v-for="(item,index) in records" :key="index" @click="gotoPage('./detail?id='+item.proposalId)" >
						<view class="recordText">{{ item.proposalId }}</view>
						<view class="recordText">{{ item.proposer }}</view>
						<view class="recordText">{{ item.content }}</view>
					</view>
				</block>
				<block v-else>
					<view class="noMoreData">
						暂无数据
					</view>
				</block>
				
			</view>
		</view> -->
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
import { Proposal } from 'bitweb-ts/lib/esm/types/Trx';
import { PROPOSAL_MAP } from '@/data/constants';

export default Vue.extend({
	components: { Empty },
	data() {
		return {
			param: {
				active: 'super',
				recordsEmpty: false,
			},
			ways: [
				{
					key: 'sentry',
					icon: require('@/static/node/proposal/send.png'),
					activeIcon: require('@/static/node/proposal/send.png'),
					title: '发起提案',
					url: './create',
				},
				{
					key: 'super',
					icon: require('@/static/node/proposal/vote.png'),
					activeIcon: require('@/static/node/proposal/vote.png'),
					title: '我的提案',
					url: './my',
				},
			],
			records: new Array<{
				proposalId: number;
				proposer: string;
				content: string;
			}>(),
			statusBarHeight:0,
		}
	},
	async onShow() {
		UniUtil.loadShow();
		this.records = new Array<{
			proposalId: number;
			proposer: string;
			content: string;
		}>()
		await BitInstance.bitweb.trx.listProposals().then((proposals: any) => {
			proposals.map((proposal: any) => {
				let tip = "";
				PROPOSAL_MAP.map((proposalData: any) => {
					if(proposalData.no === proposal.parameters[0].key) {
						tip = proposalData.describe;
					}
				})
				
				const proposer = BitInstance.bitweb.address.fromHex(proposal.proposer_address);
				this.records.push({
					proposalId: proposal.proposal_id,
					proposer: ShowUtil.omitAddress(proposer, 5, 5),
					content: proposal.parameters[0].key == 52 ? tip : tip+"变更为"+proposal.parameters[0].value,
				})
			})
			
		});
		this.param.recordsEmpty = this.records.length === 0;
		UniUtil.loadHide();
	},
	onLoad() {
		const systemInfo = uni.getSystemInfoSync();
		this.statusBarHeight = systemInfo.statusBarHeight! + 15;
	},
	methods: {
		handleAssetTabClick(active: string) {
			this.param.active = active;
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
		min-height: 100vh;
		padding: 0rpx 31rpx 20rpx 31rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;
	
		.transferMethodBox {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 185rpx;
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
				height: 832rpx;
				overflow-y: auto;
				padding: 0rpx 17rpx;
				box-sizing: border-box;
			
	
				.recordItem {
					display: flex;
					justify-content: space-between;
					width: 100%;
					min-height: 105rpx;
					border-bottom: 1rpx dashed #e6e6e6;
					box-sizing: border-box;
	
					.recordText {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 158rpx;
						min-height: 104rpx;
						padding: 20rpx 0rpx;
						box-sizing:border-box;
						font-size: 26rpx;
						color: #8b8b8b;
						text-align: center;
						line-height: 30rpx;
	
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