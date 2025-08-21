import CryptoJS from "crypto-js";

export class CryptoUtil {
	
	static sha256(data: string) {
		return CryptoJS.SHA256(data).toString();
	}
	
	/**
	 * aes加密
	 */
	static aesEncrypted(secret: string, data: string) {
		const encrypted = CryptoJS.AES.encrypt(data, secret, {
			iv: CryptoJS.enc.Utf8.parse('bitwallet'),
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		 
		return encrypted.toString();
	}
	
	/**
	 * aes解密
	 */
	static aesDecrypted(secret: string, data: string) {
		const decryptedBytes = CryptoJS.AES.decrypt(data, secret, {
			iv: CryptoJS.enc.Utf8.parse('bitwallet'),
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		 
		return decryptedBytes.toString(CryptoJS.enc.Utf8);
	}
}