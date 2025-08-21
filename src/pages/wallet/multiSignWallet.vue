<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='创建多签钱包'></titleBar>
		<view class="paramsList">
			<view class="paramsItem">
				<view class="paramsTitle">
					阈值
				</view>
				<view class="paramsInputBox">
					<input type="text" placeholder="请输入阈值(不低于该值时交易执行)" v-model="param.multiSignWallet.threshold"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="paramsItem" v-for="(item,index) in manageWalletList" :key="item.id">
				<view class="paramsTitle">
					<view class="left">
						管理钱包{{index+1}}
					</view>
					<view class="right" @click="deleteManageWallet(item.id)" v-if="index>=1">
						删除
					</view>

				</view>
				<view class="paramsTextarea">
					<textarea type="text" placeholder="请输入管理钱包地址" placeholder-class="textareaFont"
						v-model="manageWalletList[index].address" />
				</view>
			</view>

		</view>
		<!-- <view class="tipWordsBox">
			<textarea class="textarea" type="text" placeholder="请输入多签地址(一行一个地址)" v-model="param.multiSignWallet.address"
				placeholder-class="textareaFont" />
		</view> -->
		<view class="addBox" @click="addManageWallet">
			<image src="@/static/newUI3/transaction/add.png" mode="aspectFill" class="addIcon"></image>
			<view class="addText">
				添加管理钱包
			</view>
		</view>

		<TermAndPrivacy :termPrivacyAgree="termPrivacyStatus" @termPrivacyAgree="handleTermPrivacyAgree">
		</TermAndPrivacy>
		<view class="confirmButton" @click="createMultiSignWallet">
			确认
		</view>
		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import TermAndPrivacy from "../../components/termAndPrivacy.vue";
	import PasswordPopup from "@/components/password/passwordPopup.vue";
	import { ACCOUNT_TYPE, CHAIN_TYPE, STORAGE_TYPE } from '@/data/constants';
	import { UniUtil } from "@/data/util/uniUtil";
	import { CheckUtil } from '@/data/util/checkUtil';
	import { WalletData } from '@/data/wallet/walletData';
	import { BitInstance } from '../../chain/bit/instance';
	import { BitAccount } from '@/chain/bit/account/account';
	import { Permission } from 'bitweb-ts/lib/esm/types/Contract';

	export default Vue.extend({
		components: { TermAndPrivacy, PasswordPopup },
		data() {
			return {
				termPrivacyStatus: false,
				param: {
					multiSignWallet: {
						address: '',
						threshold: '',
					},
				},
				statusBarHeight: 0,
				manageWalletList: [
					{
						id: Date.now(),
						address: ''
					},
				]
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		methods: {
			handleTermPrivacyAgree(value : boolean) {
				this.termPrivacyStatus = value;
			},
			async createMultiSignWallet() {
				UniUtil.loadShow();
				const { address, threshold } = this.param.multiSignWallet;

				// check
				const hasEmptyAddress = this.manageWalletList.some((item, index) => {
					if (item.address.length === 0) {
						console.log('进入判断');
						uni.showToast({
							title: `管理钱包${index + 1}的地址为空`,
							icon: 'none'
						});
						return true;
					}
					return false;
				});
				if (hasEmptyAddress) {
					return
				}

				if (!(threshold.length > 0)) {
					uni.showToast({
						title: '请输入阈值',
						icon: 'none'
					});
					return;
				}

				if (!CheckUtil.isStrNumberAndMessage(threshold, "请输入正确阈值")) return;
				const addressArr = this.manageWalletList.map(item=>item.address);
				let addressFlag = false;
				const activeAddress = new Array<any>();
				addressArr.map((address) => {
					if (!CheckUtil.checkAddressAndMessage(address)) {
						addressFlag = true;
					}
					activeAddress.push({ address: BitInstance.bitweb.address.toHex(address), weight: 1 });
				});
				if (addressFlag) {
					UniUtil.toastError('请输入正确地址');
					return;
				}

				if (!this.termPrivacyStatus) {
					UniUtil.toastError('请查看并同意条款');
					return;
				}

				const owner = BitInstance.bitweb.address.toHex(WalletData.account.address);

				let ownerPermission : Permission = { type: 0, permission_name: 'owner', threshold: parseInt(threshold), keys: activeAddress };

				let activePermission : Permission = { type: 2, permission_name: 'active0', threshold: parseInt(threshold), keys: activeAddress };
				activePermission.operations = '7fff1fc0037e0000000000000000000000000000000000000000000000000000';

				// ownerPermission.keys.push({ address: owner, weight: 1 });
				// ownerPermission.keys.push({ address: BitInstance.bitweb.address.toHex('BGfPEpX3R8xgzF9A4RMQMSTDqPEMUgDHPZ'), weight: 1 });
				// activePermission.keys.push({ address: owner, weight: 1 });
				// activePermission.keys.push({ address: BitInstance.bitweb.address.toHex('BGfPEpX3R8xgzF9A4RMQMSTDqPEMUgDHPZ'), weight: 1 });

				await BitInstance.bitweb.transactionBuilder.updateAccountPermissions(
					owner,
					ownerPermission,
					undefined,
					[activePermission],
				).then(async (rs : any) => {
					console.log('rs: ')
					console.log(rs)
					const sign = await BitInstance.bitweb.trx.sign(rs);
					console.log('sign: ')
					console.log(sign)
					await BitInstance.bitweb.trx.sendRawTransaction(sign).then((multiSignRs : any) => {
						console.log(multiSignRs)
						if (multiSignRs.result) {
							UniUtil.toastSuccess('创建多签钱包交易发送成功', () => {
								setTimeout(() => {
									uni.reLaunch({
										url: '../home/index'
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('创建多签钱包交易发送失败，请重试');
						}
					}).catch((e : any) => {
						// console.log(e);
						UniUtil.toastError('创建多签钱包交易发送失败');
					});
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('创建多签钱包交易发送失败');
				}).finally(() => {
					UniUtil.loadHide();
				});
			},
			addManageWallet() {
				let tempObj = {
					id: Date.now(),
					address: ''
				}
				this.manageWalletList.push(tempObj)
			},
			deleteManageWallet(id : number) {
				const index = this.manageWalletList.findIndex(item => item.id === id)
				if (index) {
					this.manageWalletList.splice(index, 1)
				} else {
					UniUtil.toastError('删除失败');
				}
			}
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
		padding: 0rpx 31rpx 20rpx 31rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		// .tipWordsBox {
		// 	margin-top: 44rpx;
		// 	width: 688rpx;
		// 	height: 308rpx;
		// 	background: #FFFFFF;
		// 	border-radius: 25rpx;
		// 	padding: 39rpx 32rpx;
		// 	box-sizing: border-box;

		// 	textarea {
		// 		width: 100%;
		// 		height: 100%;
		// 		font-size: 22rpx;

		// 	}
		// }

		.addBox {
			display: flex;
			align-items: center;
			width: 100%;
			height: 74rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			margin-top: 20rpx;
			padding: 17rpx 27rpx;
			box-sizing: border-box;

			.addIcon {
				display: block;
				width: 39rpx;
				height: 39rpx;
				margin-right: 14rpx;
			}

			.addText {
				font-family: PingFang;
				font-weight: bold;
				font-size: 28rpx;
				color: #9E2922;
			}
		}

		.paramsList {
			width: 100%;
			margin-top: 59rpx;
			// background-color: pink;

			.paramsItem {
				width: 100%;
				min-height: 86rpx;
				margin-bottom: 30rpx;
				// background-color: skyblue;

				.paramsTitle {
					display: flex;
					justify-content: space-between;
					width: 100%;
					height: 28rpx;
					line-height: 28rpx;
					font-family: PingFang;
					font-weight: 800;
					font-size: 28rpx;
					color: #000000;
					margin-bottom: 20rpx;

					.left {
						font-family: PingFang;
						font-weight: 800;
						font-size: 28rpx;
						line-height: 28rpx;
						color: #000000;
					}

					.right {
						font-family: PingFang;
						font-size: 28rpx;
						line-height: 28rpx;
						color: #000000;
						text-decoration: underline;
					}
				}

				.paramsInputBox {
					width: 100%;
					height: 51rpx;
					// background-color: greenyellow;
					border-bottom: 1rpx dashed #A2A4B0;

					input {
						width: 100%;
						height: 50rpx;
						font-size: 28rpx;
					}
				}

				.paramsTextarea {
					width: 100%;
					height: 200rpx;
					background-color: #fff;
					border-radius: 25rpx;
					padding: 20rpx 30rpx;
					box-sizing: border-box;

					textarea {
						width: 100%;
						height: 200rpx;
						font-size: 28rpx;
					}

					// background-color: greenyellow;
				}
			}
		}

		.confirmButton {
			margin-top: 406rpx;
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
		color: #A2A4B0;
	}
</style>