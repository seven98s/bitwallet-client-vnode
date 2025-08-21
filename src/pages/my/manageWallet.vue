<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='管理钱包'></titleBar>
		<view class="walletList">
			<view class="walletItem" v-for="(item,index) in accounts" :key="index">
				<view class="header">
					<view class="walletName">
						{{ item.name }} <text v-show="item.type === 2" class="tips"> [观察钱包]</text>
					</view>
				<!-- 	<image src="@/static/newUI3/my/edit.png" mode="aspectFill" class="editIcon"
						@click="gotoPage('/pages/wallet/detail')"></image> -->
				</view>
				<view class="walletInfo">
					<image src="@/static/newUI3/my/bit.png" mode="aspectFill" class="walletIcon"></image>
					<view class="walletAdress">
						{{ item.addressShow }}
					</view>
					<view class="walletBalance">
						{{ item.num }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { WalletData } from '@/data/wallet/walletData';
	import { BitAccount } from '@/chain/bit/account/account';
	import { ShowUtil } from '@/data/util/showUtil';
	import { CHAIN_TYPE } from '@/data/constants';
	import { UniUtil } from '@/data/util/uniUtil';

	export default Vue.extend({
		data() {
			return {
				param: {
					chainActive: CHAIN_TYPE.BIT,
					existsMnemonic: true,
				},
				chains: [
					// {
					// 	key: 'bit',
					// 	name: 'BIT',
					// 	icon: require('@/static/wallet/popup/bit.png'),
					// 	iconActive: require('@/static/wallet/popup/bitActive.png'),
					// },
					// {
					// 	key: 'tron',
					// 	name: '波场',
					// 	icon: require('@/static/wallet/popup/tron.png'),
					// 	iconActive: require('@/static/wallet/popup/tronActive.png'),
					// },
					// {
					// 	key: 'binance',
					// 	name: '币安',
					// 	icon: require('@/static/wallet/popup/binance.png'),
					// 	iconActive: require('@/static/wallet/popup/binanceActive.png'),
					// },
					// {
					// 	key: 'eth',
					// 	name: '以太坊',
					// 	icon: require('@/static/wallet/popup/eth.png'),
					// 	iconActive: require('@/static/wallet/popup/ethActive.png'),
					// },
				],
				accounts: new Array<{
					name : string;
					address : string;
					addressShow : string;
					num : string;
					account : Wallet.Account;
					type : number;
				}>(),
				statusBarHeight: 0,
				// accounts: [
				// 	{
				// 		name: 'BIT',
				// 		address: 'BNOJkjlsdjafasdf',
				// 		num: '2000 BIT'
				// 	},
				// 	{
				// 		name: 'BIT',
				// 		address: 'BNOJkjlsdjafasdf',
				// 		num: '2000 BIT'
				// 	},
				// 	{
				// 		name: 'BIT',
				// 		address: 'BNOJkjlsdjafasdf',
				// 		num: '2000 BIT'
				// 	},
				// 	{
				// 		name: 'BIT',
				// 		address: 'BNOJkjlsdjafasdf',
				// 		num: '2000 BIT'
				// 	},
				// 	{
				// 		name: 'BIT',
				// 		address: 'BNOJkjlsdjafasdf',
				// 		num: '2000 BIT'
				// 	},
				// 	{
				// 		name: 'BIT',
				// 		address: 'BNOJkjlsdjafasdf',
				// 		num: '2000 BIT'
				// 	},
				// 	{
				// 		name: 'BIT',
				// 		address: 'BNOJkjlsdjafasdf',
				// 		num: '2000 BIT'
				// 	}
				// ],
			}
		},
		async onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			const accountChains = WalletData.accountChainMap[this.param.chainActive];
			for (const accountChain of accountChains) {
				const { name, address, type } = accountChain;

				await BitAccount.getAssets(address, [], true, 1, 100).then((rs : any) => {
					const datas = rs.data;
					datas.map((data : any) => {
						if (data.tokenType === 'BIT') {
							this.accounts.push({
								name,
								address,
								addressShow: ShowUtil.omitAddress(address, 10, 10),
								num: data.balance,
								account: accountChain,
								type: type,
							});
						}
					});
				})
			}

			// 是否存在钱包助记词
			this.param.existsMnemonic = WalletData.existsWalletMnemonic();
		},
		methods: {
			handleNavClick(chainActive : CHAIN_TYPE) {
				this.param.chainActive = chainActive;
				this.accounts = []
			},
			gotoPage(url : string) {
				uni.navigateTo({
					url
				});
			},
			copyAddress(address : string) {
				UniUtil.copy(address);
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

		.walletList {
			margin-top: 59rpx;
			width: 100%;
			overflow-y: auto;
			// ps

			.walletItem {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 688rpx;
				min-height: 181rpx;
				background: #FFFFFF;
				border-radius: 25rpx;
				margin-bottom: 24rpx;
				padding: 20rpx 36rpx 28rpx 36rpx;
				box-sizing: border-box;

				.header {
					display: flex;
					justify-content: space-between;
					width: 100%;
					height: 24rpx;
					line-height: 24rpx;
					padding-right: 10rpx;
					box-sizing: border-box;

					.walletName {
						font-family: PingFang;
						font-weight: bold;
						font-size: 24rpx;
						color: #231815;
						line-height: 24rpx;

						.tips {
							font-size: 20rpx;
							line-height: 24rpx;
							margin-left: 10rpx;
							font-weight: 400;
							color: #838383;
						}
					}

					.editIcon {
						display: block;
						width: 30rpx;
						height: 28rpx;
					}
				}

				.walletInfo {
					display: flex;
					align-items: center;
					width: 617rpx;
					min-height: 93rpx;
					background: #EBEBEB;
					border-radius: 25rpx;
					padding: 0rpx 39rpx;
					box-sizing: border-box;

					.walletIcon {
						display: block;
						width: 60rpx;
						height: 60rpx;
						margin-right: 15rpx;
					}

					.walletAdress {
						height: 24rpx;

						font-family: PingFang;
						font-weight: 500;
						font-size: 24rpx;
						color: #231815;
						line-height: 24rpx;
						margin-right: 20rpx;
					}

					.walletBalance {
						flex: 1;
						min-height: 24rpx;
						font-family: PingFang;
						font-weight: bold;
						font-size: 24rpx;
						color: #231815;
						text-align:right;
						line-height: 24rpx;
						word-break: break-all;

					}
				}
			}
		}
	}
</style>