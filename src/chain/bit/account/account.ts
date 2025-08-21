import { BitInstance } from '../instance';

export class BitAccount {

    /**
     * 导入助记词
     * @param dto 
     * @returns 
     */
    static async importMnemonic(dto: WalletBit.Account.ImportMnemonicDto): Promise<WalletBit.Account.ImportMnemonicVo> {
        const { mnemonic } = dto;
        const result = await BitInstance.bitweb.fromMnemonic(mnemonic);
        return {
            address: result.address,
            privateKey: result.privateKey,
            path: "m/44'/195'/0'/0/0",
        }
    }

    /**
     * 导入私钥
     * @param dto 
     * @returns 
     */
    static async importPrivateKey(dto: WalletBit.Account.ImportPrivateKeyDto): Promise<WalletBit.Account.ImportPrivateKeyVo> {
        let { privateKey } = dto;
        
        if(privateKey.startsWith('0x')) {
            privateKey = privateKey.substring(2, privateKey.length);
        }
        const addr = await BitInstance.bitweb.address.fromPrivateKey(privateKey);
        if(!addr) {
            throw new Error('error');
        }
        return {
            address: addr,
            privateKey: privateKey,
        }
    }

    /**
     * 通过助记词创建账户
     * @param dto 
     * @returns 
     */
    static async createByMnemonic(dto: WalletBit.Account.CreateByMnemonicDto): Promise<WalletBit.Account.CreateByMnemonicVo> {
        const account = await BitInstance.bitweb.createRandom();
        if(!account.mnemonic) {
            throw new Error('error');
        }
        return {
            mnemonic: account.mnemonic.phrase,
            address: account.address,
            privateKey: account.privateKey,
            path: "m/44'/195'/0'/0/0",
        }
    }

    /**
     * 钱包 - 创建账户
     * @param dto 
     * @returns 
     */
    static async createByWallet(dto: WalletBit.Account.CreateByWalletDto): Promise<WalletBit.Account.CreateByWalletVo> {
        const { mnemonic, path } = dto;
        const pathRs = this.increasePath(path);
        
        const result = await BitInstance.bitweb.fromMnemonic(mnemonic, pathRs);
        return {
            address: result.address,
            privateKey: result.privateKey,
            path: pathRs,
        }
    }

    /**
     * path递增index
     * @param path 
     * @returns 
     */
    static increasePath(path: string) {
        const splitRs = path.split('/');
        const index = parseInt(splitRs[splitRs.length - 1]) + 1;

        return splitRs.slice(0, -1).join('/')+'/'+index;
    }

    /**
     * 获取账户信息
     */
    static async getAccount(dto: WalletBit.Account.GetAccountInfoDto) {//: Promise<WalletBit.Account.GetAccountInfoVo> {
        const { address } = dto;
        const account = await BitInstance.bitweb.trx.getAccount(address);
        return account;// as WalletBit.Account.GetAccountInfoVo
    }

    /**
     * 多签账户 - 修改账户权限
     */
    static updateAccountPermissions() {
    }
	
	/**
	 * 获取账户资产
	 */
	static async getAssets(address: string, tokenType: string[], addFlag: boolean, page: number, pageSize: number) {
		let url = 'holder/page?limit='+pageSize+'&addFlag='+addFlag+'&start='+page+'&address='+address;
		tokenType.map((item: string) => {
			url += '&tokenType='+item;
		})
		return await BitInstance.bitweb.scanServer?.request(
            url,
            'get'
        );
	}
	
	/**
	 * 获取Token信息
	 */
	static async getTokenInfo(address: string) {
		return await BitInstance.bitweb.scanServer?.request(
		    'token/info?address='+address,
		    'get'
		);
	}
	
	/**
	 * 获取账户1155资产
	 */
	static async getToken1155Transfers(address: string, token: string, page: number, pageSize: number, nftId: string = "") {
		return await BitInstance.bitweb.scanServer?.request(
		    'holder/page/nft?limit='+pageSize+'&start='+page+'&address='+address+'&tokenAddress='+token+'&nftId='+nftId,
		    'get'
		);
	}
	
