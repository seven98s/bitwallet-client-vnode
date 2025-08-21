<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='转账详情'></titleBar>
		<view class="transferNumberBox">
			<view class="title">
				转账数量
			</view>
			<view class="transferNumber" :class="info.result===0?'successStatus':''">
				{{number}} {{unit}}
			</view>
			<template v-if="info.result!==''">
				<view class="transferdErrorStatus" :class="info.result===0?'successStatus':''">
					{{info.result===0?'已完成':'未完成'}}
				</view>
			</template>

		</view>
		<view class="paramsList">
			<view class="params">
				<view class="left">
					类型
				</view>
				<view class="right">
					<view class="value">
						转账
					</view>
				</view>
			</view>
			<view class="params">
				<view class="left">
					发送者
				</view>
				<view class="right">
					<view class="value">
						{{ fromAddress }}
					</view>
					<image src="@/static/newUI3/transaction/copy2.png" mode="aspectFill" class="copyIcon"
						@click="copyAddress(fromAddress)"></image>
				</view>
			</view>
			<view class="params">
				<view class="left">
					接受者
				</view>
				<view class="right">
					<view class="value">
						{{ info.toAddress }}
					</view>
					<image src="@/static/newUI3/transaction/copy2.png" mode="aspectFill" class="copyIcon"
						@click="copyAddress(info.toAddress)"></image>
				</view>
			</view>
			<view class="params">
				<view class="left">
					网络费
				</view>
				<view class="right">
					<view class="value">
						{{ info.feeShow }} BIT
					</view>
				</view>
			</view>
			<view class="params">
				<view class="left">
					哈希
				</view>
				<view class="right">
					<view class="value">
						{{info.hash}}
					</view>
					<image src="@/static/newUI3/transaction/copy2.png" mode="aspectFill" class="copyIcon"
						@click="copyAddress(info.hash)"></image>
				</view>
			</view>
			<view class="params">
				<view class="left">
					时间
				</view>
				<view class="right">
					<view class="value">
						{{ info.timeStamp }}
					</view>
				</view>
			</view>
		</view>
		<view class="tips" @click="gotoPage('./toChainScan?txHash='+hash.split('-')[0])">
			查询详细信息？
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { BitTransaction } from '@/chain/bit/transaction/transaction';
	import { UniUtil } from '@/data/util/uniUtil';
	import { BitAccount } from '@/chain/bit/account/account';
	import { WalletData } from '@/data/wallet/walletData';
	export default Vue.extend({
		data() {
			return {
				hash: "",
				info: {
					hash: '',

					fromAddress: '',
					toAddress: '',
					timeStamp: '',
					feeShow: '',
					bitValue: '',
					result: '',
					transactionId: '',
				},
				statusBarHeight: 0,
				unit: '',
				number: 0,
				fromAddress:''
			}
		},
		async onLoad(query : any) {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			this.hash = query.txHash;
			const info : any = await BitTransaction.getInfo(this.hash.split('_')[0]);

			this.info = info.transaction as any;
			this.info.toAddress = query.to;
			
			// 调第二个接口获取相关数据
			const account = WalletData.account;
			const res : any = await BitAccount.getTransfers2(account.address, "", 1, 100, this.hash)
			this.unit = res.data[0].name
			this.number = res.data[0].value
			this.fromAddress=res.data[0].from

		},
		methods: {
			copyAddress(content : string) {
				UniUtil.copy(content);
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
		padding: 0rpx 31rpx;
		box-sizing: border-box;
		background-color: #fff;
		background-size: 100% 100%;
		box-sizing: border-box;

		.transferNumberBox {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-top: 54rpx;
			width: 689rpx;
			height: 253rpx;
			background: #F6F6F6;
			border-radius: 25rpx;
			padding: 56rpx 0rpx 56rpx;
			box-sizing: border-box;

			.title {
				width: 100%;
				height: 22rpx;

				text-align: center;
				line-height: 22rpx;

				font-family: PingFang;
				font-weight: 500;
				font-size: 22rpx;
				color: #000000;
			}

			.transferNumber {
				width: 100%;
				height: 38rpx;
				text-align: center;
				line-height: 38rpx;
				font-family: PingFang;
				font-weight: bold;
				font-size: 38rpx;
				color: #F05047;
			}

			.transferdErrorStatus {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 32rpx;

				font-family: PingFang;
				font-weight: 800;
				font-size: 28rpx;
				color: #F05047;
			}

			.successStatus {

				color: #00C087 !important;
			}
		}

		.paramsList {
			margin-top: 6rpx;
			width: 100%;

			// height: 576rpx;
			// background-color: skyblue;
			.params {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				min-height: 78rpx;
				border-bottom: 1px dashed #A2A4B0;
				padding: 22rpx 0rpx;
				box-sizing: border-box;

				.left {
					height: 22rpx;
					line-height: 22rpx;
					font-family: PingFang;
					font-weight: 500;
					font-size: 22rpx;
					color: #A2A4B0;
				}

				.right {
					display: flex;
					// align-items: center;
					width: 300rpx;
					min-height: 22rpx;
					line-height: 22rpx;
					font-family: PingFang;
					font-weight: 500;
					font-size: 22rpx;
					color: #000000;
					text-align: right;

					.value {
						flex: 1;
						font-family: PingFang;
						font-weight: 500;
						font-size: 22rpx;
						color: #000000;
						text-align: right;

						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
					}

					.copyIcon {
						display: block;
						width: 23rpx;
						height: 25rpx;
						margin-left: 22rpx;
					}
				}
			}

			& .params:last-child {
				border: none;
			}
		}

		.tips {
			margin-top: 200rpx;
			width: 100%;
			height: 24rpx;
			text-align: center;
			font-family: PingFang;
			font-weight: 500;
			font-size: 24rpx;
			color: #000000;
			text-decoration-line: underline;
		}
	}
</style>