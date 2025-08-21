<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='多签交易记录'></titleBar>
		<view class="recordBox">
			<view class="recordHeader">
				<view class="recordHeaderItem">转出</view>
				<view class="recordHeaderItem">转入</view>
				<view class="recordHeaderItem">时间</view>
				<view class="recordHeaderItem">数量/编号</view>
				<view class="recordHeaderItem">状态</view>
			</view>
			<view class="recordMain">
				<block v-if='records.length>0'>
					<view class="recordItem" v-for="(item,index) in records" :key="index"   >
						<view class="recordItemValue">{{ item.from }} </view>
						<view class="recordItemValue">{{ item.to }}</view>
						<view class="recordItemValue">{{ item.time }}</view>
						<view class="recordItemValue">{{ item.num }}</view>
						<view class="recordStatusBox">
							<view class="recordStatus" v-if="item.state == 'INIT'" @click="argee(item.item)">同意</view>
							<view class="recordStatus successStatus" v-else-if="item.state == 'SUCCESS'">成功</view>
							<view class="recordStatus errorStatus" v-else-if="item.state == 'FAIL'">失败</view>
							<view class="recordStatus errorStatus" v-else-if="item.state == 'EXP'">已过期</view>
							<view class="recordStatus" v-else-if="item.state == '888'">您已确认</view>
							<view class="recordStatus" v-else-if="item.state == '999'" @click="send(item.item)">发送</view>
							<view class="recordStatus" v-else>成功</view>
					
						</view>
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
	import { WalletData } from '@/data/wallet/walletData';
	import { BitAccount } from '@/chain/bit/account/account';
	import { UniUtil } from "@/data/util/uniUtil";
	import { ShowUtil } from "@/data/util/showUtil";
	import PasswordPopup from "@/components/password/passwordPopup.vue";

	export default Vue.extend({
		components: { Empty, PasswordPopup },
		data() {
			return {
				param: {
					recordsEmpty: false,
				},
				records: new Array<{
					from : string;
					to : string;
					num : number;
					time : string;
					state : string;
					item : any;
					txHash:string;
				}>(),
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
				from: string;
				to: string;
				num: number;
				time: string;
				state: string;
				item: any;
				txHash:string;
			}>();
			const account = WalletData.account;
			await BitAccount.multiPage(account.address, 1, 100).then(async (rs: any) => {
				const datas = rs.data;
				
				// datas.map((data: any) => {
				for(const data of datas) {
					if(data.originalTx != "") {
						const tx = JSON.parse(data.originalTx);
						const from = data.fromAddress ? 
							data.fromAddress : BitInstance.bitweb.address.fromHex(tx.raw_data.contract[0].parameter.value.owner_address);
						const to = data.toAddress ? 
							data.toAddress : BitInstance.bitweb.address.fromHex(tx.raw_data.contract[0].parameter.value.to_address);
						const value = data.amount ? 
							data.amount : tx.raw_data.contract[0].parameter.value.amount / 10**13;
						
						let state = data.state;
						if(state == 'INIT') {
							// 当前是否已同意
							// console.log(data.approvedList.includes(account.address));
							// console.log(data.approvedList);
							// console.log(account.address);
							if(data.approvedList.includes(account.address)) {
								state = '888';
							}
							// 待发起
							const mulitAccountInfo = await BitAccount.getAccount({ address: data.address });
							if(
								// (data.approvedList.length == 1 && data.referAddress.length == 2)
								// || data.approvedList.length >= data.referAddress.length * 2 / 3
								data.approvedList.length >= mulitAccountInfo.active_permission[0].threshold
							) {
								state = '999';
							}
						}
						
								this.records.push({
									from: ShowUtil.omitAddress(from, 8, 8),
									to: ShowUtil.omitAddress(to, 8, 8),
									num: value,
									time: data.createTime,
									state: state,
									item: data,
									txHash: data.txHash
								})
					}
				// });
				}
			}).catch((e: any) => {
				console.log(e);
				UniUtil.toastError('加载失败，请刷新重试');
			});
			this.param.recordsEmpty = this.records.length === 0;
			UniUtil.loadHide();
		},
		methods: {
			async argee(item : any) {
				UniUtil.loadShow();
				// console.log(item)
				const tx = JSON.parse(item.signedTxs[item.signedTxs.length - 1]);
				// console.log(tx)

				const signedTx = await BitInstance.bitweb.trx.multiSign(tx);
				// console.log(signedTx)

				// console.log(item.id)
				// console.log(WalletData.account.address)
				// console.log(JSON.stringify(signedTx))

				await BitAccount.upsertMulti(
					item.id,
					"",
					"",
					WalletData.account.address,
					JSON.stringify(signedTx),
					"",
					"",
					"",
					"",
					"",
					"",
				).then((rs : any) => {

					// console.log(rs);
					UniUtil.toastSuccess('同意多签交易成功', () => {
						setTimeout(() => {
							uni.redirectTo({
								url: './multiRecord'
							});
						}, 1000);
					});
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('同意多签交易失败，请重试');
				})
			},
			async send(item : any) {
				UniUtil.loadShow();

				const tx = JSON.parse(item.signedTxs[item.signedTxs.length - 1]);
				await BitInstance.bitweb.trx.sendRawTransaction(tx).then((rs : any) => {

					console.log(rs);

					if (rs?.code == "DUP_TRANSACTION_ERROR") {
						UniUtil.toastSuccess('已提交，请勿重复操作', () => {
							setTimeout(() => {
								uni.redirectTo({
									url: './multiRecord'
								});
							}, 1000);
						});
					} else {
						UniUtil.toastSuccess('发送多签交易成功', () => {
							setTimeout(() => {
								uni.redirectTo({
									url: './multiRecord'
								});
							}, 1000);
						});
					}
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('发送多签交易失败，请重试');
				})
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
		background-color: #fff;
		background-size: 100% 100%;
		box-sizing: border-box;

		.recordBox {
			margin-top: 60rpx;
			width: 100%;

			// ps
			// background-color: pink;

			.recordHeader {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 24rpx;


				.recordHeaderItem {
					display: flex;
					justify-content: center;
					width: 110rpx;
					height: 24rpx;
					font-family: PingFang;
					font-weight: 500;
					font-size: 24rpx;
					color: #A2A4B0;
					line-height: 24rpx;
				}
			}

			.recordMain {
				width: 100%;
				height: 78vh;
				overflow-y: auto;
				margin-top: 62rpx;

				.recordItem {
					display: flex;
					justify-content: space-between;
					width: 100%;
					height: 40rpx;
					margin-bottom: 70rpx;

					.recordItemValue {
						display: flex;
						align-items: center;
						justify-content: center;

						width: 110rpx;
						font-family: PingFang;
						font-weight: 500;
						font-size: 18rpx;
						color: #8c8c8c;
						text-align: center;

						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
					}

					.recordStatusBox {

						display: flex;
						align-items: center;
						justify-content: center;

						width: 110rpx;
						height: 38rpx;

						.recordStatus {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 105rpx;
							height: 38rpx;
							background: #EBEBEB;
							border-radius: 16rpx;
							font-family: PingFang;
							font-weight: 500;
							font-size: 18rpx;
							color: #231815;
							line-height: 18rpx;
						}

						.errorStatus {
							background: #9E2922 !important;
							color: #fff;
						}

						.successStatus {
							background: #5E9278 !important;
							color: #fff;
						}
					}
				}
			}
		}
	}
	.noMoreData {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height:100%;
		text-align: center;
		font-family: PingFang;
		font-weight: 500;
		font-size: 25rpx;
		color: #A2A4B0;
		line-height: 25rpx;
	}
</style>