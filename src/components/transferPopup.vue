<template>
	<view class="transferPopup" v-if="show">
		<view class="mask" @click="close"></view>
		<view class="container">
			<view class="header">
				钱包列表
			</view>
			<image src="@/static/newUI3/transaction/closeIcon.png" mode="aspectFill" class="closeIcon" @click="close">
			</image>
			<view class="divider"></view>
			<view class="main">
				<view class="addressTypeList">
					<view class="addressType" v-for="(item,index) in chains" :key="index"
						@click="handleNavClick(item.key)"
						:class="param.chainActive === item.key? 'activeAddressType':''">
						{{ item.name }}
					</view>
				</view>
				<view class="addressList">
					<view class="addressItem" v-for="(item,index) in accounts" :key="index"
						@click="chooseAccount(item.address)">
						<image src="@/static/newUI3/transaction/bit.png" mode="widthFix" class="addressIcon"></image>
						<view class="addressInfo">
							<view class="name">
								{{ item.name }}
							</view>
							<view class="address">
								{{ item.addressShow }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { CHAIN_TYPE } from '@/data/constants';
	import { UniUtil } from "@/data/util/uniUtil";
	import { ShowUtil } from "@/data/util/showUtil";
	import { WalletData } from '@/data/wallet/walletData';
	import { BitAccount } from '@/chain/bit/account/account';
	import { AddressBookData } from '@/data/addressBook/addressBookData';

	export default Vue.extend({
		props: {
			show: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				param: {
					chainActive: 'transfer',
				},
				chains: [
					{
						key: 'transfer',
						name: '最近转账',
					},
					{
						key: 'wallet',
						name: '钱包列表',
					},
					{
						key: 'addressBook',
						name: '地址本',
					},
				],
				accounts: new Array<{
					chain : string;
					name : string;
					address : string;
					addressShow : string;
				}>(),
				// [
				// 	{
				// 		chain: 'BIT',
				// 		name: 'BIT',
				// 		address: 'BNOJkjlsdjafasdf'
				// 	},
				// 	{
				// 		chain: 'BIT',
				// 		name: 'BIT',
				// 		address: 'BNOJkjlsdjafasdf'
				// 	},
				// ],
			}
		},
		async created() {
			await this.loadTransfers();
		},
		methods: {
			close() {
				this.$emit('transferPopupshow', false)
			},
			chooseAccount(address : string) {
				this.$emit('transferPopupshow', false)
				this.$emit('chooseAccountValue', address)
			},
			async handleNavClick(chainActive : string) {
				this.accounts.length = 0;
				this.param.chainActive = chainActive;
				if (chainActive === 'transfer') {
					await this.loadTransfers();
				} else if (chainActive === 'wallet') {
					this.loadWallet();
				} else if (chainActive === 'addressBook') {
					this.loadAddressBook();
				}
			},
			async loadTransfers() {
				// 加载最近转账
				UniUtil.loadShow();
				const account = WalletData.account;
				await BitAccount.getTransfers(account.address, "", 1, 100).then((rs : any) => {
					const datas = rs.data;

					datas.map((data : any) => {
						this.accounts.push({
							chain: 'BIT',
							name: 'BIT',
							address: data.to,
							addressShow: ShowUtil.omitAddress(data.to, 10, 10),
						})
					});
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('加载失败，请刷新重试');
				});
				UniUtil.loadHide();
			},
			loadWallet() {
				const tmps = WalletData.accountChainMap;
				if (tmps != undefined) {
					const accountChains = tmps[CHAIN_TYPE.BIT];
					accountChains.map((accountChain) => {
						this.accounts.push({
							chain: 'BIT',
							name: accountChain.name,
							address: accountChain.address,
							addressShow: ShowUtil.omitAddress(accountChain.address, 10, 10),
						})
					})
				}
			},
			loadAddressBook() {
				const tmps = AddressBookData.addressBook;
				if (tmps != undefined) {
					const addressBooks = tmps[CHAIN_TYPE.BIT];
					if (addressBooks != undefined) {
						addressBooks.map((addressBook) => {
							this.accounts.push({
								chain: 'BIT',
								name: addressBook.name,
								address: addressBook.address,
								addressShow: ShowUtil.omitAddress(addressBook.address, 10, 10),
							})
						})
					}
				}
			},
		}
	});
</script>

<style lang="scss" scoped>
	.transferPopup {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;

		.mask {
			position: relative;
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.5);
		}

		.container {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 70vh;
			background-color: #fff;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 20rpx;
			// overflow-y: auto;
			padding-top: 56rpx;
			box-sizing: border-box;

			.header {
				width: 100%;
				height: 30rpx;
				font-family: PingFang;
				font-weight: bold;
				font-size: 30rpx;
				color: #231815;
				line-height: 30rpx;
				text-align: center;
				// ps
				// background-color: pink;
			}

			.closeIcon {
				position: absolute;
				top: 50rpx;
				right: 31rpx;
				display: block;
				width: 31rpx;
				height: 33rpx;
			}

			.divider {
				width: 100%;
				height: 1rpx;
				margin-top: 32rpx;
				background: #EBEBEB;
			}

			.main {
				margin-top: 52rpx;
				width: 100%;
				padding: 0rpx 31rpx;
				box-sizing: border-box;

				.addressTypeList {
					display: flex;

					width: 100%;
					height: 78rpx;
					background-color: #f7f7f7;
					border-radius: 36rpx;
					overflow: hidden;

					.addressType {
						position: relative;
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;

						font-family: PingFang;
						font-weight: 500;
						font-size: 28rpx;
						color: #838383;

					}

					.addressType:not(:last-child)::after {
						content: "";
						position: absolute;
						right: -1px;
						width: 1px;
						height: 43rpx;
						background-color: #A2A4B0;
					}


					.activeAddressType {
						background: #9E2922 !important;
						color: #fff !important;
					}
				
				}

				.addressList {
					margin-top: 60rpx;
					width: 100%;
					height: 50vh;
					overflow-y: auto;

					// height: 100%;
					.addressItem {
						position: relative;
						display: flex;
						align-items: center;
						width: 100%;
						height: 85rpx;
						margin-bottom: 65rpx;

						.addressIcon {
							display: block;
							width: 85rpx;
							height: 85rpx;
							margin-right: 33rpx;
						}

						.addressInfo {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							flex: 1;
							height: 64rpx;

							// ps
							// background-color: greenyellow;
							.name {
								height: 27rpx;
								line-height: 27rpx;
								font-family: PingFang;
								font-weight: bold;
								font-size: 27rpx;
								color: #231815;
							}

							.address {
								height: 27rpx;
								font-family: PingFang;
								font-weight: 500;
								font-size: 27rpx;
								color: #A2A4B0;
								line-height: 27rpx;
							}
						}
					}

					.addressItem:not(:last-child)::after {
						content: "";
						position: absolute;
						right: 0;
						bottom: -36rpx;
						width: 100%;
						height: 1rpx;
						background-color: #838383;
					}
				}

			}
		}
	}
</style>