import "./@types";
import { CHAIN_TYPE, STORAGE_TYPE } from "../constants";
import { CryptoUtil } from "../util/cryptoUtil";
import { BitInstance } from '@/chain/bit/instance';
import { Account } from "bitweb-ts/lib/esm/types/Trx";

export class WalletData {
	
	static import(chain: CHAIN_TYPE, account: Wallet.Account, observe: boolean = false, user?: Wallet.UserInfo) {
		if(observe) {
			// 存储账户数据
			let accountChainMap = this.accountChainMap;
			let accountStore = new Array<Wallet.Account>();
			if(
				accountChainMap != undefined
				&& accountChainMap[chain] !== undefined 
				&& accountChainMap[chain].length > 0
			) {
				// 校验名称是否存在
				if(accountChainMap[chain].some(item => item.name === account.name)) {
					throw new Error('钱包名称已存在，请重新输入');
				}
				// 校验助记词是否存在
				if(accountChainMap[chain].some(item => item.address === account.address)) {
					throw new Error('账户已导入，请重新输入');
				}
				
				// 存在，赋值数据
				accountStore = accountChainMap[chain];
			} else {
				accountChainMap = {};
			}
			
			accountStore.push(account);
			accountChainMap[chain] = accountStore;
			uni.setStorageSync(STORAGE_TYPE.WALLET_ACCOUNT_CHAIN_MAP, accountChainMap);
		} else {
			// 用户信息不存在
			let userData = this.user;
			if(userData === '') {
				if(user === undefined) {
					throw new Error('Please set user information');
				}
				// 存储用户信息
				userData = this.saveOrUpdUser(user);
			}
			
			// 导入钱包账户
			let accountChainMap = this.accountChainMap;
			let accountStore = new Array<Wallet.Account>();
			if(
				accountChainMap != undefined
				&& accountChainMap[chain] !== undefined 
				&& accountChainMap[chain].length > 0
			) {
				// 校验名称是否存在
				if(accountChainMap[chain].some(item => item.name === account.name)) {
					throw new Error('钱包名称已存在，请重新输入');
				}
				// 校验助记词是否存在
				if(accountChainMap[chain].some(item => item.address === account.address)) {
					throw new Error('账户已导入，请重新输入');
				}
				
				// 存在，赋值数据
				accountStore = accountChainMap[chain];
			} else {
				accountChainMap = {};
			}
			
			// aes加密助记词
			if(account.secretInfo.mnemonic != '') {
				let mnemonicAes = account.secretInfo.mnemonic;
				
				// 助记词存储
				let mnemonicInfo: Wallet.MnemonicInfo = uni.getStorageSync(STORAGE_TYPE.MNEMONIC_INFO);
				if(mnemonicInfo.mnemonic === undefined) {
					mnemonicAes = CryptoUtil.aesEncrypted(userData.password, account.secretInfo.mnemonic);
					
					mnemonicInfo = {
						mnemonic: mnemonicAes,
						path: account.secretInfo.path,
					}
					uni.setStorageSync(STORAGE_TYPE.MNEMONIC_INFO, mnemonicInfo);
				}
				account.secretInfo.mnemonic = mnemonicAes;
			}
			
			// aes加密私钥
			if(account.secretInfo.privateKey.startsWith('0x')) {
				account.secretInfo.privateKey = account.secretInfo.privateKey.substring(2, account.secretInfo.privateKey.length);
			}
			const privateKeyAes = CryptoUtil.aesEncrypted(userData.password, account.secretInfo.privateKey);
			account.secretInfo.privateKey = privateKeyAes;
			
			// 存储账户数据
			accountStore.push(account);
			accountChainMap[chain] = accountStore;
			uni.setStorageSync(STORAGE_TYPE.WALLET_ACCOUNT_CHAIN_MAP, accountChainMap);
		}
		// 选择钱包
		this.chooseAccount(account);
	}
	
