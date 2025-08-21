import { BitInstance } from '../instance';

export class BitTransaction {

	/**
	 * 获取交易详情
	 */
	static async getInfo(txHash: string) {
		return await BitInstance.bitweb.scanServer?.request(
            'transaction/'+txHash,
            'get'
        );
	}

}