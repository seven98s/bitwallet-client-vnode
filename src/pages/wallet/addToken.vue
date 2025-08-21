<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='添加代币'></titleBar>
		<view class="paramsList">
			<view class="params">
				<view class="header">
					<view class="left">
						合约地址
					</view>
					<!-- <view class="right">

						<image src="@/static/newUI3/transaction/scanIcon.png" mode="heightFix" class="icon"
							@click="scan">
						</image>
					</view> -->

				</view>
				<view class="textareaBox">
					<textarea placeholder="请输入合约地址" placeholder-class="textareaFont"
						v-model="formData.tokenAddress" ></textarea>
				</view>
			</view>
			<view class="params">
				<view class="header">
					代币名称
				</view>
				<view class="inputBox">
					<input type="text" placeholder="名称随合约自动显示" v-model="formData.tokenName"
						placeholder-class="textareaFont" disabled />
				</view>
			</view>
			<view class="params">
				<view class="header">
					代币精度
				</view>
				<view class="inputBox">
					<input type="text" placeholder="精度随合约自动显示" v-model="formData.tokenPrecision"
						placeholder-class="textareaFont" disabled />
				</view>
			</view>

		</view>
		<view class="confirmButton" @click="confirm()">
			确认
		</view>
		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { UniUtil } from "@/data/util/uniUtil";
	import PasswordPopup from "@/components/password/passwordPopup.vue";
	import TransferPopup from "@/components/transferPopup.vue";
	import { BitAccount } from '@/chain/bit/account/account';
	import { WalletData } from '@/data/wallet/walletData';
	export default Vue.extend({
		components: { PasswordPopup, TransferPopup },
		data() {
			return {
				statusBarHeight: 0,
				formData: {
					id: 0,
					account: "",
					tokenAddress: "",
					tokenName: "",
					tokenPrecision: '',
					tokenType: ""
				},
				timeId: null as any,
			}
		},
		async onShow() {
			const { address } = WalletData.account;
			this.formData.account = address
		},
		async onLoad(query : any) {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		methods: {
			async scan() {
				await UniUtil.scanCollectCode().then((rs : any) => {
					this.formData.account = rs;
				});
			},
			async loadTokenInfo() {
				UniUtil.loadShow();
				await BitAccount.getTokenInfo(this.formData.tokenAddress).then((res : any) => {
					// console.log(res.token, 'tokenInfo');
					UniUtil.loadHide();
					let tokenInfo = res.token
					if (tokenInfo && tokenInfo.id) {
						this.formData.id = tokenInfo.id
						this.formData.tokenName = tokenInfo.name
						this.formData.tokenPrecision = tokenInfo.decimal
						this.formData.tokenType=tokenInfo.tokenType

					} else {
						this.formData.id = 0
						// this.formData.tokenAddress = ''
						this.formData.tokenName = ''
						this.formData.tokenPrecision = ''
						UniUtil.toastError('请输入正确的合约地址');
					}
				}).catch((e : any) => {
					UniUtil.loadHide();
					UniUtil.toastError('查询失败');
				})
			},
			
			confirm() {
				if (!(this.formData.tokenAddress.length > 0)) {
					return UniUtil.toastError('请先输入合约地址');
				}
				if (!(this.formData.id && this.formData.tokenAddress)) {
					return UniUtil.toastError('找不到相关代币');
				}
				// console.log('进入判断');
				this.$http({
					url: "/app/accounttoken/save",
					method: 'POST',
					data: this.formData
				}).then((res : any) => {
					UniUtil.toastSuccess('添加代币成功')
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				})
			}
		},
		watch: {
			'formData.tokenAddress'(newVal, oldVal) {
				if (this.timeId) {
					clearTimeout(this.timeId)
				}
				if (newVal.length > 0) {
					this.timeId = setTimeout(() => {
						// console.log(newVal, 'newVal');
						this.loadTokenInfo()
					}, 800)
				}
			}
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
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		.paramsList {
			width: 100%;
			margin-top: 59rpx;

			.params {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 688rpx;
				min-height: 185rpx;
				background: #FFFFFF;
				border-radius: 25rpx;
				padding: 19rpx 36rpx 31rpx 36rpx;
				box-sizing: border-box;
				margin-bottom: 15rpx;

				.header {
					display: flex;
					justify-content: space-between;
					width: 100%;
					height: 28rpx;
					font-family: PingFang;
					font-weight: bold;
					font-size: 28rpx;
					color: #231815;
					line-height: 28rpx;

					.left {}

					.right {
						display: flex;
						justify-content: space-between;
						width: 78rpx;
						height: 28rpx;

						// background-color: skyblue;
						.icon {
							display: block;
							height: 28rpx;
						}
					}

				}

				.textareaBox {
					margin-top: 19rpx;
					width: 100%;
					height: 167rpx;
					background: #F7F7F7;
					border-radius: 25rpx;

					textarea {
						width: 100%;
						height: 167rpx;
						padding-top: 33rpx;
						padding-left: 16rpx;
						padding-right: 16rpx;
						box-sizing: border-box;
						font-size: 28rpx;
					}
				}

				.inputBox {
					margin-top: 19rpx;
					width: 100%;
					height: 93rpx;
					background: #F7F7F7;
					border-radius: 25rpx;

					input {
						width: 100%;
						height: 93rpx;
						padding-left: 16rpx;
						padding-right: 16rpx;
						box-sizing: border-box;
						font-size: 28rpx;
					}

				}
			}
		}

		.confirmButton {
			margin-top: 551rpx;
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
		font-size: 28rpx;
		color: #838383;
	}
</style>