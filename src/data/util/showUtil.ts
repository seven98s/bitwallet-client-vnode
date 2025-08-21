export class ShowUtil {
	
	static omitAddress(address: string, start: number, end: number) {
		return address.slice(0,start).concat('...').concat(address.slice(address.length - end, address.length));
	}
	
	static reserveFloat = (x: any) => {
		x = x.replace(/[^\d.]/g, '') //清除"数字"和"."以外的字符
		x = x.replace(/^\./g, '') //验证第一个字符是数字而不是
		x = x.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
		x = x.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
		x = x.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') //只能输入两个小数
		var s = x.toString().split('.')
		if (s.length == 1) {
			x = x.toString() + '.00'
			return x
		}
		if (s.length > 1) {
			if (s[1].length < 2) {
				x = x.toString() + '0'
			}
			return x;
		}
		return x;
	}
}