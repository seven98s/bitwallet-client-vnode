import { Trx } from "bitweb-ts";
import { SignedTransaction, Transaction } from "bitweb-ts/lib/esm/types/Transaction";
import Vue from 'vue';
import { BitWebEx } from "./webEx";
import { BitInstance } from '@/chain/bit/instance';
import { WalletData } from '@/data/wallet/walletData';
import { CheckUtil } from '@/data/util/checkUtil';
import { UniUtil } from '@/data/util/uniUtil';

type SignedStringOrSignedTransaction<T extends string | Transaction | SignedTransaction> = T extends string
    ? string
    : SignedTransaction & T;
	
export class TrxEx extends Trx {
	
	constructor(bitWeb: BitWebEx) {
		super(bitWeb);
	}
	
	async sign<T extends SignedTransaction | Transaction | string>(
		transaction: T,
		privateKey: string,
		useBitHeader = true,
		multisig = false
	): Promise<SignedStringOrSignedTransaction<T>> {
		
		privateKey = await new Promise<string>(async (resolve,reject) => {
			UniUtil.loadHide();
			Vue.prototype.$PasswordPopup({
				show: true,
				title: '',
				password: '',
				confirm: async (data: string) => {
					// check
					if(CheckUtil.isStrEmptyAndMessage(data, "请输入密码")) return;
								
					await WalletData.privateKey(data).then((privateKey) => {
						// console.log(privateKey)
						// 设置私钥
						// BitInstance.bitweb.setPrivateKey(privateKey);//.substring(2, privateKey.length));
						resolve(privateKey);
						UniUtil.loadShow();
					}).catch((e: any) => {
						console.log(e)
						// reject(e);
						uni.showToast({
							title: '请输入正确密码',
							icon: 'error',
							duration: 2000,
							style: {
								'z-index': 9999999
							},
						});
						// Vue.prototype.$store.commit('changePasswordPopConfig', { show: false, title: '' });
					});
				}
			});
		});
		
		// privateKey = await new Promise<string>(async (resolve,reject) => {
		// 	uni.showModal({
		// 		title: '签名交易',
		// 		content: '',
		// 		editable:true,
		// 		placeholderText:'请输入密码',
		// 		confirmText: '确认',
		// 		cancelText: '取消',
		// 		success: async (res) => {
		// 			if (res.confirm) {
		// 				// check
		// 				const data = res.content as string;
		// 				console.log('输入的内容：', data);
		// 				if(CheckUtil.isStrEmptyAndMessage(data, "请输入密码")) return;
									
		// 				await WalletData.privateKey(data).then((privateKey) => {
		// 					// 设置私钥
		// 					BitInstance.bitweb.setPrivateKey(privateKey.substring(2, privateKey.length));
		// 					resolve(privateKey);
		// 				}).catch((e: any) => {})
		// 			}
		// 		}
		// 	});
		// });
		
		Vue.prototype.$store.commit('changePasswordPopConfig', { show: false, title: '' });
		privateKey = privateKey;//.substring(2, privateKey.length);
		// BitInstance.bitweb.setPrivateKey(privateKey);
		return super.sign(transaction, privateKey, useBitHeader, multisig);
	}
	
	async multiSign(
		transaction: Transaction,
		privateKey: string,
		permissionId = 2
	): Promise<SignedTransaction> {
		
		privateKey = await new Promise<string>(async (resolve,reject) => {
			UniUtil.loadHide();
			Vue.prototype.$PasswordPopup({
				show: true,
				title: '',
				password: '',
				confirm: async (data: string) => {
					// check
					if(CheckUtil.isStrEmptyAndMessage(data, "请输入密码")) return;
								
					await WalletData.privateKey(data).then((privateKey) => {
						// console.log(privateKey)
						// 设置私钥
						// BitInstance.bitweb.setPrivateKey(privateKey);//.substring(2, privateKey.length));
						resolve(privateKey);
						UniUtil.loadShow();
					}).catch((e: any) => {
						console.log(e)
						// reject(e);
						uni.showToast({
							title: '请输入正确密码',
							icon: 'error',
							duration: 2000,
							style: {
								'z-index': 9999999
							},
						});
						// Vue.prototype.$store.commit('changePasswordPopConfig', { show: false, title: '' });
					});
				}
			});
		});
		
		Vue.prototype.$store.commit('changePasswordPopConfig', { show: false, title: '' });
		privateKey = privateKey;//.substring(2, privateKey.length);
		// BitInstance.bitweb.setPrivateKey(privateKey);
		return super.multiSign(transaction, privateKey, permissionId);
	}
	
	async dappSign<T extends SignedTransaction | Transaction | string>(
		transaction: T,
		privateKey: string,
		useBitHeader = true,
		multisig = false
	): Promise<SignedStringOrSignedTransaction<T>> {
		return super.sign(transaction, privateKey, useBitHeader, multisig);
	}
}