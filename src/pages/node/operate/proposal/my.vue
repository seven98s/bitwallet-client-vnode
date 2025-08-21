<template>
	<!-- <view class="page">
		<view class="main">
			<view class="records">
				<view class="content">
					<view class="title">
						<view class="titleSub">编号</view>
						<view class="titleSub titleSubFlex2">内容</view>
						<view class="titleSub">创建时间</view>
						<view class="titleSub">失效时间</view>
					</view>
					<view class="recordTab" v-for="(item,index) in records" :key="index" @click="gotoPage('./detail?id='+item.proposalId)">
						<view class="recordTabSub">{{ item.proposalId }}</view>
						<view class="recordTabSub">{{ item.content }}</view>
						<view class="recordTabSub">{{ item.startTime }}</view>
						<view class="recordTabSub">{{ item.endTime }}</view>
					</view>
					<Empty v-show="param.recordsEmpty"></Empty>
				</view>
			</view>
		</view>
	</view> -->
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='我的提案'></titleBar>
		<view class="recordBox">
			<view class="recordHeader">
				<view class="recordHeaderItem">
					编号
				</view>
				<view class="recordHeaderItem">
					内容
				</view>
				<view class="recordHeaderItem">
					创建时间
				</view>
				<view class="recordHeaderItem">
					失效时间
				</view>
			</view>
			<view class="recordList">
				<block v-if="records.length>0">
					<view class="recordItem" v-for="(item,index) in records" :key="index"
						@click="gotoPage('./detail?id='+item.proposalId)">
						<view class="recordText">{{ item.proposalId }}</view>
						<view class="recordText">{{ item.content }}</view>
						<view class="recordText">{{ item.startTime }}</view>
						<view class="recordText">{{ item.endTime }}</view>
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
	import { TimeUtil } from "@/data/util/timeUtil";
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
				records: new Array<{
					proposalId : number;
					content : string;
					startTime : string;
					endTime : string;
				}>(),
				statusBarHeight: 0,
			}
		},
		async onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		async onShow() {
			UniUtil.loadShow();
			this.records = new Array<{
				proposalId : number;
				content : string;
				startTime : string;
				endTime : string;
			}>()
			const proposer = BitInstance.bitweb.address.toHex(WalletData.account.address);

			await BitInstance.bitweb.trx.listProposals().then((proposals : any) => {
				console.log(proposals, 'proposals');
				proposals.map((proposal : any) => {
					if (proposal.proposer_address === proposer) {
						let tip = "";
						PROPOSAL_MAP.map((proposalData : any) => {
							if (proposalData.no === proposal.parameters[0].key) {
								tip = proposalData.describe;
							}
						})

						this.records.push({
							proposalId: proposal.proposal_id,
							content: tip + "变更为" + proposal.parameters[0].value,
							startTime: TimeUtil.timestampToDate(proposal.create_time),
							endTime: TimeUtil.timestampToDate(proposal.expiration_time),
						})
					}
				})
			});

			this.param.recordsEmpty = this.records.length === 0;
			UniUtil.loadHide();
		},
		methods: {
			gotoPage(url : string) {
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
		padding: 0rpx 31rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

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
				height: 78vh;
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

						font-size: 26rpx;
						color: #8b8b8b;
						text-align: center;
						line-height: 30rpx;

						padding: 20rpx 0rpx;
						box-sizing: border-box;
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
		text-align: center;
		font-family: PingFang;
		font-weight: 500;
		font-size: 25rpx;
		color: #A2A4B0;
		line-height: 25rpx;
	}
</style>