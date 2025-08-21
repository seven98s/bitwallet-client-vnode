import "./@types";
import { CHAIN_TYPE, STORAGE_TYPE } from "../constants";
import { CryptoUtil } from "../util/cryptoUtil";
import { BitInstance } from '@/chain/bit/instance';
import { version_url_1,version_url_2 } from "@/config";
export class VersionData {
	
	static async load() {
		return new Promise(async (resolve,reject) => {
			uni.request({
				// url: 'http://47.236.254.203:6007/releaseNote.json?timestamp='+new Date().getTime(),
				// url: 'http://download.bitnetworkbc.com/releaseNote.json?timestamp='+new Date().getTime(),
				url:version_url_1,
				success: (res: any) => {
					const data = res.data;
					resolve(data[data.length - 1]);
				},
				fail: (err) => {
					reject(err);
				}
			})
		});
	}
	
	static async loadRecommendDapp() {
		return new Promise(async (resolve,reject) => {
			uni.request({
				// url: 'http://47.236.254.203:6007/recommendDapp/recommendDapp.json?timestamp='+new Date().getTime(),
				// url: 'http://download.bitnetworkbc.com/recommendDapp/recommendDapp.json?timestamp='+new Date().getTime(),
				url:version_url_2,
				success: (res: any) => {
					const data = res.data;
					resolve(data);
				},
				fail: (err) => {
					reject(err);
				}
			})
		});
	}
	
	static setIgnoreVersion(version: string) {
		uni.setStorageSync(STORAGE_TYPE.IGNORE_VERSION, version);
	}
	
	static get ignoreVersion() {
		return uni.getStorageSync(STORAGE_TYPE.IGNORE_VERSION);
	}
	
}