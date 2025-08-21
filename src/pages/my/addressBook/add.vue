<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='添加地址'></titleBar>
		<view class="paramsList">
			<view class="params">
				<view class="header">
					钱包地址
				</view>
				<view class="inputBox2">
					<input type="text" placeholder="请输入或粘贴地址" v-model="param.address"
						placeholder-class="textareaFont" />
					<image src="@/static/newUI3/transaction/scanIcon.png" mode="aspectFill" class="scanCode" @click="scan"></image>
				</view>
			</view>
			<view class="params">
				<view class="header">
					设置名称
				</view>
				<view class="inputBox">
					<input type="text" placeholder="请输入名称" v-model="param.name" placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="params">
				<view class="header">
					钱包地址
				</view>
				<view class="inputBox">
					<input type="text" placeholder="备注仅作为补充信息,不参与链上交易" v-model="param.remark"
						placeholder-class="textareaFont" />
				</view>
			</view>
		</view>
		<view class="confirmButton" @click="save">
			保存
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { UniUtil } from "@/data/util/uniUtil";
	import { CheckUtil } from '@/data/util/checkUtil';
	import { AddressBookData } from '@/data/addressBook/addressBookData';
	import { CHAIN_TYPE } from '@/data/constants';
	export default Vue.extend({
		data() {
			return {
				param: {
					name: '',
					address: '',
					remark: '',
				},
				statusBarHeight: 0,
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		methods: {
			save() {
				UniUtil.loadShow();
				const { name, address, remark } = this.param;
				// check
				if (CheckUtil.isStrEmptyAndMessage(address, "请输入地址")) return;
				if (!CheckUtil.checkAddressAndMessage(address)) return;
				if (CheckUtil.isStrEmptyAndMessage(name, "请输入名称")) return;

				try {
					AddressBookData.saveAddressBook(
						CHAIN_TYPE.BIT,
						{
							chainType: CHAIN_TYPE.BIT,
							name,
							address,
							remark,
						}
					);
					UniUtil.toastSuccess("添加成功", () => {
						setTimeout(() => {
							uni.navigateTo({
								url: './list'
							});
						}, 200);
					});
				} catch (e : any) {
					UniUtil.toastError(e.message);
				} finally {
					UniUtil.loadHide();
				}
			},
			async scan() {
				await UniUtil.scanCollectCode().then((rs) => {
					this.param.address=rs as string
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

		.paramsList {
			width: 100%;
			margin-top: 59rpx;

			.params {
				width: 688rpx;
				height: 183rpx;
				background: #FFFFFF;
				border-radius: 25rpx;
				padding: 19rpx 36rpx 28rpx 36rpx;
				box-sizing: border-box;
				margin-bottom: 17rpx;

				.header {
					width: 100%;
					height: 25rpx;
					font-family: PingFang;
					font-weight: bold;
					font-size: 25rpx;
					color: #231815;
					line-height: 25rpx;
				}

				.inputBox {
					margin-top: 19rpx;
					width: 100%;
					height: 93rpx;
					background: #EBEBEB;
					border-radius: 25rpx;

					input {
						width: 100%;
						height: 93rpx;
						padding-left: 42rpx;
						padding-right: 42rpx;
						box-sizing: border-box;
						font-size: 22rpx;
					}

				}

				.inputBox2 {
					display: flex;
					align-items: center;
					margin-top: 19rpx;
					padding-right: 40rpx;
					box-sizing: border-box;
					width: 100%;
					height: 93rpx;
					background: #EBEBEB;
					border-radius: 25rpx;

					input {
						width: 100%;
						height: 93rpx;
						padding-left: 42rpx;
						padding-right: 20rpx;
						box-sizing: border-box;
						font-size: 22rpx;
					}

					.scanCode {
						display: block;
						width: 23rpx;
						height: 22rpx;
					}
				}

			}
		}

		.confirmButton {
			margin-top: 437rpx;
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

	.textareaFont {
		font-family: PingFang;
		font-weight: 500;
		font-size: 22rpx;
		color: #838383;
	}
</style>