<template>
	<view class="page">
		<!-- <cover-view class="cover" style="z-index: 2147483648 !important;">
		      <text style="color: white;">这是覆盖层内的文本</text>
		</cover-view> -->
		<web-view ref="webview" :src="url" @message="handleMessage"></web-view>
		
		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import { BitInstance } from '@/chain/bit/instance';
import { WalletData } from '@/data/wallet/walletData';
import PasswordPopup from "@/components/password/passwordPopup.vue";
import { CheckUtil } from '@/data/util/checkUtil';
import { UniUtil } from "@/data/util/uniUtil";
import {chainId} from  "@/config";
export default Vue.extend({
	components: { PasswordPopup },
	data() {
		return {
			webViewObj: {},
			urlParam: '',
			url: '',
		}
	},
	onLoad(query: any) {
		this.urlParam = query.url;
	},
	onReady() {
		// #ifdef APP-PLUS
			setTimeout(async () => {
				await this.init()
				this.url = this.urlParam+"?t="+new Date().getTime();
				console.log(this.url);
			}, 60)
		// #endif
	},
	methods: {
		async handleMessage(e: any) {
			// 返回签名数据
			if(e.detail.data[0].type == 'SIGN') {
				uni.navigateTo({
					url: './password',
				});
				
				const privateKey = await new Promise<string>(async (resolve,reject) => {
					Vue.prototype.$PasswordPopup({
						show: true,
						title: '',
						password: '',
						confirm: async (data: string) => {
							// const data = "11111111"
							// check
							if(CheckUtil.isStrEmptyAndMessage(data, "请输入密码")) return;
							
							await WalletData.privateKey(data).then((privateKey) => {
								// console.log(privateKey)
								// 设置私钥
								// BitInstance.bitweb.setPrivateKey(privateKey);//.substring(2, privateKey.length));
								resolve(privateKey);
							}).catch((e: any) => {
								console.log(e)
								// reject(e);
								UniUtil.toastError('请输入正确密码');
								// Vue.prototype.$store.commit('changePasswordPopConfig', { show: false, title: '' });
							});
						}
					});
				});
				
				const rs = await BitInstance.bitweb.trxEx.dappSign(e.detail.data[0].transaction, privateKey, true, false);
				console.log(rs);
				
				uni.navigateBack();
				
				(this.webViewObj as any).evalJS(`
					window.signStr = ${JSON.stringify(rs)};
					document.dispatchEvent(new CustomEvent('getAppSignMsg',{detail: {code:'success'}}));
				`);
			}
		},
		async init() {
			return new Promise(async (resolve,reject) => {
				const bitweb = BitInstance.bitweb;
				var currentWebview = (this as any).$scope.$getAppWebview()
				// console.log(currentWebview)
				const self = this;
				let win: any = currentWebview.children()[0]
				self.webViewObj = win;
			
				const accountBase58 = WalletData.account.address;
				const accountHex = bitweb.address.toHex(WalletData.account.address);
				
				win.show();
				
				// window.chainId = '20240618';
				// window.chainId = '20241001';
				win.evalJS(`
					window.chainId = ${chainId};
					window.bitwebTemp.defaultAddress.base58='${accountBase58.toString()}';
					window.bitwebTemp.defaultAddress.hex='${accountHex.toString()}';
					
					window.bitwebTemp.trx.sign = function(transaction, privateKey, useBitHeader, multisig) {
						return new Promise(function(resolve, reject) {
							console.log('aaaaaaaaaaaaaaaaa')
							uni.postMessage({
								data: {
									type: 'SIGN',
									transaction: transaction,
									privateKey: privateKey,
									useBitHeader: useBitHeader,
									multisig: multisig
								}
							})
							console.log('bbbbbbbbbbbbbbbbbbbb')
							
							document.addEventListener("getAppSignMsg", (e) => {
								resolve(window.signStr)
							}, { once: true })
						});
					}
					
					window.chain = 'BIT';
				`);
				
				resolve(true);
			});
		},
		// async init1() {
		// 	const bitweb = BitInstance.bitweb;
			
		// 	let win: any = "";//plus.webview.currentWebview();//plus.webview.create('http://47.236.254.203:6008');
		// 	var currentWebview = (this as any).$scope.$getAppWebview() //获取当前页面的webview对象
		// 	// console.log(currentWebview)
		// 	const self = this;
		// 	// setTimeout(function() {
		// 		win = currentWebview.children()[0]
		// 		// console.log('111111111')
		// 		// console.log(win)
		// 		self.webViewObj = win;
			
		// 		const accountBase58 = WalletData.account.address;
		// 		const accountHex = bitweb.address.toHex(WalletData.account.address);
				
		// 		win.addEventListener('titleUpdate', async (e: any) => {
		// 			console.log(e.title)
		// 			if(e.title === 'sign') {
		// 				// uni.navigateTo({
		// 				//   url: '../wallet/transfer/transfer',
		// 				// });
						
		// 				try {
							
		// 					// uni.showModal({
		// 					//         title: '提示',
		// 					//         content: '这是一个原生弹框',
		// 					//         success: function (res) {
		// 					//             if (res.confirm) {
		// 					//                 console.log('用户点击确定');
		// 					//             } else if (res.cancel) {
		// 					//                 console.log('用户点击取消');
		// 					//             }
		// 					//         }
		// 					//     });
		// 					let privateKey = await new Promise<string>(async (resolve,reject) => {
		// 						// Vue.prototype.$PasswordPopup({
		// 						// 	show: true,
		// 						// 	title: '',
		// 						// 	password: '',
		// 						// 	confirm: async (data: string) => {
		// 							const data = "11111111"
		// 								// check
		// 								if(CheckUtil.isStrEmptyAndMessage(data, "请输入密码")) return;
										
		// 								await WalletData.privateKey(data).then((privateKey) => {
		// 									// console.log(privateKey)
		// 									// 设置私钥
		// 									// BitInstance.bitweb.setPrivateKey(privateKey);//.substring(2, privateKey.length));
		// 									resolve(privateKey);
		// 								}).catch((e: any) => {
		// 									console.log(e)
		// 									// reject(e);
		// 									uni.showToast({
		// 										title: '请输入正确密码',
		// 										icon: 'error',
		// 										duration: 2000,
		// 										style: {
		// 											'z-index': 9999999
		// 										},
		// 									});
		// 									Vue.prototype.$store.commit('changePasswordPopConfig', { show: false, title: '' });
		// 								});
		// 							// }
		// 						// });
		// 					});
							
		// 					console.log(privateKey)
		// 					// uni.navigateBack()
		// 					// console.log(privateKey)
		// 					// privateKey = '111'
		// 					win.evalJS(
		// 						"document.dispatchEvent(new CustomEvent('getAppMsg',{detail: {code:"+privateKey+"}}));"
		// 					);
		// 				} catch(e: any) {
		// 					console.log(e);
		// 				}
		// 			}
		// 		}, false);
				
		// 		win.evalJS(`
		// 			console.log('111111111111111111111');
		// 			window.chain = 'BIT';
		// 			console.log(window.chain);
		// 			console.log(window.bitweb.defaultAddress);
		// 			console.log('222222222222222222222');
		// 			console.log(window.bitweb.defaultAddress.base58);
		// 			console.log('333333333333333333333');
		// 			window.bitweb.defaultAddress.base58='${accountBase58.toString()}';
		// 			console.log('444444444444444444444');
		// 			window.bitweb.defaultAddress.hex='${accountHex.toString()}';
		// 			console.log('555555555555555555555');
					
		// 			window.bitweb.trx.sign = function(transaction, privateKey, useBitHeader, multisig) {
		// 				return new Promise(function(resolve, reject) {
							
		// 					uni.postMessage({
		// 						data: {
		// 							transaction: transaction,
		// 							privateKey: privateKey,
		// 							useBitHeader: useBitHeader,
		// 							multisig: multisig
		// 						}
		// 					})
							
		// 					document.addEventListener("getAppMsg", (e) => {
		// 						console.log('getAppMsg', e.detail.code)
		// 						console.log(window.signStr)
		// 						resolve(window.signStr)
		// 					}, { once: true })
		// 				});
		// 			}
		// 		`);
				
		// 		win.show();
		// 		this.url = "http://47.236.254.203:6008";
			
		// 	// }, 1000);
		// },
	}
});
</script>

<style lang="scss" scoped>
	.page {
		
		// uni-web-view {
		// 	z-index: 9999999988 !important;
		// }
		
		
		padding: 50rpx 0rpx;
		.main {
			margin: 0rpx 40rpx;
			
			.head {
				display: flex;
				margin: 20rpx;
				
				.search {
					flex: 2;
					.content {
						display: flex;
						background-color: rgb(235 235 235);
						border-radius: 30rpx;
						padding: 20rpx;
						.icon {
							margin-left: 20rpx;
							image {
								width: 35rpx;
								height: 35rpx;
								vertical-align: middle;
							}
						}
						.letter {
							flex: 1;
							margin-left: 10rpx;
						}
					}
				}
				.scan {
					margin-left: 30rpx;
					margin-top: 10rpx;
					image {
						width: 50rpx;
						height: 50rpx;
						vertical-align: middle;
					}
				}
			}
			
			.dapp {
				text-align: center;
				margin-top: 230rpx;
			}
		}
	}
</style>
