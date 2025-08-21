<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='直接转账'></titleBar>
		<!-- 收款地址 -->
		<view class="receivingAddressBox">
			<view class="header">
				<view class="left">
					收款地址
				</view>
				<view class="right">
					<image src="@/static/newUI3/transaction/walletIcon.png" mode="heightFix" class="icon"
						@click="param.show = true;"></image>
					<image src="@/static/newUI3/transaction/scanIcon.png" mode="heightFix" class="icon" @click="scan">
					</image>
				</view>
			</view>
			<view class="inputBox">
				<input placeholder="输入、扫描或粘贴钱包地址" placeholder-class="textareaFont" v-model="param.toAddress" />
			</view>
		</view>
		<!-- 转账金额 -->
		<view class="transferAmount" v-if="param.tokenType != 'BRC1155' && param.tokenType != 'BRC721'">
			<view class="header">
				转账金额
			</view>
			<view class="main">
				<view class="inputBox">
					<input type="text" placeholder="请输入数量" placeholder-class="textareaFont"
						v-model.number="param.amount" @input="onFloatInput" />
				</view>
				<view class="allButton" @click="all">
					All
				</view>
			</view>
			<view class="footer">
				<view class="left">
					钱包余额
				</view>
				<view class="right">
					{{ show.amount }}
				</view>
			</view>
		</view>
		<!-- 编号 -->
		<view class="nftCodeBox" style="margin-top: 20rpx;" v-else>
			<view class="header">
				<view class="left">
					编号
				</view>
				<view class="right">

				</view>
			</view>
			<view class="inputBox">
				<input type="text" placeholder="请输入编号" v-model.number="param.amount" @input="onFloatInput" />
			</view>
		</view>
		<view class="receivingAddressBox box2">
			<view class="header">
				<view class="left">
					网络费(BIT)
				</view>
			</view>
			<view class="inputBox">
				<input placeholder="输入、扫描或粘贴钱包地址" placeholder-class="textareaFont" v-model="show.fee" disabled/>
			</view>
		</view>
		<view class="confirmButton" @click="transfer">
			确认
		</view>
		<!-- 钱包列表组件 -->
		<TransferPopup :show="param.show" @transferPopupshow="transferPopupshow"
			@chooseAccountValue="chooseAccountValue"></TransferPopup>
		<!-- 密码组件 -->
		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import TransferPopup from "@/components/transferPopup.vue";
	import PasswordPopup from "@/components/password/passwordPopup.vue";
	import { BitInstance } from '@/chain/bit/instance';
	import { UniUtil } from "@/data/util/uniUtil";
	import { CheckUtil } from '@/data/util/checkUtil';
	import { WalletData } from '@/data/wallet/walletData';
	import { BitAccount } from '@/chain/bit/account/account';
	import { abiToken20 } from '@/chain/abi/abiToken20';
	import { abiToken721 } from '@/chain/abi/abiToken721';
	import { abiToken1155 } from '@/chain/abi/abiToken1155';

	export default Vue.extend({
		components: { TransferPopup, PasswordPopup },
		data() {
			return {
				param: {
					show: false,
					toAddress: '',
					tokenName: '',
					tokenType: '',
					tokenAddress: 'BIT',
					tokenDecimal: 18,
					amount: '',
				},
				show: {
					amount: '',
					fee: 0.00267,
				},
				statusBarHeight: 0,
			}
		},
		async onShow() {
			await BitAccount.getAssets(WalletData.account.address, [], true, 1, 100).then((rs : any) => {
				const datas = rs.data;

				datas.map((data : any) => {
					if (data.tokenAddress === this.param.tokenAddress) {
						this.show.amount = data.balance;
					}
				});
			}).catch((e : any) => {
				UniUtil.toastError('加载失败，请刷新重试');
			});
		},
		async onLoad(query : any) {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			if (query.address != undefined) {
				this.param.toAddress = query.address;
			}
			if (query.tokenAddress != undefined) {
				this.param.tokenAddress = query.tokenAddress;
			}

			// 查询token类型
			const tokenInfo : any = await BitAccount.getTokenInfo(this.param.tokenAddress);
			this.param.tokenName = tokenInfo.token.name;
			this.param.tokenType = tokenInfo.token.tokenType;
			this.param.tokenDecimal = tokenInfo.token.decimal;
		},
		methods: {
			all() {
				if (this.param.tokenType == 'BRC20') {
					const amount = (Number(this.show.amount));
					this.param.amount = amount < 0 ? '' : amount.toString();
				} else {
					const amount = (Number(this.show.amount) - Number(0.005));
					this.param.amount = amount < 0 ? '' : amount.toString();
				}
			},
			async scan() {
				await UniUtil.scanCollectCode().then((rs : any) => {
					this.param.toAddress = rs;
				});
			},
			onFloatInput(event : any) {
				// 只允许输入数字和小数点
				event.target.value = event.target.value.replace(/[^0-9.]/g, '');
				// 保证小数点只有一个
				const decimalPointIndex = event.target.value.indexOf('.');
				if (decimalPointIndex !== -1 && event.target.value.length - 1 !== decimalPointIndex) {
					event.target.value = event.target.value.substr(0, decimalPointIndex) + '.' + event.target.value.substr(decimalPointIndex).replace(/\./g, '');
				}
				// 更新数据绑定的值
				this.param.amount = event.target.value;
			},
			transfer() {
				UniUtil.loadShow();
				const { toAddress, amount } = this.param;
				// console.log((BigInt(amount)*BigInt(10**this.param.tokenDecimal)).toString())
				// check
				if (CheckUtil.isStrEmptyAndMessage(toAddress, "请输入地址")) return;
				if (!CheckUtil.checkAddressAndMessage(toAddress)) return;
				if (toAddress === WalletData.account.address) {
					UniUtil.toastError("无法转账至同一账户");
					return;
				}
				if (CheckUtil.isStrEmptyAndMessage(amount, "请输入数量") && this.param.tokenType != 'BRC1155') return;
				if (CheckUtil.isStrEmptyAndMessage(amount, "请输入编号") && this.param.tokenType == 'BRC1155') return;

				if (this.param.tokenAddress == 'BIT') {

					const amountToBit = BitInstance.bitweb.toBit(Number(amount));

					BitInstance.bitweb.trx.sendTrx(toAddress, amountToBit.toString()).then((data : any) => {
						console.log(data);
						if (data.result) {
							UniUtil.toastSuccess('转账交易发送成功', () => {
								setTimeout(() => {
									uni.redirectTo({
										url: './transferWay'
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('转账交易发送失败，请重试');
						}
					}).catch((e : any) => {
						console.log(e);
						UniUtil.toastError('转账交易发送失败，请重试');
					}).finally(() => {
						UniUtil.loadHide();
					});
				}
				// token10 transfer
				else if (this.param.tokenType == 'BRC10') {
					const amountToDecimal = BitInstance.bitweb.toBigNumber(amount).times(10 ** this.param.tokenDecimal).toString(10);
					console.log(toAddress, amountToDecimal.toString(), this.param.tokenAddress);
					BitInstance.bitweb.trx.sendToken(toAddress, amountToDecimal.toString(), this.param.tokenAddress).then((data : any) => {
						console.log(data);
						if (data.result) {
							UniUtil.toastSuccess('转账交易发送成功', () => {
								setTimeout(() => {
									uni.redirectTo({
										url: './transferWay'
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('转账交易发送失败，请重试');
						}
					}).catch((e : any) => {
						console.log(e);
						UniUtil.toastError('转账交易发送失败，请重试');
					}).finally(() => {
						UniUtil.loadHide();
					});
				}
				// token20 transfer
				else if (this.param.tokenType == 'BRC20') {
					const instance : any = BitInstance.bitweb.contract(abiToken20, this.param.tokenAddress);
					const amountToDecimal = BitInstance.bitweb.toBigNumber(amount).times(10 ** this.param.tokenDecimal).toString(10);
					instance.transfer(toAddress, amountToDecimal).send({
						callValue: 0,
						tokenValue: "0",
					}).then((data : any) => {
						if (data) {
							UniUtil.toastSuccess('转账交易发送成功', () => {
								setTimeout(() => {
									uni.redirectTo({
										url: '../tokenDetail?address=' + this.param.tokenAddress + '&name=' + this.param.tokenName
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('转账交易发送失败，请重试');
						}
					}).catch((e : any) => {
						console.log(e);
						UniUtil.toastError('转账交易发送失败，请重试');
					}).finally(() => {
						UniUtil.loadHide();
					});
				}
				// token721 transfer
				else if (this.param.tokenType == 'BRC721') {
					const instance : any = BitInstance.bitweb.contract(abiToken721, this.param.tokenAddress);
					console.log(WalletData.account.address, toAddress, amount.toString(), "");
					instance.safeTransferFrom(
						WalletData.account.address, toAddress, amount.toString()
					).send({
						callValue: 0,
						tokenValue: "0",
					}).then((data : any) => {
						if (data) {
							UniUtil.toastSuccess('转账交易发送成功', () => {
								setTimeout(() => {
									uni.redirectTo({
										url: '../tokenDetail?address=' + this.param.tokenAddress + '&name=' + this.param.tokenName
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('转账交易发送失败，请重试');
						}
					}).catch((e : any) => {
						console.log(e);
						UniUtil.toastError('转账交易发送失败，请重试');
					}).finally(() => {
						UniUtil.loadHide();
					});
				}
				// token1155 transfer
				else if (this.param.tokenType == 'BRC1155') {
					const instance : any = BitInstance.bitweb.contract(abiToken1155, this.param.tokenAddress);
					console.log(WalletData.account.address, toAddress, amount.toString(), "");
					instance.safeTransferFrom(
						WalletData.account.address, toAddress, amount.toString(), 1, "0x",
					).send({
						callValue: 0,
						tokenValue: "0",
					}).then((data : any) => {
						if (data) {
							UniUtil.toastSuccess('转账交易发送成功', () => {
								setTimeout(() => {
									uni.redirectTo({
										url: '../tokenDetail?address=' + this.param.tokenAddress + '&name=' + this.param.tokenName
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('转账交易发送失败，请重试');
						}
					}).catch((e : any) => {
						console.log(e);
						UniUtil.toastError('转账交易发送失败，请重试');
					}).finally(() => {
						UniUtil.loadHide();
					});
				}
			},
			transferPopupshow(show : boolean) {
				this.param.show = show
			},
			chooseAccountValue(address : string) {
				this.param.toAddress = address;
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
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		.receivingAddressBox,
		.nftCodeBox {
			margin-top: 68rpx;
			width: 688rpx;
			height: 181rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			padding: 19rpx 41rpx 28rpx 36rpx;
			box-sizing: border-box;

			.header {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 28rpx;

				.left {
					height: 28rpx;
					font-family: PingFang;
					font-weight: bold;
					font-size: 28rpx;
					color: #1D1F20;
					line-height: 28rpx;
				}

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

			.inputBox {
				margin-top: 19rpx;
				width: 617rpx;
				height: 93rpx;
				background: #F7F7F7;
				border-radius: 25rpx;

				input {
					width: 617rpx;
					height: 93rpx;
					font-size: 28rpx;
					padding-left: 16rpx;
					padding-right: 16rpx;
					box-sizing: border-box;
				}
			}
		}
			
		.box2 {
			margin-top: 18rpx !important;
		}

		.transferAmount {
			margin-top: 18rpx;
			width: 688rpx;
			height: 218rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			padding: 19rpx 36rpx 23rpx 36rpx;
			box-sizing: border-box;

			.header {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 28rpx;

				font-family: PingFang;
				font-weight: bold;
				font-size: 28rpx;
				color: #1D1F20;
				line-height: 28rpx;
			}

			.main {
				display: flex;
				justify-content: space-between;
				margin-top: 19rpx;
				width: 100%;
				height: 93rpx;

				// ps
				// background-color: skyblue;
				.inputBox {
					width: 493rpx;
					height: 93rpx;
					background: #F7F7F7;
					border-radius: 25rpx;

					input {
						width: 493rpx;
						height: 93rpx;
						font-size: 28rpx;
						padding-left: 16rpx;
						padding-right: 16rpx;
						box-sizing: border-box;
					}

				}

				.allButton {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 93rpx;
					height: 93rpx;
					background: #9E2922;
					border-radius: 25rpx;

					font-family: PingFang;
					font-size: 28rpx;
					color: #FFFFFF;
				}
			}

			.footer {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: 28rpx;
				margin-top: 17rpx;
				padding: 0rpx 76rpx 0rpx 21rpx;
				box-sizing: border-box;

				.left {
					font-family: PingFang;
					font-weight: 500;
					font-size: 28rpx;
					line-height: 28rpx;
					color: #838383;
				}

				.right {
					font-family: PingFang;
					font-weight: bold;
					font-size: 28rpx;
					color: #838383;
					line-height: 28rpx;
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
		line-height: 28rpx;


	}
</style>