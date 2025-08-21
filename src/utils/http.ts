// 定义基础 URL
// const baseURL: string = 'http://t8396u.natappfree.cc/wallet';
import { baseURL } from "@/config";

// 定义拦截器接口
interface HttpInterceptor {
    invoke(options: UniApp.RequestOptions): void;
}

// 添加拦截器
const httpInterceptor: HttpInterceptor = {
    // 拦截前触发
    invoke(options: UniApp.RequestOptions) {
        // 设置请求超时时间为 10000 毫秒
        options.timeout = 10000;
        // 如果请求的 URL 不是绝对路径，则拼接基础 URL
        if (!options.url.startsWith('http')) {
            options.url = baseURL + options.url;
        }
    }
};

// 封装请求函数
function http(options: UniApp.RequestOptions): Promise<any> {
    // 显示加载提示
    uni.showLoading({
        title: '加载中...',
        mask: true
    });

    // 应用拦截器
    httpInterceptor.invoke(options);

    // 返回 Promise 对象
    return new Promise((resolve, reject) => {
        uni.request({
            ...options,
            // 响应成功
            success(res: UniApp.RequestSuccessCallbackResult) {
                // 隐藏加载提示
                uni.hideLoading();
                // 判断状态码是否在 200 - 299 之间
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    // @ts-ignore 这里可能需要根据实际情况调整类型
                    resolve(res.data.records);
                } else {
                    // 显示错误提示信息
                    uni.showToast({
                        icon: 'none',
                        // @ts-ignore 这里可能需要根据实际情况调整类型
                        title: res.data.msg || '请求错误'
                    });
                    // 拒绝 Promise
                    reject(res);
                }
            },
            // 响应失败
            fail(err: UniApp.GeneralCallbackResult) {
                // 隐藏加载提示
                uni.hideLoading();
                // 显示网络错误提示信息
                uni.showToast({
                    icon: 'none',
                    title: '网络错误，换个网络试试'
                });
                // 拒绝 Promise
                reject(err);
            }
        });
    });
}

export { http };