	/**
	 * 获取账户转账记录
	 */
	static async getTransfers(address: string, token: string = "", page: number, pageSize: number) {
		return await BitInstance.bitweb.scanServer?.request(
		    'transfer/page?limit='+pageSize+'&start='+page+'&address='+address+'&token='+token,
		    'get'
		);
	}
	static async getTransfers2(address: string, token: string = "", page: number, pageSize: number,transactionId:string) {
		return await BitInstance.bitweb.scanServer?.request(
		    'transfer/page?limit='+pageSize+'&start='+page+'&address='+address+'&token='+token+'&transactionId='+transactionId,
		    'get'
		);
	}
	static async getTransfers3(address: string, token: string = "", page: number, pageSize: number,from:string,to:string) {
		return await BitInstance.bitweb.scanServer?.request(
		    'transfer/page?limit='+pageSize+'&start='+page+'&address='+address+'&token='+token+'&from='+from+'&to='+to,
		    'get'
		);
	}
	
	/**
	 * 获取个人总投票
	 */
	static async getTotalVote(address: string) {
		return await BitInstance.bitweb.scanServer?.request(
		    'vote/total?address='+address,
		    'get'
		);
	}
	
	/**
	 * 获取个人投票记录
	 */
	static async getVotePage(address: string, page: number, pageSize: number) {
		return await BitInstance.bitweb.scanServer?.request(
		    'vote/page?limit='+pageSize+'&start='+page+'&voterAddress='+address,
		    'get'
		);
	}
	
	/**
	 * 获取个人已提取收益
	 */
	static async getTotalWithdraw(address: string) {
		return await BitInstance.bitweb.scanServer?.request(
		    'withdraw/total?address='+address,
		    'get'
		);
	}
	
	/**
	 * 获取个人提取记录
	 */
	static async getWithdrawPage(address: string, page: number, pageSize: number) {
		return await BitInstance.bitweb.scanServer?.request(
		    'withdraw/page?limit='+pageSize+'&start='+page+'&address='+address,
		    'get'
		);
	}
	
	/**
	 * 生成二维码
	 */
	static async generateQrcode(content: string) {
		return await BitInstance.bitweb.scanServer?.request(
		    '/api/qrcode/generate?text='+content,
		    'get'
		);
	}
	
	/**
	 * witness获取名称
	 */
	static async getWitnessName(address: string) {
		return await BitInstance.bitweb.scanServer?.request(
		    '/witness/name/get?address='+address,
		    'get'
		);
	}
	
	/**
	 * witness校验
	 */
	static async checkWitnessName(name: string) {
		return await BitInstance.bitweb.scanServer?.request(
		    '/witness/name/check?name='+name,
		    'get'
		);
	}
	
	/**
	 * witness设置名称
	 */
	static async setWitnessName(name: string, address: string) {
		return await BitInstance.bitweb.scanServer?.request(
		    '/witness/name/set?name='+name+'&address='+address,
		    'get'
		);
	}
	
	/**
	 * 获取个人的多签受控账户
	 */
	static async getMultiPage(address: string, page: number, pageSize: number) {
		return await BitInstance.bitweb.scanServer?.request(
		    'account/page/multi?limit='+pageSize+'&start='+page+'&account='+address,
		    'get'
		);
	}
	
	/**
	 * 添加多签交易
	 */
	static async upsertMulti(
		id: string, 
		txHash: string, fromAccount: string,
		operator: string, signedTx: string,
		tokenName: string, tokenAddress: string,
		tokenType: string, fromAddress: string,
		toAddress: string, amount: string,
	) {
		return await BitInstance.bitweb.scanServer?.request(
		    'multi/upsert',
		    {
				id: id,
				txHash: txHash,
				fromAccount: fromAccount,
				operator: operator,
				signedTx: signedTx,
				tokenName: tokenName,
				tokenAddress: tokenAddress,
				tokenType: tokenType,
				fromAddress: fromAddress,
				toAddress: toAddress,
				amount: amount,
			},
			'post'
		);
	}
	
	/**
	 * 多签交易记录
	 */
	static async multiPage(address: string, page: number, pageSize: number) {
		return await BitInstance.bitweb.scanServer?.request(
		    'multi/page?limit='+pageSize+'&start='+page+'&account='+address,
		    'get'
		);
	};

}