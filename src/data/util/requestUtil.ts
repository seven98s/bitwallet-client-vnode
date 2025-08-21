export class RequestUtil {
	
	static get (url: string) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				complete: (res: any) => {
					resolve(res)
				},
				fail: (err: any) => {
					reject(err)
				}
			})
		})
	}
}