	static changeWalletName(chain: CHAIN_TYPE, address: string, name: string) {
		let accountChainMap = this.accountChainMap;
		if(accountChainMap[chain].some(item => item.name === name)) {
			throw new Error('钱包名称已存在，请重新输入');
		}
		
		accountChainMap[chain].map((account: Wallet.Account) => {
			if(account.address === address) {
				account.name = name
				// 选择钱包
				this.chooseAccount(account);
			}
		});
		uni.setStorageSync(STORAGE_TYPE.WALLET_ACCOUNT_CHAIN_MAP, accountChainMap);
	}
	
	static get user() {
		return uni.getStorageSync(STORAGE_TYPE.WALLET_USER_INFO);
	}
	
	static checkUserPassword(password: string) {
		password = CryptoUtil.sha256(password);
		return !(this.user.password === password);
	}
	
	static saveOrUpdUser(user: Wallet.UserInfo) {
		user.password = CryptoUtil.sha256(user.password);
		uni.setStorageSync(STORAGE_TYPE.WALLET_USER_INFO, user);
		return user;
	}
	
	static removeUser() {
		uni.setStorageSync(STORAGE_TYPE.WALLET_USER_INFO, '');
	}
	
	static get accountChainMap(): Wallet.AccountChainMap {
		return uni.getStorageSync(STORAGE_TYPE.WALLET_ACCOUNT_CHAIN_MAP);
	}
	
	static chooseAccount(account: Wallet.Account) {
		uni.setStorageSync(STORAGE_TYPE.WALLET_CURRENT_ACCOUNT, account);
		
		BitInstance.bitweb.setAddress(account.address);
	}
	
	static get account(): Wallet.Account {
		return uni.getStorageSync(STORAGE_TYPE.WALLET_CURRENT_ACCOUNT);
	}
	
	static async removeAccount() {
		const account = WalletData.account;
		
		const accountChainMap = this.accountChainMap;
		for(const key in accountChainMap) {
			const accountChains = accountChainMap[key];
			let accountStore = new Array<Wallet.Account>();
			for(const accountChain of accountChains) {
				if(accountChain.address !== account.address) {
					accountStore.push(accountChain);
				}
			}
			accountChainMap[key] = accountStore;
		}
		uni.setStorageSync(STORAGE_TYPE.WALLET_ACCOUNT_CHAIN_MAP, accountChainMap);
		
		// 选择第一个账户
		uni.removeStorageSync(STORAGE_TYPE.WALLET_CURRENT_ACCOUNT);
		if(accountChainMap[0].length === 0) {
			uni.removeStorageSync(STORAGE_TYPE.WALLET_USER_INFO);
			uni.removeStorageSync(STORAGE_TYPE.WALLET_INDEX);
			uni.removeStorageSync(STORAGE_TYPE.MNEMONIC_INFO);
			uni.removeStorageSync(STORAGE_TYPE.WALLET_ACCOUNT_CHAIN_MAP);
		} else {
			this.chooseAccount(accountChainMap[0][0]);
		}
	}
	
	static async mnemonic(password: string) {
		try{
			password = CryptoUtil.sha256(password);
			const account: Wallet.Account = this.account;
			const mnemonic = CryptoUtil.aesDecrypted(password, account.secretInfo.mnemonic);
			if(mnemonic === '') {
				throw new Error();
			}
			return mnemonic;
		} catch(e) {
			uni.showToast({
				title: '请输入正确密码',
				icon: 'error',
				duration: 2000,
				style: {
					'z-index': 9999999
				}
			});
			throw new Error('Please enter the correct password');
		}
	}
	
	static async privateKey(password: string) {
		try{
			password = CryptoUtil.sha256(password);
			const account: Wallet.Account = this.account;
			const privateKey = CryptoUtil.aesDecrypted(password, account.secretInfo.privateKey);
			if(privateKey === '') {
				throw new Error();
			}
			return privateKey;
		} catch(e) {
			throw new Error('Please enter the correct password');
		}
	}
	
