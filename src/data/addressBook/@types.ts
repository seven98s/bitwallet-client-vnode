import { CHAIN_TYPE } from "../constants";

export {};
declare global {
    export namespace AddressBookCache {
		
		export interface AddressBookInfo {
			// chain => addressBook
			[key: string] : AddressBook[]
		}
		
		export interface AddressBook {
			chainType: CHAIN_TYPE;
			name: string;
			address: string;
			remark: string;
		}
    }
}
