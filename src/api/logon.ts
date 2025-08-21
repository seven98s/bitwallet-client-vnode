import request from '@/utils/request';

export function register(data) {
	return request({
		url: '/register',
		method: 'post',
		data: data
	})
}
export function registerVerify(data) {
	return request({
		url: '/register/verify',
		method: 'post',
		data: data
	})
}