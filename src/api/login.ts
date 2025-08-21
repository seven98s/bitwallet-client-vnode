import request from '@/utils/request';

// 查询用户是否存在
export function isExist(query: unknown) {
	return request({
		url: '/isExist',
		header: {
			isToken: false,
		},
		method: 'get',
		params: query,
	});
}
// 获取验证码
export function getCode(query: unknown) {
	return request({
		url: '/code',
		header: {
			isToken: false,
		},
		method: 'get',
		params: query,
	});
}
// 登录方法
export function login(username, password, code, uuid) {
	const data = {
		username,
		password,
		code,
		uuid,
	};
	return request({
		url: '/login',
		headers: {
			isToken: false,
		},
		method: 'post',
		data: data,
	});
}

// 获取用户详细信息
export function getInfo() {
	return request({
		url: '/getInfo',
		method: 'get',
	});
}

// 退出方法
export function logout() {
	return request({
		url: '/logout',
		method: 'post',
	});
}

// 获取验证码
export function getCodeImg() {
	return request({
		url: '/captchaImage',
		headers: {
			isToken: false,
		},
		method: 'get',
		timeout: 20000,
	});
}
