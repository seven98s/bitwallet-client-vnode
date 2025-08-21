import "./@types";
import { CHAIN_TYPE, STORAGE_TYPE } from "../constants";

export class AddressBookData {
	
	static saveAddressBook(chain: CHAIN_TYPE, data: AddressBookCache.AddressBook) {
		let addressBooks = this.addressBook;
		
		// check exists
		if(addressBooks[chain] != undefined) {
			if(addressBooks[chain].some(item => item.address === data.address)) {
				throw new Error('钱包地址已存在，请重新输入');
			}
			if(addressBooks[chain].some(item => item.name === data.name)) {
				throw new Error('名称已存在，请重新输入');
			}
		}
		
		let addressBookStore = new Array<AddressBookCache.AddressBook>();
		if(
			addressBooks != undefined
			&& addressBooks[chain] !== undefined 
			&& addressBooks[chain].length > 0
		) {
			// 存在，赋值数据
			addressBookStore = addressBooks[chain];
		} else {
			addressBooks = {};
		}
		
		addressBookStore.push(data);
		addressBooks[chain] = addressBookStore;
		uni.setStorageSync(STORAGE_TYPE.ADDRESS_BOOK_INFO, addressBooks);
	}
	
	static get addressBook(): AddressBookCache.AddressBookInfo {
		return uni.getStorageSync(STORAGE_TYPE.ADDRESS_BOOK_INFO);
	}
	
}