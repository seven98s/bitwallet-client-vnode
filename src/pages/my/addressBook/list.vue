<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='地址本转账'></titleBar>
		<view v-if="address.length === 0">
			<image src="@/static/newUI3/transaction/addressBackgroung.png" mode="aspectFill" class="addressBackgroung">
			</image>
			<view class="tips">
				您当前没有地址信息
			</view>
		</view>
		<view v-else>
			<view class="addressList">
				<view class="addressItem " v-for="(item,index) in address" :key="index"
					@click="chooseAccount(item.address)">
					<view class="text">
						{{ item.name }}
					</view>
					<view class="text">
						{{ item.address }}
					</view>
					<view class="text">
						备注：{{ item.remark }}
					</view>
				</view>
			</view>

		</view>
		<view class="confirmButton" @click="gotoAdd">
			添加地址
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { CHAIN_TYPE } from '@/data/constants';
	import { AddressBookData } from '@/data/addressBook/addressBookData';

	export default Vue.extend({
		data() {
			return {
				address: new Array<{
					chain : string;
					name : string;
					address : string;
					remark : string;
				}>(),
				statusBarHeight: 0,
				// [
				// 	{
				// 		chain: 'BIT',
				// 		name: 'name',
				// 		address: 'Bsdafasdfwertw',
				// 		remark: 'remark',
				// 	},
				// 	{
				// 		chain: 'BIT',
				// 		name: 'name',
				// 		address: 'Bsdafasdfwertw',
				// 		remark: 'remark',
				// 	},
				// ]
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		onShow() {
			this.address = new Array();
			const addressBooks = AddressBookData.addressBook;
			if (addressBooks != undefined) {
				const list = addressBooks[CHAIN_TYPE.BIT];
				if (list != undefined) {
					list.map((addressBook : any) => {
						this.address.push({
							chain: 'BIT',
							name: addressBook.name,
							address: addressBook.address,
							remark: addressBook.remark,
						});
					});
				}
			}
		},
		methods: {
			gotoAdd() {
				uni.navigateTo({
					url: './add'
				});
			},
			chooseAccount(address : string) {
				uni.navigateTo({
					url: '../../wallet/transfer/transfer?address=' + address
				});
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
		background-color: #fff;
		background-size: 100% 100%;
		box-sizing: border-box;

		.addressBackgroung {
			margin-top: 167rpx;
			display: block;
			width: 632rpx;
			height: 586rpx;
		}

		.tips {
			margin-top: 46rpx;
			width:100%;
			height: 24rpx;
			text-align: center;
			font-family: PingFang;
			font-weight: 500;
			font-size: 24rpx;
			color: #838383;
			line-height: 24rpx;
		}

		.confirmButton {
			margin-top: 140rpx;
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

		.addressList {
			display: flex;
			flex-direction: column;
			margin-top: 59rpx;
			width: 688rpx;
			height: 900rpx;
			overflow-y: auto;
			// background-color: pink;

			.addressItem {
				width: 100%;
				height: 160rpx;
				border-radius: 25rpx;
				padding:20rpx;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				background-color: #f9f9f9;

				.text {
					font-family: PingFang;
					font-size: 28rpx;
					line-height: 40rpx;
					color: black;
				}
			}
		}
	}
</style>