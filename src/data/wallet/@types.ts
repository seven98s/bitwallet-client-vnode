import { ACCOUNT_TYPE, CHAIN_TYPE } from "../constants";

export {};
declare global {
    export namespace Wallet {
		
		/**用户信息 */
		export interface UserInfo {
			password: string;
			tips: string;
		}
		
		/**钱包与链映射信息 */
		export interface AccountChainMap {
			// chain => account
			[key: string] : Account[]
		}
		
		/**钱包信息 */
		export interface Account {
			name: string;
			address: string;
			secretInfo: Secret;
			type: ACCOUNT_TYPE;
		}
		
		export interface Secret {
			mnemonic: string;
			privateKey: string;
			path: string;
		}
		
		/**助记词信息 */
		export interface MnemonicInfo {
			mnemonic: string;
			path: string;
		}
    }
}
