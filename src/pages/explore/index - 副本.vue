<template>
	<view class="page">
		<view class="main">
			<!-- <view class="head">
				<view class="search">
					<view class="content">
						<view class="icon">
							<image src="@/static/explore/search.png" alt="" />
						</view>
						<view class="letter">
							<input type="text" placeholder="搜索本地DApp或输入链接访问" />
						</view>
					</view>
				</view>
				
				<view class="scan">
					<image src="@/static/explore/scan.png" alt="" />
				</view>
			</view>
			
			<view class="dapp">
				<image src="@/static/explore/empty.png"></image>
				<view class="letter">
					加速完善中，敬请期待...
				</view>
			</view> -->
			<!-- <view @click="click">点击</view> -->
			
			<view @click="injectFun">INJECT</view>
			<!-- <web-view :src="url" v-if="url != ''" @message="handleMessage"></web-view> -->
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { CheckUtil } from '@/data/util/checkUtil';
	import { BitInstance } from '@/chain/bit/instance';
	import { providers } from 'bitweb-ts';
	import { BitWebEx } from '@/chain/bit/webEx';
	import { WalletData } from '@/data/wallet/walletData';

	export default Vue.extend({
		data() {
			return {
				url: '',
				// url: 'http://47.236.254.203:6008',
			}
		},
		onShow() {
			CheckUtil.checkInitWallet();
			// window.bitweb = BitInstance.bitweb;
		},
		onReady() {
			// webview.evalJS("injectWindow('" + BitInstance.bitweb + "')");
			// setTimeout(() => {
			// 	const webview:any = plus.webview.currentWebview();
			// 	console.log(BitInstance.bitweb)

			// 	webview.postMessage({ data: BitInstance.bitweb });//.evalJS(`window.injectWindow(${BitInstance.bitweb})`);
			// 	console.log('finish')
			// }, 5000);

			
			
			
			
			
			// const webview:any = uni.createSelectorQuery().select('web-view');
			// console.log(BitInstance.bitweb)
			// window.bitweb = (BitInstance.bitweb )as any;
			// console.log(window.bitweb)
			// const webview:any = plus.webview.currentWebview();
			// console.log(webview);
			// // webview.boundingClientRect((data: any) => {
			// // 	let script = `
			// // 		window.bitWeb = BitInstance.bitweb;
			// // 	`;
			// // 	webview.evalJS(script);
			// // }).exec();
			// // const bitWeb111111: any = BitInstance.bitweb;
			// // if(window === undefined) {
			// // 	window = {
			// // 		bitWeb: (bitWeb111111) as any
			// // 	}
			// // }
			// // console.log(window.bitWeb)
			// const bitweb111 = BitInstance.bitweb;
			// 	let script = `
			// 		window.bitweb = `+bitweb111+`;
			// 	`;
			// 	webview.evalJS(script);
				
			// 	setTimeout(() => {
					
			// 		this.url = 'http://47.236.254.203:6008';
			// 	}, 5000);
				
		},
		methods: {
			injectFun() {
				const bitweb = BitInstance.bitweb;
				// console.log(bitweb)
				// uni.setStorageSync("BITWEB", bitweb)
				// const bitwebJson = this.safeStringify(bitweb.address.toHex);
				// console.log(bitwebJson)
				// console.log(JSON.parse(bitwebJson))
				
				const win = plus.webview.create('http://47.236.254.203:6008');
				console.log(win)
				
				// const webview:any = plus.webview.currentWebview();
				// console.log(webview);
				// const bitweb = JSON.stringify(BitInstance.bitweb);
				// console.log(bitweb)
				// console.log(bitweb.address.toHex('B7srwhqh1TmGBEVKzL8wfFG1yr1UJuvgiZ'))
				// console.log(bitweb)
				// const tmp = this.safeStringify(bitweb);
				// 	// window.bitweb = ${this.safeStringify(bitweb)};
				
				
					// window.bitweb = ${this.safeStringify(bitweb)};
				// 	console.log(JSON.stringify(bitweb.address.toHex.toString()))
				// window.bitweb = {};
				// window.bitweb.address = {};
				// window.bitweb.address.toHex = ${JSON.stringify(bitweb.address.toHex.toString())};
				win.show();
				const accountBase58 = WalletData.account.address;
				const accountHex = bitweb.address.toHex(WalletData.account.address);
				
				win.evalJS(`
					console.log('111111111111111111111');
					console.log(window.bitweb.defaultAddress);
					console.log('222222222222222222222');
					console.log(window.bitweb.defaultAddress.base58);
					console.log('333333333333333333333');
					window.bitweb.defaultAddress.base58='${accountBase58.toString()}';
					console.log('444444444444444444444');
					window.bitweb.defaultAddress.hex='${accountHex.toString()}';
					console.log('555555555555555555555');
					
					window.bitweb.trx.sign = function(transaction, privateKey, useBitHeader, multisig) {
						return new Promise(function(resolve, reject) {
							window.parent.postMessage({
								data: {
									message: 'Hello from H5'
								}
							}, '*');
							console.log('00000000000000')
							console.log(transaction)
						});
					}
				`);
				// win.appendJsFile("_www/static/bitweb.js");
				// win.appendJsFile("_www/static/init.js");
				
					// window.bitweb = {};
					// window.bitweb = ${BitInstance.bitweb};
						// window.bitweb = ${BitInstance.bitweb};
						// alert(\"人民万岁\")
						// Object.defineProperty(window, 'bitweb', {
						//    value: ${BitInstance.bitweb},
						//    writable: false
						// });
				// this.url = 'http://47.236.254.203:6008';
			},
			handleMessage(event: any) {
				let message = event.detail.data.message;
				console.log('Received message: ' + message);
				// 在这里你可以根据接收到的消息来执行相应的方法
			},
			safeStringify(obj: any) {
			  //   let cache: any = [];
			  //   const str = JSON.stringify(obj, function(key, value) {
			  //       // if (typeof value === 'object' && value !== null) {
			  //       //     // 检查是否存在循环引用
			  //       //     if (cache.includes(value)) {
			  //       //         // 是循环引用，返回一个占位符
			  //       //         return ;
			  //       //     }
			  //       //     // 否则，将其存入缓存数组，并继续序列化
			  //       //     cache.push(value);
			  //       // }
					// if(key != 'bitWeb') {
					// 	return value;
					// }
			  //   });
			  //   cache = null; // 清空缓存，释放内存
			  //   return str;
			  
			  // 将对象转换为字符串，保留函数
				const jsonString = JSON.stringify(obj, (key, value) => {
				  if(key != 'bitWeb') {
						// 如果属性值是函数，则返回函数的字符串形式
						// if (typeof value === 'function') {
						//   return value.toString();
						// }
						return value;
					}
				});
				return jsonString;
			},
			click() {
				this.url = 'http://47.236.254.203:6008';
			}
		}
	});
</script>

<style lang="scss" scoped>
	.page {
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
