<template>
	<view class="page">
		<view class="main">
			<view class="way">
				<view class="wayTab" v-for="(item,index) in ways" :key="index"
					@click="handleAssetTabClick(item.key)"
					:style="param.active === item.key 
							? { backgroundColor: 'rgb(158 41 34)', color: 'white' } 
							: { backgroundColor: 'white', color: 'black' }" alt="" >
					<view class="icon">
						<image :src="param.active === item.key ? item.activeIcon : item.icon" />
					</view>
					<view class="letter">
						{{ item.title }}
					</view>
				</view>
			</view>
			
			<view class="records">
				<view class="tip">
					节点排名
				</view>
				<view class="content">
					<view class="title">
						<view class="titleSub">节点</view>
						<view class="titleSub">质押量</view>
						<view class="titleSub">区块高度</view>
					</view>
					<view class="recordTab" v-for="(item,index) in records" :key="index">
						<view class="recordTabSub">{{ item.node }}</view>
						<view class="recordTabSub">{{ item.pledge }}</view>
						<view class="recordTabSub">{{ item.blockNum }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import { BitInstance } from '@/chain/bit/instance';
import { WalletData } from '@/data/wallet/walletData';
import { BitAccount } from '@/chain/bit/account/account';
import { UniUtil } from "@/data/util/uniUtil";
import { ShowUtil } from "@/data/util/showUtil";

export default Vue.extend({
	data() {
		return {
			param: {
				active: 'super',
			},
			ways: [
				{
					key: 'super',
					icon: require('@/static/node/joinNodePage/super.png'),
					activeIcon: require('@/static/node/joinNodePage/superActive.png'),
					title: '超级节点'
				},
				{
					key: 'sentry',
					icon: require('@/static/node/joinNodePage/sentry.png'),
					activeIcon: require('@/static/node/joinNodePage/sentryActive.png'),
					title: '哨兵节点'
				},
				{
					key: 'campaign',
					icon: require('@/static/node/joinNodePage/campaign.png'),
					activeIcon: require('@/static/node/joinNodePage/campaignActive.png'),
					title: '竞选节点'
				},
			],
			records: new Array<{
				node: string;
				pledge: number;
				blockNum: number;
			}>(),
		}
	},
	async onShow() {
		UniUtil.loadShow();
		// const account = WalletData.account;
		// await BitAccount.getTransfers(account.address, 1, 100).then((rs: any) => {
		// // await BitAccount.getTransfers("BKPanM6mH57eQdccDHEgyrAqzrWzq7ziT9", 1, 100).then((rs: any) => {
		// 	const datas = rs.data;
			
		// 	datas.map((data: any) => {
		// 		this.records.push({
		// 			from: ShowUtil.omitAddress(data.from, 5, 3),
		// 			to: ShowUtil.omitAddress(data.to, 5, 3),
		// 			num: data.value,
		// 			time: data.updateTime,
		// 		})
		// 	});
		// }).catch((e: any) => {
		// 	console.log(e);
		// 	ShowToastUtil.success('加载失败，请刷新重试');
		// });
		UniUtil.loadHide();
	},
	methods: {
		gotoFun(index: number) {
			if(index === 0) {
				uni.navigateTo({
				  url: './transfer'
				});
			} else if(index === 1) {
				uni.navigateTo({
				  url: '../../my/addressBook/list'
				});
			}
		},
		handleAssetTabClick(active: string) {
			this.param.active = active;
		},
	}
});
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: rgb(235 235 235);
		padding: 20rpx 0rpx;
		
		.main {
			margin: 0rpx 40rpx;
			.way {
				display: flex;
				text-align: center;
				.wayTab {
					flex: 1;
					background-color: white;
					border-radius: 20rpx;
					padding: 20rpx;
					
					.icon {
						margin: 20rpx;
						image {
							width: 80rpx;
							height: 80rpx;
						}
					}
				}
				.wayTab+.wayTab {
					margin-left: 20rpx;
				}
			}
			
			.records {
				margin-top: 40rpx;
				.tip {
					font-size: 36rpx;
				}
				.content {
					margin-top: 10rpx;
					background-color: white;
					border-radius: 20rpx;
					padding-bottom: 60rpx;
					.title {
						padding: 20rpx;
						text-align: center;
						border-bottom: 2rpx solid rgb(182 182 182);
						display: flex;
						.titleSub {
							flex: 1;
						}
					}
					
					.recordTab {
						margin: 20rpx;
						color: rgb(133 133 133);
						text-align: center;
						border-bottom: 2rpx dashed rgb(182 182 182);
						display: flex;
						.recordTabSub {
							flex: 1;
							margin-top: 20rpx;
							margin-bottom: 20rpx;
							font-size: 26rpx;
						}
						.recordTabSub+.recordTabSub {
							margin-left: 20rpx;
						}
					}
				}
			}
		}
	}
</style>