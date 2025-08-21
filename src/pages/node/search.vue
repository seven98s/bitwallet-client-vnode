<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='节点搜索'></titleBar>
		<view class="searchBox">
			<view class="inputBox">
				<input type="text" placeholder="搜索" v-model="param.search" @input="onSearchInput"
					placeholder-class="textareaFont">
			</view>
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
					质押量
				</view>
				<view class="recordHeaderItem">
					区块高度
				</view>
			</view>
			<view class="recordList">
				<block v-if="showRecords.length>0">
					<view class="recordItem" v-for="(item,index) in showRecords" :key="index"
						@click="gotoPage('./operate/vote/vote?address='+item.node)">
						<view class="recordText">{{index+1}}</view>
						<view class="recordText">{{ item.nodeShow }}</view>
						<view class="recordText">{{ item.pledge }}</view>
						<view class="recordText">{{ item.blockNum }}</view>
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
	import { UniUtil } from "@/data/util/uniUtil";
	import { Frozen, Witness } from 'bitweb-ts/lib/esm/types/Trx';
	import { ShowUtil } from '@/data/util/showUtil';
	import { CheckUtil } from '@/data/util/checkUtil';

	export default Vue.extend({
		components: { Empty },
		data() {
			return {
				param: {
					recordsEmpty: false,
					search: '',
				},
				records: new Array<{
					node : string;
					nodeShow : string;
					pledge : number;
					blockNum : number;
				}>(),
				showRecords: new Array<{
					node : string;
					nodeShow : string;
					pledge : number;
					blockNum : number;
				}>(),
				witnesses: new Array<Witness>(),
				statusBarHeight: 0
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

				this.witnesses = new Array<Witness>();
				await BitInstance.bitweb.trx.listSuperRepresentatives().then((witnessArr : Witness[]) => {
					witnessArr.map((witness : Witness) => {
						if (witness.voteCount === undefined) {
							witness.voteCount = 0;
						}
						if (witness.latestBlockNum === undefined) {
							witness.latestBlockNum = 0;
						}
						witness.address = BitInstance.bitweb.address.fromHex(witness.address);
						this.witnesses.push(witness);

					});

					this.witnesses.sort((a, b) => b.voteCount - a.voteCount);
				}).catch((e : any) => { });

				this.records = new Array<{
					node : string;
					nodeShow : string;
					pledge : number;
					blockNum : number;
				}>();
				this.showRecords = new Array<{
					node : string;
					nodeShow : string;
					pledge : number;
					blockNum : number;
				}>();
				this.witnesses.map((witness : Witness) => {
					this.records.push({
						node: witness.address,
						nodeShow: ShowUtil.omitAddress(witness.address, 6, 6),
						pledge: witness.voteCount,
						blockNum: witness.latestBlockNum,
					})
					this.showRecords.push({
						node: witness.address,
						nodeShow: ShowUtil.omitAddress(witness.address, 6, 6),
						pledge: witness.voteCount,
						blockNum: witness.latestBlockNum,
					})
				})

				UniUtil.loadHide();
			},
			onSearchInput() {
				const search = this.param.search;
				if (CheckUtil.isStrEmpty(search)) {
					this.showRecords = this.records;
					return;
				}
				const tmp = new Array<{
					node : string;
					nodeShow : string;
					pledge : number;
					blockNum : number;
				}>();
				this.records.map((record : any) => {
					if (record.node.toLowerCase().includes(search.toLowerCase())) {
						tmp.push(record);
					}
				})
				this.showRecords = tmp;
			},
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
		padding-left: 31rpx;
		padding-right: 31rpx;
		padding-bottom: 180rpx;
		background-color: #f7f7f7;

		box-sizing: border-box;

		.searchBox {
			width: 100%;
			height: 165rpx;
			background-color: #fff;
			border-radius: 25rpx;
			margin-top: 59rpx;
			padding: 36rpx;
			box-sizing: border-box;

			.inputBox {
				width: 617rpx;
				height: 93rpx;
				background: #F7F7F7;
				border-radius: 25rpx;

				input {
					width: 617rpx;
					height: 93rpx;
					padding-left: 16rpx;
					padding-right: 16rpx;
					box-sizing: border-box;
				}

				.textareaFont {
					font-family: PingFang;
					font-weight: 500;
					font-size: 24rpx;
					color: #838383;
					// line-height: 24rpx;
				}
			}
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
	}
</style>