	static existsWalletMnemonic() {
		return uni.getStorageSync(STORAGE_TYPE.MNEMONIC_INFO).mnemonic != undefined;
	}
	
	
	// /**
	//  * 初始化钱包
	//  */
	// static import(chain: CHAIN_TYPE, password: string, tips: string, accountInfo: Wallet.AccountInfo) {
	// 	if(password === undefined || password === null || password.length < 8) {
	// 		throw new Error('Please enter an 8-digit password');
	// 	}
	// 	if(accountInfo === undefined || accountInfo === null) {
	// 		throw new Error('Please set up an account');
	// 	}
	// 	// uni.removeStorageSync(STORAGE_TYPE.WALLET_INFO);
	// 	// return;
		
	// 	// 获取缓存数据
	// 	let storeData: Wallet.WalletInfo = uni.getStorageSync(STORAGE_TYPE.WALLET_INFO);
	// 	let accountMapStore = storeData.accountMap;
	// 	if(storeData.password === undefined) {
	// 		// 不存在，初始化缓存数据对象
	// 		accountMapStore = {}
	// 		storeData = {
	// 			password: CryptoUtil.sha256(password), 
	// 			tips, 
	// 			accountMap: accountMapStore,
	// 		};
	// 	} else {
	// 		// 校验名称是否存在
	// 		if(accountMapStore[chain].some(item => item.name === accountInfo.name)) {
	// 			throw new Error('钱包名称已存在，请重新输入');
	// 		}
	// 		// 校验助记词是否存在
	// 		if(accountMapStore[chain].some(item => item.address === accountInfo.address)) {
	// 			throw new Error('助记词已导入，请重新输入');
	// 		}
	// 	}
		
	// 	// 是否存在账户缓存数据对象
	// 	let accountInfosStore = new Array<Wallet.AccountInfo>();
	// 	if(storeData.accountMap[chain] !== undefined && storeData.accountMap[chain].length > 0) {
	// 		// 存在，赋值数据
	// 		accountInfosStore = storeData.accountMap[chain];
	// 	}
		
	// 	// aes加密助记词
	// 	if(accountInfo.secretInfo.mnemonic === '') {
	// 		accountInfo.secretInfo.mnemonic = '';
	// 	} else {
	// 		const mnemonicAes = CryptoUtil.aesEncrypted(password, accountInfo.secretInfo.mnemonic);
	// 		accountInfo.secretInfo.mnemonic = mnemonicAes;
			
	// 		// 助记词存储
	// 		let mnemonicInfo: Wallet.MnemonicInfo = uni.getStorageSync(STORAGE_TYPE.MNEMONIC_INFO);
	// 		if(mnemonicInfo.mnemonic === undefined) {
	// 			mnemonicInfo = {
	// 				mnemonic: mnemonicAes,
	// 				path: accountInfo.secretInfo.path,
	// 			}
	// 			uni.setStorageSync(STORAGE_TYPE.MNEMONIC_INFO, mnemonicInfo);
	// 		}
	// 	}
		
	// 	// aes加密私钥
	// 	const privateKeyAes = CryptoUtil.aesEncrypted(password, accountInfo.secretInfo.privateKey);
	// 	accountInfo.secretInfo.privateKey = privateKeyAes;
		
	// 	// 存储账户数据
	// 	accountInfosStore.push(accountInfo);
	// 	storeData.accountMap[chain] = accountInfosStore;
		
	// 	// 数据存储
	// 	uni.setStorageSync(STORAGE_TYPE.WALLET_INFO, storeData);
		
	// 	// 地址 =》账户 映射存储
	// 	let addressAccountMapping = uni.getStorageSync(STORAGE_TYPE.WALLET_ADDRESS_ACCOUNT_MAPPING_INFO);
	// 	if(addressAccountMapping === '') {
	// 		const addressAccountMappingTmp: {[key: string] : Wallet.AccountInfo} = {}
	// 		addressAccountMappingTmp[accountInfo.address] = accountInfo;
	// 		addressAccountMapping = addressAccountMappingTmp;
	// 	} else {
	// 		addressAccountMapping[accountInfo.address] = accountInfo;
	// 	}
	// 	uni.setStorageSync(STORAGE_TYPE.WALLET_ADDRESS_ACCOUNT_MAPPING_INFO, addressAccountMapping);
		
	// 	// 选择钱包
	// 	this.chooseAccount(accountInfo.address);
	// }
	
	
	
}