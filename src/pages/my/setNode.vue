<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='节点速度'></titleBar>
		<view class="nodeIntroduce">
			<view class="header">
				<view class="left">
					节点速度
				</view>
				<view class="right">
					<view class="nodeSpeed">
						<image src="@/static/newUI3/transaction/speedFast.png" mode="aspectFill" class="speedIcon">
						</image>
						<view class="speedText">
							极速
						</view>
					</view>
					<view class="nodeSpeed">
						<image src="@/static/newUI3/transaction/speedMiddle.png" mode="aspectFill" class="speedIcon">
						</image>
						<view class="speedText">
							缓慢
						</view>
					</view>
					<view class="nodeSpeed">
						<image src="@/static/newUI3/transaction/speedSlow.png" mode="aspectFill" class="speedIcon">
						</image>
						<view class="speedText">
							拥堵
						</view>
					</view>

				</view>
			</view>
			<view class="nodeDescribe">
				区块高度：高度值越大，代表节点数据同步更完善,其稳定
				性更好。在节点速度差不多的情况下，选择高度值大的节
				点，体验更好
			</view>
		</view>
		<view class="recommendText">
			推荐节点
		</view>
		<view class="recommendNodeList">
			<view class="nodeItem" v-for="(item, index) in nodes" :key="index" @click="choose(item.storageNode)">
				<view class='nodeName'>
					<view class="circleBox activeNode" v-if="item.acitve"></view>
					<view class="circleBox" v-else></view>
					{{ item.name }} 
				</view>
				<view class="nodeLocation">
					{{item.nodeLocation}}
				</view>
				<view class="nodeInfoBox">
					<view class="left">
						<view class="speedNumber">
							{{ item.speed }}ms 
						</view>
						<view class="speedBlockNumber">
							区块高度：{{ item.blockNum }}
						</view>
					</view>
					<image src="@/static/newUI3/transaction/nodeIcon.png" mode="aspectFill" class="nodeIcon"></image>
				</view>
			</view>
		</view>
		<view class="confirmButton" @click="gotoPage('/pages/node/operate/createNode')">
			添加自定义节点
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { NodeData } from '@/data/node/nodeData';
	import { CHAIN_TYPE } from '@/data/constants';

	export default Vue.extend({
		data() {
			return {
				nodes: new Array<{
					name : string;
					speed : number;
					blockNum : number;
					acitve : boolean;
					storageNode : any;
					nodeLocation:string;
				}>(),
				statusBarHeight: 0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		async onShow() {
			await this.load();
		},
		methods: {
			async choose(param : any) {
				NodeData.chooseNode(param);
				await this.load();
			},
			async load() {
				// query current choose
				const currentNode : any = NodeData.node();

				const nodes : any = NodeData.list();
				// get block 
				this.nodes = new Array<{
					name : string;
					speed : number;
					blockNum : number;
					acitve : boolean;
					storageNode : any;
					nodeLocation:string
				}>();
				nodes[CHAIN_TYPE.BIT].map(async (node : any) => {
					const startTime = new Date().getTime();
					const getBlockRs : any = await uni.request({
						url: node.url + '/wallet/getblock'
					})
					const endTime = new Date().getTime();
					const speed = endTime - startTime;
					const blockNum = getBlockRs.data.block_header.raw_data.number;
					this.nodes.push({
						name: node.name,
						speed,
						blockNum,
						acitve: currentNode.url == node.url,
						storageNode: node,
						nodeLocation:node.nodeLocation
					});
				});
			},
			gotoPage(url : string) {
				uni.navigateTo({
					url
				});
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

		.nodeIntroduce {
			margin-top: 59rpx;
			width: 688rpx;
			height: 308rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			padding: 57rpx 30rpx;
			box-sizing: border-box;

			.header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: 36rpx;

				.left {
					height: 30rpx;
					font-family: PingFang;
					font-weight: bold;
					font-size: 30rpx;
					line-height: 30rpx;
					color: #000000;
				}

				.right {
					display: flex;
					justify-content: space-between;
					width: 307rpx;
					height: 36rpx;

					.nodeSpeed {
						display: flex;
						justify-content: space-between;
						width: 87rpx;
						height: 36rpx;

						.speedIcon {
							display: block;
							width: 28rpx;
							height: 36rpx;
						}

						.speedText {
							font-family: PingFang;
							font-weight: 500;
							font-size: 25rpx;
							line-height: 36rpx;
							color: #A2A4B0;
						}
					}
				}
			}

			.nodeDescribe {
				margin-top: 59rpx;
				width: 621rpx;
				height: 99rpx;
				font-family: PingFang;
				font-weight: 500;
				font-size: 25rpx;
				color: #A2A4B0;
				line-height: 33rpx;
			}
		}

		.recommendText {
			margin-top: 45rpx;
			width: 100%;
			height: 25rpx;
			font-family: PingFang;
			font-weight: bold;
			font-size: 25rpx;
			line-height: 25rpx;
			color: #000000;
		}

		.recommendNodeList {
			margin-top: 22rpx;
			width: 750rpx;

			// margin-left: -31rpx;
			// margin-right: -31rpx;
			.nodeItem {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 750rpx;
				height: 93rpx;
				background-color: #FFFFFF;
				padding: 25rpx 43rpx 25rpx 56rpx;
				box-sizing: border-box;
				margin-bottom: 8rpx;

				.nodeName {
					display: flex;
					align-items: center;
					width: 140rpx;
					font-family: PingFang;
					font-size: 28rpx;
					font-weight: bold;
					line-height: 28rpx;
					color: #000000;

					.circleBox {
						width: 20rpx;
						height: 20rpx;
						border-radius: 50%;
						margin-right: 10rpx;
						background-color: #FFFFFF;
					}

					.activeNode {
						background-color: green !important;
					}
				}
				.nodeLocation {
					flex:1;
					height: 28rpx;
					line-height: 28rpx;
					font-family: PingFang;
					font-weight: 500;
					font-size: 28rpx;
					color: #A2A4B0;
				}

				.nodeInfoBox {
					display: flex;
					align-items: center;
					height: 43rpx;
					// ps
					// background-color: skyblue;

					.left {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						width: 300rpx;
						height: 43rpx;
						margin-right: 10rpx;

						.speedNumber {
							width: 100%;
							height: 23rpx;
							text-align: end;
							font-family: PingFang;
							font-size: 23rpx;
							line-height: 23rpx;
							font-weight: bold;
						}

						.speedBlockNumber {
							width: 100%;
							height: 20rpx;
							text-align: end;
							font-family: PingFang;
							font-size: 20rpx;
							line-height: 20rpx;
							color: #9b9b9b;
						}
					}

					.nodeIcon {
						display: block;
						width: 20rpx;
						height: 20rpx;
						margin-top: 6rpx;
					}

				}
			}
		}

		.confirmButton {
			margin-top: 216rpx;
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
</style>