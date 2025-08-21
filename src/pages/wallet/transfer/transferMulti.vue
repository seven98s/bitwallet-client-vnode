<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='多签转账'></titleBar>
		<view class="paramsList">
			<view class="params">
				<view class="header">
					受控账户
				</view>
				<view class="inputBox">
					<picker mode="selector" :range="param.fromOptions" @change="onFromChange">
						<view class="addressBox">
							<image src="@/static/newUI3/transaction/bit.png" mode="aspectFill" class="addressIcon" v-if="!param.fromSelectValue">
							</image>
							<view class="address">
								{{ param.fromSelectValue == '' ? '请选择受控账户' : param.fromSelectValue }}
							</view>
							<image src="@/static/newUI3/transaction/rightTriangle.png" mode="aspectFill"
								class="rightTriangle" v-if="!param.fromSelectValue"></image>
						</view>
					</picker>
				</view>
			</view>
			<view class="params" key="toAddress">
				<view class="header">
					收款地址
				</view>
				<view class="inputBox2">
					<input type="text" placeholder="请输入、扫码或粘贴地址" v-model="param.toAddress"
						placeholder-class="textareaFont" />
					<image src="@/static/newUI3/transaction/scanIcon.png" mode="heightFix" class="icon" @click="scan">
					</image>
				</view>
			</view>
			<view class="params">
				<view class="header">
					转账代币
				</view>
				<view class="inputBox">
					<picker mode="selector" :range="param.tokenOptions" range-key="tokenName" @change="onTokenChange">
						<view class="addressBox">

							<view class="address">
								{{ param.tokenSelectValue == '' ? '请选择要转账代币' : param.tokenSelectValue }}
							</view>
							<image src="@/static/newUI3/transaction/rightTriangle.png" mode="aspectFill"
								class="rightTriangle"></image>
						</view>
					</picker>

				</view>
			</view>
			<view class="params"
				v-if="param.tokenSelectObj.tokenType != 'BRC721'&&param.tokenSelectObj.tokenType != 'BRC1155'" key="amount">
				<view class="header">
					<view class="left">
						转账金额
					</view>
					<view class="right" v-if="param.tokenSelectValue">
						钱包余额:<text class="walletBlance"> {{ show.amount }}</text> {{param.tokenSelectValue}}
					</view>
				</view>
				<view class="inputBox2">
					<input type="text" placeholder="请输入数量"  placeholder-class="textareaFont"
						v-model.number="param.amount" @input="onFloatInput" />
					</image>
				</view>
			</view>
			<view class="params"
				v-if="param.tokenSelectObj.tokenType == 'BRC1155'||param.tokenSelectObj.tokenType == 'BRC721'">
				<view class="header">
					编号
				</view>
				<view class="inputBox">
					<input type="text" placeholder="请输入编号" v-model.number="param.nftCode" @input="onFloatInput2"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="params"
				v-if="param.tokenSelectObj.tokenType == 'BRC1155'">
				<view class="header">
					数量
				</view>
				<view class="inputBox">
					<input type="text" placeholder="请输入数量" v-model.number="param.amount" @input="onFloatInput"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="params">
				<view class="header">
					网络费(BIT)
				</view>
				<view class="inputBox">
					<input type="text" :placeholder="show.fee.toString()" disabled placeholder-class="textareaFont" />
				</view>
			</view>
		</view>
		<view class="confirmButton" @click="transfer">
			确认
		</view>
		<view class="transactionRecord" @click="gotoPage('./multiRecord')">
			多签交易记录
		</view>
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
	export default Vue.extend({
		components: { TransferPopup, PasswordPopup },
		data() {
			return {
				param: {
					show: false,
					toAddress: '',
					tokenAddress: 'BIT',
					amount: '',
					nftCode: '',
					fromOptions: [],
					fromSelectValue: '',

					tokenOptions: new Array<any>(),
					tokenSelectValue: '',
					tokenSelectObj: {
						tokenType: '',
						tokenName: '',
						tokenAddress: '',
						balance: '',
						decimal: 0,
					},
				},
				show: {
					amount: '',
					fee: 0.00267,
				},
				statusBarHeight: 0,
			}
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

			await this.loadFromOption();
		},
		methods: {
			async onFromChange(e : any) {
				this.param.tokenOptions = new Array<any>();
				this.param.fromSelectValue = this.param.fromOptions[e.detail.value];
				await BitAccount.getAssets(this.param.fromSelectValue, ["BRC10", "BRC20", "BRC721", "BRC1155"], true, 1, 100).then((rs : any) => {
					const datas = rs.data;
					datas.map((data : any) => {
						this.param.tokenOptions.push({ ...data });
					});
				}).catch((e : any) => {
					UniUtil.toastError('加载失败，请刷新重试');
				});
			},
			async onTokenChange(e : any) {
				this.param.tokenSelectObj = this.param.tokenOptions[e.detail.value];
				console.log(this.param.tokenSelectObj, 'param.tokenSelectObj');
				if (this.param.tokenSelectObj != undefined) {
					this.param.tokenSelectValue = this.param.tokenSelectObj.tokenName;
					this.show.amount = this.param.tokenSelectObj.balance;
				}
			},
			all() {
				if (this.param.tokenSelectObj.tokenType == 'BRC20') {
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
			onFloatInput2(event : any) {
				// 只允许输入数字和小数点
				event.target.value = event.target.value.replace(/[^0-9.]/g, '');
				// 保证小数点只有一个
				const decimalPointIndex = event.target.value.indexOf('.');
				if (decimalPointIndex !== -1 && event.target.value.length - 1 !== decimalPointIndex) {
					event.target.value = event.target.value.substr(0, decimalPointIndex) + '.' + event.target.value.substr(decimalPointIndex).replace(/\./g, '');
				}
				// 更新数据绑定的值
				this.param.nftCode = event.target.value;
			},
			async loadFromOption() {
				const multiOptionData : any = await BitAccount.getMultiPage(WalletData.account.address, 1, 100);
				this.param.fromOptions = multiOptionData.data;
			},
			async transfer() {
				UniUtil.loadShow();
				let { toAddress, amount, fromSelectValue, tokenSelectValue, nftCode } = this.param;
				// check
				if (CheckUtil.isStrEmptyAndMessage(fromSelectValue, "请选择受控地址")) return;
				if (CheckUtil.isStrEmptyAndMessage(toAddress, "请输入地址")) return;
				if (!CheckUtil.checkAddressAndMessage(toAddress)) return;
				// if(toAddress === WalletData.account.address) {
				// 	UniUtil.toastError("无法转账至同一账户");
				// 	return;
				// }
				if (CheckUtil.isStrEmptyAndMessage(tokenSelectValue, "请选择转账代币")) return;

				if (this.param.tokenSelectObj.tokenType != 'BRC1155' && this.param.tokenSelectObj.tokenType != 'BRC721') {
					if (CheckUtil.isStrEmptyAndMessage(amount, "请输入数量")) {
						return
					}

				}
				if (this.param.tokenSelectObj.tokenType == 'BRC1155' || this.param.tokenSelectObj.tokenType == 'BRC721') {
					if (CheckUtil.isStrEmptyAndMessage(nftCode, "请输入编号")) {
						return
					}
				}


				let originTx;
				if (this.param.tokenSelectObj.tokenType == 'BIT') {
					const amountToBit = BitInstance.bitweb.toBit(Number(amount));
					originTx = await BitInstance.bitweb.transactionBuilder.sendTrx(toAddress, amountToBit.toString(), fromSelectValue)
				} else if (this.param.tokenSelectObj.tokenType == 'BRC20') {
					// BRC20
					const amountToDecimal = BitInstance.bitweb.toBigNumber(amount).times(10 ** this.param.tokenSelectObj.decimal).toString(10);
					var parameter = [
						{ type: 'address', value: toAddress },
						{ type: 'uint256', value: amountToDecimal },
					];
					var options : any = {
						tokenValue: "0",
					};
					const transaction = await BitInstance.bitweb.transactionBuilder.triggerSmartContract(
						this.param.tokenSelectObj.tokenAddress,
						"transfer(address,uint256)",
						options,
						parameter,
						this.param.fromSelectValue
					);
					originTx = transaction.transaction;
				}
				// brc10
				else if (this.param.tokenSelectObj.tokenType == 'BRC10') {
					// console.log('进入brc10转账判断');
					const amountToDecimal = BitInstance.bitweb.toBigNumber(amount).times(10 ** this.param.tokenSelectObj.decimal).toString(10);
					const transaction : any = await BitInstance.bitweb.transactionBuilder.sendToken(toAddress, amountToDecimal, this.param.tokenSelectObj.tokenAddress, this.param.fromSelectValue)
					console.log(toAddress, amount, this.param.tokenSelectObj.tokenAddress);
					originTx = transaction;
				}
				// token721 transfer
				else if (this.param.tokenSelectObj.tokenType == 'BRC721') {
					// console.log('进入brc721转账判断');
					amount = nftCode.toString()
					let parameter = [
						{ type: 'address', value: this.param.fromSelectValue },
						{ type: 'address', value: toAddress },
						{ type: 'uint256', value: nftCode }
					];
					let options : any = {
						tokenValue: "0",
					};
					const transaction = await BitInstance.bitweb.transactionBuilder.triggerSmartContract(
						this.param.tokenSelectObj.tokenAddress,
						"safeTransferFrom(address,address,uint256)",
						options,
						parameter,
						this.param.fromSelectValue
					);
					originTx = transaction.transaction;
				}
				// token1155 transfer
				else if (this.param.tokenSelectObj.tokenType == 'BRC1155') {
					// console.log('进入brc1155转账判断');
					let parameter = [
						{ type: 'address', value: this.param.fromSelectValue },
						{ type: 'address', value: toAddress },
						{ type: 'uint256', value: this.param.nftCode },
						{ type: 'uint256', value: amount },
						{ type: 'bytes', value: '0x' }
					];
					var options : any = {
						tokenValue: "0",
					};
					const transaction = await BitInstance.bitweb.transactionBuilder.triggerSmartContract(
						this.param.tokenSelectObj.tokenAddress,
						"safeTransferFrom(address,address,uint256,uint256,bytes)",
						options,
						parameter,
						this.param.fromSelectValue
					);
					originTx = transaction.transaction;
					amount = nftCode.toString()
				}

				// 30分钟过期
				originTx.raw_data.expiration = originTx.raw_data.timestamp + 30 * 60 * 1000;
				originTx = await BitInstance.bitweb.trx.multiSign(originTx);
				console.log(originTx, 'originTx');

				await BitAccount.upsertMulti(
					"empty", originTx.txID, fromSelectValue,
					WalletData.account.address, JSON.stringify(originTx),
					this.param.tokenSelectObj.tokenName,
					this.param.tokenSelectObj.tokenAddress,
					this.param.tokenSelectObj.tokenType,
					fromSelectValue, toAddress, amount
				).then((rs : any) => {

					// console.log(rs);
					UniUtil.toastSuccess('多签交易生成成功', () => {
						setTimeout(() => {
							uni.redirectTo({
								url: './multiRecord'
							});
						}, 1000);
					});
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('多签交易生成失败，请重试');
				})
			},
			transferPopupshow(show : boolean) {
				this.param.show = show
			},
			chooseAccountValue(address : string) {
				this.param.toAddress = address;
			},
			gotoPage(url : string) {
				uni.navigateTo({
					url
				})
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
		padding: 0rpx 31rpx 20rpx 31rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		.paramsList {
			width: 100%;
			margin-top: 59rpx;

			.params {
				width: 688rpx;
				height: 181rpx;
				background: #FFFFFF;
				border-radius: 25rpx;
				padding: 19rpx 36rpx 28rpx 36rpx;
				box-sizing: border-box;
				margin-bottom: 17rpx;

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
						font-family: PingFang;
						font-weight: 500;
						font-size: 28rpx;
						color: #838383;
						line-height: 28rpx;

						.walletBlance {
							color: #231815;
							margin-left: 10rpx;
							margin-right: 10rpx;
						}
					}
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
						font-size: 28rpx;
						line-height: 28rpx;
					}


				}

				.inputBox2 {
					display: flex;
					align-items: center;
					margin-top: 19rpx;
					width: 100%;
					height: 93rpx;
					background: #EBEBEB;
					border-radius: 25rpx;
					padding-right: 40rpx;
					box-sizing: border-box;

					input {
						// width: 100%;
						flex: 1;
						height: 93rpx;
						padding-left: 42rpx;
						box-sizing: border-box;
						font-size: 28rpx;
						line-height: 28rpx;
					}

					.icon {
						display: block;
						width: 23rpx;
						height: 28rpx;
						margin-left: 10rpx;
					}

				}



			}

			.addressBox {
				display: flex;
				align-items: center;
				width: 100%;
				height: 93rpx;
				padding: 16rpx 40rpx 16rpx 40rpx;
				box-sizing: border-box;

				.addressIcon {
					display: block;
					width: 60rpx;
					height: 60rpx;
					margin-right: 14rpx;
				}

				.address {
					flex: 1;
					height: 28rpx;
					font-family: STZhongsong;
					font-weight: 400;
					font-size: 28rpx;
					line-height: 28rpx;
					color: #231815;
				}

				.rightTriangle {
					display: block;
					width: 12rpx;
					height: 28rpx;
				}
			}
		}

		.transactionRecord {
			margin-top: 28rpx;
			font-family: PingFang;
			font-weight: 500;
			font-size: 28rpx;
			color: #838383;
			line-height: 28rpx;
			text-decoration-line: underline;
		}
	}

	.textareaFont {
		font-family: PingFang;
		font-weight: 500;
		font-size: 28rpx;
		line-height: 28rpx;
		color: #838383;
	}

	.confirmButton {
		margin-top: 100rpx;
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
</style>