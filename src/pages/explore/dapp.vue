<template>
	<view class="page">
		<!-- <cover-view class="cover" style="z-index: 2147483648 !important;">
		<text style="color: white;">这是覆盖层内的文本</text>
	  </cover-view> -->
		<web-view ref="webview" :src="url" @message="handleMessage"></web-view>

		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script setup lang="ts">

import PasswordPopup from "@/components/password/passwordPopup.vue";
import { BitInstance } from "@/chain/bit/instance";
import { WalletData } from "@/data/wallet/walletData";
import { CheckUtil } from "@/data/util/checkUtil";
import { UniUtil } from "@/data/util/uniUtil";
import { chainId } from "@/config";
import { onLoad, onReady } from "@dcloudio/uni-app";
import { passwordPopup } from '@/components/password/index'


const webViewObj = ref<any>({});
const urlParam = ref<string>("");
const url = ref<string>("");

const instance = getCurrentInstance();

// 页面加载
onLoad((query: any) => {
	urlParam.value = query.url;
});
// 初始化 WebView 注入
async function init() {
	return new Promise(async (resolve) => {
		const bitweb = BitInstance.bitweb;
		const currentWebview = (instance?.proxy as any).$scope.$getAppWebview();
		const win: any = currentWebview.children()[0];
		webViewObj.value = win;

		const accountBase58 = WalletData.account.address;
		const accountHex = bitweb.address.toHex(WalletData.account.address);

		win.show();

		win.evalJS(`
		window.chainId = ${chainId};
		window.bitwebTemp.defaultAddress.base58='${accountBase58.toString()}';
		window.bitwebTemp.defaultAddress.hex='${accountHex.toString()}';
		
		window.bitwebTemp.trx.sign = function(transaction, privateKey, useBitHeader, multisig) {
		  return new Promise(function(resolve, reject) {
			uni.postMessage({
			  data: {
				type: 'SIGN',
				transaction: transaction,
				privateKey: privateKey,
				useBitHeader: useBitHeader,
				multisig: multisig
			  }
			})
			document.addEventListener("getAppSignMsg", (e) => {
			  resolve(window.signStr)
			}, { once: true })
		  });
		}
		
		window.chain = 'BIT';
	  `);

		resolve(true);
	});
}
// 页面初始化完成
onReady(() => {
	// #ifdef APP-PLUS
	setTimeout(async () => {
		await init();
		url.value = urlParam.value + "?t=" + new Date().getTime();
		console.log(url.value);
	}, 60);
	// #endif
});



// 处理 webview 消息
async function handleMessage(e: any) {
	if (e.detail.data[0].type == "SIGN") {
		uni.navigateTo({
			url: "./password",
		});

		const privateKey = await new Promise<string>(async (resolve) => {
			// 调用 PasswordPopup
			passwordPopup({
				show: true,
				title: '',
				password: '',
				confirm: async (data: string) => {
					if (CheckUtil.isStrEmptyAndMessage(data, "请输入密码")) return;
					try {
						const privateKey = await WalletData.privateKey(data)
						console.log('解密成功', privateKey)
					} catch (e) {
						console.log(e)
						
						UniUtil.toastError('请输入正确密码');
					}
				}
			})
		});

		const rs = await BitInstance.bitweb.trxEx.dappSign(
			e.detail.data[0].transaction,
			privateKey,
			true,
			false
		);
		console.log(rs);

		uni.navigateBack();

		(webViewObj.value as any).evalJS(`
		window.signStr = ${JSON.stringify(rs)};
		document.dispatchEvent(new CustomEvent('getAppSignMsg',{detail: {code:'success'}}));
	  `);
	}
}


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