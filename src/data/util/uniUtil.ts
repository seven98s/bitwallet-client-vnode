export class UniUtil {
	
	static copy(data: string) {
		uni.setClipboardData({
			data: data,
			success: function () {
				UniUtil.toastSuccess('复制成功');
			}
		});
	}
	
	static toastSuccess(message: string, successFun?: () => void) {
		uni.showToast({
			title: message,
			icon: 'none',// 'success',
			duration: 2000,
			success: successFun,
		});
	}
	
	static toastError(message: string, successFun?: () => void) {
		uni.showToast({
			title: message,
			icon: 'none',// 'error',
			duration: 2000,
			style: {
				'z-index': 9999999,
			},
			success: successFun,
		});
	}
	
	static loadShow() {
		uni.showLoading({
			mask: true,
			title: 'loading',
			style: {
				'z-index': 999
			}
		});
	}
	
	static loadHide() {
		uni.hideLoading();
	}
	
	static scanCollectCode() {
		return new Promise((resolve, reject) => {
			uni.scanCode({
				success: (res: any) => {
					resolve(res.result);
				},
				fail: (err: any) => {
					console.log(err.errMsg)
					if(err.errMsg !== 'scanCode:fail cancel') {
						this.toastError('扫码失败');
					}
					reject(err);
				}
			});
		});
	}
}