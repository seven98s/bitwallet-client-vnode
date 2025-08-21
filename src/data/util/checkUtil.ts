import { UniUtil } from "@/data/util/uniUtil";
import { BitInstance } from '@/chain/bit/instance';
import { WalletData } from "../wallet/walletData";

export class CheckUtil {
	
	static isStrEmpty(data: string) {
		return data === '' || data === null || data === undefined;
	}
	
	static isStrEmptyAndMessage(data: string, message: string) {
		if(this.isStrEmpty(data)) {
			UniUtil.toastError(message);
			return true;
		}
		return false;
	}
	
	static isStrNumberAndMessage(data: string, message: string) {
		if(isNaN(Number(data))) {
			UniUtil.toastError(message);
			return false;
		}
		return true;
	}
	
	static isStrSame(data: string, data1: string) {
		return data === data1;
	}
	
	static isStrSameAndMessage(data: string, data1: string, message: string) {
		if(!this.isStrSame(data, data1)) {
			UniUtil.toastError(message);
			return false;
		}
		return true;
	}
	
	static lengthRangeEq(data: string, start?: number, end?: number) {
		const length = data.length;
		if(start != undefined && length < start) {
			return false;
		}
		if(end != undefined && length > end) {
			return false;
		}
		return true;
	}
	
	static lengthRangeEqAndMessage(data: string, message: string, start?: number, end?: number) {
		if(!this.lengthRangeEq(data, start, end)) {
			UniUtil.toastError(message);
			return false;
		}
		return true;
	}
	
	/**
	 * 校验地址是否正确
	 **/
	static checkAddress(address: string) {
		return BitInstance.bitweb.isAddress(address);
	}
	static checkAddressAndMessage(address: string) {
		if(!this.checkAddress(address)) {
			UniUtil.toastError("请输入正确地址");
			return false;
		}
		return true;
	}
	
	static shuffleArray(array: string[]): string[] {
		let currentIndex = array.length;
		let temporaryValue, randomIndex;
	 
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
	 
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
	 
		return array;
	}
	
	/**
	 * 校验是否初始化钱包
	 */
	static checkInitWallet() {
		if(WalletData.account.address === undefined) {
			UniUtil.toastError("请先创建钱包", () => {
				setTimeout(() => {
					uni.reLaunch({
					  url: '../home/index'
					});
				}, 600);
			});
		}
	}
	
}