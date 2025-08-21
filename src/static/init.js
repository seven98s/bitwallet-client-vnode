// export class BitWeb {
//     toHex(address) {
// 		console.log(address);
// 	}
// };

(() => {
	// BitWeb bitweb = new BitWeb();
	// console.log(bitweb.toHex('BBBBBBBBBBBBBBBBBBBBBBBBBB'))
	window.bitweb = {};
	window.bitweb.address = {};
	window.bitweb.address.toHex = (address) => {
		console.log(address);
	};
	
	window.bitweb.address.toHex('asdfasdfasdfsd');
})();